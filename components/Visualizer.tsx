import React from 'react';
import { motion } from 'framer-motion';
import { RailsComponentType } from '../types';

interface VisualizerProps {
  activeStage?: RailsComponentType;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeStage }) => {
  const nodes = [
    { id: RailsComponentType.ROUTE, label: 'Router', x: 50, y: 100, color: 'bg-yellow-600' },
    { id: RailsComponentType.CONTROLLER, label: 'Controller', x: 200, y: 100, color: 'bg-blue-600' },
    { id: RailsComponentType.MODEL, label: 'Model', x: 200, y: 200, color: 'bg-red-600' },
    { id: RailsComponentType.DATABASE, label: 'Database', x: 200, y: 300, color: 'bg-slate-600' },
    { id: RailsComponentType.VIEW, label: 'View', x: 350, y: 100, color: 'bg-green-600' },
  ];

  return (
    <div className="w-full h-64 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="relative w-[500px] h-[400px]">
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-500" strokeWidth="2">
            <line x1="100" y1="120" x2="200" y2="120" /> {/* Route -> Controller */}
            <line x1="250" y1="150" x2="250" y2="200" /> {/* Controller -> Model */}
            <line x1="250" y1="250" x2="250" y2="300" /> {/* Model -> DB */}
            <line x1="300" y1="120" x2="350" y2="120" /> {/* Controller -> View */}
        </svg>

        {nodes.map((node) => {
          const isActive = activeStage === node.id;
          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ 
                scale: isActive ? 1.1 : 1, 
                opacity: isActive ? 1 : 0.7,
                borderColor: isActive ? '#fff' : 'transparent'
              }}
              className={`absolute flex items-center justify-center w-24 h-12 rounded shadow-lg border-2 ${node.color} text-white font-mono text-xs font-bold`}
              style={{ left: node.x, top: node.y }}
            >
              {node.label}
            </motion.div>
          );
        })}

        {/* Request Packet Animation */}
        <motion.div
            className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"
            animate={{
                offsetDistance: "0%",
                left: [20, 100, 250, 250, 250, 250, 400],
                top:  [120, 120, 120, 200, 300, 120, 120],
                opacity: [0, 1, 1, 1, 1, 1, 0]
            }}
            transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1
            }}
        />
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-mono">
        System Monitor: Active
      </div>
    </div>
  );
};

export default Visualizer;