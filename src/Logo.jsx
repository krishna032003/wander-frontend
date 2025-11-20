import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Compass className="text-teal-500" size={24} />
      <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
        WanderGuide
      </h1>
    </div>
  );
}