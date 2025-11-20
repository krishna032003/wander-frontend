import React from 'react';
import Topbar from './Topbar';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Voice() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Voice" />
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
        <motion.div 
          className="relative flex items-center justify-center w-64 h-64"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <motion.div className="absolute inset-0 rounded-full bg-cyan-500/5" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute inset-0 border-2 rounded-full border-cyan-500/20" animate={{ scale: [1, 1.4], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <Mic className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
          </div>
        </motion.div>
        <p className="mt-12 text-lg font-semibold">Voice Assistant</p><p className="text-sm text-gray-500">Listening for your command...</p></div>
    </div>
  );
}