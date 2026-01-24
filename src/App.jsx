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
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('ia-credentials');
    return saved ? JSON.parse(saved) : { accessKey: '', secretKey: '' };
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadToItem, setUploadToItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('ia-credentials', JSON.stringify(credentials));
  }, [credentials]);

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
        return <SettingsPanel credentials={credentials} setCredentials={setCredentials} />;
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
