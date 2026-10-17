import React, { useEffect, useState } from 'react';
import { Article, ARTICLES } from '../data/articlesData';
import { TranscriptArticleSection } from './TranscriptArticleSection';
import {
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  Printer,
  Copy,
  Check,
  ChevronLeft,
  BookOpen,
  Sparkles,
  ArrowUp
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onSelectRelatedArticle: (art: Article) => void;
  fontSize: number;
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  fontFamily: 'nastaliq' | 'naskh';
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSelectRelatedArticle,
  fontSize,
  lineSpacing,
  fontFamily,
  isBookmarked,
  onToggleBookmark
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // SEO document title and scroll listener
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${article.title} | فکر و قلم`;

    // Dynamic canonical & meta description update
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary);
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = originalTitle;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [article]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedArticles = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);
  const fallbackRelated = ARTICLES.filter(a => a.id !== article.id).slice(0, 2);
  const displayedRelated = relatedArticles.length > 0 ? relatedArticles : fallbackRelated;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-naskh">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-50">
        <div
          className="h-full bg-emerald-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6 font-naskh">
        <button
          onClick={onBack}
          className="hover:text-emerald-800 transition-colors flex items-center gap-1 font-semibold"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>تمام مضامین</span>
        </button>
        <span>/</span>
        <span className="text-stone-600 font-medium">{article.category}</span>
        <span>/</span>
        <span className="text-stone-800 truncate max-w-xs font-semibold">{article.title}</span>
      </nav>

      {/* Article Header Card */}
      <header className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs mb-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              {article.category}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>خصوصی و بنیادی مقالہ</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
              }`}
              title="مقالہ محفوظ کریں"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'محفوظ ہے' : 'محفوظ کریں'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="مقالہ شیئر کریں"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'لنک کاپی ہو گیا!' : 'شیئر کریں'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="پرنٹ کریں"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">پرنٹ</span>
            </button>
          </div>
        </div>

        {/* Main Title */}
        <h1
          className={`font-bold text-stone-950 leading-snug ${
            fontFamily === 'nastaliq' ? 'font-nastaliq text-2xl sm:text-3xl lg:text-4xl' : 'font-naskh text-2xl sm:text-3xl'
          }`}
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-naskh">
          {article.subtitle}
        </p>

        {/* Metadata row */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-500 font-naskh">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              {article.author.avatar}
            </div>
            <div>
              <div className="font-bold text-stone-900">{article.author.name}</div>
              <div className="text-xs text-stone-500">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-stone-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} منٹ مطالعہ</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 font-naskh">
          {article.tags.map(t => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      </header>

      {/* Article Content */}
      <main className="space-y-8">
        {article.isTranscriptArticle ? (
          // Transcript interactive section
          <TranscriptArticleSection
            fontSize={fontSize}
            lineSpacing={lineSpacing}
            fontFamily={fontFamily}
          />
        ) : (
          // Standard Markdown Article Content
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div
              className={`text-stone-800 whitespace-pre-line text-justify ${
                fontFamily === 'nastaliq' ? 'font-nastaliq' : 'font-naskh'
              } ${
                lineSpacing === 'normal'
                  ? 'leading-normal'
                  : lineSpacing === 'relaxed'
                  ? 'leading-[2.4]'
                  : 'leading-[2.8]'
              }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {article.content}
            </div>
          </div>
        )}

        {/* Author Bio Card */}
        <div className="bg-stone-100/80 rounded-2xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 font-naskh">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            {article.author.avatar}
          </div>
          <div className="space-y-1 text-center sm:text-right">
            <div className="text-xs text-emerald-800 font-bold">مقالہ نگار / مقرر:</div>
            <h4 className="text-lg font-bold text-stone-900">{article.author.name}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{article.author.role}</p>
          </div>
        </div>

        {/* Related Articles Section */}
        <section className="space-y-4 pt-6 border-t border-stone-200 font-naskh">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              متعلقہ و مزید اہم مقالات
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>تمام مضامین دیکھیں</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedRelated.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectRelatedArticle(rel)}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-400 cursor-pointer transition-all shadow-xs space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                    {rel.category}
                  </span>
                  <span>{rel.readTimeMinutes} منٹ</span>
                </div>
                <h4 className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {rel.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-emerald-800 text-white shadow-lg hover:bg-emerald-900 transition-transform active:scale-95"
          title="اوپر جائیں"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
