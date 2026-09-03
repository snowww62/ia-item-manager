import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft, File as FileIcon, Download, Trash2, ExternalLink, Loader, Calendar,
  Eye, HardDrive, UploadCloud, Archive, RefreshCw, Sparkles, Link2, Search,
  CheckSquare, FileStack, Layers, Clock, FolderArchive,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import { useConfirm } from './ui/Confirm';
import EmptyState from './ui/EmptyState';
import Badge from './ui/Badge';
import Spinner from './ui/Spinner';
import { RowSkeleton } from './ui/Skeleton';

const fmtSize = (bytes) => {
  const n = Number(bytes);
  if (!n) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${Math.round((n / 1024 ** i) * 100) / 100} ${u[i]}`;
};
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtNum = (n) => new Intl.NumberFormat().format(Number(n) || 0);
const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').trim();

const MEDIA_TYPES = ['data', 'texts', 'movies', 'audio', 'software', 'image', 'web'];

const StatTile = ({ icon: Icon, label, value }) => (
  <div className="bg-surface-raised border border-line rounded-sm px-4 py-3">
    <div className="flex items-center gap-1.5 text-ink-faint text-[11px] uppercase tracking-wide">
      <Icon className="w-3.5 h-3.5" />{label}
    </div>
    <p className="text-ink font-medium mt-1 truncate">{value}</p>
  </div>
);

const ItemDetailsPanel = ({ item, credentials, onBack, onAddFiles }) => {
  const { t } = useLanguage();
  const toast = useToast();
  const confirm = useConfirm();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [tasks, setTasks] = useState(null);
  const [deriving, setDeriving] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);
  const [busyFile, setBusyFile] = useState(null);
  const [fileFilter, setFileFilter] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(() => new Set());

  const [editing, setEditing] = useState(false);
  const [meta, setMeta] = useState(null);
  const [savingMeta, setSavingMeta] = useState(false);

  const hasCreds = Boolean(credentials.accessKey && credentials.secretKey);
  const openExternal = (url) => window.electronAPI?.openExternal?.(url);

  const loadDetails = useCallback(async () => {
    if (!item) return;
    setLoading(true);
    try {
      const res = await window.electronAPI.getItemDetails({ identifier: item.identifier });
      if (res.success) setDetails(res.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [item]);

  const loadTasks = useCallback(async () => {
    if (!item || !hasCreds) return;
    const res = await window.electronAPI.getTasks({
      identifier: item.identifier,
      accessKey: credentials.accessKey,
      secretKey: credentials.secretKey,
    });
    if (res.success) setTasks(res.summary);
  }, [item, hasCreds, credentials]);

  useEffect(() => {
    setDetails(null);
    setEditing(false);
    setMeta(null);
    setTab('overview');
    setSelectedFiles(new Set());
    setTasks(null);
    loadDetails();
    loadTasks();
  }, [item, loadDetails, loadTasks]);

  const m = details?.metadata || {};
  const totalSize = details?.item_size ?? item?.item_size;
  const fileCount = details?.files_count ?? details?.files?.length;

  const visibleFiles = useMemo(() => {
    const all = (details?.files || []).filter(
      (f) => f.name && !f.name.endsWith('_meta.xml') && f.format !== 'Metadata'
    );
    if (!fileFilter.trim()) return all;
    const q = fileFilter.trim().toLowerCase();
    return all.filter((f) => f.name.toLowerCase().includes(q));
  }, [details, fileFilter]);

  const processing = tasks && (tasks.running > 0 || tasks.queued > 0);

  /* ---------- actions ---------- */

  const startEdit = () => {
    setMeta({
      title: m.title || item?.title || '',
      description: stripHtml(m.description),
      subject: Array.isArray(m.subject) ? m.subject.join(', ') : m.subject || '',
      creator: Array.isArray(m.creator) ? m.creator.join(', ') : m.creator || '',
      date: m.date || '',
      licenseurl: m.licenseurl || '',
      language: m.language || '',
      mediatype: m.mediatype || 'data',
    });
    setEditing(true);
    setTab('metadata');
  };

  const saveMeta = async () => {
    setSavingMeta(true);
    try {
      const res = await window.electronAPI.updateMetadata({
        identifier: item.identifier,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
        metadata: meta,
      });
      if (res.success) {
        toast.success(t('details.metadataUpdated'));
        setEditing(false);
        loadDetails();
      } else {
        toast.error(`${t('details.metadataFailed')}: ${res.error}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingMeta(false);
    }
  };

  const reDerive = async () => {
    setDeriving(true);
    const res = await window.electronAPI.queueDerive({
      identifier: item.identifier,
      accessKey: credentials.accessKey,
      secretKey: credentials.secretKey,
    });
    setDeriving(false);
    if (res.success) {
      toast.success(t('details.reDeriveQueued'));
      setTimeout(loadTasks, 1500);
    } else {
      toast.error(`${t('details.reDeriveFailed')}: ${res.error}`);
    }
  };

  const deleteFiles = async (names) => {
    const single = names.length === 1;
    const ok = await confirm({
      title: single ? t('details.deleteConfirm') : t('details.deleteSelectedFiles', { count: names.length }),
      message: single
        ? t('details.deleteConfirmMsg', { name: names[0] })
        : t('details.deleteSelectedFiles', { count: names.length }),
      details: single ? null : names.join('\n'),
      confirmLabel: t('details.deleteFile'),
      cancelLabel: t('common.cancel'),
    });
    if (!ok) return;

    let done = 0;
    for (const name of names) {
      setBusyFile(name);
      const res = await window.electronAPI.deleteFile({
        identifier: item.identifier,
        fileName: name,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
      });
      if (res.success) done++;
    }
    setBusyFile(null);
    setSelectedFiles(new Set());
    toast[done === names.length ? 'success' : 'warning'](`${done}/${names.length} — ${t('details.deleteSuccess')}`);
    loadDetails();
  };

  const deleteItem = async () => {
    const ok = await confirm({
      title: t('details.deleteItemConfirm'),
      message: t('details.deleteItemMsg', { id: item.identifier }),
      details: t('details.deleteItemDetails'),
      confirmLabel: t('details.deleteItem'),
      cancelLabel: t('common.cancel'),
    });
    if (!ok) return;
    setDeletingItem(true);
    try {
      const res = await window.electronAPI.deleteItem({
        identifier: item.identifier,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
      });
      if (res.success) {
        toast.success(t('details.deleteItemSuccess'));
        onBack();
      } else if (res.partial) {
        toast.warning(`${res.deleted} ✓ / ${res.failed} ✗`);
        loadDetails();
      } else {
        toast.error(`${t('details.deleteItemFailed')}: ${res.error}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingItem(false);
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('common.copied'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const toggleFile = (name) =>
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  if (!item) {
    return <div className="h-full flex items-center justify-center text-ink-muted">—</div>;
  }

  const detailsUrl = `https://archive.org/details/${item.identifier}`;
  const fileSourceBadge = (src) => {
    if (src === 'original') return <Badge tone="brand">{t('details.original')}</Badge>;
    if (src === 'derivative') return <Badge tone="neutral">{t('details.derivative')}</Badge>;
    return <Badge tone="neutral">{src || '—'}</Badge>;
  };

  const tabs = [
    { id: 'overview', label: t('details.tabOverview'), icon: Layers },
    { id: 'files', label: `${t('details.tabFiles')} (${visibleFiles.length})`, icon: FileStack },
    { id: 'metadata', label: t('details.tabMetadata'), icon: Archive },
    { id: 'raw', label: t('details.tabRaw'), icon: FileIcon },
  ];

  const fieldRow = (label, value) =>
    value ? (
      <div className="flex gap-4 py-2.5 border-b border-line last:border-0">
        <span className="text-xs uppercase tracking-wide text-ink-faint w-32 shrink-0 pt-0.5">{label}</span>
        <span className="text-sm text-ink break-words">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
      </div>
    ) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-8 pt-6 pb-5 border-b border-line bg-surface/40 backdrop-blur-sm">
        <button onClick={onBack} className="btn-subtle text-sm -ml-2 mb-3">
          <ArrowLeft className="w-4 h-4" />{t('details.back')}
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-ink truncate">{m.title || item.title || item.identifier}</h2>
            <button onClick={() => copyLink(detailsUrl)} className="group inline-flex items-center gap-1.5 mt-1 text-xs text-ink-faint hover:text-ink font-mono">
              {item.identifier}<Link2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn-primary" onClick={() => onAddFiles?.(item.identifier)}>
              <UploadCloud className="w-4 h-4" />{t('details.addFiles')}
            </button>
            <button className="btn-ghost" onClick={() => openExternal(`https://archive.org/compress/${item.identifier}`)} title={t('details.downloadZip')}>
              <FolderArchive className="w-4 h-4" />
            </button>
            <button className="btn-ghost" onClick={() => openExternal(detailsUrl)} title={t('details.viewOnArchive')}>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button className="btn-ghost" onClick={() => openExternal(`https://archive.org/history/${item.identifier}`)} title={t('details.history')}>
              <Clock className="w-4 h-4" />
            </button>
            <button className="btn-danger" onClick={deleteItem} disabled={deletingItem}>
              {deletingItem ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Processing status */}
        {hasCreds && (
          <div className="mt-4 flex items-center gap-2.5">
            {processing ? (
              <Badge tone="warn"><Loader className="w-3.5 h-3.5 animate-spin" />{t('details.processing')}</Badge>
            ) : tasks ? (
              <Badge tone="ok">{t('details.upToDate')}</Badge>
            ) : null}
            {processing && (
              <span className="text-xs text-ink-muted">
                {t('details.processingHelp', { running: tasks.running, queued: tasks.queued })}
              </span>
            )}
            <button onClick={loadTasks} className="btn-subtle text-xs py-1 px-2">
              <RefreshCw className="w-3 h-3" />
            </button>
            <button onClick={reDerive} disabled={deriving} className="btn-subtle text-xs py-1 px-2 ml-auto">
              {deriving ? <Spinner size="sm" /> : <Sparkles className="w-3.5 h-3.5" />}{t('details.reDerive')}
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
            </div>
            {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile icon={Calendar} label={t('details.published')} value={fmtDate(m.publicdate || item.publicdate)} />
              <StatTile icon={Eye} label={t('details.views')} value={fmtNum(item.downloads)} />
              <StatTile icon={HardDrive} label={t('details.totalSize')} value={fmtSize(totalSize)} />
              <StatTile icon={FileStack} label={t('details.fileCount')} value={fmtNum(fileCount)} />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mt-6 border-b border-line">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    tab === id ? 'border-brand text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            <div className="py-5 animate-fade-in">
              {/* Overview */}
              {tab === 'overview' && (
                <div className="space-y-5">
                  <div className="card p-5">
                    <h3 className="font-semibold text-ink mb-2">{t('details.description')}</h3>
                    <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed">
                      {stripHtml(m.description) || t('details.noDescription')}
                    </p>
                  </div>
                  <div className="card p-5">
                    {fieldRow(t('details.fldMediatype'), m.mediatype || item.mediatype)}
                    {fieldRow(t('details.collection'), m.collection)}
                    {fieldRow(t('details.fldCreator'), m.creator)}
                    {fieldRow(t('details.fldSubject'), m.subject)}
                    {fieldRow(t('details.fldDate'), m.date)}
                    {fieldRow(t('details.added'), fmtDate(m.addeddate || item.addeddate))}
                    {fieldRow(t('details.fldLicense'), m.licenseurl)}
                  </div>
                  <button className="btn-ghost" onClick={startEdit}>
                    <Archive className="w-4 h-4" />{t('details.editMetadata')}
                  </button>
                </div>
              )}

              {/* Files */}
              {tab === 'files' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                      <input
                        value={fileFilter}
                        onChange={(e) => setFileFilter(e.target.value)}
                        placeholder={t('details.filesSearch')}
                        className="field pl-9"
                      />
                    </div>
                    {visibleFiles.length > 0 && (
                      <button
                        className="btn-ghost text-xs"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.size === visibleFiles.length ? new Set() : new Set(visibleFiles.map((f) => f.name))
                          )
                        }
                      >
                        <CheckSquare className="w-3.5 h-3.5" />{t('details.selectAll')}
                      </button>
                    )}
                  </div>

                  {selectedFiles.size > 0 && (
                    <div className="flex items-center gap-3 px-3 py-2 bg-brand-soft border border-brand/25 rounded-sm">
                      <span className="text-sm text-ink">{t('items.selected', { count: selectedFiles.size })}</span>
                      <button className="btn-danger text-xs py-1 ml-auto" onClick={() => deleteFiles([...selectedFiles])}>
                        <Trash2 className="w-3.5 h-3.5" />{t('details.deleteSelectedFiles', { count: selectedFiles.size })}
                      </button>
                    </div>
                  )}

                  {visibleFiles.length === 0 ? (
                    <EmptyState icon={FileStack} title={t('details.noFiles')} />
                  ) : (
                    <div className="space-y-2">
                      {visibleFiles.map((file) => {
                        const dl = `https://archive.org/download/${item.identifier}/${file.name.split('/').map(encodeURIComponent).join('/')}`;
                        const isSel = selectedFiles.has(file.name);
                        return (
                          <div
                            key={file.name}
                            className={`group flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                              isSel ? 'bg-brand-soft border-brand' : 'bg-surface border-line hover:border-line-strong'
                            }`}
                          >
                            <button
                              onClick={() => toggleFile(file.name)}
                              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isSel ? 'bg-brand border-brand text-white' : 'border-line-strong text-transparent hover:border-brand'
                              }`}
                            >
                              <CheckSquare className="w-3 h-3" />
                            </button>
                            <FileIcon className="w-4 h-4 text-ink-faint shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-ink truncate">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-faint">
                                <span>{fmtSize(file.size)}</span>
                                {file.format && <span>· {file.format}</span>}
                              </div>
                            </div>
                            {fileSourceBadge(file.source)}
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => copyLink(dl)} className="btn-subtle p-1.5 rounded-sm opacity-0 group-hover:opacity-100" title={t('details.copyDownloadLink')}>
                                <Link2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => openExternal(dl)} className="btn-subtle p-1.5 rounded-sm" title={t('common.copyLink')}>
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteFiles([file.name])} disabled={busyFile === file.name} className="btn-subtle p-1.5 rounded-sm text-bad hover:bg-bad/10">
                                {busyFile === file.name ? <Spinner size="sm" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Metadata editor */}
              {tab === 'metadata' && (
                <div className="card p-5">
                  {!editing || !meta ? (
                    <div className="text-center py-8">
                      <button className="btn-primary" onClick={startEdit}>
                        <Archive className="w-4 h-4" />{t('details.editMetadata')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Field label={t('details.fldTitle')}>
                        <input className="field" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
                      </Field>
                      <Field label={t('details.fldDescription')}>
                        <textarea rows={4} className="field resize-none" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label={t('details.fldSubject')} hint={t('details.fldSubjectHint')}>
                          <input className="field" value={meta.subject} onChange={(e) => setMeta({ ...meta, subject: e.target.value })} />
                        </Field>
                        <Field label={t('details.fldCreator')}>
                          <input className="field" value={meta.creator} onChange={(e) => setMeta({ ...meta, creator: e.target.value })} />
                        </Field>
                        <Field label={t('details.fldDate')} hint={t('details.fldDateHint')}>
                          <input className="field" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} />
                        </Field>
                        <Field label={t('details.fldLanguage')}>
                          <input className="field" value={meta.language} onChange={(e) => setMeta({ ...meta, language: e.target.value })} />
                        </Field>
                        <Field label={t('details.fldLicense')}>
                          <input className="field" value={meta.licenseurl} onChange={(e) => setMeta({ ...meta, licenseurl: e.target.value })} />
                        </Field>
                        <Field label={t('details.fldMediatype')}>
                          <select className="field cursor-pointer" value={meta.mediatype} onChange={(e) => setMeta({ ...meta, mediatype: e.target.value })}>
                            {MEDIA_TYPES.map((mt) => <option key={mt} value={mt}>{mt}</option>)}
                          </select>
                        </Field>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button className="btn-primary" onClick={saveMeta} disabled={savingMeta}>
                          {savingMeta ? <Spinner size="sm" /> : <Archive className="w-4 h-4" />}{t('details.saveMetadata')}
                        </button>
                        <button className="btn-ghost" onClick={() => setEditing(false)} disabled={savingMeta}>
                          {t('details.cancelEdit')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Raw */}
              {tab === 'raw' && (
                <pre className="card p-4 text-xs font-mono text-ink-muted overflow-x-auto leading-relaxed">
                  {JSON.stringify(m, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
    <div className="mt-1.5">{children}</div>
    {hint && <span className="text-xs text-ink-faint mt-1 block">{hint}</span>}
  </label>
);

export default ItemDetailsPanel;
