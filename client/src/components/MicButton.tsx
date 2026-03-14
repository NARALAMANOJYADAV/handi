import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff } from 'react-icons/fi';

interface MicButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MicButton({ isListening, isProcessing, onClick, size = 'lg' }: MicButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const ringSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            <motion.div
              className={`absolute ${ringSizes[size]} rounded-full bg-primary-500/30`}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className={`absolute ${ringSizes[size]} rounded-full bg-primary-400/20`}
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.div
              className={`absolute ${ringSizes[size]} rounded-full bg-accent-500/20`}
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        id="mic-button"
        onClick={onClick}
        className={`
          relative z-10 ${sizeClasses[size]} rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer shadow-2xl
          ${isListening
            ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40 hover:shadow-red-500/60'
            : 'bg-gradient-to-br from-primary-500 to-accent-600 shadow-primary-500/40 hover:shadow-primary-500/60'
          }
          ${isProcessing ? 'animate-pulse' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <FiMicOff className="text-white" />
        ) : (
          <FiMic className="text-white" />
        )}
      </motion.button>

      {/* Waveform bars when listening */}
      <AnimatePresence>
        {isListening && (
          <div className="absolute -bottom-8 flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-primary-500 to-accent-400 rounded-full"
                initial={{ height: 4 }}
                animate={{ height: [4, 16 + Math.random() * 20, 4] }}
                transition={{
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
