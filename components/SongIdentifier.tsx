import React, { useState, useRef } from 'react';
import { identifySong } from '../services/geminiService';
import { RequestStatus } from '../types';

const SongIdentifier: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResult(null);
      setStatus(RequestStatus.IDLE);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setStatus(RequestStatus.LOADING);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const responseText = await identifySong(base64String, 'audio/webm');
        setResult(responseText);
        setStatus(RequestStatus.SUCCESS);
      };
    } catch (error) {
      console.error(error);
      setStatus(RequestStatus.ERROR);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh] space-y-12 animate-in fade-in zoom-in duration-500">
      
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-bold text-white">Sonic Search</h2>
        <p className="text-slate-400 text-lg font-light">Hum, sing, or play. We'll find the beat.</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Pulse Rings */}
        {isRecording && (
            <>
                <div className="absolute w-64 h-64 rounded-full border border-pink-500/30 animate-ping opacity-20"></div>
                <div className="absolute w-48 h-48 rounded-full border border-violet-500/40 animate-ping opacity-40 delay-75"></div>
            </>
        )}

        {/* Recording Orb */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.5)]
            ${isRecording 
              ? 'bg-gradient-to-br from-red-500 to-pink-600 scale-110 animate-pulse-glow' 
              : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'
            }
          `}
        >
          {isRecording ? (
             <div className="w-10 h-10 bg-white rounded-md shadow-lg"></div>
          ) : (
             <svg className="w-12 h-12 text-slate-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          )}
        </button>
      </div>

      {/* Status / Result */}
      <div className="w-full min-h-[100px] flex items-center justify-center">
        {isRecording && (
            <span className="text-pink-400 font-mono tracking-[0.2em] animate-pulse">LISTENING...</span>
        )}
        
        {status === RequestStatus.LOADING && (
             <div className="flex items-center gap-3 text-violet-300">
                 <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200"></div>
                 <span className="font-medium">Analyzing Waveform</span>
             </div>
        )}

        {status === RequestStatus.SUCCESS && result && (
            <div className="glass-panel rounded-2xl p-8 w-full max-w-lg relative overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Identification Match</h3>
                <div className="prose prose-invert">
                    <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">{result}</p>
                </div>
            </div>
        )}
        
        {status === RequestStatus.ERROR && (
            <span className="text-red-400">Error analyzing audio. Please try again.</span>
        )}
      </div>
    </div>
  );
};

export default SongIdentifier;