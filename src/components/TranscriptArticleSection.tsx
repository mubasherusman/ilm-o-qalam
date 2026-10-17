import React, { useState, useEffect, useRef } from 'react';
import {
  TRANSCRIPT_SECTIONS,
  HADITH_REFERENCES,
  FULL_TRANSCRIPT_URDU,
  TranscriptSection
} from '../data/transcriptionData';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Copy,
  Check,
  Download,
  Printer,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  User,
  BookOpen,
  ListFilter,
  Sparkles,
  ChevronDown,
  ChevronUp
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
  const [selectedSpeaker, setSelectedSpeaker] = useState<'all' | 'سائل' | 'انجینئر محمد علی مرزا'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-01');
  const [bookmarkedSecIds, setBookmarkedSecIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio simulator state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const totalSeconds = 2557; // 42:37

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Audio ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalSeconds]);

  // Sync active section with player
  useEffect(() => {
    if (isPlaying) {
      const currentSec = TRANSCRIPT_SECTIONS.find(
        s => currentSeconds >= s.startSeconds && currentSeconds <= s.endSeconds
      );
      if (currentSec && currentSec.id !== activeSectionId) {
        setActiveSectionId(currentSec.id);
        const el = sectionRefs.current[currentSec.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [currentSeconds, isPlaying, activeSectionId]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (secs: number, secId?: string) => {
    setCurrentSeconds(secs);
    if (secId) {
      setActiveSectionId(secId);
      const el = sectionRefs.current[secId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const header = `مکمل اردو صوتی ٹرانسکرپٹ
موضوع: مسئلہ ارسال الیدین و وضع الیدین (ہاتھ چھوڑ کر اور باندھ کر نماز پڑھنا)
مقرر: انجینئر محمد علی مرزا
کل دورانیہ: 42 منٹ 37 سیکنڈ
======================================================\n\n`;
    const file = new Blob([header + FULL_TRANSCRIPT_URDU], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Urdu_Transcript_Irsal_al_Yadayn.txt';
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
    if (selectedSpeaker !== 'all' && sec.speaker !== selectedSpeaker) return false;
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
      {/* Audio Player Card */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:p-6 shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center font-bold transition-transform active:scale-95 shrink-0 shadow-lg"
              title={isPlaying ? 'روکیں' : 'آڈیو چلائیں'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentSeconds(0)}
              className="text-stone-400 hover:text-stone-200 p-2 rounded-lg hover:bg-stone-800 transition-colors"
              title="آڈیو شروع سے چلائیں"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-mono text-stone-300">
              <span className="text-emerald-400 font-bold">{formatTime(currentSeconds)}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400">42:37</span>
            </div>

            {/* Speed toggle */}
            <div className="flex items-center bg-stone-800 rounded-lg p-0.5 text-xs font-mono">
              {[1, 1.25, 1.5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded ${
                    playbackSpeed === spd
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 font-naskh text-xs">
            <button
              onClick={() => copyText(FULL_TRANSCRIPT_URDU, 'full')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              {copiedId === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'full' ? 'کاپی ہو گیا!' : 'مکمل ٹرانسکرپٹ کاپی'}</span>
            </button>

            <button
              onClick={downloadTranscript}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤنلوڈ</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ</span>
            </button>
          </div>
        </div>

        {/* Scrubber slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max={totalSeconds}
            value={currentSeconds}
            onChange={e => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-naskh">
            <span className="truncate max-w-md">
              {TRANSCRIPT_SECTIONS.find(
                s => currentSeconds >= s.startSeconds && currentSeconds <= s.endSeconds
              )?.title || 'صوتی گفتگو'}
            </span>
            <span className="font-mono">42 منٹ 37 سیکنڈ</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher & In-transcript search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-stone-100 p-2.5 rounded-xl font-naskh">
        <div className="flex items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setViewMode('chapters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'chapters'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            ابواب وار جائزہ (22 ابواب)
          </button>
          <button
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'continuous'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            مسلسل مطالعہ
          </button>
          <button
            onClick={() => setViewMode('references')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'references'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            احادیث و مراجع ({HADITH_REFERENCES.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="اس صوتی مقالے میں تلاش کریں..."
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
          {filteredSections.map((sec, idx) => {
            const isActive = activeSectionId === sec.id;
            const isBookmarked = bookmarkedSecIds.includes(sec.id);

            return (
              <section
                key={sec.id}
                ref={el => {
                  sectionRefs.current[sec.id] = el;
                }}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                  isActive
                    ? 'border-emerald-500 ring-4 ring-emerald-500/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Heading Bar */}
                <div className="bg-stone-50/90 border-b border-stone-200/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-naskh">
                    <button
                      onClick={() => handleSeek(sec.startSeconds, sec.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-xs font-mono font-bold hover:bg-emerald-700 transition-colors"
                      title="اس باب سے آڈیو سنیں"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{sec.startTime} - {sec.endTime}</span>
                    </button>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-semibold">
                      {sec.speaker}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-naskh">
                    <button
                      onClick={() => toggleBookmark(sec.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'text-stone-400 hover:text-stone-600 border-transparent hover:bg-stone-100'
                      }`}
                      title={isBookmarked ? 'محفوظ کردہ سے ہٹائیں' : 'یہ حصہ محفوظ کریں'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => copyText(`[${sec.startTime}] ${sec.speaker}: ${sec.text}`, sec.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="یہ عبارت کاپی کریں"
                    >
                      {copiedId === sec.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-7 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                    باب {idx + 1}: {sec.title}
                  </h3>

                  <div
                    className={`text-stone-800 whitespace-pre-line text-justify ${
                      lineSpacing === 'normal'
                        ? 'leading-normal'
                        : lineSpacing === 'relaxed'
                        ? 'leading-[2.3]'
                        : 'leading-[2.7]'
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

      {/* Continuous Reading View */}
      {viewMode === 'continuous' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          <div
            className={`space-y-6 text-stone-800 ${
              lineSpacing === 'normal'
                ? 'leading-normal'
                : lineSpacing === 'relaxed'
                ? 'leading-[2.4]'
                : 'leading-[2.8]'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {TRANSCRIPT_SECTIONS.map((sec, idx) => (
              <div key={sec.id} className="relative group p-2 hover:bg-stone-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1.5 font-naskh text-xs text-stone-500">
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    {sec.startTime}
                  </span>
                  <span className="font-bold text-stone-800">{sec.speaker}:</span>
                  <span className="text-stone-500 font-semibold">{sec.title}</span>
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
