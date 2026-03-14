import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { AppState, AccessibilitySettings, SupportedLanguage, CommandFeedback, User, CustomCommand } from '../types';

const defaultAccessibility: AccessibilitySettings = {
  darkMode: true,
  highContrast: false,
  largeText: false,
  voiceFeedback: true,
  focusMode: false,
  autoRead: false,
  speechRate: 1,
  speechVolume: 1,
};

const defaultState: AppState = {
  isListening: false,
  currentTranscript: '',
  interimTranscript: '',
  commandHistory: [],
  isProcessing: false,
  isSpeaking: false,
  activeLanguage: 'en-US',
  accessibilitySettings: defaultAccessibility,
  user: null,
  isAuthenticated: false,
};

interface AppContextType extends AppState {
  setListening: (v: boolean) => void;
  setTranscript: (v: string) => void;
  setInterimTranscript: (v: string) => void;
  addCommandFeedback: (f: CommandFeedback) => void;
  clearHistory: () => void;
  setProcessing: (v: boolean) => void;
  setSpeaking: (v: boolean) => void;
  setLanguage: (l: SupportedLanguage) => void;
  updateAccessibility: (s: Partial<AccessibilitySettings>) => void;
  toggleAccessibility: (key: keyof AccessibilitySettings) => void;
  setUser: (u: User | null) => void;
  setAuthenticated: (v: boolean) => void;
  customCommands: CustomCommand[];
  setCustomCommands: (c: CustomCommand[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    // Load saved settings
    const saved = localStorage.getItem('handivoice_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultState, accessibilitySettings: { ...defaultAccessibility, ...parsed.accessibility }, activeLanguage: parsed.language || 'en-US' };
      } catch { /* ignore */ }
    }
    return defaultState;
  });

  const [customCommands, setCustomCommands] = useState<CustomCommand[]>([]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      'handivoice_settings',
      JSON.stringify({
        accessibility: state.accessibilitySettings,
        language: state.activeLanguage,
      })
    );
  }, [state.accessibilitySettings, state.activeLanguage]);

  // Apply accessibility classes to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', state.accessibilitySettings.darkMode);
    root.classList.toggle('high-contrast', state.accessibilitySettings.highContrast);
    root.classList.toggle('large-text', state.accessibilitySettings.largeText);
  }, [state.accessibilitySettings]);

  const setListening = useCallback((v: boolean) => setState((s) => ({ ...s, isListening: v })), []);
  const setTranscript = useCallback((v: string) => setState((s) => ({ ...s, currentTranscript: v })), []);
  const setInterimTranscript = useCallback((v: string) => setState((s) => ({ ...s, interimTranscript: v })), []);
  const setProcessing = useCallback((v: boolean) => setState((s) => ({ ...s, isProcessing: v })), []);
  const setSpeaking = useCallback((v: boolean) => setState((s) => ({ ...s, isSpeaking: v })), []);
  const setLanguage = useCallback((l: SupportedLanguage) => setState((s) => ({ ...s, activeLanguage: l })), []);
  const setUser = useCallback((u: User | null) => setState((s) => ({ ...s, user: u })), []);
  const setAuthenticated = useCallback((v: boolean) => setState((s) => ({ ...s, isAuthenticated: v })), []);

  const addCommandFeedback = useCallback((f: CommandFeedback) => {
    setState((s) => ({
      ...s,
      commandHistory: [f, ...s.commandHistory].slice(0, 100),
    }));
  }, []);

  const clearHistory = useCallback(() => setState((s) => ({ ...s, commandHistory: [] })), []);

  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    setState((s) => ({
      ...s,
      accessibilitySettings: { ...s.accessibilitySettings, ...updates },
    }));
  }, []);

  const toggleAccessibility = useCallback((key: keyof AccessibilitySettings) => {
    setState((s) => ({
      ...s,
      accessibilitySettings: {
        ...s.accessibilitySettings,
        [key]: !s.accessibilitySettings[key],
      },
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setListening,
        setTranscript,
        setInterimTranscript,
        addCommandFeedback,
        clearHistory,
        setProcessing,
        setSpeaking,
        setLanguage,
        updateAccessibility,
        toggleAccessibility,
        setUser,
        setAuthenticated,
        customCommands,
        setCustomCommands,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
