import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, ExternalLink, Info, Globe, Palette, User, CheckCircle, Clipboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsPanel = ({ credentials, setCredentials }) => {
  const { t, language: currentLang, changeLanguage } = useLanguage();
  const [localCredentials, setLocalCredentials] = useState(credentials);
  const [language, setLanguage] = useState(currentLang);
  const [username, setUsername] = useState(() => localStorage.getItem('app-username') || '');
  const [iaScreenname, setIaScreenname] = useState(() => localStorage.getItem('app-iascreenname') || '');
  const [autoRefresh, setAutoRefresh] = useState(() => localStorage.getItem('app-autorefresh') === 'true');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setCredentials(localCredentials);
    changeLanguage(language);
    localStorage.setItem('app-username', username);
    localStorage.setItem('app-iascreenname', iaScreenname);
    localStorage.setItem('app-autorefresh', autoRefresh.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasteAccessKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLocalCredentials({ ...localCredentials, accessKey: text.trim() });
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handlePasteSecretKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLocalCredentials({ ...localCredentials, secretKey: text.trim() });
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Settings className="w-7 h-7 text-blue-400" />
          {t('settings.title')}
        </h2>
        <p className="text-slate-400 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">{t('settings.howToGetKeys')}</h3>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>{t('settings.step1')}</li>
                  <li>{t('settings.step2')}</li>
                  <li>{t('settings.step3')}</li>
                  <li>{t('settings.step4')}</li>
                </ol>
                <a
                  href="https://archive.org/account/s3.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('settings.goToKeys')}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold">{t('settings.userProfile')}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('settings.displayName')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('settings.displayNamePlaceholder')}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">{t('settings.displayNameHelp')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Internet Archive Email
                </label>
                <input
                  type="email"
                  value={iaScreenname}
                  onChange={(e) => setIaScreenname(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">📧 Your IA account email - required to find items uploaded via web</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold">{t('settings.apiCredentials')}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('settings.accessKey')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localCredentials.accessKey}
                    onChange={(e) => setLocalCredentials({ ...localCredentials, accessKey: e.target.value })}
                    placeholder={t('settings.accessKeyPlaceholder')}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                  />
                  <button
                    onClick={handlePasteAccessKey}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('settings.secretKey')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={localCredentials.secretKey}
                    onChange={(e) => setLocalCredentials({ ...localCredentials, secretKey: e.target.value })}
                    placeholder={t('settings.secretKeyPlaceholder')}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                  />
                  <button
                    onClick={handlePasteSecretKey}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold">{t('settings.languagePrefs')}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('settings.language')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">{t('settings.languageHelp')}</p>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-slate-200">{t('settings.autoRefresh')}</p>
                  <p className="text-sm text-slate-400">{t('settings.autoRefreshHelp')}</p>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autoRefresh ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoRefresh ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6">
            <button
              onClick={handleSave}
              className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  {t('settings.settingsSaved')}
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  {t('settings.saveSettings')}
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">{t('settings.about')}</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>{t('settings.version')}:</strong> 1.0.0</p>
              <p><strong>{t('settings.author')}:</strong> {t('settings.authorText')}</p>
              <p><strong>{t('settings.description')}:</strong> {t('settings.descriptionText')}</p>
              <p className="pt-4 border-t border-slate-700 text-slate-400">
                🔒 <strong>{t('settings.privacy')}:</strong> {t('settings.privacyText')}
              </p>
              <p className="text-slate-400">
                📦 <strong>{t('settings.portable')}:</strong> {t('settings.portableText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
