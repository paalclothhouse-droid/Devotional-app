
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { name: string; email: string; id: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      name: email.split('@')[0],
      email: email,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    if (!users.find((u: any) => u.email === mockUser.email)) {
      users.push({ ...mockUser, status: 'Active', lastAction: 'Joined', streak: 0, downloadsCount: 0 });
      localStorage.setItem('app_users', JSON.stringify(users));
    }
    
    onLogin(mockUser);
  };

  const handleGoogleLogin = () => {
    onLogin({ name: 'Sangat Member', email: 'member@gmail.com', id: 'g-123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f141e] selection:bg-purple-accent/30">
      <div className="card-main p-10 w-full max-w-md space-y-10 border-white/5 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-accent to-purple-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-4xl font-black text-white">ੴ</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Faith Journey</h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Digital Sangat Portal</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl"
          >
            <i className="fa-brands fa-google text-lg"></i>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-6 py-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">or use secure mail</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full bg-[#0a0e17] border border-white/5 p-5 rounded-2xl focus:border-purple-accent/50 outline-none font-bold text-sm transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Secure Password" 
                required
                className="w-full bg-[#0a0e17] border border-white/5 p-5 rounded-2xl focus:border-purple-accent/50 outline-none font-bold text-sm transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-accent/30 active:scale-[0.98] transition-all">
              {isRegistering ? 'Initialize Account' : 'Authenticate Session'}
            </button>
          </form>
          
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-600">
            {isRegistering ? 'Existing member?' : "New to the path?"}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-purple-accent hover:underline"
            >
              {isRegistering ? 'Sign In' : 'Join Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
