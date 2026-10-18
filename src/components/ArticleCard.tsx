import React from 'react';
import { Article } from '../data/articlesData';
import { ArticleDisclaimer } from './ArticleDisclaimer';
import { Clock, Bookmark, ArrowLeft, User, Sparkles, BookOpen } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onSelectTag: (tag: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onSelectTag
}) => {
  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        article.featured
          ? 'border-emerald-300/80 ring-2 ring-emerald-500/10 md:col-span-2'
          : 'border-stone-200 hover:border-emerald-300'
      }`}
    >
      {/* Top Banner & Category */}
      <div className="p-5 sm:p-6 pb-2">
        <div className="flex items-center justify-between gap-2 mb-3 font-naskh">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {article.category}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>خصوصی مقالہ</span>
              </span>
            )}
            {article.isTranscriptArticle && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                <BookOpen className="w-3 h-3 text-teal-600" />
                <span>17 ابواب مقالہ</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <ArticleDisclaimer article={article} variant="badge" />
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleBookmark(article.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'text-stone-400 hover:text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              title={isBookmarked ? 'محفوظ کردہ سے ہٹائیں' : 'مقالہ محفوظ کریں'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2
          onClick={() => onSelectArticle(article)}
          className={`cursor-pointer font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2 ${
            article.featured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
          }`}
        >
          {article.title}
        </h2>

        {/* Subtitle / Excerpt */}
        <p className="text-xs sm:text-sm text-stone-500 font-naskh leading-relaxed line-clamp-2 mb-3">
          {article.subtitle}
        </p>

        {/* Summary Excerpt */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      </div>

      {/* Tags */}
      <div className="px-5 sm:px-6 py-2 flex flex-wrap gap-1.5 font-naskh">
        {article.tags.slice(0, 4).map(tag => (
          <button
            key={tag}
            onClick={e => {
              e.stopPropagation();
              onSelectTag(tag);
            }}
            className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Footer Info & Action */}
      <div className="p-5 sm:p-6 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3 font-naskh">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {article.author.avatar}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 leading-tight">
              {article.author.name}
            </div>
            <div className="text-[10px] text-stone-500 flex items-center gap-2">
              <span>{article.publishedDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTimeMinutes} منٹ مطالعہ</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectArticle(article)}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-[-3px] transition-transform"
        >
          <span>مقالہ پڑھیں</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
