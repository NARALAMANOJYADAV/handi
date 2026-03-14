import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMenu, FiX, FiSettings, FiUser, FiLogIn, FiLogOut, FiHome } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { isListening, isAuthenticated, user, setAuthenticated, setUser } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('handivoice_token');
    setAuthenticated(false);
    setUser(null);
    onNavigate('dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                <FiMic className="text-white text-lg" />
              </div>
              {isListening && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">HandiVoice</h1>
              <p className="text-[10px] text-dark-500 -mt-0.5">Voice Assistant</p>
            </div>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-success-500'
                }`}
              />
              <span className="text-xs text-dark-400">
                {isListening ? 'Listening' : 'Ready'}
              </span>
            </div>

            {/* Auth button */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium cursor-pointer"
              >
                <FiLogIn />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {mobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
