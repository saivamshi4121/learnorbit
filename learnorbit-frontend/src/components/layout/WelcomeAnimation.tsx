"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show on every full page mount (Refresh/Initial Load)
    // React state handles not showing it again during soft navigation
    setShow(true);
    
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#020a1a] overflow-hidden"
        >
          <iframe
            src="/learnorbit_cinematic_welcome.html"
            className="w-full h-full border-none pointer-events-auto"
            title="LearnOrbit Welcome"
            scrolling="no"
          />
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            onClick={handleDismiss}
            className="absolute bottom-12 right-12 z-[110] px-6 py-2 bg-primary/20 hover:bg-primary/40 border border-primary/50 rounded-full text-primary-foreground text-sm font-medium tracking-[0.2em] uppercase transition-all backdrop-blur-md"
          >
            Enter Orbit
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
