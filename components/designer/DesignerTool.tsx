'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Loader2, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OBJECT_TYPES = [
  { id: 'wall', label: 'Wall' },
  { id: 'floor', label: 'Floor' },
  { id: 'door', label: 'Door' },
  { id: 'window', label: 'Window Frames' },
  { id: 'ceiling', label: 'Ceiling' }
];

const COLORS = [
  { id: 'petra', name: 'Petra', hex: '#C4873A' },
  { id: 'marvellino', name: 'Marvellino', hex: '#B8A898' },
  { id: 'stucco', name: 'Stucco-tec', hex: '#8C7B6B' },
  { id: 'metallica', name: 'Metallica', hex: '#9CA0A0' },
  { id: 'bone', name: 'Bone', hex: '#F5F1EB' },
  { id: 'ink', name: 'Ink', hex: '#0F0F0D' }
];

export default function DesignerTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string>('wall');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingPro, setIsGeneratingPro] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [sceneData, setSceneData] = useState<any>(null);
  const [hoveredSegment, setHoveredSegment] = useState<any>(null);
  const [proResult, setProResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Image must be under 4MB');
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setAnalysisResult(null);
      setSceneData(null);
      setProResult(null);
      setError(null);

      // Auto-Scan the scene for smart selection
      await handleScanScene(file);
    }
  };

  const handleScanScene = async (file: File) => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const base64Image = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });

      const response = await fetch('/api/designer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (!response.ok) throw new Error('Scene scan failed');
      const data = await response.json();
      setSceneData(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      // We don't block the UI for scan failures, just log it
    } finally {
      setIsScanning(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setSceneData(null);
    setProResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyColor = async (argX?: any, argY?: any) => {
    // Type-safe coordinate extraction to avoid Event objects
    const clickX = typeof argX === 'number' ? argX : undefined;
    const clickY = typeof argY === 'number' ? argY : undefined;

    if (!imageFile) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setProResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const response = await fetch('/api/designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          objectType: selectedObject,
          colorName: selectedColor.name,
          colorHex: selectedColor.hex,
          clickX,
          clickY
        })
      });

      if (!response.ok) throw new Error('Failed to analyze image');

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateProPreview = async () => {
    if (!imageFile || !analysisResult?.segmentation?.polygon) return;

    setIsGeneratingPro(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      const base64Image = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });

      const response = await fetch('/api/designer/replicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          polygon: analysisResult.segmentation.polygon,
          obstructions: analysisResult.segmentation.obstructions,
          colorName: selectedColor.name,
          colorHex: selectedColor.hex
        })
      });

      if (!response.ok) throw new Error('Failed to generate high-fidelity preview');

      const data = await response.json();
      setProResult(data.image);
    } catch (err: any) {
      setError(err.message || 'Pro preview failed');
    } finally {
      setIsGeneratingPro(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* LEFT PANEL: Canvas */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="relative w-full aspect-[4/3] bg-chalk border border-rule overflow-hidden flex flex-col items-center justify-center">
          {!imagePreview ? (
            <div className="flex flex-col items-center gap-4 text-slate">
              <Upload size={32} className="opacity-50" />
              <p className="text-sm uppercase tracking-widest">Upload your space</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline mt-2"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <>
              {/* Interactive Segmentation Map (Visible on hover if scanned) */}
              <AnimatePresence>
                {sceneData?.mapUrl && !proResult && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply transition-opacity duration-500"
                    style={{ 
                      backgroundImage: `url(${sceneData.mapUrl})`,
                      backgroundSize: 'cover'
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Image Layer with Click Interaction */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imagePreview} 
                alt="Your space" 
                className="absolute inset-0 w-full h-full object-cover cursor-crosshair z-20"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  handleApplyColor(x, y);
                }}
              />
              
              <div className="absolute top-4 left-4 bg-ink/80 text-bone text-[8px] px-2 py-1 uppercase tracking-widest flex items-center gap-2 pointer-events-none z-30">
                {isScanning ? (
                  <>
                    <Loader2 size={10} className="animate-spin text-petra" />
                    Analyzing Architecture...
                  </>
                ) : (
                  <>
                    <Sparkles size={10} className="text-petra" />
                    {sceneData ? 'Scene Parsed - Click any object' : 'Click any surface to paint'}
                  </>
                )}
              </div>
              
              {/* High-Fidelity (Pro) Result Layer */}
              <AnimatePresence>
                {proResult && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={proResult} 
                      alt="Pro AI Result" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-petra text-bone text-[10px] px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} />
                      Pro AI HD Preview
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* High-Precision Selection Layer (Mask or Polygon) */}
              <AnimatePresence>
                {analysisResult?.isValidated && (analysisResult?.segmentation?.polygon || analysisResult?.segmentation?.maskUrl) && !proResult && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 pointer-events-none z-30"
                  >
                    {/* OPTION A: Pixel-Perfect Mask from SAM 2 */}
                    {analysisResult.segmentation.maskUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                         <div 
                           className="absolute inset-0 w-full h-full"
                           style={{ 
                             backgroundColor: selectedColor.hex,
                             maskImage: `url(${analysisResult.segmentation.maskUrl})`,
                             maskSize: '100% 100%',
                             WebkitMaskImage: `url(${analysisResult.segmentation.maskUrl})`,
                             WebkitMaskSize: '100% 100%',
                             mixBlendMode: 'multiply',
                             opacity: 0.8
                           }}
                         />
                         {/* Subtle Highlight Layer for Realism */}
                         <div 
                           className="absolute inset-0 w-full h-full"
                           style={{ 
                             backgroundColor: selectedColor.hex,
                             maskImage: `url(${analysisResult.segmentation.maskUrl})`,
                             maskSize: '100% 100%',
                             WebkitMaskImage: `url(${analysisResult.segmentation.maskUrl})`,
                             WebkitMaskSize: '100% 100%',
                             mixBlendMode: 'overlay',
                             opacity: 0.2
                           }}
                         />
                      </div>
                    ) : (
                      /* OPTION B: Vector Polygon from Gemini */
                      <svg width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0">
                        <defs>
                          <filter id="mask-blur">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="0.005" />
                          </filter>
                          <mask id="surface-mask">
                            <rect x="0" y="0" width="1" height="1" fill="black" />
                            <g filter="url(#mask-blur)">
                              <polygon 
                                points={analysisResult.segmentation.polygon.map((p: any) => `${p.x},${p.y}`).join(' ')} 
                                fill="white" 
                              />
                              {analysisResult.segmentation.obstructions?.map((obs: any, i: number) => (
                                <polygon 
                                  key={i}
                                  points={obs.map((p: any) => `${p.x},${p.y}`).join(' ')} 
                                  fill="black" 
                                />
                              ))}
                            </g>
                          </mask>
                        </defs>
                        <rect 
                          x="0" y="0" width="1" height="1" 
                          fill={selectedColor.hex} 
                          mask="url(#surface-mask)"
                          style={{ 
                            mixBlendMode: 'multiply',
                            opacity: 0.75
                          }}
                        />
                        <rect 
                          x="0" y="0" width="1" height="1" 
                          fill={selectedColor.hex} 
                          mask="url(#surface-mask)"
                          style={{ 
                            mixBlendMode: 'overlay',
                            opacity: 0.15
                          }}
                        />
                      </svg>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Removing Image Button */}
              <button 
                onClick={removeImage}
                className="absolute top-4 right-4 w-10 h-10 bg-ink/80 text-bone flex items-center justify-center hover:bg-ink transition-colors z-20"
                aria-label="Remove image"
              >
                <X size={20} />
              </button>

              {/* Loading State Overlay */}
              <AnimatePresence>
                {(isAnalyzing || isGeneratingPro) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-6 z-30 overflow-hidden"
                  >
                    <motion.div 
                      initial={{ top: '-10%' }}
                      animate={{ top: '110%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className={`absolute left-0 right-0 h-1 z-40 ${isGeneratingPro ? 'bg-bone shadow-[0_0_20px_white]' : 'bg-petra/50 shadow-[0_0_20px_rgba(196,135,58,0.8)]'}`}
                    />
                    
                    <div className="relative z-50 flex flex-col items-center bg-ink/80 p-8 border border-bone/10 backdrop-blur-md">
                      <Loader2 size={40} className={`animate-spin mb-4 ${isGeneratingPro ? 'text-bone' : 'text-petra'}`} />
                      <div className="flex flex-col items-center text-center">
                        <span className="text-bone font-display text-xl mb-1">
                          {isGeneratingPro ? 'Generating Pro HD Preview' : 'Architectural Mapping'}
                        </span>
                        <span className="text-bone/60 text-[10px] uppercase tracking-[0.2em] font-mono max-w-[250px]">
                          {isGeneratingPro 
                            ? 'Using SDXL Generative AI to render photorealistic finishes...' 
                            : `Identifying ${selectedObject} boundaries for ${selectedColor.name} finish...`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>

        {/* AI Analysis Result Feedback */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 border-l-2 flex justify-between items-center ${analysisResult.isValidated ? 'bg-chalk border-petra' : 'bg-[#FFF5F5] border-error'}`}
            >
              <div className="flex items-start gap-3">
                {analysisResult.isValidated ? (
                  <Sparkles className="text-petra mt-1 shrink-0" size={20} />
                ) : (
                  <X className="text-error mt-1 shrink-0" size={20} />
                )}
                <div>
                  <h4 className="font-display text-lg mb-2">
                    {analysisResult.isValidated ? 'Surface Mapped' : 'Object Not Validated'}
                  </h4>
                  <p className="text-sm opacity-80 leading-relaxed font-mono whitespace-pre-wrap">
                    {analysisResult.feedback}
                  </p>
                </div>
              </div>

              {analysisResult.isValidated && !proResult && (
                <button 
                  onClick={handleGenerateProPreview}
                  className="btn-outline border-petra text-petra hover:bg-petra hover:text-bone text-[10px] px-4 py-2 shrink-0 ml-4 hidden md:flex items-center gap-2"
                >
                  <Sparkles size={12} />
                  Generate Pro HD
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-4 bg-[#FFF5F5] border-l-2 border-error text-error text-sm">
            {error}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Controls */}
      <div className="lg:col-span-4 flex flex-col gap-12">
        {/* Object Selection */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-rule pb-2">
            <span className="text-xs uppercase tracking-widest opacity-60">Step 01</span>
            <span className="text-sm font-medium">Select Surface</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {OBJECT_TYPES.map(obj => (
              <button
                key={obj.id}
                onClick={() => setSelectedObject(obj.id)}
                className={`p-4 border text-left transition-all duration-300 ${
                  selectedObject === obj.id 
                    ? 'border-petra bg-chalk' 
                    : 'border-rule hover:border-slate'
                }`}
              >
                <span className="text-sm uppercase tracking-wide">{obj.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-rule pb-2">
            <span className="text-xs uppercase tracking-widest opacity-60">Step 02</span>
            <span className="text-sm font-medium">Select Finish</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {COLORS.map(color => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className="group flex flex-col gap-2 items-start"
              >
                <div 
                  className={`w-full aspect-square border transition-all duration-300 relative ${
                    selectedColor.id === color.id ? 'border-ink p-1' : 'border-rule p-0'
                  }`}
                >
                  <div 
                    className="w-full h-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                  {selectedColor.id === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-8">
          <button 
            onClick={() => handleApplyColor()}
            disabled={!imageFile || isAnalyzing}
            className="w-full btn-primary flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Apply Finish using AI</span>
            <Sparkles size={18} className="group-hover:text-bone" />
          </button>
          <p className="text-[10px] uppercase tracking-widest text-slate mt-4 text-center">
            Powered by Google Gemini
          </p>
        </div>
      </div>
    </div>
  );
}
