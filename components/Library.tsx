
import React, { useState, useEffect } from 'react';
import { Language } from '../translations';

interface LibraryProps {
  lang: Language;
}

const SCRIPTURES_CONTENT: Record<string, string[]> = {
  'Japji Sahib': [
    "<> siq nwmu krqw purKu inrBau inrvYru Akwl mUriq AjUnI sYBM gur pRswid ]",
    "jpu ] Awid scu jugwid scu ] hY BI scu nwnk hosI BI scu ]1]",
    "socY soic n hoveI jy socI lK vwr ] cupY cup n hoveI jy lwie rhw ilv qwr ]",
    "BuiKAw BuK n auqrI jy bMnw purIAw Bwr ] shs isAwxpw lK hoih q iek n clY nwil ]",
    "ikv sicAwrw hoeIAY ikv kUVY qutY pwil ] hukim rjweI clxw nwnk iliKAw nwil ]1]"
  ],
  'Jaap Sahib': [
    "<> siqgur pRswid ] sRI vwihgurU jI kI Pqh ] jwpu sRI muKvwk pwiqSwhI 10] CpY CMd ] qÍ pRswid ]",
    "c`k® ichn Aru brn jwiq Aru pwiq nihn ijh ] rUp rMg Aru ryK ByK koaU kih n skiq ikh ]",
    "Acl mUriq AnBau pRkws Aimqoij kih`jY ] koit ieMdR ieMdRwix swhu swhwix gix`jY ]",
    "iqRBvx mhIp sur nr Asur nyq nyq bn iqRx khq ] qv srb nwm kQY kvn krm nwm brnq sumiq ]1]"
  ],
  'Chaupai Sahib': [
    "hmrI kro hwQ dY r`Cw ] pUrn hoie icq kI ie`Cw ] qv crnn mn rhY hmwrw ] Apnw jwn kro pRiqpwrw ]1]",
    "hmry dust sBY qum Gwvhu ] Awpu hwQ dY moih bcwvhu ] suKI bsY moro pirvwrw ] syvk is`K sBY krqwrw ]2]",
    "mo r`Cw inj kr dY kirXY ] sB bYrn ko Awj sMGirXY ] pUrn hoie hmwrI Awsw ] qor Bjn kI rhY ipAwsw ]3]"
  ],
  'Tav-Prasad Savaiye': [
    "sRwvg s`uD smUh isDwn ky dyiK iPirE Gr jog jqI ky ] sUr surwrdn s`uD supwi dk sMq smUh Anyk mqI ky ]",
    "swry hI dys ko dyiK rihE mq koaU n dyKIAq pRwnpqI ky ] sRI Bgvwn kI Bwie ikpw hU qy eyk rqI ibn eyk rqI ky ]1]"
  ]
};

const Library: React.FC<LibraryProps> = ({ lang }) => {
  const [activeType, setActiveType] = useState<'audio' | 'video' | 'pdf' | 'downloads'>('audio');
  const [downloadedItems, setDownloadedItems] = useState<any[]>([]);
  const [readingPdf, setReadingPdf] = useState<string | null>(null);
  const [adminMedia, setAdminMedia] = useState<any[]>([]);
  
  const logActivity = (action: string, details: string) => {
    const currentUser = JSON.parse(localStorage.getItem('app_current_user') || '{}');
    if (!currentUser.email) return;
    const logs = JSON.parse(localStorage.getItem('app_activity_logs') || '[]');
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      user: currentUser.email,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('app_activity_logs', JSON.stringify([newLog, ...logs].slice(0, 1000)));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const loadData = () => {
      setDownloadedItems(JSON.parse(localStorage.getItem('app_downloads') || '[]'));
      setAdminMedia(JSON.parse(localStorage.getItem('app_global_media') || '[]'));
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleDownload = (item: any) => {
    const isAlready = downloadedItems.find(i => i.title === item.title);
    if (!isAlready) {
      const newList = [...downloadedItems, item];
      setDownloadedItems(newList);
      localStorage.setItem('app_downloads', JSON.stringify(newList));
      logActivity('Download', `Saved Offline: ${item.title}`);
      alert(`${item.title} available offline.`);
    } else {
      alert("Already in downloads.");
    }
  };

  const openPdf = (title: string) => {
    setReadingPdf(title);
    logActivity('Library', `Opened Scripture: ${title}`);
  };

  const kirtanList = [
    { title: 'Asa Di Vaar', time: '45:30', desc: 'Divine Morning Kirtan', type: 'audio' },
    { title: 'Sukhmani Sahib', time: '1:20:15', desc: 'Prayer for Peace', type: 'audio' },
    ...adminMedia.filter(m => m.type === 'audio')
  ];

  const videoList = [
    { title: 'Essence of Seva', time: '32:15', desc: 'Daily Discourse', type: 'video' },
    ...adminMedia.filter(m => m.type === 'video')
  ];

  const pdfList = [
    ...Object.keys(SCRIPTURES_CONTENT).map(title => ({ title, size: 'Divine Scripture', type: 'pdf' })),
    ...adminMedia.filter(m => m.type === 'pdf')
  ];

  if (readingPdf) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#0f141e] flex flex-col animate-in fade-in overflow-hidden">
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0e17]/80 backdrop-blur-xl">
          <div>
            <h2 className="font-black text-[var(--primary-accent)] uppercase tracking-[0.2em] text-sm">{readingPdf}</h2>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1">Digital Pothi Sahib</p>
          </div>
          <button onClick={() => setReadingPdf(null)} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-2xl text-gray-500 transition-all"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto space-y-16 scroll-smooth pb-32">
          {(SCRIPTURES_CONTENT[readingPdf] || ["This scripture content is currently being synchronized by the administration portal. Please check back shortly."]).map((line, idx) => (
            <div key={idx} className="text-center group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <p className="text-2xl md:text-5xl leading-relaxed font-medium text-gray-100 mb-8 drop-shadow-lg transition-all group-hover:text-[var(--primary-accent)] cursor-default">{line}</p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/5 to-transparent mx-auto"></div>
            </div>
          ))}
          <div className="text-center py-32 opacity-20">
            <p className="text-gray-700 font-black uppercase tracking-[0.8em] text-[10px]">End of Scripture</p>
          </div>
        </div>
      </div>
    );
  }

  const renderList = (items: any[], isPdf = false) => (
    items.map((item, idx) => (
      <div 
        key={item.id || idx} 
        onClick={() => isPdf ? openPdf(item.title) : logActivity('Media', `Consumed ${item.type}: ${item.title}`)}
        className="card-main p-6 flex items-center gap-6 group cursor-pointer hover:border-[var(--primary-accent)]/40 hover:bg-[#232a3b]/50 transition-all mb-4 border-white/5 shadow-lg"
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isPdf ? 'bg-red-500/10 text-red-500' : item.type === 'video' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'} group-hover:scale-110 group-hover:bg-[var(--primary-accent)] group-hover:text-white`}>
          <i className={`fa-solid ${isPdf ? 'fa-book-open-reader' : item.type === 'video' ? 'fa-clapperboard' : 'fa-music'} text-xl`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-black text-sm text-gray-100">{item.title}</h4>
            {item.id && <span className="bg-purple-accent/10 text-purple-accent text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-accent/20">New</span>}
          </div>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1 italic">{item.desc || item.size || item.time}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleDownload(item); }} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[var(--primary-accent)] transition-all"><i className="fa-solid fa-cloud-arrow-down"></i></button>
      </div>
    ))
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-44 pt-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex gap-2 p-1.5 bg-[#0a0e17]/80 rounded-3xl border border-white/5 overflow-x-auto scrollbar-hide shadow-2xl backdrop-blur-xl">
        {['audio', 'video', 'pdf', 'downloads'].map((type: any) => (
          <button key={type} onClick={() => setActiveType(type)} className={`flex-1 py-3 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all min-w-fit flex items-center justify-center gap-2 ${activeType === type ? 'bg-[var(--primary-accent)] text-white shadow-lg shadow-[var(--primary-accent)]/20' : 'text-gray-500 hover:text-gray-300'}`}>
            <i className={`fa-solid ${type === 'audio' ? 'fa-music' : type === 'video' ? 'fa-clapperboard' : type === 'pdf' ? 'fa-book-open-reader' : 'fa-box-archive'}`}></i>
            {type}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-8">
        {activeType === 'audio' && renderList(kirtanList)}
        {activeType === 'video' && renderList(videoList)}
        {activeType === 'pdf' && renderList(pdfList, true)}
        {activeType === 'downloads' && (downloadedItems.length > 0 ? renderList(downloadedItems, true) : (
          <div className="text-center py-20 card-main border-dashed border-white/5 bg-white/[0.01]">
             <i className="fa-solid fa-cloud-arrow-down text-3xl text-gray-800 mb-4 block"></i>
             <p className="text-gray-700 font-black uppercase text-[9px] tracking-widest">Archive Empty</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
