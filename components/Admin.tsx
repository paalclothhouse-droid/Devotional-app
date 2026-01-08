
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

type ActivityLog = {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
};

const Admin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_session') === 'active');
  const [failedAttempts, setFailedAttempts] = useState(() => Number(localStorage.getItem('failed_admin_attempts') || 0));
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('admin_terminal_locked') === 'true');
  const [activeView, setActiveView] = useState<'dashboard' | 'media' | 'cms' | 'users' | 'activity'>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [newMedia, setNewMedia] = useState({ title: '', type: 'audio' as 'audio' | 'video' | 'pdf', desc: '', url: '#' });
  const [globalMedia, setGlobalMedia] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('app_global_media') || '[]');
  });

  const [appConfig, setAppConfig] = useState(() => {
    const saved = localStorage.getItem('app_global_config');
    return saved ? JSON.parse(saved) : {
      upiId: '8556823113@fam',
      thanksMsg: 'Your contribution helps us keep the path of Gurbani accessible to all.',
      whatsappNumber: '918556823113',
      whatsappName: 'Mankirat',
      qrUrl: 'https://i.imgur.com/rM5H9Mh.png',
      profilePic: 'https://i.imgur.com/8N69wP4.png',
      theme: 'purple',
      welcomeSubtitle: 'Live Sangat Monitoring Active',
      alertMessage: ''
    };
  });

  const [broadcastMessage, setBroadcastMessage] = useState(appConfig.alertMessage || '');

  useEffect(() => {
    const loadData = () => {
      setUsers(JSON.parse(localStorage.getItem('app_users') || '[]'));
      setActivityLogs(JSON.parse(localStorage.getItem('app_activity_logs') || '[]'));
      setGlobalMedia(JSON.parse(localStorage.getItem('app_global_media') || '[]'));
      const config = localStorage.getItem('app_global_config');
      if (config) {
        const parsed = JSON.parse(config);
        setAppConfig(parsed);
        setBroadcastMessage(parsed.alertMessage || '');
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }).reverse();
    return { 
      registrations: last7Days.map((date, idx) => ({ name: date, users: Math.floor(users.length * (0.6 + idx * 0.08)) })),
      mediaDist: [
        { name: 'Audio', value: globalMedia.filter(m => m.type === 'audio').length + 3, color: '#8a4fff' },
        { name: 'Video', value: globalMedia.filter(m => m.type === 'video').length + 2, color: '#fbbf24' },
        { name: 'PDF', value: globalMedia.filter(m => m.type === 'pdf').length + 4, color: '#ef4444' }
      ]
    };
  }, [users, globalMedia]);

  const logActivity = (user: string, action: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem('app_activity_logs') || '[]');
    const newLog: ActivityLog = { id: Math.random().toString(36).substr(2, 9), user, action, details, timestamp: new Date().toISOString() };
    const updated = [newLog, ...logs].slice(0, 1000);
    localStorage.setItem('app_activity_logs', JSON.stringify(updated));
    setActivityLogs(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (passcode === '1699') {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      localStorage.setItem('admin_session', 'active');
      localStorage.setItem('failed_admin_attempts', '0');
      logActivity('System', 'Admin Auth', 'Access Granted');
    } else {
      const n = failedAttempts + 1;
      setFailedAttempts(n);
      localStorage.setItem('failed_admin_attempts', n.toString());
      if (n >= 3) {
        setIsLocked(true);
        localStorage.setItem('admin_terminal_locked', 'true');
        logActivity('System', 'Lockout', 'Security Protocol Initiated');
      } else {
        alert(`Access Denied. ${3-n} attempts remaining.`);
      }
    }
    setPasscode('');
  };

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingMediaId) {
      updated = globalMedia.map(m => m.id === editingMediaId ? { ...newMedia, id: m.id } : m);
    } else {
      updated = [...globalMedia, { ...newMedia, id: Date.now().toString() }];
    }
    localStorage.setItem('app_global_media', JSON.stringify(updated));
    setGlobalMedia(updated);
    setNewMedia({ title: '', type: 'audio', desc: '', url: '#' });
    setEditingMediaId(null);
    logActivity('Admin', 'Media CMS', 'Library sync completed');
    window.dispatchEvent(new Event('storage'));
  };

  const updateConfig = (key: string, value: any) => {
    const updated = { ...appConfig, [key]: value };
    setAppConfig(updated);
    localStorage.setItem('app_global_config', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleBroadcast = () => {
    updateConfig('alertMessage', broadcastMessage);
    logActivity('Admin', 'Broadcast', broadcastMessage ? 'New alert published' : 'Alert cleared');
    alert("System message synchronized.");
  };

  const toggleUserBan = (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
    const updatedUsers = users.map(u => u.email === email ? { ...u, status: newStatus } : u);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    logActivity('Admin', 'User Management', `${newStatus === 'Blocked' ? 'Banned' : 'Unbanned'} user: ${email}`);
    window.dispatchEvent(new Event('storage'));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card-main p-12 w-full max-w-md text-center space-y-8 border-red-500/40 shadow-2xl">
          <i className="fa-solid fa-lock text-red-500 text-4xl animate-pulse"></i>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Terminal Locked</h2>
          <div className="bg-[#0a0e17] p-6 rounded-2xl border border-white/5">
             <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Security Support</p>
             <p className="text-lg font-black text-white">+91 8556823113</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card-main p-12 w-full max-w-md text-center space-y-8 border-purple-accent/30 shadow-2xl relative overflow-hidden">
          <i className="fa-solid fa-shield-halved text-5xl text-purple-accent mt-4"></i>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">System Authority</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Terminal Key" className="w-full bg-[#0a0e17] border border-white/5 p-6 rounded-2xl text-center text-white text-2xl tracking-[0.5em] outline-none" value={passcode} onChange={e => setPasscode(e.target.value)} />
            <button className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-accent/20 text-white">Authorize</button>
          </form>
          {failedAttempts > 0 && <p className="text-red-500 text-[10px] font-black uppercase">Security Warning: {failedAttempts}/3</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-40 pt-10 space-y-10 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Admin Hub</h2>
          <p className="text-[10px] text-purple-accent font-black uppercase tracking-[0.3em]">System Monitoring Protocol</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-[#0a0e17] p-2 rounded-2xl border border-white/5 overflow-x-auto">
          {['dashboard', 'media', 'cms', 'users', 'activity'].map(v => (
            <button key={v} onClick={() => setActiveView(v as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeView === v ? 'bg-purple-accent text-white shadow-lg shadow-purple-accent/20' : 'text-gray-500 hover:text-gray-300'}`}>{v}</button>
          ))}
        </div>
      </div>

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-main p-8 border-purple-accent/20 bg-purple-accent/[0.02]">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Global Sangat</p>
            <h3 className="text-4xl font-black text-white">{users.length}</h3>
          </div>
          <div className="card-main p-8 border-yellow-500/20">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Media Assets</p>
            <h3 className="text-4xl font-black text-white">{globalMedia.length + 9}</h3>
          </div>
          <div className="card-main p-8 border-red-500/20">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Logs Collected</p>
            <h3 className="text-4xl font-black text-white">{activityLogs.length}</h3>
          </div>
        </div>
      )}

      {activeView === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#0a0e17] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4 flex-1">
               <i className="fa-solid fa-magnifying-glass text-gray-600 ml-4"></i>
               <input 
                 placeholder="Search by name or email..." 
                 className="bg-transparent border-none text-white text-sm outline-none w-full"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map(u => (
              <div key={u.email} className="card-main p-6 flex items-center justify-between border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${u.status === 'Blocked' ? 'bg-red-500/20' : 'bg-purple-accent/20'}`}>
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm text-white">{u.name}</h4>
                    <p className="text-[9px] uppercase font-black text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">Current Status</p>
                     <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${u.status === 'Blocked' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-green-500/30 text-green-500 bg-green-500/5'}`}>
                       {u.status || 'Active'}
                     </span>
                  </div>
                  <button 
                    onClick={() => toggleUserBan(u.email, u.status || 'Active')}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${u.status === 'Blocked' ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    title={u.status === 'Blocked' ? 'Unban User' : 'Ban User'}
                  >
                    <i className={`fa-solid ${u.status === 'Blocked' ? 'fa-user-check' : 'fa-user-slash'}`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'cms' && (
        <div className="space-y-8">
          <div className="card-main p-8 space-y-6 border-red-500/20 bg-red-500/[0.02]">
            <div className="flex justify-between items-center">
              <h3 className="font-black italic uppercase text-red-500">System Broadcast Alert</h3>
              <i className="fa-solid fa-bullhorn text-red-500 animate-pulse"></i>
            </div>
            <textarea 
              placeholder="Type global announcement message..." 
              className="w-full bg-[#0a0e17] border border-white/5 p-6 rounded-3xl text-sm min-h-[120px] text-white outline-none focus:border-red-500/30 transition-all"
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={handleBroadcast} className="flex-1 bg-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-600/20 text-white">Publish Broadcast</button>
              <button onClick={() => { setBroadcastMessage(''); updateConfig('alertMessage', ''); }} className="px-8 bg-white/5 py-4 rounded-2xl font-black uppercase text-[10px] text-white">Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-main p-8 space-y-4">
              <h3 className="font-black italic uppercase text-xs text-purple-accent">Coordinator Identity</h3>
              <input placeholder="Name" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={appConfig.whatsappName} onChange={e => updateConfig('whatsappName', e.target.value)} />
              <input placeholder="Phone" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={appConfig.whatsappNumber} onChange={e => updateConfig('whatsappNumber', e.target.value)} />
            </div>
            <div className="card-main p-8 space-y-4">
              <h3 className="font-black italic uppercase text-xs text-yellow-500">Seva Hub</h3>
              <input placeholder="UPI ID" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={appConfig.upiId} onChange={e => updateConfig('upiId', e.target.value)} />
              <textarea placeholder="Thanks Message" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm min-h-[100px] text-white" value={appConfig.thanksMsg} onChange={e => updateConfig('thanksMsg', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {activeView === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card-main p-8 space-y-6 h-fit border-purple-accent/20">
            <h3 className="font-black italic uppercase text-purple-accent">{editingMediaId ? 'Edit Resource' : 'Publish Resource'}</h3>
            <form onSubmit={handleMediaSubmit} className="space-y-4">
              <input required placeholder="Title" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={newMedia.title} onChange={e => setNewMedia({...newMedia, title: e.target.value})} />
              <select className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={newMedia.type} onChange={e => setNewMedia({...newMedia, type: e.target.value as any})}>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
              <input placeholder="Description" className="w-full bg-[#0a0e17] border border-white/5 p-4 rounded-xl text-sm text-white" value={newMedia.desc} onChange={e => setNewMedia({...newMedia, desc: e.target.value})} />
              <button className="w-full bg-purple-accent py-4 rounded-xl font-black text-white">{editingMediaId ? 'Update' : 'Publish'}</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {globalMedia.map(m => (
               <div key={m.id} className="card-main p-6 flex justify-between items-center border-white/5 hover:border-white/10 transition-all">
                  <div className="text-left">
                    <h4 className="font-black text-sm text-white">{m.title}</h4>
                    <p className="text-[9px] uppercase font-black text-gray-500">{m.type} • {m.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingMediaId(m.id); setNewMedia(m); }} className="p-2 text-gray-500 hover:text-white"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => { 
                      const updated = globalMedia.filter(item => item.id !== m.id);
                      localStorage.setItem('app_global_media', JSON.stringify(updated));
                      setGlobalMedia(updated);
                      window.dispatchEvent(new Event('storage'));
                    }} className="p-2 text-red-500"><i className="fa-solid fa-trash"></i></button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeView === 'activity' && (
        <div className="card-main p-8 border-white/5 bg-[#0a0e17]/40">
          <h3 className="font-black italic uppercase text-xs text-gray-500 mb-8 tracking-widest">Real-time Activity Log</h3>
          <div className="space-y-4">
            {activityLogs.map(log => (
              <div key={log.id} className="flex gap-6 p-4 border-b border-white/5 text-left items-start group">
                <div className="text-[9px] font-black text-purple-accent uppercase tabular-nums mt-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">{log.user}:</span>
                  <span className="text-xs text-white font-medium italic">"{log.action} - {log.details}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
