import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiClock } from 'react-icons/fi';
import type { CommandFeedback } from '../types';

interface CommandFeedbackDisplayProps {
  feedback: CommandFeedback | null;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function CommandFeedbackDisplay({
  feedback,
  transcript,
  interimTranscript,
  isListening,
}: CommandFeedbackDisplayProps) {
  const statusConfig = {
    success: {
      icon: <FiCheck className="text-success-400" />,
      bg: 'bg-success-500/10 border-success-500/30',
      label: 'Success',
    },
    error: {
      icon: <FiX className="text-danger-400" />,
      bg: 'bg-danger-500/10 border-danger-500/30',
      label: 'Error',
    },
    info: {
      icon: <FiInfo className="text-primary-400" />,
      bg: 'bg-primary-500/10 border-primary-500/30',
      label: 'Info',
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Live transcript */}
      <AnimatePresence mode="wait">
        {(isListening || transcript || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {isListening && (
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <span className="text-xs text-dark-400 uppercase tracking-wider font-medium">
                {isListening ? 'Listening...' : 'Detected Speech'}
              </span>
            </div>
            <p className="text-xl font-medium text-white">
              {transcript || (
                <span className="text-dark-400 italic">{interimTranscript || 'Say a command...'}</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command feedback */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`rounded-2xl border p-5 ${statusConfig[feedback.status].bg}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 text-2xl">{statusConfig[feedback.status].icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-dark-400">
                    {statusConfig[feedback.status].label}
                  </span>
                  <FiClock className="text-dark-500 text-xs" />
                  <span className="text-xs text-dark-500">
                    {new Date(feedback.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-dark-300 mb-1">
                  <span className="text-dark-500">Detected: </span>
                  {feedback.detectedCommand}
                </p>
                <p className="text-white font-medium">{feedback.actionPerformed}</p>
                {feedback.voiceResponse && (
                  <p className="text-sm text-primary-300 mt-1 italic">
                    🔊 "{feedback.voiceResponse}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
