import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export default function Topbar({ theme, toggleTheme }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-4 left-0 right-0 z-50 w-[95%] max-w-screen-lg mx-auto"
    >
      <div className="relative flex items-center justify-between h-16 px-6 bg-white/70 dark:bg-glass-bg backdrop-blur-xl border dark:border-glass-border border-white/20 rounded-2xl shadow-lg shadow-black/5">
        <Logo />

        <div className="flex items-center gap-4">
          <div className="w-px h-6 bg-glass-border" />
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            className="relative flex items-center justify-center w-9 h-9 transition-colors duration-200 border rounded-full dark:bg-glass-bg/50 bg-gray-100 dark:border-glass-border border-gray-200 text-muted-foreground hover:text-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -15, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 15, opacity: 0, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="pointer-events-none"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
      </div>
    </motion.header>
  );
}