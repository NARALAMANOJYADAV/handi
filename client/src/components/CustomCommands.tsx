import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit3, FiCommand, FiX, FiGlobe } from 'react-icons/fi';
import type { CustomCommand, CommandAction } from '../types';

interface CustomCommandsProps {
  commands: CustomCommand[];
  onAdd: (cmd: Omit<CustomCommand, '_id' | 'userId' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export function CustomCommands({ commands, onAdd, onDelete }: CustomCommandsProps) {
  const [showForm, setShowForm] = useState(false);
  const [trigger, setTrigger] = useState('');
  const [description, setDescription] = useState('');
  const [actions, setActions] = useState<CommandAction[]>([
    { type: 'open_url', target: '' },
  ]);

  const handleAddAction = () => {
    setActions([...actions, { type: 'open_url', target: '' }]);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, updates: Partial<CommandAction>) => {
    setActions(actions.map((a, i) => (i === index ? { ...a, ...updates } : a)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger || !description || actions.length === 0) return;

    onAdd({ trigger, description, actions });
    setTrigger('');
    setDescription('');
    setActions([{ type: 'open_url', target: '' }]);
    setShowForm(false);
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FiCommand className="text-accent-400" />
          <h3 className="font-semibold text-white">Custom Commands</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-sm hover:bg-primary-500/30 transition-colors cursor-pointer"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? 'Cancel' : 'Add New'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-4 border-b border-white/5 space-y-3"
          >
            <div>
              <label className="text-xs text-dark-400 mb-1 block">Voice Trigger</label>
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder='e.g., "Open my work tools"'
                className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-white text-sm placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-dark-400 mb-1 block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opens my work applications"
                className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-white text-sm placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-dark-400 mb-1 block">Actions</label>
              {actions.map((action, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={action.type}
                    onChange={(e) => handleUpdateAction(i, { type: e.target.value as CommandAction['type'] })}
                    className="px-2 py-2 bg-dark-800 border border-white/10 rounded-lg text-white text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="open_url">Open URL</option>
                    <option value="search">Search</option>
                    <option value="navigate">Navigate</option>
                  </select>
                  <input
                    type="text"
                    value={action.target || ''}
                    onChange={(e) => handleUpdateAction(i, { target: e.target.value })}
                    placeholder="URL or target"
                    className="flex-1 px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-white text-sm placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
                  />
                  {actions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAction(i)}
                      className="p-2 text-danger-400 hover:bg-danger-500/10 rounded-lg cursor-pointer"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAction}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="text-xs" /> Add another action
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white font-medium text-sm cursor-pointer"
            >
              Save Custom Command
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {commands.length === 0 ? (
          <div className="text-center py-6 text-dark-500">
            <FiCommand className="mx-auto text-2xl mb-2 opacity-30" />
            <p className="text-sm">No custom commands yet.</p>
            <p className="text-xs mt-1">Create one to automate multiple actions.</p>
          </div>
        ) : (
          commands.map((cmd) => (
            <motion.div
              key={cmd._id}
              layout
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div>
                <p className="text-sm text-white font-medium">"{cmd.trigger}"</p>
                <p className="text-xs text-dark-400">{cmd.description}</p>
                <div className="flex gap-1 mt-1">
                  {cmd.actions.map((a, i) => (
                    <span
                      key={i}
                      className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <FiGlobe className="text-[10px]" />
                      {a.target?.replace(/https?:\/\//, '').slice(0, 20)}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => cmd._id && onDelete(cmd._id)}
                className="p-2 text-dark-500 hover:text-danger-400 transition-colors rounded-lg cursor-pointer"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
