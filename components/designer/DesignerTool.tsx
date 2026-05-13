'use client';

import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { Upload, X, Loader2, Download, Zap, Brain, RotateCcw, RotateCw, ClipboardPaste } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PolygonEditor from './PolygonEditor';
import FinishPanel from './FinishPanel';
import { FINISHES, type Finish, type Segment, type PendingPolygon, type DesignerMode } from '@/lib/designer/types';
import {
  applySegment, rasterizePolygon, magicWand,
  pixelInMask, maskCoverage, canvasToJpeg,
} from '@/lib/designer/canvasUtils';

const MAX_CANVAS_WIDTH = 1200;
const MAX_FILE_MB = 10;

// ─── History helpers ──────────────────────────────────────────────────────────

function useHistory<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const past   = useRef<T[]>([]);
  const future  = useRef<T[]>([]);

  const set = useCallback((next: T | ((s: T) => T)) => {
    setState(prev => {
      const resolved = typeof next === 'function' ? (next as (s: T) => T)(prev) : next;
      past.current.push(prev);
      future.current = [];
      return resolved;
    });
  }, []);

  const undo = useCallback(() => {
    if (!past.current.length) return;
    setState(prev => {
      future.current.unshift(prev);
      return past.current.pop()!;
    });
  }, []);

  const redo = useCallback(() => {
    if (!future.current.length) return;
    setState(prev => {
      past.current.push(prev);
      return future.current.shift()!;
    });
  }, []);

  const reset = useCallback((v: T) => {
    past.current   = [];
    future.current = [];
    setState(v);
  }, []);

  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;

  return { state, set, undo, redo, reset, canUndo, canRedo };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DesignerTool() {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const dropZoneRef      = useRef<HTMLDivElement>(null);
  const originalDataRef  = useRef<ImageData | null>(null);
  const labelCountRef    = useRef(0);

  const [hasImage,      setHasImage]      = useState(false);
  const [activeFinish,  setActiveFinish]  = useState<Finish>(FINISHES[0]);
  const [mode,          setMode]          = useState<DesignerMode>('ai');
  const [isSegmenting,  setIsSegmenting]  = useState(false);
  const [pendingPolygon,setPendingPolygon] = useState<PendingPolygon | null>(null);
  const [showOriginal,  setShowOriginal]  = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [opacity,       setOpacity]       = useState(0.85);
  const [isDragging,    setIsDragging]    = useState(false);
  const [coverage,      setCoverage]      = useState(0);

  const segments = useHistory<Segment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Recomposite canvas ──
  useEffect(() => {
    const canvas   = canvasRef.current;
    const original = originalDataRef.current;
    if (!canvas || !original) return;
    const ctx = canvas.getContext('2d')!;
    if (showOriginal) { ctx.putImageData(original, 0, 0); return; }
    const output = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
    for (const seg of segments.state) applySegment(output, seg);
    ctx.putImageData(output, 0, 0);
    // Coverage
    const total = segments.state.reduce((acc, s) => acc + maskCoverage(s.maskData), 0);
    setCoverage(Math.min(100, Math.round(total * 100)));
  }, [segments.state, showOriginal]);

  // ── Keyboard: undo/redo ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); segments.undo(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); segments.redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [segments]);

  // ── Clipboard paste ──
  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'));
      if (!item) return;
      const file = item.getAsFile();
      if (file) loadImageToCanvas(file);
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, []);

  // ── Load image ──
  const loadImageToCanvas = useCallback((file: File) => {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_MB}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    const img  = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const scale  = Math.min(1, MAX_CANVAS_WIDTH / img.naturalWidth);
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      originalDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHasImage(true);
      segments.reset([]);
      setSelectedId(null);
      setPendingPolygon(null);
      setError(null);
      setCoverage(0);
      labelCountRef.current = 0;
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { setError('Could not load image.'); URL.revokeObjectURL(url); };
    img.src = url;
  }, [segments]);

  // ── Drag-and-drop ──
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = ()                    => { setIsDragging(false); };
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) loadImageToCanvas(file);
  };

  // ── Add segment ──
  const addSegment = useCallback((maskData: Uint8ClampedArray, canvas: HTMLCanvasElement, finish: Finish, op: number) => {
    labelCountRef.current++;
    const seg: Segment = {
      id: crypto.randomUUID(),
      maskData,
      width:  canvas.width,
      height: canvas.height,
      finish,
      opacity: op,
      label: `Area ${labelCountRef.current}`,
    };
    segments.set(prev => [...prev, seg]);
    setSelectedId(seg.id);
  }, [segments, activeFinish]);

  // ── Canvas click ──
  const handleCanvasClick = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas   = canvasRef.current;
    const original = originalDataRef.current;
    if (!canvas || !original || isSegmenting || pendingPolygon) return;

    const rect = canvas.getBoundingClientRect();
    const px   = Math.round((e.clientX - rect.left)  * (canvas.width  / rect.width));
    const py   = Math.round((e.clientY - rect.top)   * (canvas.height / rect.height));

    // Click existing segment → recolor
    const hit = [...segments.state].reverse().find(s => pixelInMask(s, px, py));
    if (hit) {
      setSelectedId(hit.id);
      segments.set(prev => prev.map(s =>
        s.id === hit.id ? { ...s, finish: activeFinish, opacity } : s
      ));
      return;
    }

    // Quick mode: magic wand instantly
    if (mode === 'quick') {
      addSegment(magicWand(original, px, py), canvas, activeFinish, opacity);
      return;
    }

    // AI mode: Gemini polygon
    setIsSegmenting(true);
    setError(null);
    try {
      const imageBase64 = canvasToJpeg(canvas);
      const res = await fetch('/api/designer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image:      imageBase64,
          objectType: 'surface',
          colorName:  activeFinish.name,
          clickX:     px / canvas.width,
          clickY:     py / canvas.height,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Segmentation failed');
      if (!data.segmentation?.polygon?.length) throw new Error('AI could not identify a surface at that point.');
      setPendingPolygon({ points: data.segmentation.polygon, obstructions: data.segmentation.obstructions ?? [] });
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Something went wrong');
    } finally {
      setIsSegmenting(false);
    }
  }, [segments, activeFinish, mode, isSegmenting, pendingPolygon, opacity, addSegment]);

  // ── Apply polygon ──
  const applyPendingPolygon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pendingPolygon) return;
    const maskData = rasterizePolygon(pendingPolygon.points, pendingPolygon.obstructions, canvas.width, canvas.height);
    addSegment(maskData, canvas, activeFinish, opacity);
    setPendingPolygon(null);
  }, [pendingPolygon, activeFinish, opacity, addSegment]);

  // ── Finish select (also recolors selected) ──
  const handleFinishSelect = (finish: Finish) => {
    setActiveFinish(finish);
    if (selectedId) {
      segments.set(prev => prev.map(s => s.id === selectedId ? { ...s, finish } : s));
    }
  };

  // ── Opacity change (also updates selected segment live) ──
  const handleOpacityChange = (v: number) => {
    setOpacity(v);
    if (selectedId) {
      segments.set(prev => prev.map(s => s.id === selectedId ? { ...s, opacity: v } : s));
    }
  };

  const removeSegment = (id: string) => {
    segments.set(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const clearAll = () => {
    segments.reset([]);
    setSelectedId(null);
    setHasImage(false);
    setPendingPolygon(null);
    setError(null);
    setCoverage(0);
    labelCountRef.current = 0;
    originalDataRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'ddp-design.jpg';
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.click();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

      {/* ── LEFT: Canvas area ──────────────────────────────────────────────── */}
      <div className="lg:col-span-8 flex flex-col gap-4">

        {/* Canvas container */}
        <div
          ref={dropZoneRef}
          className={`relative w-full bg-chalk border overflow-hidden transition-colors ${
            isDragging ? 'border-petra border-2' : 'border-rule'
          }`}
          style={{ minHeight: 420 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Paint canvas — drop an image here or click Browse"
        >
          {/* Empty / drag state */}
          {!hasImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-slate select-none">
              <AnimatePresence>
                {isDragging ? (
                  <motion.div
                    key="drag"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Upload size={36} className="text-petra" />
                    <p className="text-xs uppercase tracking-widest text-petra">Drop to load image</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <Upload size={32} className="opacity-30" />
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs uppercase tracking-widest">Drop an image or browse</p>
                      <p className="text-[9px] opacity-40 uppercase tracking-wider">
                        Also: paste from clipboard (Ctrl+V)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary mt-1"
                        aria-label="Browse for image file"
                      >
                        Browse Files
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`w-full h-auto block ${
              hasImage && !pendingPolygon ? 'cursor-crosshair' : 'cursor-default'
            } ${hasImage ? '' : 'invisible absolute'}`}
            aria-label="Painting canvas — click a surface to apply finish"
          />

          {/* Polygon editor */}
          {pendingPolygon && (
            <PolygonEditor
              pending={pendingPolygon}
              activeFinish={activeFinish}
              onChange={setPendingPolygon}
              onApply={applyPendingPolygon}
              onCancel={() => setPendingPolygon(null)}
            />
          )}

          {/* Status badge */}
          {hasImage && !pendingPolygon && (
            <div
              className="absolute top-3 left-3 bg-ink/80 text-bone text-[9px] px-2.5 py-1.5 uppercase tracking-widest flex items-center gap-2 pointer-events-none z-10 backdrop-blur-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              {isSegmenting ? (
                <><Loader2 size={9} className="animate-spin text-petra" aria-hidden="true" /> Reading surface…</>
              ) : mode === 'ai' ? (
                <><Brain size={9} className="text-petra" aria-hidden="true" /> Smart Select — click any surface</>
              ) : (
                <><Zap size={9} className="text-petra" aria-hidden="true" /> Quick Select — click any surface</>
              )}
            </div>
          )}

          {/* Coverage badge */}
          {hasImage && !pendingPolygon && coverage > 0 && (
            <div className="absolute top-3 right-16 bg-ink/80 text-bone text-[9px] px-2.5 py-1.5 uppercase tracking-widest pointer-events-none z-10 backdrop-blur-sm">
              {coverage}% painted
            </div>
          )}

          {/* Top-right controls */}
          {hasImage && !pendingPolygon && (
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              <button
                onPointerDown={() => setShowOriginal(true)}
                onPointerUp={() => setShowOriginal(false)}
                onPointerLeave={() => setShowOriginal(false)}
                aria-label="Hold to see original"
                className="bg-ink/80 text-bone text-[9px] px-2.5 py-1.5 uppercase tracking-widest hover:bg-ink transition-colors select-none backdrop-blur-sm"
              >
                Before
              </button>
              <button onClick={() => segments.undo()} disabled={!segments.canUndo} aria-label="Undo" className="bg-ink/80 text-bone flex items-center justify-center w-8 h-8 hover:bg-ink transition-colors disabled:opacity-30 backdrop-blur-sm">
                <RotateCcw size={12} aria-hidden="true" />
              </button>
              <button onClick={() => segments.redo()} disabled={!segments.canRedo} aria-label="Redo" className="bg-ink/80 text-bone flex items-center justify-center w-8 h-8 hover:bg-ink transition-colors disabled:opacity-30 backdrop-blur-sm">
                <RotateCw size={12} aria-hidden="true" />
              </button>
              <button onClick={handleDownload} aria-label="Download result" className="bg-ink/80 text-bone flex items-center justify-center w-8 h-8 hover:bg-ink transition-colors backdrop-blur-sm">
                <Download size={12} aria-hidden="true" />
              </button>
              <button onClick={clearAll} aria-label="Clear canvas" className="bg-ink/80 text-bone flex items-center justify-center w-8 h-8 hover:bg-ink transition-colors backdrop-blur-sm">
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Scanning overlay */}
          <AnimatePresence>
            {isSegmenting && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink/20 backdrop-blur-[1px] flex items-center justify-center z-20"
                aria-hidden="true"
              >
                <motion.div
                  initial={{ top: '-4%' }} animate={{ top: '104%' }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-petra shadow-[0_0_14px_3px_rgba(196,135,58,0.7)]"
                />
                <div className="relative z-10 bg-ink/90 px-8 py-5 border border-bone/10 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-petra" />
                  <span className="text-bone font-mono text-[9px] uppercase tracking-[0.22em]">
                    Gemini is reading the surface…
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              role="alert"
              className="px-4 py-3 border-l-2 border-[var(--color-error)] bg-[var(--color-error)]/5 text-[var(--color-error)] text-xs font-mono flex justify-between items-start"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)} aria-label="Dismiss error" className="ml-4 opacity-50 hover:opacity-100">
                <X size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Painted segments list */}
        <AnimatePresence>
          {segments.state.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest opacity-40">Painted Surfaces</span>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Painted surfaces">
                {segments.state.map(seg => (
                  <motion.button
                    key={seg.id}
                    role="listitem"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedId(prev => prev === seg.id ? null : seg.id)}
                    aria-pressed={selectedId === seg.id}
                    aria-label={`${seg.label} — ${seg.finish.name}`}
                    className={`flex items-center gap-2 px-3 py-2 border text-left transition-all ${
                      selectedId === seg.id ? 'border-ink bg-chalk' : 'border-rule hover:border-slate'
                    }`}
                  >
                    <div className="w-3 h-3 shrink-0 border border-rule/40" style={{ backgroundColor: seg.finish.hex }} />
                    <span className="text-[9px] uppercase tracking-wider">{seg.label} · {seg.finish.name}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${seg.label}`}
                      onClick={(e) => { e.stopPropagation(); removeSegment(seg.id); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removeSegment(seg.id); } }}
                      className="ml-1 opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={9} aria-hidden="true" />
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) loadImageToCanvas(file);
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT: Controls ────────────────────────────────────────────────── */}
      <div className="lg:col-span-4 flex flex-col gap-8">

        {/* Mode selector */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] uppercase tracking-widest opacity-40 border-b border-rule pb-2">Mode</span>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'ai'    as const, Icon: Brain, label: 'Smart Select', sub: 'Gemini AI + editable border' },
              { id: 'quick' as const, Icon: Zap,   label: 'Quick Select',  sub: 'Instant colour fill' },
            ] as const).map(({ id, Icon, label, sub }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                aria-pressed={mode === id}
                aria-label={`${label} mode`}
                className={`p-3 border text-left transition-all ${
                  mode === id ? 'border-petra bg-chalk' : 'border-rule hover:border-slate'
                }`}
              >
                <Icon size={13} className={`mb-1.5 ${mode === id ? 'text-petra' : 'opacity-40'}`} aria-hidden="true" />
                <div className="text-[10px] uppercase tracking-wide font-medium">{label}</div>
                <div className="text-[9px] opacity-40 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Finish panel */}
        <FinishPanel
          activeFinish={activeFinish}
          onSelect={handleFinishSelect}
          selectedSegmentId={selectedId}
          opacity={opacity}
          onOpacityChange={handleOpacityChange}
        />

        {/* Instructions / CTA */}
        <div className="mt-auto flex flex-col gap-4">
          {!hasImage ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full btn-primary flex justify-between items-center group"
                aria-label="Upload a photo of your space"
              >
                <span>Upload Space Photo</span>
                <Upload size={15} aria-hidden="true" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-rule py-2.5 text-[9px] uppercase tracking-widest text-slate hover:border-ink hover:text-ink transition-all"
                aria-label="Paste image from clipboard"
              >
                <ClipboardPaste size={11} aria-hidden="true" /> Paste from Clipboard
              </button>
            </div>
          ) : (
            <div className="border-t border-rule pt-5 flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-widest text-slate">
              {pendingPolygon ? (
                <>
                  <span className="text-petra">→ Drag white handles to adjust border</span>
                  <span className="text-petra">→ Press Apply when satisfied</span>
                </>
              ) : (
                <>
                  <span>→ Pick a finish &amp; intensity</span>
                  <span>→ Click any surface to detect it</span>
                  <span>→ Adjust border, then apply</span>
                  <span>→ Click painted area to recolor</span>
                  <span>→ Hold "Before" to compare</span>
                  <span>→ Ctrl+Z / Ctrl+Y to undo/redo</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
