
import React, { useState } from 'react';
import { Language, translations } from '../translations.ts';

interface CommunityProps {
  lang: Language;
  onDonateClick?: () => void;
}

const Community: React.FC<CommunityProps> = ({ lang, onDonateClick }) => {
  const t = translations[lang];
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  const toggleReminder = (id: number) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(id)) {
      newReminders.delete(id);
    } else {
      newReminders.add(id);
      alert("Sangat Reminder Set! You'll be notified before the event begins.");
    }
    setReminders(newReminders);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-40 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Power of Sangat</h2>
          <div className="h-1 w-20 bg-purple-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="card-main p-8 bg-gradient-to-br from-[#1a1f2c] to-[#0a0e17] border-white/5 space-y-6 leading-relaxed">
          <p className="text-sm text-gray-300 font-medium">
            In the Sikh tradition, <span className="text-purple-accent font-bold italic">Sangat</span> is more than just a gathering—it is a sacred space where individual souls merge into a collective consciousness. Guru Nanak Dev Ji taught that in the company of the holy, we find the path to liberation. 
          </p>
          <p className="text-sm text-gray-300 font-medium">
            The <span className="text-yellow-500 font-bold italic">Faith Journey App</span> acts as your digital Gurdwara, bringing the spirit of the Khalsa Panth to your pocket. Whether you are in Punjab or New York, you are never alone on your path. Here, we track our Nitnem together, share the wisdom of Katha, and support each other's spiritual growth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-main p-6 text-center space-y-2 border-purple-accent/10">
          <i className="fa-solid fa-earth-americas text-2xl text-purple-accent"></i>
          <h4 className="text-lg font-black tracking-tight">120+</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Countries Connected</p>
        </div>
        <div className="card-main p-6 text-center space-y-2 border-yellow-500/10">
          <i className="fa-solid fa-hands-praying text-2xl text-yellow-500"></i>
          <h4 className="text-lg font-black tracking-tight">500k+</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Daily Prayers</p>
        </div>
        <div className="card-main p-6 text-center space-y-2 border-green-500/10">
          <i className="fa-solid fa-shield-heart text-2xl text-green-500"></i>
          <h4 className="text-lg font-black tracking-tight">Active</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Sangat Support</p>
        </div>
      </div>

      <div className="card-main p-10 bg-[var(--primary-accent)]/5 border-2 border-[var(--primary-accent)]/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <i className="fa-solid fa-hand-holding-heart text-9xl -mr-10 -mt-10"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Support the Mission</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Our platform is built on the principle of <span className="text-white font-bold italic">Dasvandh</span>—the tradition of giving a portion of one's earnings to benefit the community. Your contributions power the digital infrastructure that keeps Gurbani accessible to all, free of cost, across the globe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><i className="fa-solid fa-server"></i></div>
              <p className="text-[9px] font-black uppercase text-gray-300">Server & Maintenance</p>
            </div>
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-purple-accent/10 flex items-center justify-center text-purple-accent"><i className="fa-solid fa-microphone-lines"></i></div>
              <p className="text-[9px] font-black uppercase text-gray-300">Content Digitization</p>
            </div>
          </div>

          <button 
            onClick={onDonateClick}
            className="w-full bg-yellow-500 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all hover:brightness-110"
          >
            Contribute My Dasvandh
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-accent">Sangat Calendar</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black uppercase text-red-500 tracking-widest">Live Transmissions</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, title: 'Amrit Vela Kirtan', host: 'Golden Temple Stream', date: 'DAILY', time: '03:30 AM' },
            { id: 2, title: 'Bhai Gurpreet Singh Ji', host: 'Weekly Katha Vichar', date: 'SUNDAY', time: '08:00 PM' },
            { id: 3, title: 'Sukhmani Sahib Path', host: 'Community Group Recitation', date: 'SATURDAY', time: '06:00 PM' }
          ].map((event) => (
            <div key={event.id} className="card-main p-6 flex items-center justify-between border-white/5 hover:border-purple-accent/30 transition-all group cursor-pointer bg-[#0a0e17]/40">
              <div className="flex items-center gap-6">
                <div className="bg-[#1a1f2c] p-4 rounded-2xl border border-white/5 text-center min-w-[80px] group-hover:bg-purple-accent/5 transition-all">
                  <p className="text-[10px] font-black text-yellow-500 tracking-tighter uppercase">{event.date}</p>
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-100">{event.title}</h4>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1 italic">{event.host} • {event.time}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleReminder(event.id); }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${reminders.has(event.id) ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-gray-600 hover:text-white hover:bg-white/10'}`}
              >
                <i className={`fa-solid ${reminders.has(event.id) ? 'fa-bell-slash' : 'fa-bell'}`}></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-10 opacity-40">
        <p className="text-[8px] font-black uppercase tracking-[0.8em] text-gray-500">End of Community Pulse</p>
      </div>

    </div>
  );
};

export default Community;
