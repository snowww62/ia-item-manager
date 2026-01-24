import React from 'react';
import { Archive, Upload, FolderOpen, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = ({ currentView, setCurrentView }) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'items', icon: FolderOpen, label: t('sidebar.myItems') },
    { id: 'upload', icon: Upload, label: t('sidebar.upload') },
    { id: 'faq', icon: HelpCircle, label: t('sidebar.faq') },
    { id: 'settings', icon: Settings, label: t('sidebar.settings') },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Archive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">IA Item Manager</h1>
            <p className="text-xs text-slate-400">by Snow</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 text-center">
            {t('sidebar.version')} 1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
