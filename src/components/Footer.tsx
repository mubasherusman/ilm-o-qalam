import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import { ARTICLES_CATEGORIES } from '../data/articlesData';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onGoHome }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 font-naskh border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-nastaliq">فکر و قلم</span>
                <p className="text-xs text-stone-400">جامع اردو مضامین، تحقیقی مقالات و صوتی ٹرانسکرپٹ پورٹل</p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              فکر و قلم ایک علمی اور تحقیقی پلیٹ فارم ہے جس کا مقصد قرآن و سنت کے نصوص، ائمہ سلف کے معتبر فقہی آثار اور بین المسالک رواداری کے تقاضوں کے مطابق مضامین، کتابی مباحث اور صوتی ٹرانسکرپٹس کو شفافیت کے ساتھ عام فہم انداز میں پیش کرنا ہے۔
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>تمام مضامین مستند کتبِ احادیث و فقہ کے حوالوں کے ساتھ مصدقہ ہیں</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-stone-800 pb-2">
              اہم زمرہ جات
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {ARTICLES_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    • {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Research & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-stone-800 pb-2">
              علمی منشور و رابطہ
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              ہمارا بنیادی مشن: "مسلم علمی کتابی" سوچ کا فروغ اور تعصب، فرقہ واریت اور یکطرفہ بیانیے سے پاک، اعتدال پسند دینی و سائنسی فکر کی نشر و اشاعت ہے۔
            </p>
            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 text-[11px] text-stone-300">
              <span className="font-bold text-emerald-400 block mb-1">سرچ انجن آپٹیمائزیشن (SEO):</span>
              مکمل اسکیمہ ڈاٹ آرگ (Schema.org) اور اوپن گراف (OpenGraph) معیارات کے عین مطابق ڈیزائن شدہ۔
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026ء فکر و قلم ریسرچ پورٹل۔ جملہ حقوق محفوظ ہیں۔</p>
          <p className="flex items-center gap-1">
            <span>اردو زبان و ادب اور علمی خدمت کے لیے تیار کردہ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
