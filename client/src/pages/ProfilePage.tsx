import { motion } from 'framer-motion';
import { FiUser, FiMail, FiGlobe, FiShield, FiCommand, FiCalendar } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export function ProfilePage() {
  const { user, isAuthenticated, commandHistory, customCommands, activeLanguage } = useApp();

  const langNames: Record<string, string> = {
    'en-US': 'English',
    'hi-IN': 'Hindi (हिन्दी)',
    'te-IN': 'Telugu (తెలుగు)',
  };

  const stats = [
    { label: 'Commands Used', value: commandHistory.length, icon: <FiCommand />, color: 'from-primary-500 to-cyan-500' },
    { label: 'Custom Commands', value: customCommands.length, icon: <FiShield />, color: 'from-accent-500 to-pink-500' },
    { label: 'Language', value: langNames[activeLanguage] || 'English', icon: <FiGlobe />, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile card */}
          <div className="glass rounded-2xl p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-4xl text-white">
                {isAuthenticated && user ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {isAuthenticated && user ? user.name : 'Guest User'}
                </h1>
                {isAuthenticated && user ? (
                  <>
                    <p className="text-dark-400 flex items-center gap-2 justify-center sm:justify-start mt-1">
                      <FiMail className="text-sm" /> {user.email}
                    </p>
                    <p className="text-dark-500 flex items-center gap-2 justify-center sm:justify-start mt-0.5 text-sm">
                      <FiCalendar className="text-xs" />
                      Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-dark-400 mt-1">Sign in to save your preferences</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-dark-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent commands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recent Commands</h2>
            {commandHistory.length === 0 ? (
              <p className="text-dark-500 text-center py-8">No commands yet. Start speaking!</p>
            ) : (
              <div className="space-y-2">
                {commandHistory.slice(0, 10).map((cmd) => (
                  <div
                    key={cmd.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                  >
                    <div>
                      <p className="text-sm text-white">{cmd.detectedCommand}</p>
                      <p className="text-xs text-dark-400">{cmd.actionPerformed}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      cmd.status === 'success'
                        ? 'bg-success-500/20 text-success-400'
                        : cmd.status === 'error'
                        ? 'bg-danger-500/20 text-danger-400'
                        : 'bg-primary-500/20 text-primary-400'
                    }`}>
                      {cmd.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
