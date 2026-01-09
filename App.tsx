import React, { useState, useEffect } from 'react';
import { UserStats } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import Library from './components/Library.tsx';
import Admin from './components/Admin.tsx';
import Community from './components/Community.tsx';
import Auth from './components/Auth.tsx';
import { translations, Language } from './translations.ts';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'en';
  });

  const [globalConfig, setGlobalConfig] = useState(() => {
    const saved = localStorage.getItem('app_global_config');
    return saved ? JSON.parse(saved) : {
      theme: 'purple',
      alertMessage: '',
      upiId: '8556823113@fam',
      thanksMsg: 'Your contribution helps us keep the path of Gurbani accessible to all.',
      whatsappNumber: '918194918713',
      whatsappName: 'Mankirat',
      qrUrl: 'https://i.imgur.com/rM5H9Mh.png',
      profilePic: 'https://i.imgur.com/8N69wP4.png',
      showFloatingButtons: true
    };
  });

  const [showDonateOverlay, setShowDonateOverlay] = useState(false);
  const [showWhatsAppOverlay, setShowWhatsAppOverlay] = useState(false);

  const t = translations[lang];

  const [currentUser, setCurrentUser] = useState<{name: string; email: string; id: string} | null>(() => {
    const saved = localStorage.getItem('app_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState<UserStats>({
    paathStreak: 0,
    simranCount: 0,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    const syncApp = () => {
      const savedConfig = localStorage.getItem('app_global_config');
      if (savedConfig) setGlobalConfig(JSON.parse(savedConfig));

      const savedStreak = localStorage.getItem('user_streak_count');
      const savedSimran = localStorage.getItem('user_simran_count');
      setStats(prev => ({ 
        ...prev, 
        paathStreak: savedStreak ? parseInt(savedStreak) : 0,
        simranCount: savedSimran ? parseInt(savedSimran) : 0
      }));

      if (currentUser) {
        const users = JSON.parse(localStorage.getItem('app_users') || '[]');
        const userInDb = users.find((u: any) => u.email === currentUser.email);
        if (userInDb && userInDb.status === 'Blocked') setIsBlocked(true);
        else setIsBlocked(false);
      }
    };

    window.addEventListener('storage', syncApp);
    syncApp();
    return () => window.removeEventListener('storage', syncApp);
  }, [currentUser]);

  const handleSetUser = (user: any) => {
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('app_current_user', JSON.stringify(user));
    } else {
      setCurrentUser(null);
      localStorage.removeItem('app_current_user');
      localStorage.removeItem('admin_session');
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(globalConfig.upiId);
    alert("UPI ID Copied to clipboard!");
  };

  if (!currentUser) return <Auth onLogin={handleSetUser} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard stats={stats} setActiveTab={setActiveTab} lang={lang} />;
      case 'media': return <Library lang={lang} />;
      case 'community': return <Community lang={lang} onDonateClick={() => setShowDonateOverlay(true)} />;
      case 'admin': return <Admin />;
      case 'nitnem': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 text-center space-y-8">
           <div className="card-main p-14 space-y-14 shadow-2xl border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0f141e]">
              <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-purple-accent italic">{t.spirit_path}</h2>
              <div className="flex justify-around items-center bg-[#0a0e17] py-14 rounded-[3rem] border border-white/5">
                 <div className="text-center">
                    <div className="text-6xl font-black text-yellow-500">{stats.paathStreak}</div>
                    <div className="text-[10px] text-gray-600 font-black uppercase">{t.day_streak}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-6xl font-black text-purple-accent">{stats.simranCount}</div>
                    <div className="text-[10px] text-gray-600 font-black uppercase">{t.simran_log}</div>
                 </div>
              </div>
           </div>
        </div>
      );
      case 'more': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 space-y-8 pb-32">
          <div className="card-main p-10 space-y-14 border-white/5 bg-[#1a1f2c]">
             <div className="flex items-center gap-6 p-6 bg-[#0a0e17] rounded-3xl">
                <div className="w-16 h-16 bg-purple-accent rounded-full flex items-center justify-center text-3xl font-black">{currentUser.name[0]}</div>
                <div>
                  <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowDonateOverlay(true)} className="card-main p-8 flex flex-col items-center gap-4 bg-[#0a0e17]">
                  <i className="fa-solid fa-heart text-purple-accent text-2xl"></i>
                  <span className="text-[10px] font-black uppercase">{t.sewa_hub}</span>
                </button>
                <button onClick={() => setShowWhatsAppOverlay(true)} className="card-main p-8 flex flex-col items-center gap-4 bg-[#0a0e17]">
                  <i className="fa-brands fa-whatsapp text-green-500 text-2xl"></i>
                  <span className="text-[10px] font-black uppercase">{t.whatsapp}</span>
                </button>
                <button onClick={() => setActiveTab('admin')} className="card-main p-8 flex flex-col items-center gap-4 bg-[#0a0e17]">
                  <i className="fa-solid fa-user-shield text-yellow-500 text-2xl"></i>
                  <span className="text-[10px] font-black uppercase">{t.system_admin}</span>
                </button>
                <button onClick={() => handleSetUser(null)} className="card-main p-8 flex flex-col items-center gap-4 bg-[#0a0e17]">
                  <i className="fa-solid fa-power-off text-red-500 text-2xl"></i>
                  <span className="text-[10px] font-black uppercase">{t.sign_out}</span>
                </button>
             </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141e] text-gray-100 selection:bg-purple-accent/30">
      {/* Overlays */}
      {showDonateOverlay && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowDonateOverlay(false)}>
          <div className="card-main p-10 max-w-sm w-full space-y-8 text-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black italic uppercase text-yellow-500">{t.sewa_hub}</h3>
            <img src={globalConfig.qrUrl} alt="QR" className="w-48 h-48 mx-auto rounded-3xl border-4 border-white/5" />
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{globalConfig.upiId}</p>
              <button onClick={copyUPI} className="w-full bg-white/5 py-4 rounded-2xl font-black text-xs uppercase">{t.copy_upi}</button>
            </div>
            <p className="text-xs text-gray-400 italic">"{globalConfig.thanksMsg}"</p>
            <button onClick={() => setShowDonateOverlay(false)} className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase">{t.close}</button>
          </div>
        </div>
      )}

      {showWhatsAppOverlay && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowWhatsAppOverlay(false)}>
          <div className="card-main p-10 max-w-sm w-full space-y-8 text-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="relative mx-auto w-32 h-32">
              <img src={globalConfig.profilePic} className="w-full h-full rounded-full border-4 border-purple-accent object-cover" />
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1a1f2c] flex items-center justify-center">
                <i className="fa-brands fa-whatsapp text-white text-xs"></i>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{globalConfig.whatsappName}</h3>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Digital Sevadar</p>
            </div>
            <a href={`https://wa.me/${globalConfig.whatsappNumber}`} target="_blank" className="block w-full bg-green-600 py-5 rounded-2xl font-black uppercase text-center shadow-xl shadow-green-600/20">Message on WhatsApp</a>
            <button onClick={() => setShowWhatsAppOverlay(false)} className="w-full bg-white/5 py-5 rounded-2xl font-black uppercase">{t.close}</button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      {globalConfig.showFloatingButtons && (
        <div className="fixed bottom-32 right-6 z-[100] flex flex-col gap-4">
          <button onClick={() => setShowWhatsAppOverlay(true)} className="w-14 h-14 bg-green-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-2xl animate-bounce hover:scale-110 transition-transform">
            <i className="fa-brands fa-whatsapp"></i>
          </button>
          <button onClick={() => setShowDonateOverlay(true)} className="w-14 h-14 bg-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center text-black text-2xl hover:scale-110 transition-transform">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </button>
        </div>
      )}

      <main className="pb-4">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-[#0a0e17]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
          {[
            { id: 'home', icon: 'fa-house', label: t.home },
            { id: 'media', icon: 'fa-circle-play', label: t.library },
            { id: 'nitnem', icon: 'fa-feather-pointed', label: t.nitnem },
            { id: 'community', icon: 'fa-users', label: t.community },
            { id: 'more', icon: 'fa-shapes', label: t.menu }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-2 transition-all ${activeTab === tab.id ? 'text-purple-accent -translate-y-1' : 'text-gray-600'}`}>
              <i className={`fa-solid ${tab.icon} text-xl`}></i>
              <span className="text-[8px] font-black uppercase">{tab.label}</span>
            </button>
          ))}
      </nav>
    </div>
  );
};

export default App;