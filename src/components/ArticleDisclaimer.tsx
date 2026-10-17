import React, { useState, useEffect } from 'react';
import { Info, X, ShieldAlert, CheckCircle2, FileText, Scale } from 'lucide-react';
import { Article } from '../data/articlesData';

interface ArticleDisclaimerProps {
  article: Article;
  variant?: 'badge' | 'banner';
}

export const ArticleDisclaimer: React.FC<ArticleDisclaimerProps> = ({ article, variant = 'badge' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button / Pill at Article Start */}
      {variant === 'badge' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-[11px] sm:text-xs font-naskh font-medium transition-all cursor-pointer shadow-2xs"
          title="قانونی و علمی وضاحتی بیان (Disclaimer) دیکھیں"
          aria-label="علمی و قانونی وضاحتی بیان"
        >
          <span className="w-4 h-4 rounded-full bg-amber-200/80 group-hover:bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
            i
          </span>
          <span className="font-semibold">قانونی و علمی وضاحت</span>
          <span className="text-[10px] text-amber-700/80 font-mono">(Disclaimer)</span>
        </button>
      ) : (
        /* Banner Variant at top of article body */
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs font-naskh text-amber-950">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              i
            </span>
            <p className="line-clamp-1 sm:line-clamp-none text-stone-700 text-[11px] sm:text-xs">
              <strong className="text-amber-900">وضاحتی نوٹ:</strong> یہ مضمون متعلقہ مصنف کے ذاتی افکار و تحقیق پر مبنی ہے۔ ویب سائٹ اس کی کسی قانونی یا غیر قانونی ذمہ دار نہیں۔
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            مکمل وضاحت پڑھیں
          </button>
        </div>
      )}

      {/* Disclaimer Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          dir="rtl"
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 font-naskh space-y-5 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-linear-to-r from-amber-500 via-emerald-600 to-teal-700" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 pt-1 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                  <Scale className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    علمی، فکری و قانونی وضاحتی بیان
                  </h3>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Official Publishing & Legal Disclaimer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="بند کریں"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Specific Reference */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>مضمون:</span>
                <span className="font-bold text-stone-800 truncate">{article.title}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                <span>اصل مصنف / مقرر:</span>
                <strong className="text-stone-900">{article.author.name}</strong>
                <span className="text-stone-400">({article.author.role})</span>
              </div>
            </div>

            {/* Core Legal & Non-Legal Disclaimer Body */}
            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed text-justify">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  <strong>ذاتی افکار و تحقیق:</strong> یہ مضمون / صوتی مقالہ حال ہی میں شائع کیا گیا ہے۔ اس میں پیش کردہ تمام دلائل، افکار، تعبیرات، استدلال اور اندازِ تخاطب کلی طور پر اس کے اصل مصنف / مقرر کی ذاتی فکری کاوش ہیں۔
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  <strong>عدمِ ذمہ داری (قانونی و غیر قانونی):</strong> یہ ویب سائٹ (فکر و قلم)، اس کے مدیران اور منتظمین اس تحریر کے مندرجات، اظہارِ رائے، یا پیش کش کے کسی بھی پہلو کی کسی بھی نوعیت کی قانونی (Legally) یا غیر قانونی / روایتی (Non-legally) ذمہ داری قبول نہیں کرتے۔
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  <strong>علمی پلیٹ فارم کا مقصد:</strong> اس اشاعت کا مقصد محض سنجیدہ علمی تحقیق، متوازن فکری مکالمے اور تاریخی و فقہی نصوص کو دیانت داری کے ساتھ محفوظ رکھنا ہے، اور یہ کسی مخصوص مسلکی یا قانونی فیصلے کی توثیق نہیں ہے۔
                </p>
              </div>
            </div>

            {/* English Short Clause for Legal Clarity */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 font-sans text-[11px] text-stone-500 leading-normal text-left" dir="ltr">
              <span className="font-semibold text-stone-700 block mb-0.5">Legal Notice:</span>
              The views, arguments, and opinions expressed in this article are solely those of the original author and do not represent the platform. This website assumes no legal or non-legal liability or responsibility for any statements, presentations, or consequences arising therefrom.
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
              >
                سمجھ لیا اور متفق ہیں (Close Disclaimer)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
