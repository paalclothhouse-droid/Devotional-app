
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
      whatsappNumber: '918194918713',
      whatsappName: 'Mankirat',
      qrUrl: 'https://i.imgur.com/rM5H9Mh.png',
      profilePic: 'https://i.imgur.com/8N69wP4.png'
    };
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
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
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
        if (userInDb && userInDb.status === 'Blocked') {
          setIsBlocked(true);
        } else {
          setIsBlocked(false);
        }
      }
    };

    window.addEventListener('storage', syncApp);
    syncApp();
    return () => {
      window.removeEventListener('storage', syncApp);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [currentUser]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      }
      setDeferredPrompt(null);
    }
  };

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

  const handleNitnemComplete = () => {
    const today = new Date().toLocaleDateString('en-GB');
    if (localStorage.getItem('streak_last_date') !== today) {
      const newStreak = stats.paathStreak + 1;
      setStats(prev => ({ ...prev, paathStreak: newStreak }));
      localStorage.setItem('streak_last_date', today);
      localStorage.setItem('user_streak_count', newStreak.toString());
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSimranSession = () => {
    const newCount = stats.simranCount + 1;
    setStats(prev => ({ ...prev, simranCount: newCount }));
    localStorage.setItem('user_simran_count', newCount.toString());
    window.dispatchEvent(new Event('storage'));
  };

  if (!currentUser) return <Auth onLogin={handleSetUser} />;

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[#0f141e] flex items-center justify-center p-8 text-center animate-in fade-in">
        <div className="card-main p-12 space-y-8 max-w-md border-red-500/40">
          <i className="fa-solid fa-ban text-red-500 text-5xl"></i>
          <h1 className="text-2xl font-black uppercase text-white">Access Restricted</h1>
          <p className="text-gray-500 text-xs">Your access is currently restricted. Please contact support.</p>
          <button onClick={() => handleSetUser(null)} className="w-full bg-white/5 py-4 rounded-xl font-black text-white">Exit Portal</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard stats={stats} setActiveTab={setActiveTab} lang={lang} />;
      case 'media': return <Library lang={lang} />;
      case 'community': return <Community lang={lang} onDonateClick={() => setShowDonateOverlay(true)} />;
      case 'admin': return <Admin />;
      case 'nitnem': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 text-center space-y-8 animate-in fade-in duration-700">
           <div className="card-main p-14 space-y-14 shadow-2xl border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0f141e]">
              <div className="space-y-3">
                <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-purple-accent italic">{t.spirit_path}</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">{t.commitment}</p>
              </div>
              <div className="flex justify-around items-center bg-[#0a0e17] py-14 rounded-[3rem] border border-white/5">
                 <div className="space-y-3">
                    <div className="text-7xl font-black text-yellow-500 tabular-nums">{stats.paathStreak}</div>
                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">{t.day_streak}</div>
                 </div>
                 <div className="h-28 w-px bg-white/5"></div>
                 <div className="space-y-3">
                    <div className="text-7xl font-black text-purple-accent tabular-nums">{stats.simranCount}</div>
                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">{t.simran_log}</div>
                 </div>
              </div>
              <div className="space-y-5">
                <button onClick={handleNitnemComplete} className="w-full bg-purple-accent py-8 rounded-[2.5rem] font-black uppercase text-white shadow-2xl shadow-purple-accent/20">
                  {t.log_nitnem}
                </button>
                <button onClick={handleSimranSession} className="w-full border-2 border-yellow-500/20 text-yellow-500 py-8 rounded-[2.5rem] font-black uppercase">
                  {t.verify_simran}
                </button>
              </div>
           </div>
        </div>
      );
      case 'support': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 space-y-12 pb-32 animate-in fade-in">
           <div className="card-main p-10 space-y-10 border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0f141e]">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-purple-accent/10 rounded-full flex items-center justify-center mx-auto text-purple-accent text-4xl">
                   <i className="fa-solid fa-headset"></i>
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Seva Support</h3>
                   <p className="text-[10px] text-purple-accent font-black uppercase tracking-[0.4em] leading-relaxed">
                     "We are here to serve the Sangat. If you face any issues or have questions, reach out with love."
                   </p>
                </div>
              </div>
              <div className="space-y-4">
                 <a href="tel:+918556823113" className="card-main p-6 flex items-center gap-6 border-white/5 hover:border-purple-accent/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-purple-accent/10 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phone Support</p>
                      <p className="text-lg font-black text-white">+91 85568 23113</p>
                    </div>
                 </a>
                 <a href="mailto:singhanterjog@gmail.com" className="card-main p-6 flex items-center gap-6 border-white/5 hover:border-yellow-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email Seva</p>
                      <p className="text-sm font-black text-white italic">singhanterjog@gmail.com</p>
                    </div>
                 </a>
              </div>
              <button onClick={() => setActiveTab('more')} className="w-full py-4 bg-white/5 rounded-2xl font-black uppercase text-white border border-white/5">Back</button>
           </div>
        </div>
      );
      case 'bio': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 space-y-12 pb-32 animate-in fade-in">
           <div className="card-main p-10 space-y-10 border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0f141e]">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-purple-accent/30 shadow-2xl">
                   <img src={globalConfig.profilePic} alt="Mankirat" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-black uppercase italic text-white">{globalConfig.whatsappName}</h3>
                <p className="text-[10px] text-purple-accent font-black uppercase tracking-[0.4em]">Digital Sewadar</p>
              </div>
              <div className="bg-[#0a0e17] p-8 rounded-[2rem] border border-white/5 text-sm text-gray-300 italic">
                <p>"Dedicated to serving the global Sangat by bridging ancient wisdom and modern accessibility."</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <button onClick={() => setShowWhatsAppOverlay(true)} className="w-full bg-green-600 py-6 rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-white shadow-xl shadow-green-600/20 active:scale-95 transition-all">
                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                    Join Sangat on WhatsApp
                 </button>
                 <button onClick={() => setActiveTab('more')} className="w-full py-4 bg-white/5 rounded-2xl font-black uppercase text-white">Back</button>
              </div>
           </div>
        </div>
      );
      case 'more': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 space-y-8 pb-32 animate-in fade-in">
          <div className="card-main p-10 space-y-14 border-white/5 bg-gradient-to-br from-[#1a1f2c] to-[#0f141e]">
             <div className="flex items-center gap-8 p-10 bg-[#0a0e17] rounded-[3.5rem] border border-white/5">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-accent to-black rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white">
                  {currentUser.name[0]}
                </div>
                <div className="text-left">
                   <h3 className="text-3xl font-black uppercase italic text-white">{currentUser.name}</h3>
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">{currentUser.email}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-5">
                {[
                  { id: 'bio', icon: 'fa-info-circle', label: t.biography, action: () => setActiveTab('bio') },
                  { id: 'support_tab', icon: 'fa-headset', label: t.support, action: () => setActiveTab('support') },
                  { id: 'sewa', icon: 'fa-heart', label: t.sewa_hub, action: () => setShowDonateOverlay(true) },
                  { id: 'community_tab', icon: 'fa-users', label: t.community, action: () => setActiveTab('community') },
                  { id: 'whatsapp_tab', icon: 'fa-brands fa-whatsapp', label: t.whatsapp, action: () => setShowWhatsAppOverlay(true) },
                  { id: 'admin_tab', icon: 'fa-user-shield', label: t.system_admin, action: () => setActiveTab('admin') }
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} className="card-main p-10 flex flex-col items-center gap-6 group border-white/5 hover:border-purple-accent/30 transition-all">
                    <i className={`fa-solid ${btn.icon} text-2xl text-purple-accent`}></i>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{btn.label}</span>
                  </button>
                ))}
                {deferredPrompt && (
                  <button onClick={handleInstallClick} className="card-main p-10 flex flex-col items-center gap-6 border-green-500/20 bg-green-500/5 group hover:bg-green-500/10 col-span-2 transition-all">
                    <i className="fa-solid fa-download text-2xl text-green-500"></i>
                    <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Install App</span>
                  </button>
                )}
                <button onClick={() => handleSetUser(null)} className="p-10 flex flex-col items-center gap-6 border border-gray-800 rounded-[3rem] group hover:bg-white/5 col-span-2 transition-all">
                    <i className="fa-solid fa-power-off text-2xl text-gray-500"></i>
                    <span className="text-[10px] font-black uppercase text-gray-500">{t.sign_out}</span>
                </button>
             </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  const WhatsAppOverlay = () => (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in">
      <div className="bg-[#0a0e17] rounded-[2.5rem] p-10 w-full max-w-sm text-center border border-white/5 relative shadow-2xl">
        <button onClick={() => setShowWhatsAppOverlay(false)} className="absolute top-6 right-6 text-gray-600">
          <i className="fa-solid fa-circle-xmark text-3xl"></i>
        </button>
        <div className="mb-8">
          <div className="w-24 h-24 rounded-3xl overflow-hidden mb-4 border-4 border-white/5 mx-auto">
            <img src={globalConfig.profilePic} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic">{globalConfig.whatsappName}</h3>
          <p className="text-purple-accent text-[9px] font-black uppercase tracking-[0.3em] mt-1">Sangat Coordinator</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] mb-8 inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)]">
           <img src={globalConfig.qrUrl} alt="QR" className="w-48 h-48 mx-auto" />
        </div>
        <a href={`https://wa.me/${globalConfig.whatsappNumber}`} target="_blank" className="block w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase text-xs">
          Open WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#0f141e] text-gray-100 font-sans tracking-tight`}>
      {globalConfig.alertMessage && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
           <div className="bg-[#0a0e17] rounded-[2rem] p-8 max-w-sm w-full border border-white/10 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-purple-accent/20 rounded-full flex items-center justify-center mx-auto text-purple-accent text-2xl">
                <i className="fa-solid fa-bullhorn animate-pulse"></i>
              </div>
              <h3 className="text-xl font-black uppercase italic text-white">{t.alert_title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-medium italic">"{globalConfig.alertMessage}"</p>
              <button onClick={() => setGlobalConfig({...globalConfig, alertMessage: ''})} className="w-full bg-purple-accent py-4 rounded-xl font-black uppercase text-white shadow-xl shadow-purple-accent/20">{t.close}</button>
           </div>
        </div>
      )}
      {showDonateOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#0a0e17] rounded-[2.5rem] p-10 w-full max-w-sm text-center border border-white/5 relative shadow-2xl">
            <button onClick={() => setShowDonateOverlay(false)} className="absolute top-6 right-6 text-gray-600"><i className="fa-solid fa-circle-xmark text-3xl"></i></button>
            <i className="fa-solid fa-heart text-yellow-500 text-4xl mb-4"></i>
            <h3 className="text-2xl font-black text-white uppercase italic">{t.support_seva}</h3>
            <p className="text-gray-400 text-xs mb-8 italic leading-relaxed">"{globalConfig.thanksMsg}"</p>
            <div className="bg-[#0f141e] p-5 rounded-2xl border border-white/5 mb-4">
               <p className="text-[9px] font-black uppercase text-gray-500">Official UPI ID</p>
               <p className="text-lg font-black text-yellow-500 font-mono tracking-tighter">{globalConfig.upiId}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(globalConfig.upiId); alert("Copied!"); }} className="w-full bg-white/5 py-4 rounded-2xl font-black uppercase text-white hover:bg-white/10 transition-all">{t.copy_upi}</button>
          </div>
        </div>
      )}
      {showWhatsAppOverlay && <WhatsAppOverlay />}
      <main className="pb-4">{renderContent()}</main>
      <nav className="fixed bottom-0 left-0 right-0 h-28 bg-[#0a0e17]/90 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-10 z-50">
          {[
            { id: 'home', icon: 'fa-house', label: t.home },
            { id: 'media', icon: 'fa-circle-play', label: t.library },
            { id: 'nitnem', icon: 'fa-feather-pointed', label: t.nitnem },
            { id: 'community', icon: 'fa-users', label: t.community },
            { id: 'more', icon: 'fa-shapes', label: t.menu }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-3 transition-all duration-300 ${activeTab === tab.id ? 'text-purple-accent -translate-y-2' : 'text-gray-600 hover:text-gray-400'}`}>
              <i className={`fa-solid ${tab.icon} text-2xl`}></i>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
      </nav>
    </div>
  );
};

export default App;
