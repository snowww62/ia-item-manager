import React, { useState, useEffect } from 'react';
import { Search, FolderOpen, ExternalLink, Loader, RefreshCw, Calendar, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const escapeLucene = (str) => {
  const specialChars = /([+\-!(){}[\]^"~*?:\\/]|&&|\|\|)/g;
  return str.replace(specialChars, '\\$1');
};

const ItemsPanel = ({ credentials, onSelectItem }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const loadItems = async () => {
    if (!credentials.accessKey) {
      setError(t('items.credentialsError'));
      return;
    }

    setLoading(true);
    setError('');
    setDebugInfo('Recherche en cours...');
    
    try {
      const savedEmail = localStorage.getItem('app-iascreenname');
      let customQuery = '';
      
      if (savedEmail) {
        if (searchQuery) {
          const escapedQuery = escapeLucene(searchQuery);
          customQuery = `(title:(${escapedQuery}) OR description:(${escapedQuery})) AND uploader:"${savedEmail}"`;
        } else {
          customQuery = `uploader:"${savedEmail}"`;
        }
      } else {
        customQuery = searchQuery ? escapeLucene(searchQuery) : undefined;
      }
      
      const result = await window.electronAPI.getItems({
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
        query: customQuery || undefined
      });

      if (result.success) {
        const foundItems = result.data.response?.docs || [];
        setItems(foundItems);
        const queryUsed = customQuery || 'auto-detection';
        setDebugInfo(`✅ Trouvé ${foundItems.length} items | Email: ${savedEmail || 'non défini'} | Query: ${queryUsed}`);
      } else {
        setError(result.error || 'Failed to load items');
        setDebugInfo(`❌ Erreur: ${result.error}`);
      }
    } catch (err) {
      setError(err.message);
      setDebugInfo(`❌ Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentials.accessKey) {
      loadItems();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FolderOpen className="w-7 h-7 text-blue-400" />
              {t('items.title')}
            </h2>
            <p className="text-slate-400 mt-1">{t('items.subtitle')}</p>
          </div>
          <button
            onClick={loadItems}
            disabled={loading}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('items.refresh')}
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('items.search')}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {t('items.searchButton')}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {debugInfo && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm font-mono">{debugInfo}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">{t('items.noItems')}</p>
            <p className="text-slate-500 mt-2">{t('items.noItemsHelp')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.identifier}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all cursor-pointer group"
                onClick={() => onSelectItem(item)}
              >
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <FolderOpen className="w-12 h-12 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate mb-1">{item.title || item.identifier}</h3>
                  <p className="text-sm text-slate-400 truncate mb-3">{item.identifier}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.publicdate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.downloads || 0} {t('items.views')}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.mediatype || 'data'}</span>
                    <a
                      href={`https://archive.org/details/${item.identifier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;
