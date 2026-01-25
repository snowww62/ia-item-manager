import React, { useState, useEffect } from 'react';
import { Archive, Upload, FolderOpen, Settings, Search, Download, Trash2, FileText, Info } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Sidebar';
import UploadPanel from './components/UploadPanel';
import ItemsPanel from './components/ItemsPanel';
import SettingsPanel from './components/SettingsPanel';
import ItemDetailsPanel from './components/ItemDetailsPanel';
import FAQPanel from './components/FAQPanel';

function AppContent() {
  const [currentView, setCurrentView] = useState('items');
  const [credentials, setCredentials] = useState({ accessKey: '', secretKey: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadToItem, setUploadToItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const encryptionAvailable = await window.electronAPI.isEncryptionAvailable();
      
      if (encryptionAvailable) {
        const encryptedData = localStorage.getItem('ia-credentials-encrypted');
        
        if (encryptedData) {
          const { encryptedAccessKey, encryptedSecretKey } = JSON.parse(encryptedData);
          const result = await window.electronAPI.loadCredentials({ 
            encryptedAccessKey, 
            encryptedSecretKey 
          });
          
          if (result.success) {
            setCredentials(result.credentials);
          }
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
        if (saved) {
          setCredentials(JSON.parse(saved));
        }
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
          secretKey: creds.secretKey
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

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadPanel credentials={credentials} prefilledIdentifier={uploadToItem} />;
      case 'items':
        return <ItemsPanel credentials={credentials} onSelectItem={(item) => {
          setSelectedItem(item);
          setCurrentView('details');
        }} />;
      case 'settings':
        return <SettingsPanel credentials={credentials} setCredentials={saveCredentials} />;
      case 'details':
        return <ItemDetailsPanel 
          item={selectedItem} 
          credentials={credentials} 
          onBack={() => setCurrentView('items')}
          onAddFiles={(identifier) => {
            setUploadToItem(identifier);
            setCurrentView('upload');
          }}
        />;
      case 'faq':
        return <FAQPanel />;
      default:
        return <ItemsPanel credentials={credentials} onSelectItem={(item) => {
          setSelectedItem(item);
          setCurrentView('details');
        }} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
