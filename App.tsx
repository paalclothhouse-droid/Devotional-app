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
      showFloatingButtons: true,
      supportPhone: '+91 81949 18713',
      supportEmail: 'singhanterjog@gmail.com',
      warmGreeting: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. How can we assist you on your spiritual journey today?'
    };
  });

  const [showDonateOverlay, setShowDonateOverlay] = useState(false);
  const [showWhatsAppOverlay, setShowWhatsAppOverlay] = useState(false);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [showAboutOverlay, setShowAboutOverlay] = useState(false);
  const [showHeritageOverlay, setShowHeritageOverlay] = useState(false);
  const [showLanguageOverlay, setShowLanguageOverlay] = useState(false);
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);

  const t = translations[lang];

  const [currentUser, setCurrentUser] = useState<{name: string; email: string; id: string; phone?: string} | null>(() => {
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
      setStats({ 
        paathStreak: savedStreak ? parseInt(savedStreak) : 0,
        simranCount: savedSimran ? parseInt(savedSimran) : 0,
        lastUpdated: new Date().toISOString()
      });

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

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    setShowLanguageOverlay(false);
  };

  const handleSimranIncrement = () => {
    const newCount = stats.simranCount + 1;
    localStorage.setItem('user_simran_count', newCount.toString());
    setStats(prev => ({ ...prev, simranCount: newCount }));
    // No alert here to keep the flow smooth during jaap
  };

  const handleUpdateAccount = (updatedData: {name: string, email: string, phone: string}) => {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser?.id);
    
    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('app_users', JSON.stringify(users));
      const newUser = { ...currentUser!, ...updatedData };
      setCurrentUser(newUser);
      localStorage.setItem('app_current_user', JSON.stringify(newUser));
      alert("Account updated successfully.");
      setShowSettingsOverlay(false);
    }
  };

  const handleNitnemComplete = () => {
    const today = new Date().toLocaleDateString('en-GB');
    const lastDate = localStorage.getItem('streak_last_date');
    if (lastDate === today) { alert("Already logged!"); return; }
    const newStreak = stats.paathStreak + 1;
    localStorage.setItem('streak_last_date', today);
    localStorage.setItem('user_streak_count', newStreak.toString());
    setStats(prev => ({ ...prev, paathStreak: newStreak }));
    window.dispatchEvent(new Event('storage'));
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

  if (!currentUser) return <Auth onLogin={handleSetUser} />;
  if (isBlocked) return <div className="min-h-screen flex items-center justify-center bg-[#0f141e] text-red-500 font-bold">Access Suspended</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard stats={stats} setActiveTab={setActiveTab} lang={lang} onWhatsAppClick={() => setShowWhatsAppOverlay(true)} onSimranIncrement={handleSimranIncrement} />;
      case 'media': return <Library lang={lang} />;
      case 'community': return <Community lang={lang} onDonateClick={() => setShowDonateOverlay(true)} />;
      case 'admin': return <Admin />;
      case 'nitnem': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 text-center space-y-10 pb-32">
           <div className="card-main p-10 space-y-10 bg-[#1a1f2c]">
              <h2 className="text-4xl font-black text-purple-accent italic">{t.spirit_path}</h2>
              <div className="grid grid-cols-2 gap-6 bg-[#0a0e17] p-8 rounded-[2rem]">
                 <div className="text-center">
                    <div className="text-5xl font-black text-yellow-500">{stats.paathStreak}</div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Streak</div>
                 </div>
                 <div className="text-center" onClick={handleSimranIncrement}>
                    <div className="text-5xl font-black text-purple-accent cursor-pointer">{stats.simranCount}</div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Simran</div>
                 </div>
              </div>
              <button onClick={handleNitnemComplete} className="w-full bg-purple-accent py-6 rounded-3xl font-black uppercase text-white shadow-xl active:scale-95 transition-all">Complete Nitnem</button>
              <button onClick={handleSimranIncrement} className="w-full bg-[#0a0e17] border border-purple-accent/30 py-4 rounded-2xl font-black uppercase text-purple-accent text-xs tracking-[0.2em] active:bg-purple-accent/10 transition-all">Jaap Simran (+1)</button>
           </div>
        </div>
      );
      case 'more': return (
        <div className="max-w-2xl mx-auto px-4 pt-10 space-y-8 pb-32">
          <div className="card-main p-8 space-y-10 bg-[#1a1f2c]">
             <div className="flex items-center gap-6 p-6 bg-[#0a0e17] rounded-3xl">
                <div className="w-16 h-16 bg-purple-accent rounded-full flex items-center justify-center text-3xl font-black">{currentUser.name[0]}</div>
                <div>
                  <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                  <p className="text-[10px] text-gray-500">{currentUser.email}</p>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowAboutOverlay(true)} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] border-purple-accent/20 hover:border-purple-accent transition-all">
                  <i className="fa-solid fa-circle-info text-purple-accent text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">About App</span>
                </button>
                <button onClick={() => setShowHeritageOverlay(true)} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] border-yellow-500/20 hover:border-yellow-500 transition-all">
                  <i className="fa-solid fa-khanda text-yellow-500 text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">Sikh Heritage</span>
                </button>
                <button onClick={() => setShowLanguageOverlay(true)} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] hover:border-blue-500 transition-all">
                  <i className="fa-solid fa-language text-blue-400 text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">Language</span>
                </button>
                <button onClick={() => setShowSocialOverlay(true)} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] hover:border-orange-500 transition-all">
                  <i className="fa-solid fa-hashtag text-orange-400 text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">Social Links</span>
                </button>
                <button onClick={() => setShowSettingsOverlay(true)} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] hover:border-gray-500 transition-all">
                  <i className="fa-solid fa-user-gear text-gray-400 text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">Settings</span>
                </button>
                <button onClick={() => setActiveTab('admin')} className="card-main p-6 flex flex-col items-center gap-4 bg-[#0a0e17] border-red-500/10 hover:border-red-500 transition-all">
                  <i className="fa-solid fa-user-shield text-red-500 text-xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-300">Admin Panel</span>
                </button>
             </div>
             
             <button onClick={() => handleSetUser(null)} className="w-full p-4 border border-red-500/20 rounded-2xl text-red-500 font-bold uppercase text-[10px] tracking-[0.2em]">Logout Session</button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141e] text-gray-100 selection:bg-purple-accent/30">
      
      {/* Portals mapping (About, Heritage, Social, etc.) */}
      {showSocialOverlay && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowSocialOverlay(false)}>
          <div className="card-main p-10 max-w-sm w-full space-y-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="space-y-4">
              <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">Connect with Us</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium italic px-2">"Join our digital Sangat across all platforms to stay connected."</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'WhatsApp', icon: 'fa-whatsapp', color: 'bg-green-600' },
                { name: 'Telegram', icon: 'fa-telegram', color: 'bg-sky-500' },
                { name: 'Instagram', icon: 'fa-instagram', color: 'bg-pink-600' },
                { name: 'YouTube', icon: 'fa-youtube', color: 'bg-red-600' }
              ].map((s) => (
                <button key={s.name} className={`flex items-center gap-4 p-4 ${s.color}/10 rounded-2xl border border-white/5`}>
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white`}><i className={`fa-brands ${s.icon}`}></i></div>
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">{s.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSocialOverlay(false)} className="w-full bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase">Close</button>
          </div>
        </div>
      )}

      {showLanguageOverlay && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowLanguageOverlay(false)}>
           <div className="card-main p-10 max-w-sm w-full space-y-8 text-center" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">App Language</h3>
              <div className="space-y-3">
                {['en', 'pa', 'hi'].map((l) => (
                  <button key={l} onClick={() => changeLanguage(l as Language)} className={`w-full p-5 rounded-2xl border transition-all ${lang === l ? 'border-purple-accent bg-purple-accent/5' : 'border-white/5 bg-[#0a0e17]'}`}>
                    <span className="font-black text-white uppercase tracking-widest">{l === 'en' ? 'English' : l === 'pa' ? 'ਗੁਰਮੁਖੀ' : 'हिन्दी'}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowLanguageOverlay(false)} className="w-full bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase">Cancel</button>
           </div>
        </div>
      )}

      {showHeritageOverlay && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto" onClick={() => setShowHeritageOverlay(false)}>
           <div className="card-main p-10 max-w-lg w-full space-y-8 my-auto" onClick={e => e.stopPropagation()}>
              <div className="text-center space-y-2">
                <div className="text-4xl text-yellow-500 mb-4">ੴ</div>
                <h3 className="text-2xl font-black text-white uppercase">Teachings of Guru Nanak</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-[#0a0e17] p-5 rounded-2xl border border-yellow-500/10"><h4 className="text-yellow-500 font-black text-xs uppercase">Naam Japo</h4><p className="text-xs text-gray-400">Meditate on the Divine Name.</p></div>
                <div className="bg-[#0a0e17] p-5 rounded-2xl border border-yellow-500/10"><h4 className="text-yellow-500 font-black text-xs uppercase">Kirat Karo</h4><p className="text-xs text-gray-400">Earn an honest living.</p></div>
                <div className="bg-[#0a0e17] p-5 rounded-2xl border border-yellow-500/10"><h4 className="text-yellow-500 font-black text-xs uppercase">Vand Chakko</h4><p className="text-xs text-gray-400">Share with the needy.</p></div>
              </div>
              <button onClick={() => setShowHeritageOverlay(false)} className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase">Done</button>
           </div>
        </div>
      )}

      {showAboutOverlay && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto" onClick={() => setShowAboutOverlay(false)}>
           <div className="card-main p-10 max-w-lg w-full space-y-8 my-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black text-white uppercase">About Faith Journey</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Faith Journey is a community-driven digital portal designed for modern Sikhs to stay connected with their roots through daily Hukamnama, Nitnem tracking, and a global Sangat network.</p>
              <button onClick={() => setShowAboutOverlay(false)} className="w-full bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase">Close</button>
           </div>
        </div>
      )}

      {showSettingsOverlay && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowSettingsOverlay(false)}>
           <div className="card-main p-10 max-w-md w-full space-y-10" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold uppercase text-purple-accent">Update Profile</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleUpdateAccount({
                  name: fd.get('name') as string,
                  email: fd.get('email') as string,
                  phone: fd.get('phone') as string
                });
              }} className="space-y-6">
                <input name="name" defaultValue={currentUser.name} className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" />
                <input name="email" type="email" defaultValue={currentUser.email} className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" />
                <input name="phone" placeholder="Phone" defaultValue={currentUser.phone || ''} className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" />
                <button type="submit" className="w-full bg-purple-accent py-4 rounded-xl font-bold uppercase">Update</button>
              </form>
              <button onClick={() => setShowSettingsOverlay(false)} className="w-full text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest">Back</button>
           </div>
        </div>
      )}

      {showWhatsAppOverlay && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowWhatsAppOverlay(false)}>
           <div className="card-main p-10 max-w-sm w-full space-y-8 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 text-4xl shadow-2xl"><i className="fa-brands fa-whatsapp"></i></div>
              <div><h3 className="text-2xl font-black text-white">{globalConfig.whatsappName}</h3><p className="text-[10px] font-bold uppercase text-gray-500">Coordinator</p></div>
              <a href={`https://wa.me/${globalConfig.whatsappNumber}`} target="_blank" className="block w-full bg-green-600 py-4 rounded-2xl font-bold uppercase text-center text-xs">Message</a>
              <button onClick={() => setShowWhatsAppOverlay(false)} className="w-full text-gray-600 text-[10px] font-bold uppercase">Back</button>
           </div>
        </div>
      )}

      {showDonateOverlay && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowDonateOverlay(false)}>
          <div className="card-main p-10 max-w-sm w-full space-y-8 text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-yellow-500">Sewa Center</h3>
            <div className="bg-white p-4 rounded-3xl inline-block mx-auto shadow-2xl"><img src={globalConfig.qrUrl} alt="QR" className="w-48 h-48 rounded-xl" /></div>
            <button onClick={() => { navigator.clipboard.writeText(globalConfig.upiId); alert("Copied!"); }} className="w-full bg-white/5 py-4 rounded-2xl font-bold text-[10px] uppercase border border-white/5">Copy UPI ID</button>
            <button onClick={() => setShowDonateOverlay(false)} className="w-full bg-purple-accent py-4 rounded-xl font-bold uppercase text-xs">Return</button>
          </div>
        </div>
      )}

      <main className="pb-4 min-h-[calc(100vh-6rem)]">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-[#0a0e17]/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 z-50">
          {[
            { id: 'home', icon: 'fa-house', label: 'HOME' },
            { id: 'media', icon: 'fa-circle-play', label: 'LIBRARY' },
            { id: 'nitnem', icon: 'fa-feather', label: 'NITNEM' },
            { id: 'community', icon: 'fa-users', label: 'SANGAT' },
            { id: 'more', icon: 'fa-shapes', label: 'MENU' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-2 transition-all ${activeTab === tab.id ? 'text-purple-accent -translate-y-2' : 'text-gray-600'}`}>
              <i className={`fa-solid ${tab.icon} text-xl`}></i>
              <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
      </nav>
    </div>
  );
};

export default App;