import React, { useRef, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { Camera, RefreshCw, CheckCircle2, UserX, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Recognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognizing, setRecognizing] = useState(false);
  const [results, setResults] = useState([]);
  const [marked, setMarked] = useState([]);
  const [fps, setFps] = useState(0);

  // Initialize Webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access denied or not found");
      console.error(err);
    }
  };

  useEffect(() => {
    startVideo();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !recognizing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = canvas.toDataURL('image/jpeg', 0.5);

    try {
      const startTime = performance.now();
      const response = await api.post('/recognition/process_frame', { frame });
      const endTime = performance.now();
      
      setFps(Math.round(1000 / (endTime - startTime)));
      setResults(response.data.results);
      
      if (response.data.marked.length > 0) {
        setMarked(prev => [...response.data.marked, ...prev].slice(0, 5));
        response.data.marked.forEach(m => {
          toast.success(`Attendance marked: ${m.name}`, { icon: "✅" });
        });
      }
    } catch (err) {
      console.error("Frame processing error", err);
    }

    if (recognizing) {
      requestAnimationFrame(captureAndProcess);
    }
  }, [recognizing]);

  useEffect(() => {
    if (recognizing) {
      captureAndProcess();
    }
  }, [recognizing, captureAndProcess]);

  const toggleRecognition = () => {
    setRecognizing(!recognizing);
    if (!recognizing) {
      setResults([]);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white font-['Outfit']">Live Recognition</h2>
          <p className="text-slate-400 text-sm mt-1">Neural AI-powered face detection & automatic logging.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-primary tracking-widest uppercase">
            FPS: {recognizing ? fps : 0}
          </div>
          <button
            onClick={toggleRecognition}
            className={`flex items-center px-8 py-3.5 rounded-2xl font-bold transition-all duration-500 group ${
              recognizing 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/20' 
                : 'btn-primary flex items-center gap-2'
            }`}
          >
            {recognizing ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> TERMINATE SESSION</>
            ) : (
              <><Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> INITIATE SYSTEM</>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 relative group">
          <div className={`absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-[2.5rem] blur-xl opacity-20 transition-opacity duration-1000 ${recognizing ? 'opacity-40 animate-pulse' : 'opacity-10'}`}></div>
          <div className="relative bg-surface-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} width="640" height="360" className="hidden" />
            
            {/* High-Tech Overlay */}
            {recognizing && (
              <>
                <div className="absolute inset-0 border-[20px] border-primary/5 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[scan_3s_linear_infinite] opacity-50 shadow-[0_0_15px_#3b82f6]"></div>
              </>
            )}

            {/* Recognition Boxes */}
            {recognizing && results.map((res, i) => {
              const { top, right, bottom, left } = res.box;
              const isKnown = res.name !== "Unknown";
              return (
                <div 
                  key={i}
                  className={`absolute border-2 transition-all duration-200 animate-in zoom-in-50 ${
                    isKnown ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  }`}
                  style={{
                    top: `${(top / 720) * 100}%`,
                    left: `${(left / 1280) * 100}%`,
                    width: `${((right - left) / 1280) * 100}%`,
                    height: `${((bottom - top) / 720) * 100}%`,
                  }}
                >
                  <div className={`absolute -top-8 left-0 px-3 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl flex items-center gap-2 ${
                    isKnown ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {isKnown ? <CheckCircle2 className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {res.name.toUpperCase()} {res.distance !== 1.0 && `| ${Math.round((1 - res.distance) * 100)}%`}
                  </div>
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-4 border-l-4 border-white/50"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-4 border-r-4 border-white/50"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-4 border-l-4 border-white/50"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-4 border-r-4 border-white/50"></div>
                </div>
              );
            })}

            {!recognizing && (
              <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                  <Camera className="w-10 h-10 text-primary opacity-50" />
                </div>
                <h3 className="text-2xl font-bold font-['Outfit'] opacity-90">System Inactive</h3>
                <p className="text-slate-500 mt-2 font-medium">Authentication engines are in standby mode.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white font-['Outfit']">Activity Log</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {marked.length > 0 ? (
              marked.map((m, i) => (
                <div 
                  key={i} 
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-right duration-500 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{m.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{m.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Loader2 className={`w-6 h-6 text-slate-700 ${recognizing ? 'animate-spin' : ''}`} />
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  {recognizing ? 'Analyzing Feed...' : 'System Offline'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mb-1">Status Report</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {recognizing 
                  ? "Biometric scanners are active. All detections are being logged in real-time." 
                  : "Scanning components are currently powered down. Press start to reactivate."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Recognition;
