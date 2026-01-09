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

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('app_global_config');
    return saved ? JSON.parse(saved) : {
      supportPhone: '+91 81949 18713',
      supportEmail: 'singhanterjog@gmail.com',
      warmGreeting: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. How can we assist you on your spiritual journey today?'
    };
  });

  useEffect(() => {
    const syncConfig = () => {
      const saved = localStorage.getItem('app_global_config');
      if (saved) setConfig(JSON.parse(saved));
    };
    window.addEventListener('storage', syncConfig);
    
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
    return () => window.removeEventListener('storage', syncConfig);
  }, []);

  const toggleReminder = (id: number) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(id)) {
      newReminders.delete(id);
    } else {
      newReminders.add(id);
    }
    setReminders(newReminders);
  };

  const scheduleData = [
    { id: 1, title: 'Amrit Vela (Japji Sahib)', time: '03:30 AM', icon: 'fa-sun', desc: 'Daily Morning Prayers' },
    { id: 2, title: 'Evening (Rehrass Sahib)', time: '06:00 PM', icon: 'fa-cloud-moon', desc: 'Daily Sunset Prayers' },
    { id: 3, title: 'Night (Sohila Sahib)', time: '09:30 PM', icon: 'fa-moon', desc: 'Daily Bedtime Prayers' }
  ];

  const gridItems = [
    { id: 'schedule', icon: 'fa-calendar-days', label: 'Satsang Schedule', color: 'text-purple-400', action: () => setShowScheduleModal(true) },
    { id: 'media', icon: 'fa-circle-play', label: 'Media & Kirtan', color: 'text-blue-400', tab: 'media' },
    { id: 'nitnem', icon: 'fa-feather', label: 'Bhagti Jaap', color: 'text-pink-400', tab: 'nitnem' },
    { id: 'library', icon: 'fa-book', label: 'Digital Books/PDFs', color: 'text-indigo-400', tab: 'media' },
    { id: 'enquiry', icon: 'fa-comment-dots', label: 'SS Location & Enquiry', color: 'text-purple-300', action: () => setShowEnquiryModal(true) },
    { id: 'whatsapp', icon: 'fa-whatsapp', label: 'Whatsapp Join', color: 'text-green-400', action: onWhatsAppClick },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-60 pt-4 space-y-6 animate-in fade-in duration-700">
      
      {/* Schedule Portal Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="card-main p-8 max-w-sm w-full space-y-8 bg-[#1a1f2c] border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-accent to-blue-500"></div>
             <div className="text-center space-y-2">
                <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Nitnem Schedule</h3>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Daily Timings</p>
             </div>
             <div className="space-y-3">
                {scheduleData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-yellow-500">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">{item.title}</h4>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">{item.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleReminder(item.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${reminders.has(item.id) ? 'bg-purple-accent text-white' : 'bg-white/5 text-gray-700'}`}
                    >
                      <i className={`fa-solid ${reminders.has(item.id) ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                    </button>
                  </div>
                ))}
             </div>
             <button onClick={() => setShowScheduleModal(false)} className="w-full bg-purple-accent py-4 rounded-xl text-[10px] font-black uppercase text-white shadow-xl">Close Schedule</button>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <div className="card-main p-8 max-w-sm w-full space-y-8 text-center bg-[#1a1f2c] border-white/10 shadow-2xl">
              <div className="w-16 h-16 bg-purple-accent/20 rounded-2xl flex items-center justify-center mx-auto text-purple-accent text-2xl">
                 <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="space-y-4">
                 <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Support & Location</h3>
                 <p className="text-xs text-gray-400 leading-relaxed font-medium italic">"{config.warmGreeting || 'How can we assist you today?'}"</p>
              </div>
              <div className="space-y-3">
                 <a href={`tel:${config.supportPhone}`} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-xl border border-white/5 hover:border-purple-accent/40 transition-all">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Call Us</span>
                    <span className="text-sm font-bold text-white">{config.supportPhone}</span>
                 </a>
                 <a href={`mailto:${config.supportEmail}`} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-xl border border-white/5 hover:border-purple-accent/40 transition-all">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email</span>
                    <span className="text-sm font-bold text-white lowercase tracking-tighter">{config.supportEmail}</span>
                 </a>
              </div>
              <button onClick={() => setShowEnquiryModal(false)} className="w-full bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Close Portal</button>
           </div>
        </div>
      )}

      {/* Hukamnama Card */}
      <div className="card-main p-6 border-yellow-500/30 bg-[#1a1f2c] relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-purple-accent">Today's Hukamnama</h3>
          <span className="text-[10px] text-gray-500 font-bold">{hukamnama?.date || '07/01/2026'}</span>
        </div>
        
        {loading ? (
          <div className="py-10 text-center animate-pulse text-gray-600 font-bold uppercase text-[10px]">Awaiting Divine Words...</div>
        ) : (
          <div className="space-y-6">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-100 font-medium text-center italic">
              {hukamnama?.text}
            </p>
            <p className="text-xs text-gray-400 text-center italic">
              ({hukamnama?.translation})
            </p>
            <div className="pt-4 text-center border-t border-white/5">
              <span className="text-[10px] font-bold text-purple-accent/60 uppercase">
                {hukamnama?.source}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats & Jaap Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="card-main p-6 flex items-center justify-between bg-[#1a1f2c] border-white/5 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">Paath Streak</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Consistency</p>
          </div>
          <div className="text-center">
            <i className="fa-solid fa-fire text-4xl text-orange-500 mb-1"></i>
            <div className="text-2xl font-black text-yellow-500 leading-none">{stats.paathStreak}</div>
          </div>
        </div>

        {/* Simran Jaap Button/Card */}
        <button 
          onClick={onSimranIncrement}
          className="card-main p-6 flex items-center justify-between bg-[#1a1f2c] border-purple-accent/30 shadow-xl active:scale-95 transition-all group"
        >
          <div className="space-y-1 text-left">
            <h4 className="text-lg font-bold text-white">Simran Jaap</h4>
            <p className="text-[9px] text-purple-accent font-bold uppercase tracking-widest">Tap to Chant</p>
          </div>
          <div className="text-center relative">
            <div className="w-12 h-12 rounded-full border-2 border-purple-accent/40 flex items-center justify-center group-active:scale-110 transition-transform">
              <span className="text-xl font-black text-purple-accent">{stats.simranCount}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        {gridItems.map((item, idx) => (
          <button 
            key={idx}
            onClick={() => item.action ? item.action() : setActiveTab(item.tab)}
            className="card-main p-5 flex flex-col items-start gap-4 bg-[#1a1f2c] border-white/5 text-left hover:bg-[#232a3b] transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl ${item.color} group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="text-xs font-bold text-gray-200">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;