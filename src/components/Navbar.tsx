import React, { useState } from 'react';
import { BookOpen, Bookmark, Type, Menu, X, Search, Sparkles } from 'lucide-react';
import { ARTICLES_CATEGORIES } from '../data/articlesData';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarkedCount: number;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  isArticleView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  bookmarkedCount,
  showBookmarksOnly,
  onToggleBookmarksOnly,
  onOpenSettings,
  onGoHome,
  isArticleView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top micro bar for branding & stats */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 font-naskh border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-200 font-semibold">فکر و قلم – اردو جرنل آف اسلامک ریسرچ و مقالات</span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="hidden sm:inline text-stone-400">تحقیقی، تاریخی و فقہی مباحث کا مستند ذخیرہ</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span className="hover:text-emerald-400 transition-colors cursor-pointer" onClick={onOpenSettings}>
              رسم الخط: نستعلیق / نسخ
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">تاریخ: 2026ء</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-700 to-teal-900 flex items-center justify-center text-white shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-nastaliq">فکر و قلم</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-naskh">
                مضامین پورٹل
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-naskh leading-tight">
              جامع اردو مضامین، تحقیقی مقالات و صوتی ٹرانسکرپٹ
            </p>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center gap-1 font-naskh text-sm">
          {ARTICLES_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (isArticleView) onGoHome();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === cat.id && !isArticleView
                  ? 'bg-emerald-800 text-white font-medium shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Bookmarks Toggle */}
          <button
            onClick={onToggleBookmarksOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-naskh transition-colors ${
              showBookmarksOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title="محفوظ شدہ مضامین"
          >
            <Bookmark className={`w-4 h-4 ${bookmarkedCount > 0 ? 'text-amber-600 fill-amber-500' : ''}`} />
            <span className="hidden sm:inline">محفوظ</span>
            <span className="bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded-full text-xs font-mono">
              {bookmarkedCount}
            </span>
          </button>

          {/* Typography Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-naskh transition-colors"
            title="فونٹ اور لے آؤٹ سیٹنگز"
          >
            <Type className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline">فونٹ</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-4 font-naskh space-y-3">
          <div className="text-xs font-bold text-stone-400 mb-1">مضامین کے زمرہ جات:</div>
          <div className="grid grid-cols-2 gap-2">
            {ARTICLES_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                  if (isArticleView) onGoHome();
                }}
                className={`text-right p-2 rounded-lg text-xs transition-colors ${
                  activeCategory === cat.id && !isArticleView
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
