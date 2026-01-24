import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQPanel = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = t('faq.questions', { returnObjects: true });

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <HelpCircle className="w-7 h-7 text-blue-400" />
          {t('faq.title')}
        </h2>
        <p className="text-slate-400 mt-1">{t('faq.subtitle')}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-750 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-slate-300 border-t border-slate-700/50 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border-2 border-blue-500 mt-8">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              {t('faq.links')}
            </h3>
            <div className="space-y-2 text-sm">
              <a href="https://archive.org/account/s3.php" target="_blank" rel="noopener noreferrer" 
                className="block text-blue-300 hover:text-blue-200 transition-colors">
                → {t('faq.linkApiKeys')}
              </a>
              <a href="https://archive.org/developers/" target="_blank" rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 transition-colors">
                → {t('faq.linkDocs')}
              </a>
              <a href="https://archive.org/about/faqs.php" target="_blank" rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 transition-colors">
                → {t('faq.linkGeneralFaq')}
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-slate-400 text-sm">
            <p>{t('faq.madeBy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPanel;
