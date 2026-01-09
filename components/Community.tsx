
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
      alert("Nitnem Reminder Set! You'll be notified when it's time for the path.");
    }
    setReminders(newReminders);
  };

  const schedule = [
    { id: 1, title: 'Amrit Vela (Japji Sahib)', host: 'Morning Prayers', date: 'DAILY', time: '03:30 AM', icon: 'fa-sun' },
    { id: 2, title: 'Evening (Rehrass Sahib)', host: 'Sunset Prayers', date: 'DAILY', time: '06:00 PM', icon: 'fa-cloud-moon' },
    { id: 3, title: 'Night (Sohila Sahib)', host: 'Before Sleep', date: 'DAILY', time: '09:30 PM', icon: 'fa-moon' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-40 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Power of Sangat</h2>
          <div className="h-1 w-20 bg-purple-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="card-main p-8 bg-gradient-to-br from-[#1a1f2c] to-[#0a0e17] border-white/5 space-y-6 leading-relaxed">
          <p className="text-sm text-gray-300 font-medium">
            In the Sikh tradition, <span className="text-purple-accent font-bold italic">Sangat</span> is more than just a gathering—it is a sacred space where individual souls merge into a collective consciousness. 
          </p>
          <p className="text-sm text-gray-300 font-medium italic">
            "Join thousands of devotees globally in our digital Sangat. We are dedicated to providing accessible Gurbani, Nitnem tracking, and spiritual support for seekers everywhere."
          </p>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-main p-6 text-center space-y-2 border-purple-accent/10">
          <i className="fa-solid fa-earth-americas text-2xl text-purple-accent"></i>
          <h4 className="text-lg font-black tracking-tight">120+</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Countries Connected</p>
        </div>
        <div className="card-main p-6 text-center space-y-2 border-yellow-500/10">
          <i className="fa-solid fa-hands-praying text-2xl text-yellow-500"></i>
          <h4 className="text-lg font-black tracking-tight">Active</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Global Sangat</p>
        </div>
        <div className="card-main p-6 text-center space-y-2 border-green-500/10">
          <i className="fa-solid fa-shield-heart text-2xl text-green-500"></i>
          <h4 className="text-lg font-black tracking-tight">Verified</h4>
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Daily Nitnem</p>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-accent">Nitnem Schedule</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">Live Updates</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {schedule.map((event) => (
            <div key={event.id} className="card-main p-6 flex items-center justify-between border-white/5 hover:border-purple-accent/30 transition-all group cursor-pointer bg-[#0a0e17]/40">
              <div className="flex items-center gap-6">
                <div className="bg-[#1a1f2c] p-4 rounded-2xl border border-white/5 text-center min-w-[80px] group-hover:bg-purple-accent/5 transition-all">
                  <i className={`fa-solid ${event.icon} text-yellow-500 mb-2 block`}></i>
                  <p className="text-[10px] font-black text-gray-400 tracking-tighter uppercase">{event.date}</p>
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

      {/* Donation Block */}
      <div className="card-main p-10 bg-purple-accent/5 border-2 border-purple-accent/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <i className="fa-solid fa-hand-holding-heart text-9xl -mr-10 -mt-10 text-white"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Support the Mission</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Our platform is built on the principle of <span className="text-white font-bold italic">Dasvandh</span>. Your contributions power the digital infrastructure that keeps Gurbani accessible to all, free of cost.
            </p>
          </div>
          
          <button 
            onClick={onDonateClick}
            className="w-full bg-yellow-500 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all hover:brightness-110"
          >
            Contribute My Dasvandh
          </button>
        </div>
      </div>

      <div className="text-center py-10 opacity-40">
        <p className="text-[8px] font-black uppercase tracking-[0.8em] text-gray-500">End of Community Pulse</p>
      </div>

    </div>
  );
};

export default Community;
