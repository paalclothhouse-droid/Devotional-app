import React, { useState, useEffect } from 'react';

const Admin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_session') === 'active');
  const [activeView, setActiveView] = useState<'dashboard' | 'media' | 'cms' | 'users'>('dashboard');
  const [users, setUsers] = useState<any[]>(() => JSON.parse(localStorage.getItem('app_users') || '[]'));
  const [mediaItems, setMediaItems] = useState<any[]>(() => JSON.parse(localStorage.getItem('app_global_media') || '[]'));
  
  const [newAsset, setNewAsset] = useState({ title: '', type: 'audio', url: '', desc: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

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
      alertMessage: '',
      supportPhone: '+91 81949 18713',
      supportEmail: 'singhanterjog@gmail.com',
      warmGreeting: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. How can we assist you on your spiritual journey today?'
    };
  });

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_global_media', JSON.stringify(mediaItems));
    window.dispatchEvent(new Event('storage'));
  }, [mediaItems]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1699') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'active');
    } else alert("Invalid Terminal Key");
    setPasscode('');
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setMediaItems(prev => prev.map(m => m.id === editingId ? { ...newAsset, id: editingId } : m));
      setEditingId(null);
    } else {
      const asset = { ...newAsset, id: Math.random().toString(36).substr(2, 9) };
      setMediaItems(prev => [asset, ...prev]);
    }
    setNewAsset({ title: '', type: 'audio', url: '', desc: '' });
  };

  const deleteAsset = (id: string) => {
    if (confirm("Delete this asset permanently?")) {
      setMediaItems(prev => prev.filter(m => m.id !== id));
    }
  };

  const startEdit = (asset: any) => {
    setNewAsset(asset);
    setEditingId(asset.id);
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
          <div className="w-20 h-20 bg-purple-accent/10 rounded-full flex items-center justify-center mx-auto text-purple-accent text-3xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-2xl font-black uppercase italic text-white">System Authority</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Terminal Key" className="w-full bg-[#0a0e17] border border-white/5 p-6 rounded-2xl text-center text-white text-2xl outline-none" value={passcode} onChange={e => setPasscode(e.target.value)} />
            <button className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase text-white shadow-xl">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-44 pt-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Admin Hub</h2>
        <div className="flex gap-2 bg-[#0a0e17] p-2 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
          {['dashboard', 'media', 'cms', 'users'].map(v => (
            <button key={v} onClick={() => setActiveView(v as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeView === v ? 'bg-purple-accent text-white shadow-lg' : 'text-gray-500'}`}>{v}</button>
          ))}
        </div>
      </div>

      {activeView === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <form onSubmit={handleAddAsset} className="card-main p-8 space-y-6 sticky top-10">
              <h3 className="font-black uppercase text-purple-accent text-sm">{editingId ? 'Edit Asset' : 'Upload New Asset'}</h3>
              <div className="space-y-4">
                <input placeholder="Asset Title" required className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={newAsset.title} onChange={e => setNewAsset({ ...newAsset, title: e.target.value })} />
                <select className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value })}>
                  <option value="audio">Audio / Kirtan</option>
                  <option value="video">Video / Katha</option>
                  <option value="pdf">PDF / Pothi</option>
                </select>
                <input placeholder="Source URL" required className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={newAsset.url} onChange={e => setNewAsset({ ...newAsset, url: e.target.value })} />
                <textarea placeholder="Description" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm h-20" value={newAsset.desc} onChange={e => setNewAsset({ ...newAsset, desc: e.target.value })} />
              </div>
              <button className="w-full bg-purple-accent py-4 rounded-xl font-black uppercase text-xs">{editingId ? 'Save Changes' : 'Broadcast Asset'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setNewAsset({ title: '', type: 'audio', url: '', desc: '' }); }} className="w-full bg-white/5 py-2 rounded-xl text-[9px] font-bold uppercase text-gray-500">Cancel</button>}
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black uppercase text-gray-500 text-xs tracking-widest">Library Vault ({mediaItems.length})</h3>
            <div className="grid grid-cols-1 gap-3">
              {mediaItems.map((item) => (
                <div key={item.id} className="card-main p-4 flex items-center justify-between border-white/5 bg-[#0a0e17]/60">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'pdf' ? 'bg-red-500/10 text-red-500' : item.type === 'video' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                         <i className={`fa-solid ${item.type === 'pdf' ? 'fa-file-pdf' : item.type === 'video' ? 'fa-video' : 'fa-music'}`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.type} • Source: {item.url.substring(0, 30)}...</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-white"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => deleteAsset(item.id)} className="p-2 text-red-500/50 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'cms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          <div className="card-main p-8 space-y-6">
            <h3 className="font-black uppercase text-purple-accent text-sm">Coordinator Profile</h3>
            <div className="space-y-4">
              <input placeholder="Name" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.whatsappName} onChange={e => updateConfig('whatsappName', e.target.value)} />
              <input placeholder="WhatsApp Number" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.whatsappNumber} onChange={e => updateConfig('whatsappNumber', e.target.value)} />
              <input placeholder="Profile Pic URL" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.profilePic} onChange={e => updateConfig('profilePic', e.target.value)} />
            </div>
          </div>
          <div className="card-main p-8 space-y-6">
            <h3 className="font-black uppercase text-yellow-500 text-sm">Seva & Dasvandh</h3>
            <div className="space-y-4">
              <input placeholder="UPI ID" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.upiId} onChange={e => updateConfig('upiId', e.target.value)} />
              <input placeholder="QR Code URL" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.qrUrl} onChange={e => updateConfig('qrUrl', e.target.value)} />
              <textarea placeholder="Thanks Message" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm h-20" value={appConfig.thanksMsg} onChange={e => updateConfig('thanksMsg', e.target.value)} />
            </div>
          </div>
          <div className="card-main p-8 space-y-6 md:col-span-2 border-purple-accent/20">
            <h3 className="font-black uppercase text-purple-400 text-sm">Location & Enquiry Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Support Phone" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.supportPhone} onChange={e => updateConfig('supportPhone', e.target.value)} />
              <input placeholder="Support Email" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm" value={appConfig.supportEmail} onChange={e => updateConfig('supportEmail', e.target.value)} />
              <textarea placeholder="Warm Greeting Message" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-white text-sm h-24 md:col-span-2" value={appConfig.warmGreeting} onChange={e => updateConfig('warmGreeting', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-main p-8 bg-purple-accent/5">
            <p className="text-[10px] font-black uppercase text-gray-500">Total Users</p>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="card-main p-8 bg-yellow-500/5">
            <p className="text-[10px] font-black uppercase text-gray-500">Active Streaks</p>
            <p className="text-3xl font-black text-white">{users.reduce((acc, u) => acc + (u.streak || 0), 0)}</p>
          </div>
          <div className="card-main p-8 bg-green-500/5">
            <p className="text-[10px] font-black uppercase text-gray-500">Global Assets</p>
            <p className="text-3xl font-black text-green-500">{mediaItems.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;