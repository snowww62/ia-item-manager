import React, { useState, useEffect } from 'react';
import { ArrowLeft, File, Download, Trash2, ExternalLink, Loader, Calendar, Eye, HardDrive, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ItemDetailsPanel = ({ item, credentials, onBack, onAddFiles }) => {
  const { t } = useLanguage();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [metadata, setMetadata] = useState({
    title: item?.title || '',
    description: '',
    subject: '',
    creator: '',
    mediatype: 'data'
  });
  const [metadataReady, setMetadataReady] = useState(false);

  useEffect(() => {
    setMetadataReady(false);
    setEditingMetadata(false);
    loadDetails();
  }, [item]);

  const loadDetails = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      const result = await window.electronAPI.getItemDetails({
        identifier: item.identifier
      });

      if (result.success) {
        setDetails(result.data);
      }
    } catch (err) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (!confirm(`${t('details.deleteConfirm')} ${fileName}?`)) return;

    setDeleting(fileName);
    try {
      const result = await window.electronAPI.deleteFile({
        identifier: item.identifier,
        fileName,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey
      });

      if (result.success) {
        alert(t('details.deleteSuccess'));
        loadDetails();
      } else {
        alert(t('details.deleteFailed') + ': ' + result.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteItem = async () => {
    const confirmMessage = `${t('details.deleteItemConfirm')}

⚠️ IMPORTANT:
• Les fichiers système IA (.xml, .sqlite, .torrent) ne seront PAS supprimés (c'est normal)
• Internet Archive créera des versions de backup (.~1~) qui disparaîtront automatiquement dans 30 jours
• Pour une suppression définitive, utilisez le site web Internet Archive

Voulez-vous continuer ?`;
    
    if (!confirm(confirmMessage)) return;

    setDeletingItem(true);
    try {
      const result = await window.electronAPI.deleteItem({
        identifier: item.identifier,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey
      });

      if (result.success) {
        alert(t('details.deleteItemSuccess'));
        onBack();
      } else {
        alert(t('details.deleteItemFailed') + ': ' + result.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeletingItem(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      const result = await window.electronAPI.updateMetadata({
        identifier: item.identifier,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
        metadata: {
          title: metadata.title,
          description: metadata.description,
          subject: metadata.subject,
          creator: metadata.creator,
          mediatype: metadata.mediatype
        }
      });

      if (result.success) {
        alert('✅ Metadata updated successfully!');
        setEditingMetadata(false);
        loadDetails();
      } else {
        alert('❌ Failed to update metadata: ' + result.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  if (!item) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">No item selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('details.back')}
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{item.title || item.identifier}</h2>
            <p className="text-slate-400 mt-1">{item.identifier}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddFiles && onAddFiles(item.identifier)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              title="Add files to this item"
            >
              <Upload className="w-4 h-4" />
              + Add Files
            </button>
            <button
              onClick={() => {
                if (!editingMetadata && details?.metadata && !metadataReady) {
                  // Charger les métadonnées seulement au moment du clic
                  const cleanDescription = (details.metadata.description || '').replace(/<[^>]*>/g, '').trim();
                  setMetadata({
                    title: details.metadata.title || item.title || '',
                    description: cleanDescription,
                    subject: details.metadata.subject || '',
                    creator: details.metadata.creator || '',
                    mediatype: details.metadata.mediatype || 'data'
                  });
                  setMetadataReady(true);
                }
                setEditingMetadata(!editingMetadata);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <File className="w-4 h-4" />
              {editingMetadata ? 'Cancel Edit' : 'Edit Metadata'}
            </button>
            <button
              onClick={handleDeleteItem}
              disabled={deletingItem}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingItem ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {t('details.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {t('details.deleteItem')}
                </>
              )}
            </button>
            <a
              href={`https://archive.org/details/${item.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {t('details.viewOnArchive')}
            </a>
            <a
              href={`https://archive.org/history/${item.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              title="View item history and tasks"
            >
              <Calendar className="w-4 h-4" />
              History
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">{t('details.published')}</h3>
                </div>
                <p className="text-slate-300">{formatDate(item.publicdate)}</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">{t('details.views')}</h3>
                </div>
                <p className="text-slate-300">{item.downloads || 0}</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">{t('details.mediaType')}</h3>
                </div>
                <p className="text-slate-300">{item.mediatype || 'data'}</p>
              </div>
            </div>

            {editingMetadata && metadataReady && (
              <div key={`metadata-form-${item.identifier}-${metadataReady}`} className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border-2 border-blue-500">
                <h3 className="font-semibold mb-4 text-lg">📝 Edit Metadata</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      defaultValue={metadata.title}
                      onChange={(e) => metadata.title = e.target.value}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      defaultValue={metadata.description}
                      onChange={(e) => metadata.description = e.target.value}
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Subject/Tags</label>
                      <input
                        type="text"
                        defaultValue={metadata.subject}
                        onChange={(e) => metadata.subject = e.target.value}
                        placeholder="retro, games, dos"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Creator</label>
                      <input
                        type="text"
                        defaultValue={metadata.creator}
                        onChange={(e) => metadata.creator = e.target.value}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Media Type</label>
                    <select
                      defaultValue={metadata.mediatype}
                      onChange={(e) => metadata.mediatype = e.target.value}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="software">Software</option>
                      <option value="movies">Movies</option>
                      <option value="audio">Audio</option>
                      <option value="texts">Texts</option>
                      <option value="data">Data</option>
                      <option value="web">Web</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveMetadata}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <File className="w-5 h-5" />
                    Save Metadata
                  </button>
                </div>
              </div>
            )}

            {!editingMetadata && details?.metadata?.description && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="font-semibold mb-3">{t('details.description')}</h3>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {details.metadata.description.replace(/<[^>]*>/g, '').trim()}
                </p>
              </div>
            )}

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">{t('details.files')}</h3>
              {details?.files && details.files.length > 0 ? (
                <div className="space-y-2">
                  {details.files
                    .filter(file => file.name && !file.name.endsWith('_meta.xml') && file.format !== 'Metadata')
                    .map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                              <span>{formatFileSize(file.size)}</span>
                              {file.format && <span>{file.format}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <a
                            href={`https://archive.org/download/${item.identifier}/${file.name}`}
                            download
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            disabled={deleting === file.name}
                            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          >
                            {deleting === file.name ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">{t('details.noFiles')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailsPanel;
