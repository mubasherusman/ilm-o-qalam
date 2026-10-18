import React, { useState, useRef } from 'react';
import {
  TRANSCRIPT_SECTIONS,
  HADITH_REFERENCES,
  FULL_TRANSCRIPT_URDU,
  ArticleSection
} from '../data/transcriptionData';
import {
  Copy,
  Check,
  Download,
  Printer,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  BookOpen,
  FileText
} from 'lucide-react';

interface TranscriptArticleSectionProps {
  fontSize: number;
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  fontFamily: 'nastaliq' | 'naskh';
}

export const TranscriptArticleSection: React.FC<TranscriptArticleSectionProps> = ({
  fontSize,
  lineSpacing,
  fontFamily
}) => {
  const [viewMode, setViewMode] = useState<'chapters' | 'continuous' | 'references'>('chapters');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedSecIds, setBookmarkedSecIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const downloadArticle = () => {
    const element = document.createElement('a');
    const header = `تحقیقی مقالہ: مسئلہ ارسال الیدین اور وضع الیدین کی شرعی حیثیت
کتبِ احادیث، فقہ مالکی اور آثارِ سلف کی روشنی میں تحقیقی و اسنادی مطالعہ
======================================================\n\n`;
    const file = new Blob([header + FULL_TRANSCRIPT_URDU], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Article_Irsal_al_Yadayn.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedSecIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredSections = TRANSCRIPT_SECTIONS.filter(sec => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sec.text.toLowerCase().includes(q) ||
        sec.title.toLowerCase().includes(q) ||
        sec.keyPoints?.some(kp => kp.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Editorial Action Bar (Clean Essay Style, replacing audio player) */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-naskh">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">تحقیقی مقالہ</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 font-mono">
                {TRANSCRIPT_SECTIONS.length} ابواب
              </span>
            </div>
            <p className="text-xs text-stone-400">
              احادیث و آثارِ صحابہ کی روشنی میں باقاعدہ ابواب وار فکری مطالعہ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <button
            onClick={() => copyText(FULL_TRANSCRIPT_URDU, 'full')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
            title="مکمل مقالہ کاپی کریں"
          >
            {copiedId === 'full' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedId === 'full' ? 'کاپی ہو گیا!' : 'مکمل مقالہ کاپی'}</span>
          </button>

          <button
            onClick={downloadArticle}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
            title="ٹیکسٹ فائل ڈاؤنلوڈ کریں"
          >
            <Download className="w-4 h-4" />
            <span>ڈاؤنلوڈ</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
            title="مقالہ پرنٹ کریں"
          >
            <Printer className="w-4 h-4" />
            <span>پرنٹ</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher & In-article search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-stone-100 p-2.5 rounded-xl font-naskh">
        <div className="flex items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setViewMode('chapters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'chapters'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            ابواب وار مطالعہ ({TRANSCRIPT_SECTIONS.length} ابواب)
          </button>
          <button
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            مسلسل مطالعہ (مضمون موڈ)
          </button>
          <button
            onClick={() => setViewMode('references')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'references'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            احادیث و فقہی مراجع ({HADITH_REFERENCES.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="اس مقالے کے ابواب میں تلاش کریں..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg pr-8 pl-3 py-1 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Chapters View */}
      {viewMode === 'chapters' && (
        <div className="space-y-6">
          {filteredSections.map(sec => {
            const isBookmarked = bookmarkedSecIds.includes(sec.id);

            return (
              <section
                key={sec.id}
                ref={el => {
                  sectionRefs.current[sec.id] = el;
                }}
                className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all duration-300 overflow-hidden shadow-xs"
              >
                {/* Heading Bar */}
                <div className="bg-stone-50/90 border-b border-stone-200/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3 font-naskh">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold font-mono">
                      باب {sec.chapterNumber}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">
                      {sec.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(sec.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'text-stone-400 hover:text-stone-600 border-transparent hover:bg-stone-100'
                      }`}
                      title={isBookmarked ? 'محفوظ کردہ سے ہٹائیں' : 'یہ باب محفوظ کریں'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => copyText(`[باب ${sec.chapterNumber}: ${sec.title}]\n${sec.text}`, sec.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="یہ باب کاپی کریں"
                    >
                      {copiedId === sec.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-7 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                    باب {sec.chapterNumber}: {sec.title}
                  </h3>

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
                    {sec.text}
                  </div>

                  {/* Key Takeaways */}
                  {sec.keyPoints && sec.keyPoints.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-100 bg-emerald-50/40 rounded-xl p-3.5 font-naskh text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>کلیدی نکات و خلاصہ:</span>
                      </div>
                      <ul className="space-y-1 text-stone-700 list-disc list-inside">
                        {sec.keyPoints.map((pt, i) => (
                          <li key={i} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Continuous Reading View (Full Essay Flow) */}
      {viewMode === 'continuous' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div
            className={`space-y-8 text-stone-800 ${
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
            {TRANSCRIPT_SECTIONS.map(sec => (
              <div key={sec.id} className="relative pb-6 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-2 mb-2 font-naskh text-xs text-stone-500">
                  <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">
                    باب {sec.chapterNumber}
                  </span>
                  <span className="font-bold text-stone-900">{sec.title}</span>
                </div>
                <p className="whitespace-pre-line text-justify">{sec.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hadith References View */}
      {viewMode === 'references' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HADITH_REFERENCES.map(ref => (
            <div
              key={ref.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2.5 font-naskh">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold">
                    {ref.book}
                  </span>
                  {ref.hadithNumber && <span className="text-stone-500 font-mono">{ref.hadithNumber}</span>}
                </div>
                <h4 className="text-base font-bold text-stone-900">{ref.title}</h4>
                {ref.arabicText && (
                  <div className="bg-stone-50 p-2.5 rounded-lg border text-sm text-emerald-950 font-semibold leading-relaxed">
                    {ref.arabicText}
                  </div>
                )}
                <p className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-bold">اردو مفہوم: </span>
                  {ref.urduTranslation}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t text-[11px] text-stone-500 font-naskh">
                <span className="font-bold text-emerald-800">علمی نکتہ: </span>
                {ref.significance}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
