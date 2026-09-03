import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, AlertTriangle, File as FileIcon, Loader, CheckCircle2, XCircle, Rocket,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import PageHeader from './ui/PageHeader';
import Spinner from './ui/Spinner';
import Badge from './ui/Badge';

const ID_RE = /^[a-z0-9][a-z0-9._-]{1,98}[a-z0-9]$/;
const MEDIA_TYPES = ['data', 'texts', 'movies', 'audio', 'software', 'image', 'web'];
const COLLECTIONS = ['opensource_media', 'opensource', 'test_collection'];

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
    <div className="mt-1.5">{children}</div>
    {hint && <span className="text-xs text-ink-muted mt-1 block">{hint}</span>}
  </label>
);

const fmtSize = (b) => {
  const n = Number(b) || 0;
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = n ? Math.floor(Math.log(n) / Math.log(1024)) : 0;
  return `${Math.round((n / 1024 ** i) * 100) / 100} ${u[i]}`;
};

const CreateItemPanel = ({ credentials, onCreated }) => {
  const { t } = useLanguage();
  const toast = useToast();

  const [ack, setAck] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediatype, setMediatype] = useState('data');
  const [collection, setCollection] = useState('opensource_media');
  const [file, setFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [avail, setAvail] = useState(null); // 'checking' | 'free' | 'taken' | 'invalid'
  const checkRef = useRef(0);

  const hasCreds = Boolean(credentials.accessKey && credentials.secretKey);
  const idValid = ID_RE.test(identifier);

  useEffect(() => {
    if (!identifier) return setAvail(null);
    if (!idValid) return setAvail('invalid');
    setAvail('checking');
    const token = ++checkRef.current;
    const timer = setTimeout(async () => {
      try {
        const res = await window.electronAPI.checkIdentifier({ identifier });
        if (token !== checkRef.current) return;
        setAvail(res.success && res.exists ? 'taken' : 'free');
      } catch {
        if (token === checkRef.current) setAvail(null);
      }
    }, 550);
    return () => clearTimeout(timer);
  }, [identifier, idValid]);

  const pickFile = async () => {
    const picked = await window.electronAPI.openFileDialog();
    if (picked) setFile(picked);
  };

  const create = async () => {
    if (!hasCreds || !idValid || !file || avail === 'taken') return;
    setCreating(true);
    try {
      const res = await window.electronAPI.createItem({
        identifier,
        filePath: file.path,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
        metadata: { title: title || identifier, description, mediatype, collection },
      });
      if (res.success) {
        toast.success(t('create.created'));
        onCreated?.({ identifier, title: title || identifier, mediatype, publicdate: new Date().toISOString() });
      } else {
        const msg = typeof res.error === 'string' ? res.error : JSON.stringify(res.error);
        toast.error(`${t('create.createFailed')}: ${msg}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const availBadge = {
    checking: <Badge tone="neutral"><Loader className="w-3 h-3 animate-spin" />{t('create.identifierChecking')}</Badge>,
    free: <Badge tone="ok" icon={CheckCircle2}>{t('create.identifierAvailable')}</Badge>,
    taken: <Badge tone="bad" icon={XCircle}>{t('create.identifierTaken')}</Badge>,
    invalid: <Badge tone="warn" icon={AlertTriangle}>{t('create.identifierInvalid')}</Badge>,
  }[avail];

  return (
    <div className="h-full flex flex-col">
      <PageHeader icon={Sparkles} title={t('create.title')} subtitle={t('create.subtitle')} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Warning */}
          <div className="card p-5 bg-warn/10 border-warn/25">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warn shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-ink">{t('create.warningTitle')}</h3>
                <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{t('create.warningBody')}</p>
                <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none">
                  <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="w-4 h-4 accent-brand" />
                  <span className="text-sm text-ink">{t('create.ack')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className={`card p-6 space-y-4 transition-opacity ${ack ? '' : 'opacity-40 pointer-events-none'}`}>
            <Field label={t('create.identifier')} hint={t('create.identifierHint')}>
              <input
                className="field font-mono"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="my-collection-2026"
              />
              {availBadge && <div className="mt-2">{availBadge}</div>}
            </Field>

            <Field label={t('details.fldTitle')}>
              <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>

            <Field label={t('details.fldDescription')}>
              <textarea rows={3} className="field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('create.mediatype')}>
                <select className="field cursor-pointer" value={mediatype} onChange={(e) => setMediatype(e.target.value)}>
                  {MEDIA_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label={t('create.collection')} hint={t('create.collectionHint')}>
                <select className="field cursor-pointer" value={collection} onChange={(e) => setCollection(e.target.value)}>
                  {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label={t('create.firstFile')}>
              {file ? (
                <div className="flex items-center gap-3 px-3.5 py-2.5 bg-surface-raised border border-line rounded-sm">
                  <FileIcon className="w-4 h-4 text-ink-faint shrink-0" />
                  <span className="text-sm text-ink truncate flex-1">{file.name}</span>
                  <span className="text-xs text-ink-faint">{fmtSize(file.size)}</span>
                  <button className="btn-subtle text-xs py-1" onClick={() => setFile(null)}>{t('upload.remove')}</button>
                </div>
              ) : (
                <button className="btn-ghost w-full" onClick={pickFile}>
                  <FileIcon className="w-4 h-4" />{t('create.pickFile')}
                </button>
              )}
            </Field>

            <button
              className="btn-primary w-full py-3.5 text-base"
              disabled={!hasCreds || !idValid || !file || avail === 'taken' || avail === 'checking' || creating}
              onClick={create}
            >
              {creating ? <><Loader className="w-5 h-5 animate-spin" />{t('create.creating')}</> : <><Rocket className="w-5 h-5" />{t('create.create')}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItemPanel;
