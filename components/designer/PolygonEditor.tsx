'use client';

import { useRef } from 'react';
import { X, Check } from 'lucide-react';
import type { PendingPolygon, Finish, Point } from '@/lib/designer/types';
import { pointsToSvg } from '@/lib/designer/canvasUtils';

interface Props {
  pending: PendingPolygon;
  activeFinish: Finish;
  onChange: (p: PendingPolygon) => void;
  onApply: () => void;
  onCancel: () => void;
}

export default function PolygonEditor({ pending, activeFinish, onChange, onApply, onCancel }: Props) {
  const draggingRef = useRef<{ list: 'main' | number; idx: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toNorm = (e: React.PointerEvent): Point => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left)  / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top)   / rect.height)),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = draggingRef.current;
    if (!d) return;
    const { x, y } = toNorm(e);
    if (d.list === 'main') {
      onChange({ ...pending, points: pending.points.map((p, i) => i === d.idx ? { x, y } : p) });
    } else {
      onChange({
        ...pending,
        obstructions: pending.obstructions.map((obs, oi) =>
          oi === d.list ? obs.map((p, i) => i === d.idx ? { x, y } : p) : obs
        ),
      });
    }
  };

  const stopDrag = () => { draggingRef.current = null; };

  const handleDown = (list: 'main' | number, idx: number) => (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = { list, idx };
  };

  const hex = activeFinish.hex;
  const mainPts = pointsToSvg(pending.points);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 touch-none"
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      role="application"
      aria-label="Polygon editor — drag handles to adjust selection"
    >
      {/* SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <mask id="poly-cutout">
            <rect width="1" height="1" fill="white" />
            <polygon points={mainPts} fill="black" />
          </mask>
        </defs>

        {/* Dim outside */}
        <rect width="1" height="1" fill="rgba(0,0,0,0.52)" mask="url(#poly-cutout)" />

        {/* Color preview */}
        <polygon points={mainPts} fill={hex} opacity="0.38" />

        {/* Obstruction holes */}
        {pending.obstructions.map((obs, i) => (
          <polygon key={i} points={pointsToSvg(obs)} fill="rgba(0,0,0,0.6)" />
        ))}

        {/* Dashed outline — double layer for contrast */}
        <polygon points={mainPts} fill="none" stroke="white"  strokeWidth="2"   strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
        <polygon points={mainPts} fill="none" stroke={hex}    strokeWidth="1"   strokeDasharray="8 5" strokeDashoffset="6.5" vectorEffect="non-scaling-stroke" />

        {/* Obstruction outlines */}
        {pending.obstructions.map((obs, i) => (
          <polygon key={i} points={pointsToSvg(obs)} fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" opacity="0.6" />
        ))}
      </svg>

      {/* Main polygon handles */}
      {pending.points.map((p, i) => (
        <button
          key={i}
          aria-label={`Polygon handle ${i + 1}`}
          className="absolute w-5 h-5 bg-white border-2 cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-petra"
          style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: 'translate(-50%,-50%)', borderColor: hex, zIndex: 10 }}
          onPointerDown={handleDown('main', i)}
        />
      ))}

      {/* Obstruction handles */}
      {pending.obstructions.map((obs, oi) =>
        obs.map((p, i) => (
          <button
            key={`obs-${oi}-${i}`}
            aria-label={`Obstruction handle ${oi + 1}-${i + 1}`}
            className="absolute w-3.5 h-3.5 bg-slate border border-white cursor-grab active:cursor-grabbing touch-none"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}
            onPointerDown={handleDown(oi, i)}
          />
        ))
      )}

      {/* Instructions badge */}
      <div className="absolute top-3 left-3 bg-ink/85 text-bone text-[9px] px-2.5 py-1.5 uppercase tracking-widest pointer-events-none backdrop-blur-sm">
        Drag white handles to adjust · Then apply
      </div>

      {/* Confirm / Cancel bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          onClick={onCancel}
          aria-label="Cancel polygon edit"
          className="flex items-center gap-2 px-4 py-2.5 bg-ink/90 text-bone text-[10px] uppercase tracking-widest hover:bg-ink transition-colors backdrop-blur-sm"
        >
          <X size={11} aria-hidden="true" /> Cancel
        </button>
        <button
          onClick={onApply}
          aria-label={`Apply ${activeFinish.name} finish`}
          className="flex items-center gap-2 px-5 py-2.5 text-bone text-[10px] uppercase tracking-widest transition-colors backdrop-blur-sm"
          style={{ backgroundColor: hex }}
        >
          <Check size={11} aria-hidden="true" /> Apply {activeFinish.name}
        </button>
      </div>
    </div>
  );
}
