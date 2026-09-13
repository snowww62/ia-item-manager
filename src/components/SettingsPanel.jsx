import React, { useState, useEffect } from 'react';
import {
  Settings, KeyRound, Save, ExternalLink, Info, Globe, User, CheckCircle2,
  ClipboardPaste, Eye, EyeOff, ShieldCheck, ShieldAlert, Plug,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import PageHeader from './ui/PageHeader';
import Toggle from './ui/Toggle';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';
import { languageNames } from '../i18n/translations';

const Section = ({ icon: Icon, title, children }) => (
  <div className="card p-6">
    <div className="flex items-center gap-2.5 mb-5">
      <Icon className="w-5 h-5 text-brand" />
      <h3 className="font-semibold text-ink">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
    <div className="mt-1.5">{children}</div>
    {hint && <span className="text-xs text-ink-muted mt-1 block">{hint}</span>}
  </label>
);

const SettingsPanel = ({ credentials, setCredentials, version, onGoToAbout }) => {
  const { t, language: currentLang, changeLanguage } = useLanguage();
  const toast = useToast();

  const [local, setLocal] = useState(credentials);
  const [language, setLanguage] = useState(currentLang);
  const [username, setUsername] = useState(() => localStorage.getItem('app-username') || '');
  const [iaEmail, setIaEmail] = useState(() => localStorage.getItem('app-iascreenname') || '');
  const [autoRefresh, setAutoRefresh] = useState(() => localStorage.getItem('app-autorefresh') === 'true');
  const [showSecret, setShowSecret] = useState(false);
  const [encAvailable, setEncAvailable] = useState(true);
  const [testing, setTesting] = useState(false);
  const [conn, setConn] = useState(null); // { ok, name } | { ok:false, error }

  useEffect(() => {
    window.electronAPI?.isEncryptionAvailable?.().then(setEncAvailable).catch(() => {});
  }, []);

  const save = () => {
    setCredentials(local);
    changeLanguage(language);
    localStorage.setItem('app-username', username);
    localStorage.setItem('app-iascreenname', iaEmail.trim());
    localStorage.setItem('app-autorefresh', String(autoRefresh));
    toast.success(t('settings.saved'));
  };

  const paste = async (field) => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      setLocal((c) => ({ ...c, [field]: text }));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const testConnection = async () => {
    if (!local.accessKey || !local.secretKey) return;
    setTesting(true);
    setConn(null);
    try {
      const res = await window.electronAPI.testConnection({
        accessKey: local.accessKey,
        secretKey: local.secretKey,
      });
      if (res.success) {
        setConn({ ok: true, name: res.screenname || res.email || '✓' });
        if (res.email && !iaEmail) setIaEmail(res.email);
      } else {
        setConn({ ok: false, unverifiable: res.errorCode === 'Unverifiable' });
      }
    } catch (err) {
      setConn({ ok: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const openKeys = () => window.electronAPI?.openExternal?.('https://archive.org/account/s3.php');

  return (
    <div className="h-full flex flex-col">
      <PageHeader icon={Settings} title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* How-to */}
          <div className="card p-5 bg-brand-soft/40 border-brand/20">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-ink mb-2">{t('settings.howToGetKeys')}</h3>
                <ol className="text-sm text-ink-muted space-y-1 list-decimal list-inside">
                  <li>{t('settings.step1')}</li>
                  <li>{t('settings.step2')}</li>
                  <li>{t('settings.step3')}</li>
                  <li>{t('settings.step4')}</li>
                </ol>
                <button onClick={openKeys} className="btn-subtle text-xs mt-3 -ml-2">
                  <ExternalLink className="w-3.5 h-3.5" />{t('settings.goToKeys')}
                </button>
              </div>
            </div>
          </div>

          {/* Profile */}
          <Section icon={User} title={t('settings.userProfile')}>
            <Field label={t('settings.displayName')} hint={t('settings.displayNameHelp')}>
              <input className="field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('settings.displayNamePlaceholder')} />
            </Field>
            <Field label={t('settings.iaEmail')} hint={t('settings.iaEmailHelp')}>
              <input type="email" className="field" value={iaEmail} onChange={(e) => setIaEmail(e.target.value)} placeholder={t('settings.iaEmailPlaceholder')} />
            </Field>
          </Section>

          {/* Credentials */}
          <Section icon={KeyRound} title={t('settings.apiCredentials')}>
            <Field label={t('settings.accessKey')}>
              <div className="flex gap-2">
                <input className="field font-mono" value={local.accessKey} onChange={(e) => setLocal({ ...local, accessKey: e.target.value })} placeholder={t('settings.accessKeyPlaceholder')} />
                <button className="btn-ghost shrink-0" onClick={() => paste('accessKey')}><ClipboardPaste className="w-4 h-4" />{t('settings.paste')}</button>
              </div>
            </Field>
            <Field label={t('settings.secretKey')}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    className="field font-mono pr-10"
                    value={local.secretKey}
                    onChange={(e) => setLocal({ ...local, secretKey: e.target.value })}
                    placeholder={t('settings.secretKeyPlaceholder')}
                  />
                  <button type="button" onClick={() => setShowSecret((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="btn-ghost shrink-0" onClick={() => paste('secretKey')}><ClipboardPaste className="w-4 h-4" />{t('settings.paste')}</button>
              </div>
            </Field>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <button className="btn-ghost" onClick={testConnection} disabled={testing || !local.accessKey || !local.secretKey}>
                  {testing ? <Spinner size="sm" /> : <Plug className="w-4 h-4" />}
                  {testing ? t('settings.testing') : t('settings.testConnection')}
                </button>
                {conn?.ok && <Badge tone="ok" icon={CheckCircle2}>{t('settings.connectedAs', { name: conn.name })}</Badge>}
              </div>
              {conn && !conn.ok && (
                <p className={`flex items-start gap-1.5 text-sm ${conn.unverifiable ? 'text-ink-muted' : 'text-bad'}`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  {conn.unverifiable ? t('settings.connectionUnverifiable') : t('settings.connectionFailed')}
                </p>
              )}
            </div>

            <div className={`flex items-center gap-2 text-xs ${encAvailable ? 'text-ink-muted' : 'text-warn'}`}>
              {encAvailable ? <ShieldCheck className="w-4 h-4 text-ok" /> : <ShieldAlert className="w-4 h-4" />}
              {encAvailable ? t('settings.encryptionOn') : t('settings.encryptionOff')}
            </div>
          </Section>

          {/* Preferences */}
          <Section icon={Globe} title={t('settings.preferences')}>
            <Field label={t('settings.language')} hint={t('settings.languageHelp')}>
              <select className="field cursor-pointer" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </Field>
            <div className="bg-surface-raised border border-line rounded-sm p-4">
              <Toggle checked={autoRefresh} onChange={setAutoRefresh} label={t('settings.autoRefresh')} description={t('settings.autoRefreshHelp')} />
            </div>
          </Section>

          <button className="btn-primary w-full py-3.5 text-base" onClick={save}>
            <Save className="w-5 h-5" />{t('settings.save')}
          </button>

          {/* About */}
          <button
            onClick={onGoToAbout}
            className="w-full card p-6 flex items-center justify-between hover:border-line-strong hover:bg-surface-hover transition-colors text-left"
          >
            <div>
              <h3 className="font-semibold text-ink">{t('settings.about')}</h3>
              <p className="text-xs text-ink-muted mt-1">{t('app.name')} · v{version || '2.0.1'}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-ink-faint" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
