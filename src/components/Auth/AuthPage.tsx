import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getRandomJobMarketQuote } from '../../data/jobMarketQuotes';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { isDark } = useTheme(); // not used directly here; styling uses static classes
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(getRandomJobMarketQuote());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  useEffect(() => {
    // Change quote every 10 seconds for demo
    const interval = setInterval(() => {
      setDailyQuote(getRandomJobMarketQuote());
    }, 10000);

    // Preload the background image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80';

    // Mouse move handler for flashlight effect - relative to right panel
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rightPanel = document.querySelector('.right-panel') as HTMLElement;
      if (rightPanel) {
        const rect = rightPanel.getBoundingClientRect();
        setMousePosition({ 
          x: mouseEvent.clientX - rect.left, 
          y: mouseEvent.clientY - rect.top 
        });
      }
    };

    // Only track mouse when over the right panel
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
      rightPanel.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      clearInterval(interval);
      if (rightPanel) {
        rightPanel.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    setAuthInfo(null);
    try {
      if (!supabase) {
        setAuthError('Auth is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        return;
      }
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          setAuthError('Invalid credentials or email not confirmed.');
        } else if (data.session?.user) {
          onLogin({
            name: data.session.user.user_metadata?.name || formData.name || 'User',
            email: data.session.user.email || formData.email,
          });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
          },
        });
        if (error) {
          setAuthError(error.message);
        } else if (data.user) {
          setAuthInfo('Account created. Check your email to verify before signing in.');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getQuoteColor = (_type: string) => 'text-blue-300';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getQuoteIcon = (_type: string) => <Sparkles className="w-6 h-6" />;

  return (
    <>
      {/* CSS Animation for floating particles and flashlight effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            from {
              transform: translateY(0px) rotate(0deg);
              opacity: 1;
            }
            to {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }
          .floating-particle {
            animation: float infinite alternate;
          }
          .flashlight-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
              circle 200px at ${mousePosition.x}px ${mousePosition.y}px,
              transparent 0%,
              transparent 40%,
              rgba(0, 0, 0, 0.8) 100%
            );
            pointer-events: none;
            z-index: 25;
            transition: background 0.1s ease-out;
          }
          .right-panel {
            cursor: none;
          }
          @keyframes traceCircle {
            0% { 
              stroke-dashoffset: 240;
              animation-timing-function: ease-out;
            }
            25% { 
              stroke-dashoffset: 180;
              animation-timing-function: ease-in;
            }
            50% { 
              stroke-dashoffset: 120;
              animation-timing-function: ease-out;
            }
            75% { 
              stroke-dashoffset: 60;
              animation-timing-function: ease-in;
            }
            100% { 
              stroke-dashoffset: 0;
              animation-timing-function: ease-out;
            }
          }
          .logo-trace {
            animation: traceCircle 3s infinite;
          }
          @keyframes textIllumination {
            0% { 
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
              color: rgba(255, 255, 255, 0.6);
            }
            5% { 
              text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
              color: rgba(255, 255, 255, 0.7);
            }
            10% { 
              text-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4);
              color: rgba(255, 255, 255, 0.85);
            }
            15% {
              text-shadow: 0 0 25px rgba(255, 255, 255, 1), 0 0 35px rgba(255, 255, 255, 0.8), 0 0 45px rgba(255, 255, 255, 0.4);
              color: rgba(255, 255, 255, 1);
            }
            20% { 
              text-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4);
              color: rgba(255, 255, 255, 0.85);
            }
            25% { 
              text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
              color: rgba(255, 255, 255, 0.7);
            }
            30% { 
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
              color: rgba(255, 255, 255, 0.6);
            }
            100% { 
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
              color: rgba(255, 255, 255, 0.6);
            }
          }
          .text-illuminate {
            animation: textIllumination 3s infinite;
          }
        `
      }} />
      
      <div className="min-h-screen flex bg-black">
        {/* Left Panel - 1/3 width - Authentication */}
        <div className="w-1/3 flex flex-col justify-center px-12 py-8 bg-black relative z-10">
          <div className="max-w-md w-full mx-auto">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center relative">
                {/* Enhanced glow effect background with downward glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl"></div>
                <div className="absolute top-0 left-0 right-0 bottom-4 bg-white/10 blur-md rounded-2xl"></div>
                <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                
                {/* Animated white box trace */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                  <rect
                    x="1"
                    y="1"
                    width="62"
                    height="62"
                    rx="12"
                    ry="12"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="240"
                    strokeDashoffset="240"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="logo-trace"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 8px 16px rgba(255, 255, 255, 0.3))'
                    }}
                  />
                </svg>
                
                {/* Logo */}
                <img 
                  src="/logo.png" 
                  alt="ApplyTrack" 
                  className="w-10 h-10 object-contain relative z-10 drop-shadow-lg" 
                  style={{
                    filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight italic" style={{fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)'}}>ApplyTrack</h1>
              <p className="text-gray-400 text-sm italic" style={{fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 0 15px rgba(156, 163, 175, 0.6), 0 0 25px rgba(156, 163, 175, 0.3)'}}>Your intelligent job tracking companion</p>
            </div>

            {/* Auth Toggle */}
            <div className="flex mb-6 bg-gray-900 p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  isLogin 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  !isLogin 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 px-4 transition-colors flex items-center justify-center gap-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {authError && (
                <div className="text-sm text-red-400 mt-2">{authError}</div>
              )}

              {authInfo && (
                <div className="text-sm text-green-400 mt-2">{authInfo}</div>
              )}

              {authLoading && (
                <div className="text-sm text-gray-400 mt-1">Processing...</div>
              )}
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (!supabase) return;
                    setAuthError(null);
                    setAuthLoading(true);
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        queryParams: { access_type: 'offline', prompt: 'consent select_account' },
                        redirectTo: `${window.location.origin}/dashboard`,
                      },
                    });
                    if (error) setAuthError(error.message);
                    setAuthLoading(false);
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 border border-gray-700 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Right Panel - 2/3 width - Dynamic Background with Flashlight Effect */}
        <div className="w-2/3 relative overflow-hidden right-panel">
          {/* Primary Forest Image Background */}
          {imageLoaded && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')`
              }}
            />
          )}

          {/* Secondary Nature Image Backup */}
          {!imageLoaded && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')`
              }}
            />
          )}

          {/* Animated Fallback Background - Always visible as base layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900">
            <div className="absolute inset-0 opacity-30">
              {/* Floating particles */}
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white floating-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDelay: `${Math.random() * 20}s`,
                    animationDuration: `${Math.random() * 15 + 10}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Flashlight Overlay */}
          <div className="flashlight-overlay"></div>

          {/* Simplified Quote on Image */}
          <div className="absolute inset-0 flex items-center justify-center z-30 px-16">
            <div className="max-w-2xl text-center">
              {/* Quote Text Only */}
              <blockquote className="text-3xl leading-relaxed mb-6 italic text-white font-light drop-shadow-2xl">
                "{dailyQuote.quote}"
              </blockquote>
              
              {/* Quote Source */}
              <cite className="text-xl font-medium text-gray-200 drop-shadow-lg">
                — {dailyQuote.source}
              </cite>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 