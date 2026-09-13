import React from 'react';
import {
  FolderOpen, UploadCloud, Sparkles, HelpCircle, Settings, Info,
  PanelLeftClose, PanelLeftOpen, Archive,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = ({ currentView, setView, collapsed, onToggleCollapse, connected, version, updateAvailable }) => {
  const { t } = useLanguage();

  const items = [
    { id: 'items', icon: FolderOpen, label: t('nav.items') },
    { id: 'upload', icon: UploadCloud, label: t('nav.upload') },
    { id: 'create', icon: Sparkles, label: t('nav.create') },
    { id: 'faq', icon: HelpCircle, label: t('nav.faq') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
    { id: 'about', icon: Info, label: t('nav.about'), badge: updateAvailable },
  ];

  return (
    <aside
      className={`relative z-10 shrink-0 flex flex-col bg-surface/70 backdrop-blur-xl border-r border-line transition-[width] duration-200 ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 h-[68px] px-4 border-b border-line ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center shadow-glow shrink-0">
          <Archive className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-semibold text-ink leading-tight truncate">{t('app.name')}</p>
            <p className="text-[11px] text-ink-faint truncate">{t('app.tagline')}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ id, icon: Icon, label, badge }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              title={collapsed ? label : undefined}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-soft text-ink'
                  : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-brand" />
              )}
              <span className="relative shrink-0">
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-brand' : ''}`} />
                {badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent shadow-[0_0_6px] shadow-accent/70" />
                )}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-line space-y-2">
        <div className={`flex items-center gap-2 px-2 text-[11px] text-ink-faint ${collapsed ? 'justify-center' : ''}`}>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-ok shadow-[0_0_8px] shadow-ok/60' : 'bg-ink-faint'}`}
          />
          {!collapsed && <span>{connected ? 'archive.org' : t('items.credentialsError')}</span>}
        </div>
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-xs text-ink-faint hover:bg-surface-hover hover:text-ink transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!collapsed && <span>{t('nav.collapse')}</span>}
          {!collapsed && version && <span className="ml-auto opacity-60">v{version}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
