import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, onNavigate, activeView, theme, toggleTheme }) {
  return (
    <div className="h-full w-full font-sans antialiased bg-background text-foreground overflow-hidden">
      <Topbar 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
      />

      <div className="relative h-full pl-[90px]">
        <AnimatePresence mode="wait">
          <motion.main 
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full overflow-y-auto pt-[120px]"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}