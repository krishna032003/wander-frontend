import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, User, Volume2, Mic, Send, ArrowDown } from 'lucide-react';

const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-r border-white/10"><Bot size={20} className="text-brand-accent" /></div>
    <div className="flex items-center gap-1.5 p-3.5 rounded-full bg-white/10 backdrop-blur-md border-r border-white/10">
      <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, delay: 0.15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, delay: 0.3, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  </motion.div>
);

export default function Chat({
  chatHistory,
  isLoading,
  currentMessage,
  setCurrentMessage,
  sendMessage,
  handleVoiceInput,
  isRecording,
  speakText,
  isSpeaking,
  chatEndRef,
}) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > 200);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [chatHistory, isLoading]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col h-full bg-transparent"
    >
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 w-full max-w-screen-md px-4 pt-8 pb-40 mx-auto space-y-8 flex flex-col"
      >
        {chatHistory.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground"
          >
            <Sparkles size={56} className="mb-4 opacity-30" />
            <p className="text-2xl font-light">Start a conversation</p>
            <p className="mt-2 text-sm font-normal">Ask about destinations, attractions, or travel tips.</p>
          </motion.div>
        )}
        
        <AnimatePresence>
          {chatHistory.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-r border-white/10"><Bot size={20} className="text-brand-accent" /></div>}
              <div className={`max-w-xl rounded-2xl px-5 py-3 shadow-lg ${
                msg.role === 'user' ? 'bg-brand-accent text-background rounded-br-lg' : msg.isError ? 'bg-destructive/20 text-destructive-foreground rounded-bl-lg border border-destructive/30' : 'bg-white/10 backdrop-blur-md border-r border-white/10 text-foreground rounded-bl-lg'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && !msg.isError && (
                  <div className="flex items-center gap-4 pt-3 mt-2 border-t border-white/10">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => speakText(msg.content)} disabled={isSpeaking} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"><Volume2 size={14} /> Listen</motion.button>
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-r border-white/10"><User size={20} className="text-muted-foreground" /></div>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <div className="flex justify-start"><TypingIndicator /></div>}
        <div ref={chatEndRef} />
      </div>

      <AnimatePresence>
        {showScrollToBottom && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute z-20 p-2 rounded-full bottom-28 right-8 bg-white/10 backdrop-blur-md border-r border-white/10 text-muted-foreground hover:text-foreground"
          >
            <ArrowDown size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-0 right-0 mx-auto w-[90%] max-w-2xl z-50">
        <motion.div 
          layout 
          className="relative rounded-full p-2 flex items-center gap-3 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 focus-within:ring-2 focus-within:ring-teal-500/50"
        >
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(currentMessage); } }}
            placeholder={isLoading ? "WanderGuide is thinking..." : "Ask anything about your travel..."}
            disabled={isLoading}
            rows={1}
            className="w-full px-2 pr-12 text-slate-600 dark:text-slate-200 transition-all duration-300 bg-transparent outline-none resize-none placeholder-muted-foreground disabled:opacity-60"
          />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleVoiceInput} disabled={isRecording || isLoading} className={`p-2.5 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}><Mic size={18} /></motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(currentMessage)} disabled={!currentMessage.trim() || isLoading} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"><Send size={18} /></motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}