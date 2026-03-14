# 🎙️ HandiVoice — Voice-Controlled Internet Assistant

A full-stack web application designed to help **people with motor disabilities**, paralysis, tremors, arthritis, or limited hand movement **control websites using voice commands**.

![HandiVoice](https://img.shields.io/badge/Built%20for-Accessibility-blue)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)

---

## ✨ Features

### 🎤 Voice Command System
- **Web Speech API** integration for real-time speech recognition
- Natural language processing for flexible commands
- Multi-step command execution (e.g., "Open YouTube and search cooking videos")

### 🗣️ Text-to-Speech
- Page content reading using `SpeechSynthesis` API
- Configurable speech rate and volume
- Voice feedback after every command

### ⌨️ Voice Typing
- Dictate text directly into input fields
- Example: *"Type Hello I will join the meeting tomorrow"*

### 🧠 Smart Command Processor
- Understands flexible natural language:
  - *"Can you open Gmail"*
  - *"Please scroll down a little"*
  - *"Open YouTube and search cooking videos"*

### ♿ Accessibility Mode
- Large buttons & high contrast colors
- Voice feedback after commands
- Simple navigation UI
- Focus/reader mode for easier reading
- Dark mode support

### 🌍 Multi-Language Support
- 🇺🇸 English (en-US)
- 🇮🇳 Hindi (hi-IN)
- 🇮🇳 Telugu (te-IN)

### 📊 Command Feedback System
After each voice command, displays:
- Detected command text
- Action performed
- Voice response confirmation

### 📜 Command History
- All commands stored with timestamps
- Success/failure status tracking
- Clearable history

### 🔧 Custom Voice Commands
Create custom trigger phrases that execute multiple actions:
- Example: Say *"Open my work tools"* → opens Gmail, Slack, Notion

### 🤖 AI Natural Language Processing
- Optional OpenAI API integration
- Understands complex multi-step instructions
- Falls back to built-in NLP when AI key not configured

### 🌐 Browser Navigation Controls
- Go back / Go forward / Refresh page
- Open new tab / Close tab
- Scroll up/down with intensity control

### 🚨 Emergency Voice Command
Say *"Emergency help"* to:
- Trigger visual alert
- Open emergency support page
- Future: Send alert to emergency contact

### 👤 User Profile System
- Create account, save preferences
- Persist accessibility settings
- Track command usage statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Build** | Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Voice** | Web Speech API |
| **AI** | OpenAI API (optional) |
| **Animation** | Framer Motion |
| **Icons** | React Icons (Feather) |

---

## 📁 Project Structure

```
handi/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── MicButton.tsx        # Animated microphone button
│   │   │   ├── CommandFeedback.tsx   # Real-time feedback display
│   │   │   ├── CommandHistory.tsx    # Command history panel
│   │   │   ├── AccessibilityPanel.tsx # Settings toggles
│   │   │   ├── QuickCommands.tsx     # Command reference guide
│   │   │   ├── CustomCommands.tsx    # Custom command manager
│   │   │   └── Navbar.tsx           # Navigation bar
│   │   ├── context/
│   │   │   └── AppContext.tsx       # Global state management
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.ts  # Voice recognition hook
│   │   │   └── useCommandExecutor.ts    # Command execution hook
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Main assistant dashboard
│   │   │   ├── AuthPage.tsx         # Login/Register page
│   │   │   ├── SettingsPage.tsx     # Settings page
│   │   │   └── ProfilePage.tsx      # User profile page
│   │   ├── services/
│   │   │   ├── commandParser.ts     # NLP command parser
│   │   │   ├── speechService.ts     # Text-to-speech service
│   │   │   └── api.ts              # Backend API client
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js             # User model
│   │   │   ├── Command.js          # Command history model
│   │   │   └── CustomCommand.js    # Custom command model
│   │   ├── routes/
│   │   │   ├── auth.js             # Authentication routes
│   │   │   ├── commands.js         # Command history routes
│   │   │   ├── customCommands.js   # Custom commands CRUD
│   │   │   ├── settings.js         # User settings routes
│   │   │   └── ai.js              # AI processing route
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT middleware
│   │   └── index.js               # Express server entry
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally (or MongoDB Atlas URI)
- **Chrome** or **Edge** browser (for Web Speech API)

### Installation

1. **Clone and navigate:**
   ```bash
   cd handi
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure environment:**
   Edit `server/.env` with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/handivoice
   JWT_SECRET=your-secure-secret-key
   # Optional: Add OpenAI key for AI processing
   # OPENAI_API_KEY=sk-your-key-here
   ```

### Running Development Servers

**Start the backend:**
```bash
cd server
npm run dev
```

**Start the frontend (new terminal):**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in Chrome or Edge.

### Building for Production

```bash
cd client
npm run build
```

---

## 🎯 Voice Command Examples

| Command | Action |
|---------|--------|
| *"Open YouTube"* | Opens youtube.com |
| *"Search cooking videos"* | Google search |
| *"Scroll down"* | Scrolls page down |
| *"Scroll up a little"* | Small scroll up |
| *"Click the login button"* | Clicks matching button |
| *"Go back"* | Browser back |
| *"Refresh page"* | Reloads page |
| *"Read this page"* | Reads page aloud |
| *"Stop reading"* | Stops TTS |
| *"Type Hello everyone"* | Types into focused input |
| *"Play the video"* | Plays video element |
| *"Pause video"* | Pauses video |
| *"Increase volume"* | Raises media volume |
| *"Toggle dark mode"* | Switches theme |
| *"Emergency help"* | Triggers emergency alert |

### Hindi Commands (हिन्दी)
| Command | Action |
|---------|--------|
| *"YouTube खोलो"* | Opens YouTube |
| *"नीचे स्क्रॉल"* | Scrolls down |
| *"पढ़ो"* | Reads page |

---

## 🔮 Future Roadmap

- [ ] Browser extension for controlling any website
- [ ] Smart home integration (lights, fans)
- [ ] AI screen understanding (read page elements)
- [ ] Gesture + Voice combination control
- [ ] Voice-controlled operating system features
- [ ] Mobile app version

---

## 📄 License

MIT — Built for accessibility, built with ❤️

---

**Perfect for:** Final year projects • Accessibility startups • AI + Web portfolios
