import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiGlobe, FiShield, FiAlertTriangle,
  FiPhone, FiSave
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export function SettingsPage() {
  const { accessibilitySettings, updateAccessibility, activeLanguage, setLanguage } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-dark-400 mb-8">Customize your HandiVoice experience</p>
        </motion.div>

        <div className="space-y-6">
          {/* Voice Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiGlobe className="text-primary-400" />
              Voice Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-300 mb-2 block">Speech Rate</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={accessibilitySettings.speechRate}
                    onChange={(e) => updateAccessibility({ speechRate: parseFloat(e.target.value) })}
                    className="flex-1 accent-primary-500"
                  />
                  <span className="text-white font-mono text-sm w-12 text-right">
                    {accessibilitySettings.speechRate.toFixed(1)}x
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-dark-300 mb-2 block">Speech Volume</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={accessibilitySettings.speechVolume}
                    onChange={(e) => updateAccessibility({ speechVolume: parseFloat(e.target.value) })}
                    className="flex-1 accent-primary-500"
                  />
                  <span className="text-white font-mono text-sm w-12 text-right">
                    {Math.round(accessibilitySettings.speechVolume * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-dark-300 mb-2 block">Language</label>
                <select
                  value={activeLanguage}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="en-US">🇺🇸 English</option>
                  <option value="hi-IN">🇮🇳 Hindi (हिन्दी)</option>
                  <option value="te-IN">🇮🇳 Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiShield className="text-accent-400" />
              Display & Accessibility
            </h2>

            <div className="space-y-3">
              {[
                { label: 'Auto-read page content', key: 'autoRead' as const, value: accessibilitySettings.autoRead },
                { label: 'Voice feedback after commands', key: 'voiceFeedback' as const, value: accessibilitySettings.voiceFeedback },
                { label: 'Focus mode (simplified UI)', key: 'focusMode' as const, value: accessibilitySettings.focusMode },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-dark-300">{item.label}</span>
                  <button
                    onClick={() => updateAccessibility({ [item.key]: !item.value })}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      item.value ? 'bg-primary-500' : 'bg-dark-700'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                      animate={{ left: item.value ? 20 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-warning-400" />
              Emergency Contact
            </h2>
            <p className="text-sm text-dark-400 mb-4">
              Set up an emergency contact for the "Emergency help" voice command.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-dark-400 mb-1 block">Contact Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    placeholder="Emergency contact name"
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-dark-400 mb-1 block">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-dark-400 mb-1 block">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="email"
                    placeholder="emergency@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-warning-400 to-danger-400 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <FiSave />
                Save Emergency Contact
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
