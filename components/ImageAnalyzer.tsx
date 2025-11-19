import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { RequestStatus } from '../types';

const ImageAnalyzer: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setAnalysis('');
        setStatus(RequestStatus.IDLE);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus(RequestStatus.LOADING);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = file.type;
        
        const result = await analyzeImage(base64String, mimeType);
        setAnalysis(result);
        setStatus(RequestStatus.SUCCESS);
      };
    } catch (error) {
      console.error(error);
      setStatus(RequestStatus.ERROR);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
       <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
          Visual Eye
        </h2>
        <p className="text-slate-400">Deep learning powered image understanding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Left Column: Image Input */}
         <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative">
                {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-all group">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="font-medium text-lg text-slate-300">Drop image to analyze</span>
                        <span className="text-sm mt-1 text-slate-500">Supports all formats</span>
                        <input type='file' className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="relative w-full h-full flex flex-col">
                        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl flex-1 bg-black/40">
                            <img src={imagePreview} alt="Target" className="w-full h-full object-contain" />
                            <button 
                                onClick={() => { setImagePreview(null); setFile(null); setAnalysis(''); }}
                                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors border border-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {status !== RequestStatus.SUCCESS && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={status === RequestStatus.LOADING}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {status === RequestStatus.LOADING ? 'Running Analysis...' : 'Run Analysis'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
         </div>

         {/* Right Column: Report */}
         <div className="glass-panel rounded-2xl p-8 min-h-[400px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-32 h-32 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             
             <h3 className="text-xl font-semibold text-emerald-400 mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                <span>Analysis Report</span>
             </h3>
             
             {status === RequestStatus.LOADING ? (
                 <div className="space-y-4 animate-pulse">
                    <div className="h-2 bg-emerald-500/20 rounded w-3/4"></div>
                    <div className="h-2 bg-emerald-500/20 rounded w-full"></div>
                    <div className="h-2 bg-emerald-500/20 rounded w-5/6"></div>
                    <div className="h-2 bg-emerald-500/10 rounded w-full mt-8"></div>
                    <div className="h-2 bg-emerald-500/10 rounded w-4/5"></div>
                 </div>
             ) : analysis ? (
                <div className="prose prose-invert prose-emerald max-w-none">
                     <p className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light">{analysis}</p>
                </div>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-600">
                     <p>Waiting for input data...</p>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;