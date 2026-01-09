import React, { useState, useEffect } from 'react';

const Admin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_session') === 'active');
  const [activeView, setActiveView] = useState<'dashboard' | 'media' | 'cms' | 'users'>('dashboard');
  const [globalMedia, setGlobalMedia] = useState<any[]>(() => JSON.parse(localStorage.getItem('app_global_media') || '[]'));
  const [appConfig, setAppConfig] = useState(() => {
    const saved = localStorage.getItem('app_global_config');
    return saved ? JSON.parse(saved) : {
      upiId: '8556823113@fam',
      thanksMsg: 'Your contribution helps us keep the path of Gurbani accessible to all.',
      whatsappNumber: '918194918713',
      whatsappName: 'Mankirat',
      qrUrl: 'https://i.imgur.com/rM5H9Mh.png',
      profilePic: 'https://i.imgur.com/8N69wP4.png',
      showFloatingButtons: true,
      alertMessage: ''
    };
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1699') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'active');
    } else alert("Invalid Terminal Key");
    setPasscode('');
  };

  const updateConfig = (key: string, value: any) => {
    const updated = { ...appConfig, [key]: value };
    setAppConfig(updated);
    localStorage.setItem('app_global_config', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card-main p-12 w-full max-w-md text-center space-y-8 shadow-2xl">
          <h2 className="text-2xl font-black uppercase italic text-white">System Authority</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Terminal Key" className="w-full bg-[#0a0e17] border border-white/5 p-6 rounded-2xl text-center text-white text-2xl outline-none" value={passcode} onChange={e => setPasscode(e.target.value)} />
            <button className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase text-white">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-40 pt-10 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic text-white">Admin Hub</h2>
        <div className="flex gap-2 bg-[#0a0e17] p-2 rounded-2xl border border-white/5">
          {['dashboard', 'media', 'cms', 'users'].map(v => (
            <button key={v} onClick={() => setActiveView(v as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase ${activeView === v ? 'bg-purple-accent text-white' : 'text-gray-500'}`}>{v}</button>
          ))}
        </div>
      </div>

      {activeView === 'cms' && (
        <div className="space-y-8">
          <div className="card-main p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black uppercase text-purple-accent">Floating Interface Controls</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={appConfig.showFloatingButtons} onChange={(e) => updateConfig('showFloatingButtons', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-accent"></div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-gray-500">WhatsApp Coordinator</h4>
                <input placeholder="Name" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white" value={appConfig.whatsappName} onChange={e => updateConfig('whatsappName', e.target.value)} />
                <input placeholder="Number (with country code)" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white" value={appConfig.whatsappNumber} onChange={e => updateConfig('whatsappNumber', e.target.value)} />
                <input placeholder="Profile Pic URL" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white" value={appConfig.profilePic} onChange={e => updateConfig('profilePic', e.target.value)} />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-yellow-500">Seva / Donation Hub</h4>
                <input placeholder="UPI ID" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white" value={appConfig.upiId} onChange={e => updateConfig('upiId', e.target.value)} />
                <input placeholder="QR Code Image URL" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white" value={appConfig.qrUrl} onChange={e => updateConfig('qrUrl', e.target.value)} />
                <textarea placeholder="Thanks Message" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white h-24" value={appConfig.thanksMsg} onChange={e => updateConfig('thanksMsg', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card-main p-8 border-red-500/20">
            <h3 className="font-black uppercase text-red-500 mb-4">Global Broadcast</h3>
            <textarea placeholder="Announcement text..." className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white h-24" value={appConfig.alertMessage} onChange={e => updateConfig('alertMessage', e.target.value)} />
          </div>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-main p-8 bg-purple-accent/5">
            <p className="text-[10px] font-black uppercase text-gray-500">System Visibility</p>
            <p className="text-xl font-black text-white">{appConfig.showFloatingButtons ? 'FAB Active' : 'FAB Hidden'}</p>
          </div>
          <div className="card-main p-8 bg-yellow-500/5">
            <p className="text-[10px] font-black uppercase text-gray-500">Active UPI</p>
            <p className="text-xl font-black text-white">{appConfig.upiId}</p>
          </div>
          <div className="card-main p-8 bg-green-500/5">
            <p className="text-[10px] font-black uppercase text-gray-500">WhatsApp Lead</p>
            <p className="text-xl font-black text-white">{appConfig.whatsappName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;