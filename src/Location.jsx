import React from 'react';
import Topbar from './Topbar';
import { MapPin } from 'lucide-react';

export default function Location() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Location" />
      <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
        <div className="relative flex items-center justify-center w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse"></div>
          <MapPin className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
        </div>
        <p className="mt-8 text-lg font-semibold">Location View</p><p className="text-sm text-gray-600">This section is under construction.</p></div>
    </div>
  );
}