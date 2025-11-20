import React from 'react';
import { LayoutGrid, MessageCircle, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'home', icon: LayoutGrid, label: 'Dashboard' },
  { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
  { id: 'documents', icon: FileCode, label: 'Documents' },
];

const NavItem = ({ item, isActive, onClick }) => {
  return (
    <motion.li 
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button 
        onClick={onClick} 
        className={`relative flex flex-col items-center justify-center w-20 h-20 gap-2 transition-colors duration-200 rounded-xl ${isActive ? 'dark:text-foreground text-teal-700' : 'text-muted-foreground hover:text-foreground'}`}
      >
        {isActive && (
          <motion.div
            layoutId="active-sidebar-glow"
            className="absolute inset-0 border rounded-xl dark:bg-brand-accent/10 bg-teal-50 dark:border-brand-accent/30 border-teal-200"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl dark:shadow-neon-glow"
            style={{ filter: 'blur(10px)' }}
          />
        )}
        <item.icon size={24} className="relative z-10" />
        <span className="relative z-10 text-xs font-medium tracking-wide">{item.label}</span>
      </button>
    </motion.li>
  );
};

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <div className="fixed inset-y-0 left-0 z-40 flex items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="ml-4"
      >
        <ul className="flex flex-col items-center gap-2 p-2 bg-white/10 backdrop-blur-md border-r border-white/10 rounded-2xl shadow-inner-soft">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </ul>
      </motion.div>
    </div>
  );
}