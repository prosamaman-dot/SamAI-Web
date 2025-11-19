import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { RequestStatus } from '../types';

const quickPrompts = [
  "Cyberpunk style",
  "Remove background",
  "Oil painting",
  "Add dramatic lighting",
  "Turn into anime"
];

const ImageEditor: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  
  // Image 1 State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  // Image 2 State (Optional)
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [secondFile, setSecondFile] = useState<File | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isSecond: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (isSecond) {
            setSecondFile(file);
            setSecondImage(result);
        } else {
            setOriginalFile(file);
            setOriginalImage(result);
        }
        setGeneratedImage(null); // Reset previous generation
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalFile || !prompt.trim()) return;

    setStatus(RequestStatus.LOADING);
    try {
      // Helper to read file as base64
      const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve((reader.result as string).split(',')[1]);
            };
            reader.readAsDataURL(file);
        });
      };

      const base64String1 = await readFile(originalFile);
      const mimeType1 = originalFile.type;

      let base64String2: string | undefined = undefined;
      let mimeType2: string | undefined = undefined;

      if (secondFile) {
          base64String2 = await readFile(secondFile);
          mimeType2 = secondFile.type;
      }
        
      const resultImages = await editImage(base64String1, mimeType1, prompt, base64String2, mimeType2);
        
      if (resultImages.length > 0) {
           setGeneratedImage(`data:image/png;base64,${resultImages[0]}`);
           setStatus(RequestStatus.SUCCESS);
      } else {
           throw new Error("No image returned");
      }
    } catch (error) {
      console.error(error);
      setStatus(RequestStatus.ERROR);
    }
  };

  const UploadBox = ({ 
    image, 
    onChange, 
    onClear, 
    label, 
    subLabel 
  }: { 
    image: string | null, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    onClear: () => void, 
    label: string,
    subLabel?: string
  }) => (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</h4>
             {image && (
                 <button onClick={onClear} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
             )}
        </div>
        
        {!image ? (
            <label className="group flex-1 flex flex-col items-center justify-center w-full min-h-[160px] border border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 mb-3 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="mb-1 text-sm text-slate-300 font-medium group-hover:text-white">Upload Image</p>
                    {subLabel && <p className="text-[10px] text-slate-500">{subLabel}</p>}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={onChange} />
            </label>
        ) : (
            <div className="relative group w-full flex-1 min-h-[160px] rounded-xl overflow-hidden bg-black/50 border border-white/10">
                <img src={image} alt="Upload" className="w-full h-full object-contain p-2" />
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">Nano Banana</span> Editor
            </h2>
            <p className="text-slate-400">Transform reality with a simple text prompt.</p>
        </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CONTROLS PANEL */}
        <div className="lg:col-span-5 space-y-6">
           <div className="glass-panel rounded-2xl p-6 space-y-6">
               
               {/* Upload Grid */}
               <div className="grid grid-cols-2 gap-4">
                    <UploadBox 
                        image={originalImage} 
                        onChange={(e) => handleFileChange(e, false)}
                        onClear={() => { setOriginalImage(null); setOriginalFile(null); setGeneratedImage(null); }}
                        label="Base"
                    />
                    <UploadBox 
                        image={secondImage} 
                        onChange={(e) => handleFileChange(e, true)}
                        onClear={() => { setSecondImage(null); setSecondFile(null); }}
                        label="Merge (Opt)"
                        subLabel="Combine visuals"
                    />
               </div>

               {/* Prompt Input */}
               <div className="pt-2">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Magic Prompt</h3>
                 </div>
                 <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={secondImage ? "Combine these images..." : "Describe your changes..."}
                        className="w-full h-24 px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none text-white placeholder-slate-500 resize-none text-sm"
                    />
                    <button
                        onClick={handleEdit}
                        disabled={!originalImage || !prompt || status === RequestStatus.LOADING}
                        className="absolute bottom-3 right-3 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-purple-500/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {status === RequestStatus.LOADING ? 'Working...' : 'Generate'}
                    </button>
                 </div>
                 
                 {/* Chips */}
                 <div className="flex flex-wrap gap-2 mt-3">
                    {quickPrompts.map((p) => (
                        <button
                        key={p}
                        onClick={() => setPrompt(p)}
                        className="px-2.5 py-1 text-[10px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/20 rounded-full transition-all"
                        >
                        {p}
                        </button>
                    ))}
                 </div>
               </div>
           </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7">
            <div className="h-full min-h-[500px] glass-panel rounded-2xl p-1 flex flex-col">
                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group">
                    
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {status === RequestStatus.LOADING ? (
                        <div className="text-center z-10">
                            <div className="relative w-20 h-20 mx-auto mb-4">
                                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-fuchsia-500 animate-spin"></div>
                                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                            </div>
                            <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 animate-pulse">
                                Creating Masterpiece...
                            </p>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative w-full h-full">
                             <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                             <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <a href={generatedImage} download="samai-edit.png" className="px-4 py-2 bg-black/70 backdrop-blur text-white text-sm font-medium rounded-lg hover:bg-black/90 border border-white/10">
                                     Download
                                 </a>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center z-10 p-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-slate-500 font-light text-lg">Your creation will materialize here</p>
                        </div>
                    )}
                </div>
                
                 {status === RequestStatus.ERROR && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/20 text-red-200 px-4 py-2 rounded-lg border border-red-500/30 backdrop-blur">
                        Generation failed. Please try again.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;