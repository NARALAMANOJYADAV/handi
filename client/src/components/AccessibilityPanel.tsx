import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSun, FiMoon, FiEye, FiType, FiVolume2, FiZap,
  FiSliders, FiGlobe, FiChevronDown
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import type { SupportedLanguage, LanguageOption } from '../types';

const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export function AccessibilityPanel() {
  const {
    accessibilitySettings,
    activeLanguage,
    toggleAccessibility,
    updateAccessibility,
    setLanguage,
  } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [langDropdown, setLangDropdown] = useState(false);

  const toggles = [
    {
      key: 'darkMode' as const,
      label: 'Dark Mode',
      icon: accessibilitySettings.darkMode ? <FiMoon /> : <FiSun />,
      active: accessibilitySettings.darkMode,
    },
    {
      key: 'highContrast' as const,
      label: 'High Contrast',
      icon: <FiEye />,
      active: accessibilitySettings.highContrast,
    },
    {
      key: 'largeText' as const,
      label: 'Large Text',
      icon: <FiType />,
      active: accessibilitySettings.largeText,
    },
    {
      key: 'voiceFeedback' as const,
      label: 'Voice Feedback',
      icon: <FiVolume2 />,
      active: accessibilitySettings.voiceFeedback,
    },
    {
      key: 'focusMode' as const,
      label: 'Focus Mode',
      icon: <FiZap />,
      active: accessibilitySettings.focusMode,
    },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === activeLanguage) || LANGUAGES[0];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FiSliders className="text-accent-400" />
          <h3 className="font-semibold text-white">Accessibility</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown className="text-dark-400" />
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="p-4 space-y-3"
        >
          {/* Toggle switches */}
          {toggles.map((toggle) => (
            <button
              key={toggle.key}
              onClick={() => toggleAccessibility(toggle.key)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className={toggle.active ? 'text-primary-400' : 'text-dark-500'}>
                  {toggle.icon}
                </span>
                <span className={`text-sm ${toggle.active ? 'text-white' : 'text-dark-400'}`}>
                  {toggle.label}
                </span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  toggle.active ? 'bg-primary-500' : 'bg-dark-700'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                  animate={{ left: toggle.active ? 20 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>
          ))}

          {/* Speech rate slider */}
          <div className="p-3">
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-300">Speech Rate</span>
              <span className="text-xs text-primary-400 font-mono">
                {accessibilitySettings.speechRate.toFixed(1)}x
              </span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={accessibilitySettings.speechRate}
              onChange={(e) => updateAccessibility({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Language selector */}
          <div className="p-3 relative">
            <label className="text-sm text-dark-300 mb-2 block">Voice Language</label>
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-800 border border-white/10 hover:border-primary-500/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{currentLang.flag}</span>
                <span className="text-white text-sm">{currentLang.name}</span>
                <span className="text-dark-500 text-xs">({currentLang.nativeName})</span>
              </div>
              <FiGlobe className="text-dark-400" />
            </button>

            {langDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-3 right-3 mb-1 bg-dark-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 p-3 hover:bg-white/5 transition-colors cursor-pointer ${
                      activeLanguage === lang.code ? 'bg-primary-500/10' : ''
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-white text-sm">{lang.name}</span>
                    <span className="text-dark-500 text-xs">({lang.nativeName})</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
