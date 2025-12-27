import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Cloud, Laptop, Box, ArrowRight, Play, CheckCircle, ShieldCheck, RefreshCw, Container } from 'lucide-react';

const STEPS = [
    { 
        id: 0, 
        label: 'Local Environment', 
        title: 'Git Push & Build',
        action: 'kamal deploy',
        desc: 'The process starts on your machine. Kamal reads config/deploy.yml, builds the Docker image locally (or via remote builder) for linux/amd64.',
        config: `builder:\n  arch: amd64\n  remote: ssh://build-server` 
    },
    { 
        id: 1, 
        label: 'Registry Push', 
        title: 'Upload to Registry',
        action: 'docker push',
        desc: 'The built image is tagged with the git hash and pushed to a container registry (Docker Hub, GHCR, AWS ECR).',
        config: `registry:\n  server: ghcr.io\n  username: rails-user` 
    },
    { 
        id: 2, 
        label: 'Server Pull', 
        title: 'Pull & Boot',
        action: 'docker pull && docker run',
        desc: 'Kamal SSHs into your VPS, pulls the new image, and starts a NEW container alongside the old one on a free port.',
        config: `servers:\n  web:\n    - 192.168.1.1` 
    },
    { 
        id: 3, 
        label: 'Health Check', 
        title: 'Verify Readiness',
        action: 'curl /up',
        desc: 'Kamal checks the exposed health endpoint. If it returns 200 OK, the app is considered ready to receive traffic.',
        config: `healthcheck:\n  path: /up\n  port: 3000` 
    },
    { 
        id: 4, 
        label: 'Traefik Switch', 
        title: 'Zero Downtime Swap',
        action: 'traefik update',
        desc: 'Traefik (the reverse proxy) is updated to point traffic to the NEW container. The old container stops receiving requests.',
        config: `traefik:\n  options:\n    publish: "80:80"` 
    },
    { 
        id: 5, 
        label: 'Cleanup', 
        title: 'Prune Old Version',
        action: 'docker stop && docker rm',
        desc: 'The old container is stopped and removed. The deployment is complete with zero downtime.',
        config: `options:\n  prune: true` 
    }
];

const DeploymentSimulator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isPlaying && currentStep < STEPS.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 3500);
        } else if (isPlaying && currentStep === STEPS.length - 1) {
            timer = setTimeout(() => {
                setIsPlaying(false);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep]);

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const handlePlay = () => {
        if (currentStep === STEPS.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(true);
    };

    const stepData = STEPS[currentStep];

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <div className="flex items-center gap-3 mb-6 p-1">
                <Container className="text-rails-red" />
                <h2 className="text-2xl font-bold text-white">Kamal Deployment Simulator</h2>
            </div>

            <div className="flex-1 flex flex-col gap-6 min-h-0">
                
                {/* Visualizer Stage */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center p-8">
                    
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                            backgroundSize: '40px 40px' 
                        }}>
                    </div>

                    {/* Nodes Container */}
                    <div className="relative w-full max-w-4xl flex justify-between items-center z-10">
                        
                        {/* 1. Local Machine */}
                        <div className={`relative flex flex-col items-center gap-2 transition-opacity duration-500 ${currentStep === 0 ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                            <div className="w-20 h-20 bg-slate-800 border-2 border-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                <Laptop className="text-blue-400 w-8 h-8" />
                            </div>
                            <span className="text-xs font-mono text-blue-300 font-bold uppercase">Localhost</span>
                        </div>

                        {/* Connection 1 */}
                        <div className="flex-1 h-1 bg-slate-800 relative mx-4">
                            {currentStep >= 1 && (
                                <motion.div 
                                    className="absolute inset-0 bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1 }}
                                />
                            )}
                            {currentStep === 0 && isPlaying && (
                                <motion.div 
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg z-20"
                                    animate={{ left: ["0%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </div>

                        {/* 2. Registry */}
                        <div className={`relative flex flex-col items-center gap-2 transition-opacity duration-500 ${currentStep === 1 ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                            <div className="w-20 h-20 bg-slate-800 border-2 border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                <Cloud className="text-purple-400 w-8 h-8" />
                            </div>
                            <span className="text-xs font-mono text-purple-300 font-bold uppercase">Registry</span>
                        </div>

                         {/* Connection 2 */}
                         <div className="flex-1 h-1 bg-slate-800 relative mx-4">
                            {currentStep >= 2 && (
                                <motion.div 
                                    className="absolute inset-0 bg-purple-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1 }}
                                />
                            )}
                            {currentStep === 1 && (
                                <motion.div 
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg z-20"
                                    animate={{ left: ["0%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </div>

                        {/* 3. VPS */}
                        <div className={`relative p-6 border-2 border-dashed ${currentStep >= 2 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-700 bg-slate-900'} rounded-xl transition-all duration-500 min-w-[280px]`}>
                            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs font-mono text-slate-400 border border-slate-700 rounded">
                                Production VPS (Ubuntu)
                            </div>
                            
                            {/* Traefik */}
                            <div className="w-full h-12 bg-slate-800 border border-amber-500/50 rounded mb-4 flex items-center justify-center gap-2 shadow-sm">
                                <ShieldCheck className={`w-4 h-4 ${currentStep >= 4 ? 'text-amber-400' : 'text-slate-500'}`} />
                                <span className={`text-xs font-bold ${currentStep >= 4 ? 'text-amber-100' : 'text-slate-500'}`}>Traefik Proxy (80/443)</span>
                            </div>

                            <div className="flex justify-between gap-2">
                                {/* Old Container */}
                                <div className={`flex-1 h-24 rounded border border-slate-700 flex flex-col items-center justify-center gap-1 transition-all duration-500 ${currentStep === 5 ? 'opacity-20 scale-90' : 'opacity-100 bg-slate-800'}`}>
                                    <Box className="w-6 h-6 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 font-mono">App (Old)</span>
                                    {currentStep < 4 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                </div>

                                {/* New Container */}
                                <AnimatePresence>
                                    {currentStep >= 2 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`flex-1 h-24 rounded border-2 flex flex-col items-center justify-center gap-1 relative ${currentStep >= 3 ? 'border-emerald-500 bg-emerald-900/20' : 'border-blue-500 bg-blue-900/20'}`}
                                        >
                                            <Box className={`w-6 h-6 ${currentStep >= 3 ? 'text-emerald-400' : 'text-blue-400'}`} />
                                            <span className="text-[10px] text-white font-mono">App (New)</span>
                                            {currentStep >= 4 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                                            
                                            {currentStep === 3 && (
                                                <div className="absolute -right-2 -top-2 bg-yellow-500 text-black text-[10px] px-1 rounded font-bold">
                                                    Checking
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Stage Label */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 px-6 py-2 rounded-full flex items-center gap-2 shadow-xl z-20">
                         {currentStep === 0 && <Laptop size={14} className="text-blue-400" />}
                         {currentStep === 1 && <Cloud size={14} className="text-purple-400" />}
                         {currentStep >= 2 && <Server size={14} className="text-emerald-400" />}
                         <span className="text-sm font-bold text-slate-200">{stepData.label}</span>
                    </div>

                </div>

                {/* Control & Info Panel */}
                <div className="h-64 flex gap-6">
                    
                    {/* Controls */}
                    <div className="w-1/4 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Controls</h3>
                            <div className="flex gap-2 mb-4">
                                {STEPS.map((step) => (
                                    <div 
                                        key={step.id} 
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${step.id <= currentStep ? 'bg-rails-red' : 'bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">Step {currentStep + 1} of {STEPS.length}</p>
                        </div>

                        <div className="flex gap-2">
                            {!isPlaying ? (
                                <button 
                                    onClick={handlePlay}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Play size={18} fill="currentColor" />
                                    {currentStep === STEPS.length - 1 ? 'Replay' : 'Deploy'}
                                </button>
                            ) : (
                                <button 
                                    className="flex-1 bg-slate-700 text-slate-400 py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-wait"
                                    disabled
                                >
                                    <RefreshCw size={18} className="animate-spin" />
                                    Running...
                                </button>
                            )}
                            <button 
                                onClick={handleReset}
                                className="px-4 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-lg transition-colors"
                                title="Reset"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex gap-6 animate-in slide-in-from-right duration-300" key={currentStep}>
                         <div className="w-1/2">
                             <div className="flex items-center gap-2 mb-3">
                                 <div className="p-1.5 bg-blue-900/30 border border-blue-800 rounded">
                                     <ArrowRight size={14} className="text-blue-400" />
                                 </div>
                                 <h3 className="text-lg font-bold text-white">{stepData.title}</h3>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                 {stepData.desc}
                             </p>
                             <div className="bg-black/50 p-2 rounded border border-slate-800 flex items-center gap-2">
                                 <span className="text-emerald-500 font-mono font-bold text-xs">$</span>
                                 <span className="text-slate-200 font-mono text-xs">{stepData.action}</span>
                             </div>
                         </div>
                         
                         {/* Config Preview */}
                         <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs relative overflow-hidden group">
                             <div className="absolute top-2 right-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider">deploy.yml</div>
                             <pre className="text-amber-100/90 whitespace-pre-wrap leading-relaxed z-10 relative">
                                 {stepData.config}
                             </pre>
                             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rails-red/5 rounded-full blur-2xl"></div>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeploymentSimulator;
