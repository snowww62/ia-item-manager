import React, { useState, useEffect, useCallback } from 'react';
import {
  Info, ExternalLink, Github, Bug, ShieldCheck, FileWarning, RefreshCw,
  CheckCircle2, ArrowDownToLine, Scale,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import PageHeader from './ui/PageHeader';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';

const REPO_URL = 'https://github.com/snowww62/retrovault-archive-manager';

const LinkRow = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 bg-surface-raised hover:bg-surface-hover border border-line rounded-sm text-sm text-ink transition-colors text-left"
  >
    <Icon className="w-4 h-4 text-ink-faint shrink-0" />
    <span className="flex-1">{label}</span>
    <ExternalLink className="w-3.5 h-3.5 text-ink-faint" />
  </button>
);

const AboutPanel = ({ version, onUpdateChecked }) => {
  const { t } = useLanguage();
  const toast = useToast();
  const [checking, setChecking] = useState(false);
  const [update, setUpdate] = useState(null); // result of app:checkForUpdate

  const openExternal = (url) => window.electronAPI?.openExternal?.(url);

  const checkUpdate = useCallback(async (silent = false) => {
    if (!window.electronAPI?.checkForUpdate) return;
    setChecking(true);
    try {
      const res = await window.electronAPI.checkForUpdate();
      setUpdate(res);
      onUpdateChecked?.(res);
      if (!silent) {
        if (res.success && res.hasUpdate) toast.info(t('about.updateFoundToast', { version: res.latestVersion }));
        else if (res.success) toast.success(t('about.upToDate'));
        else toast.error(res.error || t('common.error'));
      }
    } catch (err) {
      if (!silent) toast.error(err.message);
    } finally {
      setChecking(false);
    }
  }, [t, toast, onUpdateChecked]);

  useEffect(() => {
    checkUpdate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col">
      <PageHeader icon={Info} title={t('about.title')} subtitle={t('about.subtitle')} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Hero */}
          <div className="card p-6 flex items-center gap-4">
            <img src="./icon.png" alt="" className="w-14 h-14 rounded-xl shadow-glow shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink text-lg">{t('app.name')}</p>
              <p className="text-sm text-ink-muted">{t('settings.authorText')}</p>
            </div>
            <Badge>v{version || '2.0.0'}</Badge>
          </div>

          {/* Update check */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <RefreshCw className="w-5 h-5 text-brand" />
              <h3 className="font-semibold text-ink">{t('about.updates')}</h3>
            </div>

            {update?.success && update.hasUpdate ? (
              <div className="bg-brand-soft border border-brand/25 rounded-sm p-4">
                <p className="text-sm font-medium text-ink">
                  {t('about.updateFound', { version: update.latestVersion })}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {update.portableUrl && (
                    <button className="btn-primary text-xs py-2" onClick={() => openExternal(update.portableUrl)}>
                      <ArrowDownToLine className="w-3.5 h-3.5" />{t('about.downloadPortable')}
                    </button>
                  )}
                  {update.setupUrl && (
                    <button className="btn-ghost text-xs py-2" onClick={() => openExternal(update.setupUrl)}>
                      <ArrowDownToLine className="w-3.5 h-3.5" />{t('about.downloadSetup')}
                    </button>
                  )}
                  <button className="btn-subtle text-xs py-2" onClick={() => openExternal(update.releaseUrl)}>
                    <ExternalLink className="w-3.5 h-3.5" />{t('about.viewRelease')}
                  </button>
                </div>
              </div>
            ) : update?.success ? (
              <Badge tone="ok" icon={CheckCircle2}>{t('about.upToDate')}</Badge>
            ) : update && !update.success ? (
              <Badge tone="bad">{update.error}</Badge>
            ) : null}

            <button
              className="btn-ghost text-xs mt-4"
              onClick={() => checkUpdate(false)}
              disabled={checking}
            >
              {checking ? <Spinner size="sm" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {t('about.checkUpdate')}
            </button>
          </div>

          {/* Description */}
          <div className="card p-6">
            <p className="text-sm text-ink-muted leading-relaxed">{t('settings.descriptionText')}</p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <LinkRow icon={Github} label={t('about.linkGithub')} onClick={() => openExternal(REPO_URL)} />
            <LinkRow icon={Bug} label={t('about.linkBug')} onClick={() => openExternal(`${REPO_URL}/issues`)} />
            <LinkRow icon={ExternalLink} label={t('about.linkArchive')} onClick={() => openExternal('https://archive.org')} />
          </div>

          {/* Credits & license */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Scale className="w-4 h-4 text-ink-faint" />
              <h3 className="font-semibold text-ink text-sm">{t('about.license')}</h3>
            </div>
            <p className="text-xs text-ink-muted">{t('about.licenseText')}</p>
            <p className="text-xs text-ink-faint mt-3 pt-3 border-t border-line">{t('about.credits')}</p>
          </div>

          {/* Privacy */}
          <p className="text-xs text-ink-faint px-1">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-ok" />
            {t('settings.privacyText')}
          </p>

          {/* Diagnostics */}
          <button
            className="btn-ghost text-xs"
            onClick={() => window.electronAPI?.openCrashLogFolder?.()}
            title={t('settings.crashLogHelp')}
          >
            <FileWarning className="w-3.5 h-3.5" />{t('settings.crashLog')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
