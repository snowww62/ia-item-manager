import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ExternalLink, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PageHeader from './ui/PageHeader';
import EmptyState from './ui/EmptyState';

const LINKS = [
  { key: 'linkApiKeys', url: 'https://archive.org/account/s3.php' },
  { key: 'linkDocs', url: 'https://archive.org/developers/' },
  { key: 'linkGeneralFaq', url: 'https://archive.org/about/faqs.php' },
];

const FAQPanel = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState('');

  const faqs = t('faq.questions') || [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const openExternal = (url) => window.electronAPI?.openExternal?.(url);

  return (
    <div className="h-full flex flex-col">
      <PageHeader icon={HelpCircle} title={t('faq.title')} subtitle={t('faq.subtitle')}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('faq.search')}
            className="field pl-9"
          />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title={t('faq.noMatch')} />
          ) : (
            filtered.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="card overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
                  >
                    <span className="font-medium text-ink text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-ink-faint shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-sm text-ink-muted leading-relaxed border-t border-line animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}

          <div className="card p-5 mt-6 bg-brand-soft/30 border-brand/20">
            <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-brand" />{t('faq.links')}
            </h3>
            <div className="space-y-1.5">
              {LINKS.map(({ key, url }) => (
                <button
                  key={key}
                  onClick={() => openExternal(url)}
                  className="block text-sm text-brand hover:text-brand-hover transition-colors"
                >
                  → {t(`faq.${key}`)}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-ink-faint pt-4">{t('faq.madeBy')}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQPanel;
