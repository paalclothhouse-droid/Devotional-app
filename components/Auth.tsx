import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (user: { name: string; email: string; id: string; picture?: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Parse JWT for Google Login (Simulated decode as we are in a client-only environment)
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const syncUserToLocalStorage = (userData: any) => {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const existingUserIndex = users.findIndex((u: any) => u.email === userData.email);
    
    if (existingUserIndex === -1) {
      const newUser = {
        ...userData,
        status: 'Active',
        lastAction: 'Joined',
        streak: 0,
        downloadsCount: 0,
        joinedAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('app_users', JSON.stringify(users));
      return newUser;
    } else {
      // Update existing user with latest login info
      users[existingUserIndex] = { ...users[existingUserIndex], lastLogin: new Date().toISOString() };
      localStorage.setItem('app_users', JSON.stringify(users));
      return users[existingUserIndex];
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      const mockUser = {
        name: email.split('@')[0],
        email: email,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      const user = syncUserToLocalStorage(mockUser);
      onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleCredentialResponse = (response: any) => {
    const payload = parseJwt(response.credential);
    if (payload) {
      const googleUser = {
        name: payload.name,
        email: payload.email,
        id: payload.sub,
        picture: payload.picture
      };
      const user = syncUserToLocalStorage(googleUser);
      onLogin(user);
    }
  };

  useEffect(() => {
    /* global google */
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // User should replace this in production
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f141e] selection:bg-purple-accent/30">
      <div className="card-main p-10 w-full max-w-md space-y-10 border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
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
          {/* Google Login Target */}
          <div id="googleBtn" className="w-full min-h-[44px]"></div>
          
          <button 
            type="button"
            onClick={() => (window as any).google?.accounts.id.prompt()}
            className="w-full flex items-center justify-center gap-4 bg-white text-black py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl"
          >
            <i className="fa-brands fa-google text-lg"></i>
            One-Tap Identity
          </button>

          <div className="relative flex items-center gap-6 py-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">or use secure mail</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full bg-[#0a0e17] border border-white/5 p-5 pl-12 rounded-2xl focus:border-purple-accent/50 outline-none font-bold text-sm transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input 
                  type="password" 
                  placeholder="Secure Password" 
                  required
                  className="w-full bg-[#0a0e17] border border-white/5 p-5 pl-12 rounded-2xl focus:border-purple-accent/50 outline-none font-bold text-sm transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              disabled={isLoading}
              className="w-full bg-purple-accent py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-accent/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
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