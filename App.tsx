import React, { useState } from 'react';
import ImageEditor from './components/ImageEditor';
import SongIdentifier from './components/SongIdentifier';
import ImageAnalyzer from './components/ImageAnalyzer';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);

  const renderContent = () => {
    switch (mode) {
      case AppMode.LANDING:
        return <LandingPage onSelectMode={setMode} />;
      case AppMode.IMAGE_EDITOR:
        return <ImageEditor />;
      case AppMode.IMAGE_ANALYZER:
        return <ImageAnalyzer />;
      case AppMode.SONG_SEARCH:
        return <SongIdentifier />;
      default:
        return <LandingPage onSelectMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 hover:scale-[1.02]">
        <div className="glass-panel rounded-full p-1.5 flex items-center gap-1 shadow-2xl shadow-black/50 ring-1 ring-white/10">
           <NavBtn 
             label="Home" 
             active={mode === AppMode.LANDING} 
             onClick={() => setMode(AppMode.LANDING)}
             icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
           />
           <div className="w-px h-4 bg-white/10 mx-1"></div>
           <NavBtn 
             label="Editor" 
             active={mode === AppMode.IMAGE_EDITOR} 
             onClick={() => setMode(AppMode.IMAGE_EDITOR)}
             icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
           />
           <NavBtn 
             label="Analyzer" 
             active={mode === AppMode.IMAGE_ANALYZER} 
             onClick={() => setMode(AppMode.IMAGE_ANALYZER)}
             icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
           />
           <NavBtn 
             label="Songs" 
             active={mode === AppMode.SONG_SEARCH} 
             onClick={() => setMode(AppMode.SONG_SEARCH)}
             icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
           />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto flex flex-col">
        <div className="flex-1 w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
          {renderContent()}
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-700"></div>
             <span className="font-semibold text-slate-400 tracking-widest uppercase text-[10px]">Powered by SamAI</span>
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-700"></div>
        </div>
      </footer>
    </div>
  );
};

const NavBtn = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`
      relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
      ${active ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
    <span>{label}</span>
    {active && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></span>}
  </button>
);

const LandingPage = ({ onSelectMode }: { onSelectMode: (mode: AppMode) => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-16">
    
    {/* Hero Header */}
    <div className="space-y-6 max-w-4xl relative">
        {/* Decorative Glow Behind Header */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-fuchsia-500/10 blur-[100px] rounded-full -z-10"></div>
       
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-in fade-in zoom-in duration-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">SamAI Powered</span>
       </div>

       <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
         <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Unleash your</span>
         <br />
         <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500">Creative Mind</span>
       </h1>
       <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
         Experience the next generation of AI. Edit realities, understand visuals, and discover music with our advanced creative suite.
       </p>
       
       <div className="pt-4">
          <button 
            onClick={() => onSelectMode(AppMode.IMAGE_EDITOR)}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
          >
            <span>Start Creating</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
       </div>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        <FeatureCard 
            title="Nano Editor" 
            desc="Edit and combine images with simple text prompts."
            icon={
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            }
            color="from-purple-500 to-indigo-500"
            accentColor="bg-purple-500"
            onClick={() => onSelectMode(AppMode.IMAGE_EDITOR)}
        />
        <FeatureCard 
            title="Visual Eye" 
            desc="Deeply analyze and understand any image."
            icon={
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            }
            color="from-emerald-400 to-teal-500"
            accentColor="bg-emerald-500"
            onClick={() => onSelectMode(AppMode.IMAGE_ANALYZER)}
        />
        <FeatureCard 
            title="Sonic Search" 
            desc="Identify any song by just humming or singing."
            icon={
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            }
            color="from-pink-500 to-rose-500"
            accentColor="bg-pink-500"
            onClick={() => onSelectMode(AppMode.SONG_SEARCH)}
        />
    </div>
  </div>
);

const FeatureCard = ({ title, desc, icon, color, accentColor, onClick }: { title: string, desc: string, icon: React.ReactNode, color: string, accentColor: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="group relative glass-panel rounded-3xl p-8 text-left transition-all duration-500 hover:-translate-y-2 glass-card-hover overflow-hidden border border-white/5 hover:border-white/20"
  >
    {/* Hover Gradient Background */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition-opacity duration-700`}></div>
    
    {/* Content */}
    <div className="relative z-10 flex flex-col h-full">
        {/* Icon Container */}
        <div className={`w-16 h-16 rounded-2xl ${accentColor}/20 flex items-center justify-center mb-6 border border-${accentColor}/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(0,0,0,0.2)]`}>
            {icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200">{title}</h3>
        <p className="text-slate-400 group-hover:text-slate-300 transition-colors font-light leading-relaxed mb-8">{desc}</p>
        
        <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
            <span>Launch Tool</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
    </div>
  </button>
);

export default App;