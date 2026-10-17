import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailView } from './components/ArticleDetailView';
import { Footer } from './components/Footer';
import { ARTICLES, Article, ARTICLES_CATEGORIES } from './data/articlesData';
import {
  Sliders,
  Type,
  X,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function App() {
  // Navigation & Search State
  const [articlesList, setArticlesList] = useState<Article[]>(ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/article\/([^/?]+)/);
      if (match) {
        const slug = match[1];
        return ARTICLES.find(a => a.slug === slug || a.id === slug) || null;
      }
    }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Fetch dynamic updates from JSON files / API
  useEffect(() => {
    let mounted = true;
    import('./data/articlesData').then(({ fetchArticlesFromJSON }) => {
      fetchArticlesFromJSON().then(fetched => {
        if (mounted && fetched && fetched.length > 0) {
          setArticlesList(fetched);
        }
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/article\/([^/?]+)/);
      if (match) {
        const slug = match[1];
        const found = articlesList.find(a => a.slug === slug || a.id === slug);
        setSelectedArticle(found || null);
      } else {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articlesList]);

  // Bookmarking with local persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fikr_qalam_bookmarks');
      return saved ? JSON.parse(saved) : ['art-01']; // default bookmark flagship article
    } catch {
      return ['art-01'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fikr_qalam_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Typography Settings
  const [fontFamily, setFontFamily] = useState<'nastaliq' | 'naskh'>('nastaliq');
  const [fontSize, setFontSize] = useState<number>(20);
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Tag selection filter
  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(tag);
    if (selectedArticle) {
      setSelectedArticle(null);
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articlesList.filter(art => {
      // Category filter
      if (activeCategory !== 'all' && art.category !== activeCategory) {
        return false;
      }
      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedIds.includes(art.id)) {
        return false;
      }
      // Search / Tag filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inSubtitle = art.subtitle.toLowerCase().includes(q);
        const inSummary = art.summary.toLowerCase().includes(q);
        const inAuthor = art.author.name.toLowerCase().includes(q);
        const inCategory = art.category.toLowerCase().includes(q);
        const inTags = art.tags.some(t => t.toLowerCase().includes(q));
        const inContent = art.content?.toLowerCase().includes(q);
        return inTitle || inSubtitle || inSummary || inAuthor || inCategory || inTags || inContent;
      }
      return true;
    });
  }, [articlesList, activeCategory, showBookmarksOnly, bookmarkedIds, searchQuery]);

  return (
    <div
      className={`min-h-screen bg-stone-50 text-stone-900 ${
        fontFamily === 'nastaliq' ? 'font-nastaliq' : 'font-naskh'
      }`}
      dir="rtl"
    >
      {/* Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat);
          if (selectedArticle) {
            setSelectedArticle(null);
            window.history.pushState(null, '', '/');
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookmarkedCount={bookmarkedIds.length}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => setShowBookmarksOnly(!showBookmarksOnly)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onGoHome={() => {
          setSelectedArticle(null);
          setActiveCategory('all');
          setSearchQuery('');
          setSelectedTag(null);
          setShowBookmarksOnly(false);
          window.history.pushState(null, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isArticleView={!!selectedArticle}
      />

      {/* Main Body */}
      {selectedArticle ? (
        /* Detailed Article View */
        <ArticleDetailView
          article={selectedArticle}
          onBack={() => {
            setSelectedArticle(null);
            window.history.pushState(null, '', '/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectRelatedArticle={art => {
            setSelectedArticle(art);
            window.history.pushState(null, '', `/article/${art.slug}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          fontSize={fontSize}
          lineSpacing={lineSpacing}
          fontFamily={fontFamily}
          isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        /* Home Articles Grid View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Hero Banner */}
          <HeroBanner
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTag={handleSelectTag}
            totalArticles={ARTICLES.length}
          />

          {/* Category Filter Pills & Results Header */}
          <section className="mb-8 font-naskh">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {ARTICLES_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {cat.label}
                    {cat.id === 'all' && (
                      <span className="mr-1.5 px-1.5 py-0.2 rounded-full text-[11px] bg-emerald-900/40 text-emerald-100">
                        {ARTICLES.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Status indicator */}
              <div className="text-xs text-stone-500 flex items-center gap-2">
                <span>
                  مجموعی مضامین: <strong className="text-stone-900 font-mono">{filteredArticles.length}</strong>
                </span>
                {(searchQuery || activeCategory !== 'all' || showBookmarksOnly) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setSelectedTag(null);
                      setShowBookmarksOnly(false);
                    }}
                    className="text-emerald-800 hover:underline font-bold mr-2"
                  >
                    (فلٹرز ختم کریں)
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Articles Listing Grid */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto font-naskh space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">کوئی مضمون نہیں ملا</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                آپ کے تلاش کردہ الفاظ یا زمرے میں فی الوقت کوئی تحریر موجود نہیں ہے۔ براہِ کرم الفاظ بدل کر کوشش کریں۔
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setShowBookmarksOnly(false);
                }}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                تمام مضامین دیکھیں
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelectArticle={art => {
                    setSelectedArticle(art);
                    window.history.pushState(null, '', `/article/${art.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isBookmarked={bookmarkedIds.includes(article.id)}
                  onToggleBookmark={toggleBookmark}
                  onSelectTag={handleSelectTag}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={cat => {
          setActiveCategory(cat);
          if (selectedArticle) setSelectedArticle(null);
        }}
        onGoHome={() => {
          setSelectedArticle(null);
          setActiveCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Typography & Layout Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 font-naskh">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <Sliders className="w-5 h-5 text-emerald-800" />
                <span>فونٹ اور لے آؤٹ ترتیبات</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Font Family selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  رسم الخط (اردو فونٹ):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFontFamily('nastaliq')}
                    className={`py-2 px-3 rounded-xl border text-sm font-nastaliq transition-all ${
                      fontFamily === 'nastaliq'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    خطِ نستعلیق (روایتی)
                  </button>

                  <button
                    onClick={() => setFontFamily('naskh')}
                    className={`py-2 px-3 rounded-xl border text-sm font-naskh transition-all ${
                      fontFamily === 'naskh'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    خطِ نسخ / جدید
                  </button>
                </div>
              </div>

              {/* Font Size slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>فونٹ سائز:</span>
                  <span className="font-mono text-emerald-800 font-bold">{fontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">چھوٹا</span>
                  <input
                    type="range"
                    min="16"
                    max="28"
                    step="1"
                    value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <span className="text-base font-bold text-stone-700">بڑا</span>
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  سطروں کے درمیان کشادگی:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'عام' },
                    { id: 'relaxed', label: 'کشادہ' },
                    { id: 'loose', label: 'بہت کشادہ' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setLineSpacing(s.id as any)}
                      className={`py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        lineSpacing === s.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Sample */}
              <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] text-stone-400 block mb-1">نمونہ عبارت:</span>
                <p
                  className={`text-stone-900 ${fontFamily === 'nastaliq' ? 'font-nastaliq' : 'font-naskh'}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  نہ میں وہابی، نہ میں بابی، میں ہوں مسلم علمی کتابی!
                </p>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors"
              >
                ترتیبات لاگو کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
