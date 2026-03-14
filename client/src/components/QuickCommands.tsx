import React from 'react';
import { motion } from 'framer-motion';
import {
  FiGlobe, FiSearch, FiArrowUp, FiArrowDown, FiMousePointer,
  FiArrowLeft, FiPlay, FiPause, FiType, FiBookOpen, FiVolume2,
  FiRefreshCw, FiAlertTriangle, FiMoon, FiMaximize
} from 'react-icons/fi';

const COMMAND_GROUPS = [
  {
    title: 'Navigation',
    color: 'from-blue-500 to-cyan-500',
    commands: [
      { icon: <FiGlobe />, text: '"Open YouTube"', desc: 'Opens a website' },
      { icon: <FiSearch />, text: '"Search cooking videos"', desc: 'Search the web' },
      { icon: <FiArrowLeft />, text: '"Go back"', desc: 'Navigate back' },
      { icon: <FiRefreshCw />, text: '"Refresh page"', desc: 'Reload current page' },
    ],
  },
  {
    title: 'Page Control',
    color: 'from-purple-500 to-pink-500',
    commands: [
      { icon: <FiArrowDown />, text: '"Scroll down"', desc: 'Scroll the page down' },
      { icon: <FiArrowUp />, text: '"Scroll up"', desc: 'Scroll the page up' },
      { icon: <FiMousePointer />, text: '"Click login button"', desc: 'Click an element' },
      { icon: <FiMaximize />, text: '"Open menu"', desc: 'Open navigation menu' },
    ],
  },
  {
    title: 'Media',
    color: 'from-green-500 to-emerald-500',
    commands: [
      { icon: <FiPlay />, text: '"Play the video"', desc: 'Play media' },
      { icon: <FiPause />, text: '"Pause video"', desc: 'Pause media' },
      { icon: <FiVolume2 />, text: '"Increase volume"', desc: 'Change volume' },
    ],
  },
  {
    title: 'Text & Reading',
    color: 'from-orange-500 to-amber-500',
    commands: [
      { icon: <FiType />, text: '"Type Hello everyone"', desc: 'Voice typing' },
      { icon: <FiBookOpen />, text: '"Read this page"', desc: 'Read page aloud' },
      { icon: <FiVolume2 />, text: '"Stop reading"', desc: 'Stop text-to-speech' },
    ],
  },
  {
    title: 'Accessibility',
    color: 'from-indigo-500 to-violet-500',
    commands: [
      { icon: <FiMoon />, text: '"Toggle dark mode"', desc: 'Switch theme' },
      { icon: <FiAlertTriangle />, text: '"Emergency help"', desc: 'Trigger emergency' },
    ],
  },
];

export function QuickCommands() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Quick Commands
        </h3>
        <p className="text-xs text-dark-400 mt-1">Say any of these commands to get started</p>
      </div>

      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {COMMAND_GROUPS.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${group.color}`} />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-400">
                {group.title}
              </h4>
            </div>
            <div className="space-y-1">
              {group.commands.map((cmd, ci) => (
                <motion.div
                  key={ci}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-dark-500 group-hover:text-primary-400 transition-colors text-sm">
                    {cmd.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary-300 font-mono">{cmd.text}</p>
                    <p className="text-xs text-dark-500">{cmd.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
