import axios from 'axios';
import type { VoiceCommand, User, CustomCommand, AccessibilitySettings } from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('handivoice_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),

  getProfile: () => api.get<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) => api.put<User>('/auth/profile', data),
};

// Commands
export const commandApi = {
  saveCommand: (command: Omit<VoiceCommand, '_id'>) =>
    api.post<VoiceCommand>('/commands', command),

  getHistory: (limit: number = 50) =>
    api.get<VoiceCommand[]>(`/commands/history?limit=${limit}`),

  clearHistory: () => api.delete('/commands/history'),
};

// Custom Commands
export const customCommandApi = {
  getAll: () => api.get<CustomCommand[]>('/custom-commands'),

  create: (command: Omit<CustomCommand, '_id' | 'userId' | 'createdAt'>) =>
    api.post<CustomCommand>('/custom-commands', command),

  update: (id: string, command: Partial<CustomCommand>) =>
    api.put<CustomCommand>(`/custom-commands/${id}`, command),

  delete: (id: string) => api.delete(`/custom-commands/${id}`),
};

// Settings
export const settingsApi = {
  getSettings: () => api.get<AccessibilitySettings>('/settings'),
  updateSettings: (settings: Partial<AccessibilitySettings>) =>
    api.put<AccessibilitySettings>('/settings', settings),
};

// AI Processing
export const aiApi = {
  processCommand: (text: string, language: string = 'en-US') =>
    api.post<{ intent: string; actions: Array<{ type: string; target?: string; value?: string }> }>(
      '/ai/process',
      { text, language }
    ),
};

export default api;
