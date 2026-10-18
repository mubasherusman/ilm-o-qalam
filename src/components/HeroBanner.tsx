import React from 'react';
import { Search, Sparkles, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTag: (tag: string) => void;
  totalArticles: number;
}

const TRENDING_TAGS = [
  'ارسال الیدین',
  'وضع الیدین',
  'عبد اللہ بن زبیر',
  'سنن ابی داؤد',
  'المدونة الکبرى',
  'فقہ مالکی',
  'اصول حدیث',
  'ابن باز'
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTag,
  totalArticles
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-stone-900 to-teal-950 text-white p-6 sm:p-10 shadow-lg border border-emerald-900/40 mb-10">
      {/* Decorative background glows */}
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-naskh">
          <Sparkles className="w-3.5 h-3.5" />
          <span>علمی، فقہی و تاریخی مضامین کا مستند اردو پورٹل</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight font-nastaliq">
          فکر و قلم – علم و تحقیق کی روشنی
        </h1>

        <p className="text-stone-300 text-sm sm:text-base font-naskh leading-relaxed max-w-2xl mx-auto">
          احادیث و سننِ نبویہ ﷺ، فقہی و تاریخی مباحث، صوتی ٹرانسکرپٹس اور کتبِ سلف کے مستند ماخذ پر مبنی علمی مقالات کا جامع پلیٹ فارم۔
        </p>

        {/* Global Live Search Bar */}
        <div className="max-w-2xl mx-auto relative font-naskh">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-stone-400 absolute right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="کسی بھی موضوع، صحابی، حدیث، فقہی مسئلے یا مصنف کا نام تلاش کریں..."
              className="w-full bg-white text-stone-900 rounded-2xl pr-12 pl-10 py-3.5 text-sm sm:text-base shadow-xl border-2 border-transparent focus:border-emerald-500 focus:outline-hidden placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3.5 p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 text-xs"
                title="تلاش ختم کریں"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-stone-300">
            <span className="text-stone-400 font-bold ml-1">مشہور موضوعات:</span>
            {TRENDING_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-600/40 border border-white/10 hover:border-emerald-400/40 text-stone-200 hover:text-white transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stat badges */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto font-naskh text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="block font-bold text-emerald-400 text-base font-mono">{totalArticles}</span>
            <span className="text-stone-400">جامع مقالات</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="block font-bold text-emerald-400 text-base font-mono">17</span>
            <span className="text-stone-400">تحقیقی ابواب</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="block font-bold text-emerald-400 text-base font-mono">10+</span>
            <span className="text-stone-400">صحابہ و ائمہ کے دلائل</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="block font-bold text-emerald-400 text-base font-mono">100%</span>
            <span className="text-stone-400">مستند کتب و مراجع</span>
          </div>
        </div>
      </div>
    </section>
  );
};
