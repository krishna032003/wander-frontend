import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, RefreshCw, Trash2, Plus } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const Dropzone = ({ onDrop, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <motion.div 
      variants={itemVariants}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); onDrop(e.dataTransfer.files); }}
      className={`relative group overflow-hidden py-20 text-center border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging ? 'border-teal-500 bg-teal-500/10' : 'border-teal-500/30 hover:border-teal-500 bg-teal-500/5 backdrop-blur-sm'}`}
    >
      <div className="relative">
        <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
          <Upload size={64} className="mx-auto mb-4 text-teal-500/70" />
        </motion.div>
        <h3 className="text-lg font-semibold text-white/90">Drag & Drop PDF files here</h3>
        <p className="mt-1 text-sm text-white/70">or click the "Upload PDF" button</p>
      </div>
    </motion.div>
  );
};

export default function Documents({
  documents,
  isLoading,
  fileInputRef,
  uploadDocument,
  refreshKnowledgeBase,
  deleteDocument,
}) {
  const handleDrop = (files) => {
    if (files && files.length > 0) {
      uploadDocument(files[0]);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-screen-xl p-6 mx-auto md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-start justify-between gap-4 mt-16 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Your Documents</h1>
          <p className="mt-2 font-medium text-muted-foreground">Upload PDFs to give the AI context for your trip.</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg text-white bg-teal-500 hover:bg-teal-600 disabled:opacity-50"><Upload size={16} /> Upload PDF</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refreshKnowledgeBase} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg text-white/90 bg-white/10 hover:bg-white/20 disabled:opacity-50"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</motion.button>
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && uploadDocument(e.target.files[0])} className="hidden" />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="mt-10 pb-20"
      >
        {documents.length === 0 ? (
          <Dropzone onDrop={handleDrop} isLoading={isLoading} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative flex flex-col items-center justify-center p-4 text-center transition-shadow duration-300 border-2 border-dashed rounded-2xl border-teal-500/30 hover:border-teal-500"
            >
              <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="flex flex-col items-center justify-center w-full h-full text-sm font-semibold transition-colors rounded-lg text-teal-500/70 hover:text-teal-500 disabled:opacity-50">
                <Plus size={32} className="mb-3" />
                Add Document
              </button>
            </motion.div>
            {documents.map((doc, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }} 
                className="flex flex-col justify-between p-5 transition-shadow duration-300 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-soft-lift"
              >
                <div className="flex items-start flex-1 gap-4">
                  <FileText className="flex-shrink-0 mt-1 text-teal-400" size={20} />
                  <p className="text-sm font-medium break-all text-white/90">{doc.name}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/70">{(doc.size / 1024).toFixed(1)} KB</p>
                  <motion.button whileHover={{ scale: 1.1, color: 'hsl(var(--destructive))' }} whileTap={{ scale: 0.9 }} onClick={() => deleteDocument(doc.name)} disabled={isLoading} className="p-1.5 text-white/70 transition-colors rounded-md disabled:opacity-50"><Trash2 size={16} /></motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}