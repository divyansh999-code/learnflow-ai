import React, { useState } from 'react';
import { useStore } from '../store';
import { Moon, Sun, User, Save, Edit2, Check, Zap, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Settings = () => {
  const { theme, toggleTheme, user, updateUser, reduceMotion, toggleReduceMotion } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editTitle, setEditTitle] = useState(user?.title || '');

  const handleSave = () => {
    updateUser({ name: editName, title: editTitle });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditName(user?.name || '');
    setEditTitle(user?.title || '');
    setIsEditing(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Appearance & Accessibility */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500" />
            Display & Accessibility
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Sun className="w-4 h-4 text-gray-500" /> Dark Mode
                </div>
                <div className="text-sm text-gray-500">Toggle application theme</div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-700 pt-6">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-500" /> Reduced Motion
                </div>
                <div className="text-sm text-gray-500">Disable complex animations</div>
              </div>
              <button 
                onClick={toggleReduceMotion}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${reduceMotion ? 'bg-primary-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${reduceMotion ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Account Information
          </h2>
          <div className="flex items-start gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-primary-50 dark:ring-primary-900/20 shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                     <label className="text-xs text-gray-400 font-bold uppercase">Display Name</label>
                     <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-primary-500"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-gray-400 font-bold uppercase">Title / Status</label>
                     <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-primary-500"
                     />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-1" />
                      Save Changes
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-lg">{user?.name}</div>
                    <div className="text-gray-500">{user?.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{user?.email}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleStartEdit}>
                    <Edit2 className="w-3 h-3 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};