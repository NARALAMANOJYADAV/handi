import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { accessibilitySettings } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        accessibilitySettings.darkMode
          ? 'bg-dark-950 text-white'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-dark-500 text-sm">
              HandiVoice © {new Date().getFullYear()} — Built for Accessibility
            </p>
            <p className="text-dark-600 text-xs mt-1">
              Empowering people with motor disabilities to browse the internet independently
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
