
import React, { useState, useEffect } from 'react';
import { Hukamnama, UserStats } from '../types.ts';
import { getDailyHukamnama } from '../services/geminiService.ts';
import { translations, Language } from '../translations.ts';

interface DashboardProps {
  stats: UserStats;
  setActiveTab: (tab: string) => void;
  lang: Language;
}

// Added the component implementation and default export to fix "no default export" error.
const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, lang }) => {
  const [hukamnama, setHukamnama] = useState<Hukamnama | null>(null);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const fetchHukamnama = async () => {
      try {
        setLoading(true);
        const data = await getDailyHukamnama();
        setHukamnama(data);
      } catch (err) {
        console.error("Dashboard failed to fetch Hukamnama", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHukamnama();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-44 pt-10 space-y-10 animate-in fade-in duration-700">
      {/* Header Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-main p-6 border-purple-accent/20 bg-purple-accent/[0.02] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{t.day_streak}</p>
            <h3 className="text-3xl font-black text-white italic tracking-tighter">{stats.paathStreak}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-accent/10 flex items-center justify-center text-purple-accent">
            <i className="fa-solid fa-fire text-xl"></i>
          </div>
        </div>
        <div className="card-main p-6 border-yellow-500/20 bg-yellow-500/[0.02] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{t.simran_log}</p>
            <h3 className="text-3xl font-black text-white italic tracking-tighter">{stats.simranCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <i className="fa-solid fa-hands-praying text-xl"></i>
          </div>
        </div>
      </div>

      {/* Hukamnama Section */}
      <div className="card-main p-8 md:p-14 space-y-10 border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0a0e17] relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
           <span className="text-[12rem] font-black text-white italic leading-none">ੴ</span>
        </div>
        
        <div className="text-center space-y-4 relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-accent">{t.daily_hukamnama}</h3>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-purple-accent/50 to-transparent mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-4 animate-pulse relative z-10">
            <i className="fa-solid fa-gear fa-spin text-gray-800 text-3xl mb-2"></i>
            <p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.3em]">{t.awaiting_divine}</p>
          </div>
        ) : (
          <div className="space-y-12 relative z-10">
            <div className="text-center space-y-8">
               <p className="text-2xl md:text-5xl leading-[1.6] text-gray-100 font-medium drop-shadow-2xl">
                 {hukamnama?.text}
               </p>
               <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto"></div>
               <p className="text-xs md:text-sm italic text-gray-400 leading-relaxed font-medium max-w-xl mx-auto">
                 {hukamnama?.translation}
               </p>
            </div>
            <div className="text-center pt-6">
               <span className="bg-[#0a0e17]/60 border border-white/5 px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 backdrop-blur-sm">
                 {hukamnama?.source} • {hukamnama?.date}
               </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Quick Link */}
      <button 
        onClick={() => setActiveTab('nitnem')}
        className="w-full card-main p-8 border-white/5 bg-[#0a0e17]/60 flex items-center justify-between group hover:border-purple-accent/30 transition-all shadow-xl"
      >
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-3xl bg-purple-accent/10 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all duration-500">
              <i className="fa-solid fa-feather-pointed text-xl"></i>
           </div>
           <div className="text-left">
              <h4 className="font-black text-sm text-white">{t.nitnem_progress}</h4>
              <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest mt-1 group-hover:text-gray-400 transition-colors">{t.tap_verify}</p>
           </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-purple-accent transition-all">
           <i className="fa-solid fa-chevron-right"></i>
        </div>
      </button>

      {/* Welcome / Quote */}
      <div className="text-center py-10 opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.8em] text-gray-600">The Light is Within</p>
      </div>
    </div>
  );
};

export default Dashboard;
