import React, { useState, useEffect, useCallback } from 'react';
import { Archive } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/Confirm';
import Sidebar from './components/Sidebar';
import UploadPanel from './components/UploadPanel';
import ItemsPanel from './components/ItemsPanel';
import SettingsPanel from './components/SettingsPanel';
import ItemDetailsPanel from './components/ItemDetailsPanel';
import FAQPanel from './components/FAQPanel';
import CreateItemPanel from './components/CreateItemPanel';

const NAV_ORDER = ['items', 'upload', 'create', 'faq', 'settings'];

function AppContent() {
  const [currentView, setCurrentView] = useState('items');
  const [credentials, setCredentials] = useState({ accessKey: '', secretKey: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadToItem, setUploadToItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState('');
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('app-sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    loadCredentials();
    window.electronAPI?.getVersion?.().then(setVersion).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('app-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  // Keyboard shortcuts: Ctrl/Cmd+1..5 to switch views, Ctrl/Cmd+K to focus search
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        setCurrentView(NAV_ORDER[Number(e.key) - 1]);
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentView('items');
        setTimeout(() => window.dispatchEvent(new CustomEvent('av:focus-search')), 40);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const loadCredentials = async () => {
    if (!window.electronAPI) {
      setIsLoading(false);
      return;
    }
    try {
      const encryptionAvailable = await window.electronAPI.isEncryptionAvailable();

      if (encryptionAvailable) {
        const encryptedData = localStorage.getItem('ia-credentials-encrypted');

        if (encryptedData) {
          const { encryptedAccessKey, encryptedSecretKey } = JSON.parse(encryptedData);
          const result = await window.electronAPI.loadCredentials({
            encryptedAccessKey,
            encryptedSecretKey,
          });
          if (result.success) setCredentials(result.credentials);
        } else {
          const oldCreds = localStorage.getItem('ia-credentials');
          if (oldCreds) {
            const parsed = JSON.parse(oldCreds);
            if (parsed.accessKey && parsed.secretKey) {
              await saveCredentials(parsed);
              localStorage.removeItem('ia-credentials');
            }
          }
        }
      } else {
        const saved = localStorage.getItem('ia-credentials');
        if (saved) setCredentials(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async (creds) => {
    try {
      const encryptionAvailable = await window.electronAPI.isEncryptionAvailable();

      if (encryptionAvailable && creds.accessKey && creds.secretKey) {
        const result = await window.electronAPI.saveCredentials({
          accessKey: creds.accessKey,
          secretKey: creds.secretKey,
        });
        if (result.success) {
          localStorage.setItem('ia-credentials-encrypted', JSON.stringify(result.encrypted));
          localStorage.removeItem('ia-credentials');
        }
      } else {
        localStorage.setItem('ia-credentials', JSON.stringify(creds));
      }
      setCredentials(creds);
    } catch (error) {
      console.error('Failed to save credentials:', error);
      localStorage.setItem('ia-credentials', JSON.stringify(creds));
      setCredentials(creds);
    }
  };

  const goToItem = useCallback((item) => {
    setSelectedItem(item);
    setCurrentView('details');
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadPanel credentials={credentials} prefilledIdentifier={uploadToItem} onGoToItems={() => setCurrentView('items')} />;
      case 'create':
        return <CreateItemPanel credentials={credentials} onCreated={goToItem} />;
      case 'items':
        return <ItemsPanel credentials={credentials} onSelectItem={goToItem} onGoToSettings={() => setCurrentView('settings')} />;
      case 'settings':
        return <SettingsPanel credentials={credentials} setCredentials={saveCredentials} version={version} />;
      case 'details':
        return (
          <ItemDetailsPanel
            item={selectedItem}
            credentials={credentials}
            onBack={() => setCurrentView('items')}
            onAddFiles={(identifier) => {
              setUploadToItem(identifier);
              setCurrentView('upload');
            }}
          />
        );
      case 'faq':
        return <FAQPanel />;
      default:
        return <ItemsPanel credentials={credentials} onSelectItem={goToItem} onGoToSettings={() => setCurrentView('settings')} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center shadow-glow">
            <Archive className="w-7 h-7 text-white" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-brand/25 border-t-brand animate-spin" />
        </div>
      </div>
    );
  }

  const connected = Boolean(credentials.accessKey && credentials.secretKey);
  const navView = currentView === 'details' ? 'items' : currentView;

  return (
    <div className="relative flex h-screen">
      <Sidebar
        currentView={navView}
        setView={setCurrentView}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        connected={connected}
        version={version}
      />
      <main className="relative z-10 flex-1 min-w-0 overflow-hidden">{renderView()}</main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ConfirmProvider>
          <AppContent />
        </ConfirmProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
