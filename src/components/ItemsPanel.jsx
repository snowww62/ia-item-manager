import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, FolderOpen, ExternalLink, RefreshCw, Calendar, Eye, LayoutGrid,
  Rows, X, Trash2, CheckSquare, ArrowUpRight, HardDrive, Settings,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './ui/Toast';
import { useConfirm } from './ui/Confirm';
import PageHeader from './ui/PageHeader';
import EmptyState from './ui/EmptyState';
import Badge from './ui/Badge';
import { ItemCardSkeleton } from './ui/Skeleton';
import Spinner from './ui/Spinner';

const escapeLucene = (str) => str.replace(/([+\-!(){}[\]^"~*?:\\/]|&&|\|\|)/g, '\\$1');
const PAGE_SIZE = 48;

const MEDIA_TYPES = ['all', 'texts', 'movies', 'audio', 'software', 'image', 'data', 'web'];
const SORTS = [
  { value: '-publicdate', key: 'sortNewest' },
  { value: 'publicdate', key: 'sortOldest' },
  { value: 'titleSorter asc', key: 'sortTitle' },
  { value: '-downloads', key: 'sortDownloads' },
];

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtSize = (bytes) => {
  const n = Number(bytes);
  if (!n) return null;
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${Math.round((n / 1024 ** i) * 10) / 10} ${u[i]}`;
};
const fmtNum = (n) => new Intl.NumberFormat().format(Number(n) || 0);

const Thumb = ({ identifier, className }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} bg-gradient-to-br from-surface-raised to-surface flex items-center justify-center`}>
        <FolderOpen className="w-10 h-10 text-ink-faint" />
      </div>
    );
  }
  return (
    <img
      src={`https://archive.org/services/img/${identifier}`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover bg-surface-raised`}
    />
  );
};

const ItemsPanel = ({ credentials, onSelectItem, onGoToSettings }) => {
  const { t } = useLanguage();
  const toast = useToast();
  const confirm = useConfirm();

  const [items, setItems] = useState([]);
  const [numFound, setNumFound] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('-publicdate');
  const [mediatype, setMediatype] = useState('all');
  const [view, setView] = useState(() => localStorage.getItem('app-items-view') || 'grid');
  const [selected, setSelected] = useState(() => new Set());

  const searchRef = useRef(null);
  const hasCreds = Boolean(credentials.accessKey);

  useEffect(() => {
    localStorage.setItem('app-items-view', view);
  }, [view]);

  useEffect(() => {
    const focus = () => searchRef.current?.focus();
    window.addEventListener('av:focus-search', focus);
    return () => window.removeEventListener('av:focus-search', focus);
  }, []);

  const buildQuery = useCallback((q) => {
    const email = localStorage.getItem('app-iascreenname');
    if (email) {
      return q
        ? `(title:(${escapeLucene(q)}) OR description:(${escapeLucene(q)})) AND uploader:"${email}"`
        : `uploader:"${email}"`;
    }
    return q ? escapeLucene(q) : undefined;
  }, []);

  const fetchItems = useCallback(
    async ({ nextPage = 1, append = false } = {}) => {
      if (!hasCreds) {
        setError(t('items.credentialsError'));
        return;
      }
      append ? setLoadingMore(true) : setLoading(true);
      setError('');
      try {
        const res = await window.electronAPI.getItems({
          accessKey: credentials.accessKey,
          secretKey: credentials.secretKey,
          query: buildQuery(query.trim()),
          sort,
          mediatype,
          page: nextPage,
          rows: PAGE_SIZE,
        });
        if (res.success) {
          const docs = res.data?.response?.docs || [];
          setNumFound(res.numFound || docs.length);
          setPage(nextPage);
          setItems((prev) => (append ? [...prev, ...docs] : docs));
        } else {
          setError(res.error || 'Failed to load items');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [hasCreds, credentials, query, sort, mediatype, buildQuery, t]
  );

  useEffect(() => {
    if (hasCreds) fetchItems({ nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, mediatype]);

  useEffect(() => {
    if (hasCreds && items.length === 0) fetchItems({ nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCreds]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSelected(new Set());
    fetchItems({ nextPage: 1 });
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const deleteSelected = async () => {
    const ids = [...selected];
    const ok = await confirm({
      title: t('details.deleteItemConfirm'),
      message: t('items.selected', { count: ids.length }),
      details: ids.join('\n'),
      confirmLabel: t('details.deleteItem'),
      cancelLabel: t('common.cancel'),
    });
    if (!ok) return;

    let done = 0;
    for (const id of ids) {
      const res = await window.electronAPI.deleteItem({
        identifier: id,
        accessKey: credentials.accessKey,
        secretKey: credentials.secretKey,
      });
      if (res.success) done++;
    }
    toast[done === ids.length ? 'success' : 'warning'](
      `${done}/${ids.length} — ${t('details.deleteItemSuccess')}`
    );
    setSelected(new Set());
    fetchItems({ nextPage: 1 });
  };

  const openExternal = (url) => window.electronAPI?.openExternal?.(url);

  /* ---------- render helpers ---------- */

  const renderCard = (item) => {
    const isSel = selected.has(item.identifier);
    return (
      <div
        key={item.identifier}
        className={`group card overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-raised ${
          isSel ? 'ring-2 ring-brand border-brand' : ''
        }`}
        onClick={() => onSelectItem(item)}
      >
        <div className="relative aspect-[4/3]">
          <Thumb identifier={item.identifier} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={(e) => { e.stopPropagation(); toggleSelect(item.identifier); }}
            className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              isSel
                ? 'bg-brand border-brand text-white opacity-100'
                : 'bg-black/40 border-white/30 text-white/0 opacity-0 group-hover:opacity-100 hover:text-white/90'
            }`}
            title={t('items.selected', { count: 1 })}
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openExternal(`https://archive.org/details/${item.identifier}`); }}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-black/40 border border-white/20 text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
            title="archive.org"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-3.5">
          <p className="font-medium text-ink text-sm truncate">{item.title || item.identifier}</p>
          <p className="text-xs text-ink-faint truncate mt-0.5 font-mono">{item.identifier}</p>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-ink-faint">
            <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(item.publicdate)}</span>
            <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{fmtNum(item.downloads)}</span>
            {fmtSize(item.item_size) && (
              <span className="inline-flex items-center gap-1 ml-auto"><HardDrive className="w-3 h-3" />{fmtSize(item.item_size)}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRow = (item) => {
    const isSel = selected.has(item.identifier);
    return (
      <div
        key={item.identifier}
        className={`group flex items-center gap-3 p-2.5 pr-4 rounded-sm border cursor-pointer transition-colors ${
          isSel ? 'bg-brand-soft border-brand' : 'bg-surface border-line hover:bg-surface-hover hover:border-line-strong'
        }`}
        onClick={() => onSelectItem(item)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); toggleSelect(item.identifier); }}
          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
            isSel ? 'bg-brand border-brand text-white' : 'border-line-strong text-transparent hover:border-brand'
          }`}
        >
          <CheckSquare className="w-3 h-3" />
        </button>
        <Thumb identifier={item.identifier} className="w-11 h-11 rounded-sm shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink text-sm truncate">{item.title || item.identifier}</p>
          <p className="text-xs text-ink-faint truncate font-mono">{item.identifier}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-ink-faint shrink-0">
          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(item.publicdate)}</span>
          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{fmtNum(item.downloads)}</span>
          {fmtSize(item.item_size) && <span className="w-16 text-right">{fmtSize(item.item_size)}</span>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); openExternal(`https://archive.org/details/${item.identifier}`); }}
          className="btn-subtle p-1.5 rounded-sm opacity-0 group-hover:opacity-100 shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  /* ---------- toolbar ---------- */

  const selectClass =
    'px-3 py-2 bg-surface-raised border border-line rounded-sm text-sm text-ink-muted focus:outline-none focus:border-brand/70 focus:ring-4 focus:ring-brand-soft cursor-pointer';

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        icon={FolderOpen}
        title={t('items.title')}
        subtitle={t('items.subtitle')}
        actions={
          <button onClick={() => fetchItems({ nextPage: 1 })} disabled={loading || !hasCreds} className="btn-ghost">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={submitSearch} className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('items.searchPlaceholder')}
              className="field pl-9 pr-8"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); fetchItems({ nextPage: 1 }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{t(`items.${s.key}`)}</option>
            ))}
          </select>

          <select value={mediatype} onChange={(e) => setMediatype(e.target.value)} className={selectClass}>
            {MEDIA_TYPES.map((m) => (
              <option key={m} value={m}>{m === 'all' ? t('items.allTypes') : m}</option>
            ))}
          </select>

          <div className="flex rounded-sm border border-line overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 transition-colors ${view === 'grid' ? 'bg-brand-soft text-brand' : 'bg-surface-raised text-ink-faint hover:text-ink'}`}
              title={t('items.gridView')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition-colors border-l border-line ${view === 'list' ? 'bg-brand-soft text-brand' : 'bg-surface-raised text-ink-faint hover:text-ink'}`}
              title={t('items.listView')}
            >
              <Rows className="w-4 h-4" />
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="shrink-0 flex items-center gap-3 px-8 py-2.5 bg-brand-soft border-b border-brand/25 animate-slide-up">
          <span className="text-sm font-medium text-ink">{t('items.selected', { count: selected.size })}</span>
          {selected.size === 1 && (
            <button
              className="btn-subtle text-xs"
              onClick={() => onSelectItem(items.find((i) => i.identifier === [...selected][0]))}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />{t('items.openItem')}
            </button>
          )}
          <button className="btn-danger text-xs ml-auto py-1.5" onClick={deleteSelected}>
            <Trash2 className="w-3.5 h-3.5" />{t('items.deleteSelected')}
          </button>
          <button className="btn-subtle text-xs py-1.5" onClick={() => setSelected(new Set())}>
            {t('items.clearSelection')}
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {!hasCreds ? (
          <EmptyState
            icon={Settings}
            title={t('items.credentialsError')}
            action={<button className="btn-primary" onClick={onGoToSettings}><Settings className="w-4 h-4" />{t('items.goToSettings')}</button>}
          />
        ) : error ? (
          <EmptyState
            icon={X}
            title={t('common.error')}
            description={error}
            action={<button className="btn-ghost" onClick={() => fetchItems({ nextPage: 1 })}><RefreshCw className="w-4 h-4" />{t('common.retry')}</button>}
          />
        ) : loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {Array.from({ length: 8 }).map((_, i) => <ItemCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={FolderOpen} title={query ? t('items.noResults') : t('items.noItems')} description={query ? t('items.noResultsHelp') : t('items.noItemsHelp')} />
        ) : (
          <>
            <p className="text-xs text-ink-faint mb-4">{t('items.showing', { count: items.length, total: fmtNum(numFound) })}</p>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {items.map(renderCard)}
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in">{items.map(renderRow)}</div>
            )}

            {items.length < numFound && (
              <div className="flex justify-center pt-8">
                <button className="btn-ghost" disabled={loadingMore} onClick={() => fetchItems({ nextPage: page + 1, append: true })}>
                  {loadingMore ? <Spinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
                  {t('items.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;
