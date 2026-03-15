// Voice Recognition & Command Types

export interface VoiceCommand {
  _id?: string;
  text: string;
  action: string;
  params?: Record<string, string>;
  timestamp: Date;
  language: string;
  confidence: number;
  status: 'success' | 'failed' | 'pending';
  response?: string;
}

export interface CustomCommand {
  _id?: string;
  userId: string;
  trigger: string;
  actions: CommandAction[];
  description: string;
  createdAt: Date;
}

export interface CommandAction {
  type: 'open_url' | 'search' | 'scroll' | 'click' | 'navigate' | 'read' | 'type' | 'custom';
  target?: string;
  value?: string;
  delay?: number;
}

export interface ParsedCommand {
  intent: CommandIntent;
  action: string;
  target?: string;
  value?: string;
  rawText: string;
  confidence: number;
}

export type CommandIntent =
  | 'open_website'
  | 'search'
  | 'scroll'
  | 'click'
  | 'navigate_back'
  | 'navigate_forward'
  | 'refresh'
  | 'new_tab'
  | 'read_page'
  | 'stop_reading'
  | 'type_text'
  | 'play_video'
  | 'pause_video'
  | 'volume_up'
  | 'volume_down'
  | 'emergency'
  | 'open_menu'
  | 'dark_mode'
  | 'high_contrast'
  | 'large_text'
  | 'reader_mode'
  | 'custom_command'
  | 'get_time'
  | 'get_date'
  | 'open_app'
  | 'unknown';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  preferredLanguage: SupportedLanguage;
  accessibilitySettings: AccessibilitySettings;
  customCommands: CustomCommand[];
  emergencyContact?: EmergencyContact;
  createdAt?: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  voiceFeedback: boolean;
  focusMode: boolean;
  autoRead: boolean;
  speechRate: number;
  speechVolume: number;
}

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'te-IN';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CommandFeedback {
  id: string;
  detectedCommand: string;
  actionPerformed: string;
  voiceResponse: string;
  status: 'success' | 'error' | 'info';
  timestamp: Date;
}

export interface AppState {
  isListening: boolean;
  currentTranscript: string;
  interimTranscript: string;
  commandHistory: CommandFeedback[];
  isProcessing: boolean;
  isSpeaking: boolean;
  activeLanguage: SupportedLanguage;
  accessibilitySettings: AccessibilitySettings;
  user: User | null;
  isAuthenticated: boolean;
}
