import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useCommandExecutor } from '../hooks/useCommandExecutor';
import { MicButton } from '../components/MicButton';
import { CommandFeedbackDisplay } from '../components/CommandFeedback';
import { CommandHistory } from '../components/CommandHistory';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { QuickCommands } from '../components/QuickCommands';
import { CustomCommands } from '../components/CustomCommands';
import type { CommandFeedback as CommandFeedbackType, CustomCommand } from '../types';

export function Dashboard() {
  const {
    activeLanguage,
    accessibilitySettings,
    commandHistory,
    addCommandFeedback,
    clearHistory,
    isProcessing,
    setProcessing,
    toggleAccessibility,
    customCommands,
    setCustomCommands,
  } = useApp();

  const [latestFeedback, setLatestFeedback] = useState<CommandFeedbackType | null>(null);

  const onAccessibilityToggle = useCallback(
    (setting: 'darkMode' | 'highContrast' | 'largeText' | 'focusMode') => {
      toggleAccessibility(setting);
    },
    [toggleAccessibility]
  );

  const { executeCommand } = useCommandExecutor(
    activeLanguage,
    accessibilitySettings.voiceFeedback,
    accessibilitySettings.speechRate,
    onAccessibilityToggle
  );

  const handleVoiceResult = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return;

      setProcessing(true);
      try {
        const feedback = await executeCommand(transcript, customCommands);
        setLatestFeedback(feedback);
        addCommandFeedback(feedback);
      } catch (error) {
        const errorFeedback: CommandFeedbackType = {
          id: Date.now().toString(),
          detectedCommand: transcript,
          actionPerformed: 'Error processing command',
          voiceResponse: 'Sorry, something went wrong.',
          status: 'error',
          timestamp: new Date(),
        };
        setLatestFeedback(errorFeedback);
        addCommandFeedback(errorFeedback);
      } finally {
        setProcessing(false);
      }
    },
    [executeCommand, addCommandFeedback, setProcessing, customCommands]
  );

  const {
    transcript,
    interimTranscript,
    isListening,
    error: speechError,
    toggleListening,
  } = useSpeechRecognition(activeLanguage, true, handleVoiceResult);

  const handleAddCustomCommand = (cmd: Omit<CustomCommand, '_id' | 'userId' | 'createdAt'>) => {
    const newCmd: CustomCommand = {
      ...cmd,
      _id: Date.now().toString(),
      userId: 'local',
      createdAt: new Date(),
    };
    setCustomCommands([...customCommands, newCmd]);
  };

  const handleDeleteCustomCommand = (id: string) => {
    setCustomCommands(customCommands.filter((c) => c._id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="gradient-text">Voice-Controlled</span>
            <br />
            <span className="text-white">Internet Assistant</span>
          </motion.h1>
          <motion.p
            className="text-dark-400 text-lg max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Navigate the web hands-free. Control websites, search, scroll, and interact
            using just your voice.
          </motion.p>

          {/* Speech error */}
          {speechError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-lg bg-danger-500/10 border border-danger-500/30 text-danger-400 text-sm max-w-md mx-auto"
            >
              {speechError}
            </motion.div>
          )}

          {/* Mic Button */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <MicButton
              isListening={isListening}
              isProcessing={isProcessing}
              onClick={toggleListening}
            />
            <p className="text-sm text-dark-500 mt-4">
              {isListening ? (
                <span className="text-red-400">🎙️ Listening... Say a command</span>
              ) : (
                'Tap the microphone to start'
              )}
            </p>
          </div>

          {/* Feedback display */}
          <CommandFeedbackDisplay
            feedback={latestFeedback}
            transcript={transcript}
            interimTranscript={interimTranscript}
            isListening={isListening}
          />
        </motion.div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AccessibilityPanel />
            <CustomCommands
              commands={customCommands}
              onAdd={handleAddCustomCommand}
              onDelete={handleDeleteCustomCommand}
            />
          </motion.div>

          {/* Center Column */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuickCommands />
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CommandHistory
              history={commandHistory}
              onClear={clearHistory}
            />
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { emoji: '🌐', title: 'Browse Websites', desc: 'Open any website instantly' },
            { emoji: '🔍', title: 'Voice Search', desc: 'Search the web by speaking' },
            { emoji: '📖', title: 'Page Reader', desc: 'Read pages aloud for you' },
            { emoji: '🌍', title: 'Multi-Language', desc: 'English, Hindi, Telugu' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 text-center hover:border-primary-500/30 transition-colors"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <span className="text-3xl mb-3 block">{feature.emoji}</span>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-xs text-dark-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
