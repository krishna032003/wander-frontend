import React from 'react';
import { Search, MapPin, MessageSquare, FileText, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function Home({
  currentLocation,
  searchQuery,
  setSearchQuery,
  setLocation,
  handleNavigation,
}) {
  const trendingDestinations = [
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000' },
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000' },
    { name: 'Santorini', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000' },
  ];

  return (
    <motion.div 
      className="w-full max-w-screen-xl p-6 mx-auto md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex flex-col justify-center">
          <motion.h1 
            variants={itemVariants}
            className="relative text-5xl font-bold tracking-tight md:text-7xl text-transparent bg-clip-text bg-gradient-to-r dark:from-teal-400 dark:to-blue-400 from-teal-600 to-blue-600"
            style={{ textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          >
            Your Next Adventure
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mt-6 text-lg text-muted-foreground"
          >
            An intelligent travel companion for seamless exploration.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="relative w-full max-w-lg mt-8"
          >
            <Search className="absolute text-muted-foreground -translate-y-1/2 left-5 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Set your next destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && searchQuery.trim()) { setLocation(searchQuery); setSearchQuery(''); } }}
              className="w-full py-4 pr-6 text-base tracking-wide transition-all duration-300 bg-accent/50 border rounded-full outline-none text-foreground placeholder-muted-foreground pl-14 border-border focus:ring-4 focus:ring-teal-500/20 shadow-inner-soft"
            />
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-lg group">
          <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070" className="object-cover w-full h-full transition-transform duration-700 hover:scale-110" alt="Featured Destination" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-2xl font-bold text-white">Kyoto, Japan</h3>
            <p className="text-white/80">Cherry Blossom Season is here.</p>
          </div>
        </motion.div>
      </div>

      {/* Trending Now Section */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-2xl font-bold text-white/90 mb-4">Trending Now</h2>
        <div className="flex gap-6 pb-4 -mx-6 px-6 overflow-x-auto">
          {trendingDestinations.map(dest => (
            <div key={dest.name} className="flex-shrink-0 w-64 h-64 relative rounded-2xl overflow-hidden shadow-lg group">
              <img src={dest.image} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt={dest.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-4 left-4 text-lg font-bold text-white">{dest.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Utility Row */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white/90 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg group border border-white/10 hover:border-teal-500/50 transition-all duration-300">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073" className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Chat background" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <button onClick={() => handleNavigation('chat')} className="relative p-8 w-full h-full text-left">
              <MessageSquare className="text-teal-400" size={28} />
              <h3 className="mt-4 text-lg font-semibold text-white/90">Start a Chat</h3>
              <p className="mt-1 text-sm text-white/70">Ask our AI for travel advice.</p>
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg group border border-white/10 hover:border-teal-500/50 transition-all duration-300">
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071" className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Documents background" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <button onClick={() => handleNavigation('documents')} className="relative p-8 w-full h-full text-left">
              <FileText className="text-teal-400" size={28} />
              <h3 className="mt-4 text-lg font-semibold text-white/90">Manage Documents</h3>
              <p className="mt-1 text-sm text-white/70">Organize your travel papers.</p>
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg group bg-gradient-to-br from-orange-400 to-pink-500 p-8 flex flex-col justify-between">
            <Sun className="text-white/80" size={28} />
            <div>
              <h3 className="text-lg font-semibold text-white/90">Travel Weather</h3>
              <p className="text-3xl font-bold text-white">24°C Sunny</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}