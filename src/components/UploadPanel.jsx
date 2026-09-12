import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UploadCloud, File as FileIcon, X, CheckCircle2, AlertCircle, FolderInput,
  Loader, RotateCcw, Trash2, ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import PageHeader from './ui/PageHeader';
import EmptyState from './ui/EmptyState';
import Badge from './ui/Badge';
import Toggle from './ui/Toggle';

const fmtSize = (bytes) => {
  const n = Number(bytes) || 0;
  if (n === 0) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${Math.round((n / 1024 ** i) * 100) / 100} ${u[i]}`;
};

const FOLDER_RE = /^(?!\/)(?!.*\.\.)[a-zA-Z0-9 ._\-/]*$/;

const STATUS = {
  pending: { tone: 'neutral', icon: null, key: 'statusPending' },
  uploading: { tone: 'brand', icon: Loader, key: 'statusUploading' },
  done: { tone: 'ok', icon: CheckCircle2, key: 'statusDone' },
  failed: { tone: 'bad', icon: AlertCircle, key: 'statusFailed' },
};

const UploadPanel = ({ credentials, prefilledIdentifier, onGoToItems }) => {
  const { t } = useLanguage();
  const toast = useToast();

  const [identifier, setIdentifier] = useState(prefilledIdentifier || '');
  const [targetFolder, setTargetFolder] = useState('');
  // Off by default: queuing a derive task per file is the main way bulk uploads
  // trip archive.org's "total_tasks_queued exceeds global_limit" throttle.
  const [queueDerive, setQueueDerive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const speedRef = useRef({});

  useEffect(() => {
    if (prefilledIdentifier) setIdentifier(prefilledIdentifier);
  }, [prefilledIdentifier]);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.onUploadProgress((data) => {
      const now = Date.now();
      const prev = speedRef.current[data.fileName];
      let speed = '';
      if (prev && data.loaded != null) {
        const dt = (now - prev.t) / 1000;
        const db = data.loaded - prev.loaded;
        if (dt > 0 && db > 0) speed = `${fmtSize(db / dt)}/s`;
      }
      speedRef.current[data.fileName] = { t: now, loaded: data.loaded ?? 0 };
      setFiles((list) =>
        list.map((f) =>
          f.name === data.fileName ? { ...f, progress: data.progress, status: 'uploading', speed } : f
        )
      );
    });
    return () => window.electronAPI.removeUploadProgressListener();
  }, []);

  const addPaths = useCallback(async (paths) => {
    if (!paths?.length) return;
    const stat = window.electronAPI.statFiles
      ? await window.electronAPI.statFiles(paths)
      : paths.map((p) => ({ path: p, name: p.split(/[\\/]/).pop(), size: 0 }));
    setFiles((list) => {
      const seen = new Set(list.map((f) => f.path));
      const fresh = stat
        .filter((s) => s.path && !seen.has(s.path))
        .map((s) => ({ ...s, status: 'pending', progress: 0, error: '', speed: '' }));
      return [...list, ...fresh];
    });
  }, []);

  const browse = async () => {
    const picked = await window.electronAPI.openMultipleFilesDialog();
    if (picked?.length) {
      setFiles((list) => {
        const seen = new Set(list.map((f) => f.path));
        return [
          ...list,
          ...picked.filter((p) => !seen.has(p.path)).map((p) => ({ ...p, status: 'pending', progress: 0, error: '', speed: '' })),
        ];
      });
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    const paths = dropped
      .map((f) => window.electronAPI.getPathForFile?.(f) || f.path)
      .filter(Boolean);
    await addPaths(paths);
  };

  const removeFile = (path) => setFiles((list) => list.filter((f) => f.path !== path));
  const clearAll = () => setFiles([]);

  const folderValid = FOLDER_RE.test(targetFolder.trim());

  const runUpload = async (targets) => {
    if (!identifier || targets.length === 0 || !credentials.accessKey || !credentials.secretKey) {
      toast.error(t('upload.fillRequired'));
      return;
    }
    setUploading(true);
    const totalSize = files.reduce((s, f) => s + (f.size || 0), 0);
    let ok = 0;
    let fail = 0;
    let warnedRateLimit = false;

    for (let i = 0; i < targets.length; i++) {
      const file = targets[i];
      setFiles((list) => list.map((f) => (f.path === file.path ? { ...f, status: 'uploading', progress: 0, error: '', errorCode: null } : f)));
      let rateLimited = false;
      try {
        const res = await window.electronAPI.uploadFile({
          identifier,
          filePath: file.path,
          targetFolder: targetFolder.trim(),
          accessKey: credentials.accessKey,
          secretKey: credentials.secretKey,
          isExistingItem: true,
          sizeHint: totalSize,
          queueDerive,
        });
        if (res.success) {
          ok++;
          setFiles((list) => list.map((f) => (f.path === file.path ? { ...f, status: 'done', progress: 100, speed: '' } : f)));
        } else {
          fail++;
          rateLimited = res.errorCode === 'SlowDown';
          const msg = typeof res.error === 'string' ? res.error : JSON.stringify(res.error);
          setFiles((list) => list.map((f) => (f.path === file.path ? { ...f, status: 'failed', error: msg, errorCode: res.errorCode, speed: '' } : f)));
        }
      } catch (err) {
        fail++;
        setFiles((list) => list.map((f) => (f.path === file.path ? { ...f, status: 'failed', error: err.message, speed: '' } : f)));
      }

      if (rateLimited && !warnedRateLimit) {
        warnedRateLimit = true;
        toast.warning(t('upload.rateLimitedToast'));
      }

      if (i < targets.length - 1) {
        await new Promise((r) => setTimeout(r, rateLimited ? 20000 : 2000));
      }
    }

    setUploading(false);
    if (fail === 0) toast.success(t('upload.allDone', { count: ok }));
    else toast.warning(t('upload.someFailed', { ok, fail }));
  };

  const pending = files.filter((f) => f.status === 'pending' || f.status === 'uploading');
  const failed = files.filter((f) => f.status === 'failed');
  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0);
  const canUpload = identifier && pending.length > 0 && folderValid && !uploading;

  return (
    <div className="h-full flex flex-col">
      <PageHeader icon={UploadCloud} title={t('upload.title')} subtitle={t('upload.subtitle')} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Target */}
          <div className="card p-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('upload.targetItem')}</label>
            {identifier ? (
              <>
                <div className="mt-2 flex items-center gap-2.5 px-3.5 py-2.5 bg-surface-raised border border-line rounded-sm">
                  <Badge tone="ok">✓</Badge>
                  <span className="font-mono text-sm text-ink truncate">{identifier}</span>
                </div>
                <p className="text-xs text-ink-muted mt-2">{t('upload.lockedToItem')}</p>
              </>
            ) : (
              <div className="mt-2 flex items-center justify-between gap-3 px-3.5 py-3 bg-warn/10 border border-warn/25 rounded-sm">
                <p className="text-sm text-warn">{t('upload.noTarget')}</p>
                <button className="btn-ghost text-xs shrink-0" onClick={onGoToItems}>
                  {t('nav.items')}<ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint mt-5 block">
              <FolderInput className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t('upload.targetFolder')}
            </label>
            <input
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              placeholder={t('upload.targetFolderPlaceholder')}
              className={`field mt-2 font-mono ${!folderValid ? 'border-bad/60 focus:border-bad/60 focus:ring-bad/20' : ''}`}
            />
            <p className={`text-xs mt-1.5 ${!folderValid ? 'text-bad' : 'text-ink-muted'}`}>
              {folderValid ? t('upload.targetFolderHint') : t('create.identifierInvalid')}
            </p>

            <div className="mt-4 pt-4 border-t border-line">
              <Toggle
                checked={queueDerive}
                onChange={setQueueDerive}
                label={t('upload.deriveOption')}
                description={t('upload.deriveOptionHelp')}
              />
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={browse}
            className={`relative rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-brand bg-brand-soft scale-[1.01]' : 'border-line hover:border-line-strong bg-surface/40'
            }`}
          >
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragOver ? 'bg-brand text-white' : 'bg-surface-raised text-ink-faint'}`}>
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="font-medium text-ink">{dragOver ? t('upload.dropzoneActive') : t('upload.dropzoneTitle')}</p>
            <p className="text-sm text-ink-muted mt-1">{t('upload.dropzoneHint')}</p>
          </div>

          {/* Queue */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-ink">{t('upload.filesToUpload')}</h3>
                {files.length > 0 && (
                  <Badge>{files.length} · {fmtSize(totalSize)}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {failed.length > 0 && !uploading && (
                  <button className="btn-ghost text-xs" onClick={() => runUpload(failed)}>
                    <RotateCcw className="w-3.5 h-3.5" />{t('upload.retryFailed')}
                  </button>
                )}
                {files.length > 0 && !uploading && (
                  <button className="btn-subtle text-xs" onClick={clearAll}>
                    <Trash2 className="w-3.5 h-3.5" />{t('upload.clearAll')}
                  </button>
                )}
              </div>
            </div>

            {files.length === 0 ? (
              <EmptyState icon={FileIcon} title={t('upload.noFiles')} description={t('upload.noFilesHelp')} />
            ) : (
              <div className="space-y-2">
                {files.map((f) => {
                  const s = STATUS[f.status];
                  const Icon = s.icon;
                  return (
                    <div key={f.path} className="bg-surface-raised border border-line rounded-sm p-3">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-4 h-4 text-ink-faint shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink truncate">{f.name}</p>
                          <p className="text-xs text-ink-faint">{fmtSize(f.size)}{f.speed ? ` · ${f.speed}` : ''}</p>
                        </div>
                        <Badge tone={s.tone}>
                          {Icon && <Icon className={`w-3.5 h-3.5 ${f.status === 'uploading' ? 'animate-spin' : ''}`} />}
                          {t(`upload.${s.key}`)}
                        </Badge>
                        {!uploading && f.status !== 'done' && (
                          <button onClick={() => removeFile(f.path)} className="btn-subtle p-1 rounded-sm">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {f.status === 'uploading' && (
                        <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                        </div>
                      )}
                      {f.status === 'failed' && f.error && (
                        <>
                          <p className="text-xs text-bad mt-1.5 break-words">{f.error}</p>
                          {f.errorCode === 'SlowDown' && (
                            <p className="text-xs text-warn mt-1">{t('upload.rateLimitedHint')}</p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button className="btn-primary w-full py-3.5 text-base" disabled={!canUpload} onClick={() => runUpload(pending)}>
            {uploading ? <><Loader className="w-5 h-5 animate-spin" />{t('upload.uploading')}</> : <><UploadCloud className="w-5 h-5" />{t('upload.uploadButton', { count: pending.length })}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
