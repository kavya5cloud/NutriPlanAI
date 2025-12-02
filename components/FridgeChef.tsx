import React, { useState, useRef, useEffect } from 'react';
import { analyzeFridgeImage } from '../services/geminiService';
import { FridgeAnalysis } from '../types';
import { RecipeCard } from './RecipeCard';
import { Camera, Upload, Loader2, Sparkles, ChefHat, X, Aperture, Image as ImageIcon } from 'lucide-react';

export const FridgeChef: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FridgeAnalysis | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleStartCamera = async () => {
    setIsCameraOpen(true);
    setAnalysis(null);
    setImagePreview(null);
    
    try {
      // Small delay to allow UI to render the video element
      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        stopCameraStream();
        setIsCameraOpen(false);
      }
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    try {
      // Extract base64 without the prefix
      const base64Data = imagePreview.split(',')[1];
      const result = await analyzeFridgeImage(base64Data);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      alert("Couldn't analyze image. Try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-wide">Fridge Chef</h2>
        <p className="text-lg text-slate-600 font-medium">Snap a photo of your open fridge, and we'll doodle up a menu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Camera View */}
          {isCameraOpen ? (
            <div className="relative aspect-[3/4] sm:aspect-video lg:aspect-[3/4] rounded-2xl border-2 border-slate-900 overflow-hidden bg-black shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                playsInline 
                muted
              />
              
              {/* Camera Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center gap-8 bg-gradient-to-t from-black/50 to-transparent">
                <button 
                  onClick={handleCloseCamera}
                  className="bg-white text-slate-900 p-3 rounded-full border-2 border-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <button 
                  onClick={handleCapture}
                  className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                >
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-900"></div>
                </button>
                
                <div className="w-12"></div> {/* Spacer for balance */}
              </div>
            </div>
          ) : (
            /* Upload/Preview Area */
            <div 
              className={`
                relative aspect-[3/4] sm:aspect-video lg:aspect-[3/4] rounded-2xl border-2 
                ${imagePreview ? 'border-solid border-slate-900' : 'border-dashed border-slate-900'}
                bg-white shadow-[4px_4px_0px_0px_#cbd5e1] overflow-hidden flex flex-col
              `}
            >
               {imagePreview ? (
                 <>
                   <img src={imagePreview} alt="Fridge content" className="w-full h-full object-cover" />
                   <button 
                    onClick={() => { setImagePreview(null); setAnalysis(null); }}
                    className="absolute top-2 right-2 bg-white text-slate-900 p-2 rounded-full border-2 border-slate-900 hover:bg-rose-100 hover:text-rose-600 transition-colors shadow-sm"
                   >
                     <X size={20} />
                   </button>
                 </>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                    <button 
                      onClick={handleStartCamera}
                      className="w-full py-4 bg-emerald-100 hover:bg-emerald-200 border-2 border-slate-900 rounded-xl flex flex-col items-center gap-2 transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.1)] group"
                    >
                      <div className="p-3 bg-white rounded-full border-2 border-slate-900 group-hover:scale-110 transition-transform">
                        <Camera size={32} className="text-emerald-600" />
                      </div>
                      <span className="font-bold text-lg text-slate-900">Open Camera</span>
                    </button>

                    <div className="relative w-full text-center">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t-2 border-slate-200 border-dashed"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-sm font-bold text-slate-400">OR</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 text-slate-600 font-bold"
                    >
                      <ImageIcon size={20} />
                      Upload from Gallery
                    </button>
                 </div>
               )}
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileChange} 
               />
            </div>
          )}

          {imagePreview && !isCameraOpen && (
             <button
             onClick={handleAnalyze}
             disabled={loading}
             className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-70 disabled:active:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
           >
             {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
             ANALYZE INGREDIENTS
           </button>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
           {!analysis && !loading && (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-slate-900 border-dashed rounded-2xl text-slate-400 min-h-[300px]">
                <ChefHat size={64} className="mb-4 opacity-20" />
                <p className="font-bold text-xl">Snap a photo to see magic happen.</p>
             </div>
           )}

           {loading && (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <Loader2 size={64} className="animate-spin text-emerald-500 mb-6" />
                <p className="text-slate-900 font-bold text-xl">Scanning your ingredients...</p>
                <p className="text-slate-500 font-medium mt-2">Identifying veggies, proteins, and hidden treats.</p>
             </div>
           )}

           {analysis && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
               
               <div className="bg-white p-5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <span className="bg-yellow-300 w-4 h-4 rounded-full border border-slate-900"></span>
                   Detected Ingredients
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {analysis.ingredientsDetected.map((ing, i) => (
                     <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-lg font-bold border-2 border-slate-900 transform hover:-rotate-2 transition-transform cursor-default">
                       {ing}
                     </span>
                   ))}
                 </div>
               </div>

               <div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 pl-2 border-l-4 border-emerald-500">Suggested Recipes</h3>
                 <div className="space-y-6">
                   {analysis.suggestedRecipes.map((recipe, idx) => (
                     <RecipeCard key={idx} type={`Suggestion #${idx + 1}`} recipe={recipe} />
                   ))}
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
