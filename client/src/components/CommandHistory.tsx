import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import type { CommandFeedback } from '../types';

interface CommandHistoryProps {
  history: CommandFeedback[];
  onClear: () => void;
}

export function CommandHistory({ history, onClear }: CommandHistoryProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FiClock className="text-primary-400" />
          <h3 className="font-semibold text-white">Command History</h3>
          <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="text-dark-400 hover:text-danger-400 transition-colors p-2 rounded-lg hover:bg-dark-800 cursor-pointer"
            aria-label="Clear history"
          >
            <FiTrash2 className="text-sm" />
          </motion.button>
        )}
      </div>

      {/* History list */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <div className="p-8 text-center text-dark-500">
              <FiClock className="mx-auto text-3xl mb-2 opacity-30" />
              <p className="text-sm">No commands yet. Start speaking to see your history.</p>
            </div>
          ) : (
            history.map((cmd, i) => (
              <motion.div
                key={cmd.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="mt-1">
                  {cmd.status === 'success' ? (
                    <FiCheck className="text-success-400 text-sm" />
                  ) : cmd.status === 'error' ? (
                    <FiX className="text-danger-400 text-sm" />
                  ) : (
                    <FiClock className="text-primary-400 text-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{cmd.detectedCommand}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{cmd.actionPerformed}</p>
                </div>
                <span className="text-xs text-dark-500 whitespace-nowrap">
                  {new Date(cmd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
