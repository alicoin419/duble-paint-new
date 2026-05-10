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
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyColor = async () => {
    if (!imageFile) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const response = await fetch('/api/designer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          objectType: selectedObject,
          colorName: selectedColor.name,
          colorHex: selectedColor.hex
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again in a minute.');
        }
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
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
              {/* Image Layer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imagePreview} 
                alt="Your space" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Simulated Color Overlay based on AI validation */}
              <AnimatePresence>
                {analysisResult?.isValidated && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                )}
              </AnimatePresence>

              {/* Removing Image Button */}
              <button 
                onClick={removeImage}
                className="absolute top-4 right-4 w-10 h-10 bg-ink/80 text-bone flex items-center justify-center hover:bg-ink transition-colors z-10"
                aria-label="Remove image"
              >
                <X size={20} />
              </button>

              {/* Loading State Overlay */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-ink/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-20"
                  >
                    <Loader2 size={40} className="text-bone animate-spin" />
                    <div className="flex flex-col items-center">
                      <span className="text-bone font-display text-xl mb-1">AI Model Analyzing Space</span>
                      <span className="text-bone/60 text-xs uppercase tracking-widest font-mono">
                        Validating {selectedObject} structure for {selectedColor.name}...
                      </span>
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
              className={`p-6 border-l-2 ${analysisResult.isValidated ? 'bg-chalk border-petra' : 'bg-[#FFF5F5] border-error'}`}
            >
              <div className="flex items-start gap-3">
                {analysisResult.isValidated ? (
                  <Sparkles className="text-petra mt-1 shrink-0" size={20} />
                ) : (
                  <X className="text-error mt-1 shrink-0" size={20} />
                )}
                <div>
                  <h4 className="font-display text-lg mb-2">
                    {analysisResult.isValidated ? 'Analysis Complete & Applied' : 'Object Not Validated'}
                  </h4>
                  <p className="text-sm opacity-80 leading-relaxed font-mono whitespace-pre-wrap">
                    {analysisResult.feedback}
                  </p>
                </div>
              </div>
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
            onClick={handleApplyColor}
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
