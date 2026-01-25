import React, { useState, useEffect } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const validateIdentifier = (id) => {
  if (!id || id.length < 3) return 'Identifier must be at least 3 characters';
  if (id.length > 100) return 'Identifier must be less than 100 characters';
  if (!/^[a-z0-9][a-z0-9_-]*[a-z0-9]$/.test(id)) return 'Identifier must start and end with a letter or number';
  return null;
};

const UploadPanel = ({ credentials, prefilledIdentifier }) => {
  const { t } = useLanguage();
  const [files, setFiles] = useState([]);
  const [identifier, setIdentifier] = useState(prefilledIdentifier || '');
  const [identifierError, setIdentifierError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState('opensource_media');
  const [mediatype, setMediatype] = useState('data');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    if (prefilledIdentifier) {
      setIdentifier(prefilledIdentifier);
    }
  }, [prefilledIdentifier]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onUploadProgress((data) => {
        setUploadStatus(prev => ({
          ...prev,
          [data.fileName]: { progress: data.progress, status: 'uploading' }
        }));
      });

      return () => {
        window.electronAPI.removeUploadProgressListener();
      };
    }
  }, []);

  const handleSelectFiles = async () => {
    const selectedFiles = await window.electronAPI.openMultipleFilesDialog();
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleIdentifierChange = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setIdentifier(cleaned);
    
    if (cleaned) {
      const error = validateIdentifier(cleaned);
      setIdentifierError(error);
    } else {
      setIdentifierError(null);
    }
  };

  const handleUpload = async () => {
    if (!identifier || files.length === 0 || !credentials.accessKey || !credentials.secretKey) {
      alert('Please fill in all required fields and configure your credentials in Settings');
      return;
    }

    const validationError = validateIdentifier(identifier);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploading(true);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { progress: 0, status: 'uploading' }
        }));

        const result = await window.electronAPI.uploadFile({
          identifier,
          filePath: file.path,
          accessKey: credentials.accessKey,
          secretKey: credentials.secretKey,
          isExistingItem: !!prefilledIdentifier,
          sizeHint: totalSize,
          metadata: {
            title,
            description,
            collection,
            mediatype
          }
        });

        if (result.success) {
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { progress: 100, status: 'success' }
          }));
        } else {
          const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
          
          if (errorMsg.includes('SlowDown') || errorMsg.includes('spam')) {
            alert(t('upload.spamErrorTitle') + '\n\n' + t('upload.spamErrorMessage'));
            setUploading(false);
            return;
          }
          
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { progress: 0, status: 'error', error: errorMsg }
          }));
        }

        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } catch (error) {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { progress: 0, status: 'error', error: error.message }
        }));
      }
    }

    setUploading(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Upload className="w-7 h-7 text-blue-400" />
          {t('upload.title')}
        </h2>
        <p className="text-slate-400 mt-1">{t('upload.subtitle')}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">{t('upload.itemInfo')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('upload.identifier')}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(e.target.value)}
                  placeholder={t('upload.identifierPlaceholder')}
                  disabled={!!prefilledIdentifier}
                  className={`w-full px-4 py-2 bg-slate-900 border ${identifierError ? 'border-red-500' : 'border-slate-600'} rounded-lg focus:outline-none focus:ring-2 ${identifierError ? 'focus:ring-red-500' : 'focus:ring-blue-500'} text-white ${prefilledIdentifier ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {identifierError && !prefilledIdentifier && (
                  <p className="text-xs text-red-400 mt-1">❌ {identifierError}</p>
                )}
                {!identifierError && (
                  <p className="text-xs text-slate-400 mt-1">
                    {prefilledIdentifier 
                      ? t('upload.lockedIdentifier')
                      : t('upload.identifierHelp')}
                  </p>
                )}
              </div>

              {!prefilledIdentifier && (
                <>
                  <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-200 font-semibold mb-2">
                      {t('upload.newItemWarningTitle')}
                    </p>
                    <p className="text-xs text-yellow-100 mb-2">
                      {t('upload.newItemWarningText')}
                    </p>
                    <p className="text-xs text-yellow-100 font-semibold">
                      {t('upload.newItemWarningSolution')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('upload.title')}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t('upload.titlePlaceholder')}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('upload.description')}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('upload.descriptionPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Collection * (Required)
                    </label>
                    <select
                      value={collection}
                      onChange={(e) => {
                        const selectedCollection = e.target.value;
                        setCollection(selectedCollection);
                        
                        const mediatypeMap = {
                          'opensource_media': 'data',
                          'opensource_movies': 'movies',
                          'opensource': 'texts',
                          'opensource_audio': 'audio',
                          'opensource_image': 'image',
                          'open_source_software': 'software'
                        };
                        setMediatype(mediatypeMap[selectedCollection] || 'data');
                      }}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="opensource_media">Community Data</option>
                      <option value="opensource_movies">Community Movies</option>
                      <option value="opensource">Community Texts</option>
                      <option value="opensource_audio">Community Audio</option>
                      <option value="opensource_image">Community Image</option>
                      <option value="open_source_software">Community Software</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">
                      ✅ Required to prevent spam detection. Mediatype will be set automatically.
                    </p>
                  </div>
                </>
              )}
              
              {prefilledIdentifier && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    {t('upload.existingItemNote')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('upload.filesToUpload')}</h3>
              <button
                onClick={handleSelectFiles}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <File className="w-4 h-4" />
                {t('upload.selectFiles')}
              </button>
            </div>

            {files.length === 0 ? (
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">{t('upload.noFiles')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('upload.noFilesHelp')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => {
                  const status = uploadStatus[file.name];
                  return (
                    <div key={index} className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-3 flex-1">
                        <File className="w-5 h-5 text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                          {status && status.status === 'uploading' && (
                            <div className="mt-2">
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${status.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{status.progress}%</p>
                            </div>
                          )}
                          {status && status.status === 'success' && (
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <p className="text-sm text-green-400">{t('upload.uploadSuccess')}</p>
                            </div>
                          )}
                          {status && status.status === 'error' && (
                            <div className="flex items-center gap-2 mt-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <p className="text-sm text-red-400">{status.error || t('upload.uploadFailed')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {!uploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !identifier}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {t('upload.uploading')}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {t('upload.uploadButton')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
