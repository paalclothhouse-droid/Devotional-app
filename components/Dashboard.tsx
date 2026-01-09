import React, { useState, useEffect } from 'react';
import { Hukamnama, UserStats } from '../types.ts';
import { getDailyHukamnama } from '../services/geminiService.ts';
import { translations, Language } from '../translations.ts';

interface DashboardProps {
  stats: UserStats;
  setActiveTab: (tab: string) => void;
  lang: Language;
  onWhatsAppClick: () => void;
  onSimranIncrement: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, lang, onWhatsAppClick, onSimranIncrement }) => {
  const [hukamnama, setHukamnama] = useState<Hukamnama | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  
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

  const scheduleData = [
    { id: 1, title: 'Amrit Vela (Japji Sahib)', time: '03:30 AM', icon: 'fa-sun' },
    { id: 2, title: 'Evening (Rehrass Sahib)', time: '06:00 PM', icon: 'fa-cloud-moon' },
    { id: 3, title: 'Night (Sohila Sahib)', time: '09:30 PM', icon: 'fa-moon' }
  ];

  const gridItems = [
    { id: 'schedule', icon: 'fa-calendar-days', label: 'Satsang Schedule', color: 'text-purple-400', action: () => setShowScheduleModal(true) },
    { id: 'media', icon: 'fa-circle-play', label: 'Media & Kirtan', color: 'text-blue-400', tab: 'media' },
    { id: 'nitnem', icon: 'fa-feather', label: 'Bhagti Jaap', color: 'text-pink-400', tab: 'nitnem' },
    { id: 'library', icon: 'fa-book', label: 'Digital Books', color: 'text-indigo-400', tab: 'media' },
    { id: 'enquiry', icon: 'fa-comment-dots', label: 'Support & Help', color: 'text-purple-300', action: () => setShowEnquiryModal(true) },
    { id: 'whatsapp', icon: 'fa-whatsapp', label: 'Sangati Group', color: 'text-green-400', action: onWhatsAppClick },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-60 pt-4 space-y-6 animate-in fade-in duration-700">
      
      {/* Hukamnama Card - Centered on official Darbar Sahib update */}
      <div className="card-main p-8 border-yellow-500/40 bg-gradient-to-b from-[#1a1f2c] to-[#0a0e17] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <i className="fa-solid fa-khanda text-8xl text-yellow-500"></i>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-yellow-500 tracking-tight uppercase">Mukhwak</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sri Darbar Sahib, Amritsar</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-purple-accent font-black uppercase tracking-widest block">{hukamnama?.date || new Date().toLocaleDateString('en-GB')}</span>
            <span className="text-[8px] text-gray-600 font-bold uppercase">Daily Guidance</span>
          </div>
        </div>
        
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-purple-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="animate-pulse text-gray-600 font-black uppercase text-[10px] tracking-[0.2em]">Awaiting Divine Words...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl leading-[1.8] text-gray-100 font-medium text-center">
                {hukamnama?.text}
              </p>
            </div>
            
            <div className="h-px w-20 bg-yellow-500/20 mx-auto"></div>
            
            <p className="text-xs text-gray-400 text-center italic leading-relaxed px-4">
              "{hukamnama?.translation}"
            </p>
            
            <div className="pt-6 text-center border-t border-white/5">
              <span className="text-[10px] font-black text-yellow-500/80 uppercase tracking-[0.2em]">
                {hukamnama?.source}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats & Jaap Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-main p-6 flex items-center justify-between bg-[#1a1f2c] border-white/5 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">Paath Streak</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Persistence</p>
          </div>
          <div className="text-center">
            <i className="fa-solid fa-fire text-4xl text-orange-500 mb-1"></i>
            <div className="text-2xl font-black text-yellow-500 leading-none">{stats.paathStreak}</div>
          </div>
        </div>

        <button 
          onClick={onSimranIncrement}
          className="card-main p-6 flex items-center justify-between bg-[#1a1f2c] border-purple-accent/30 shadow-xl active:scale-95 transition-all group"
        >
          <div className="space-y-1 text-left">
            <h4 className="text-lg font-bold text-white">Simran Jaap</h4>
            <p className="text-[9px] text-purple-accent font-bold uppercase tracking-widest">Count: {stats.simranCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-accent/10 flex items-center justify-center text-purple-accent text-xl group-active:scale-110 transition-transform">
            <i className="fa-solid fa-fingerprint"></i>
          </div>
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        {gridItems.map((item, idx) => (
          <button 
            key={idx}
            onClick={() => item.action ? item.action() : setActiveTab(item.tab || 'home')}
            className="card-main p-5 flex flex-col items-start gap-4 bg-[#1a1f2c] border-white/5 text-left hover:bg-[#232a3b] transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl ${item.color} group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="text-xs font-bold text-gray-200">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Modals for Schedule and Enquiry */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowScheduleModal(false)}>
          <div className="card-main p-8 max-w-sm w-full space-y-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-white uppercase text-center">Nitnem Timings</h3>
            <div className="space-y-3">
              {scheduleData.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <i className={`fa-solid ${s.icon} text-yellow-500`}></i>
                    <span className="text-xs font-bold text-gray-300">{s.title}</span>
                  </div>
                  <span className="text-[10px] font-black text-purple-accent">{s.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowScheduleModal(false)} className="w-full bg-purple-accent py-4 rounded-xl font-black uppercase text-[10px]">Close</button>
          </div>
        </div>
      )}

      {showEnquiryModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowEnquiryModal(false)}>
          <div className="card-main p-8 max-w-sm w-full space-y-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-purple-accent/10 rounded-full flex items-center justify-center mx-auto text-purple-accent text-2xl"><i className="fa-solid fa-headset"></i></div>
            <h3 className="text-xl font-black text-white uppercase">Sangat Support</h3>
            <p className="text-xs text-gray-400">Need help with Nitnem, Santhya, or app features?</p>
            <div className="space-y-2">
              <a href="tel:+918194918713" className="block w-full bg-[#0a0e17] p-4 rounded-xl border border-white/5 text-sm font-bold text-white tracking-widest">+91 81949 18713</a>
              <a href="mailto:singhanterjog@gmail.com" className="block w-full bg-[#0a0e17] p-4 rounded-xl border border-white/5 text-xs font-bold text-purple-accent">singhanterjog@gmail.com</a>
            </div>
            <button onClick={() => setShowEnquiryModal(false)} className="w-full bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] text-gray-500">Back</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;