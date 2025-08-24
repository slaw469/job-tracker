// src/components/Auth/AuthPage.tsx
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { firebaseAuth } from "../../lib/firebaseAuth";
import { getRandomJobMarketQuote } from "../../data/jobMarketQuotes";

interface AuthPageProps {
  onLogin: (user?: { name: string; email: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const [dailyQuote, setDailyQuote] = useState(getRandomJobMarketQuote());
  useEffect(() => {
    const t = setInterval(() => setDailyQuote(getRandomJobMarketQuote()), 10000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError(null);
  setAuthInfo(null);
  setAuthLoading(true);

  const email = formData.email.trim();
  const password = formData.password;

  // Best-effort hinting only; don't trust it when enumeration protection is ON
  let methods: string[] | null = null;
  try { methods = await fetchSignInMethodsForEmail(auth, email); } catch {}

  try {
    if (isLogin) {
      // Attempt sign-in directly
      const { data, error } = await firebaseAuth.signInWithPassword({ email, password });
      if (error) {
        // If we *happen* to know it's not a password account, hint Google
        if (methods && methods.length > 0 && !methods.includes("password")) {
          setAuthError('This account uses Google sign-in. Use "Continue with Google" or reset your password.');
        } else {
          setAuthError("Invalid email or password.");
        }
        return;
      }
      if (data.session?.user) {
        onLogin({
          name: data.session.user.user_metadata?.name || (data.session.user.email?.split("@")[0] || "User"),
          email: data.session.user.email || email,
        });
      }
    } else {
      // Attempt sign-up directly
      const { data, error } = await firebaseAuth.signUp({ email, password });
      if (error) {
        // EMAIL_EXISTS etc.
        setAuthError(error.message || "Failed to create account.");
        return;
      }
      if (data?.session?.user) {
        onLogin({
          name: data.session.user.user_metadata?.name || "User",
          email: data.session.user.email || email,
        });
      } else {
        setAuthInfo("Account created successfully! You can now sign in.");
        setIsLogin(true);
      }
    }
  } catch (err: any) {
    setAuthError(err?.message || "Unexpected error.");
  } finally {
    setAuthLoading(false);
  }
};

  const handleForgotPassword = async () => {
    try {
      if (!formData.email) return setAuthError("Enter your email first.");
      await sendPasswordResetEmail(auth, formData.email.trim());
      setAuthInfo("Password reset link sent. Check your email.");
      setAuthError(null);
    } catch (e: any) {
      setAuthError(e.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left panel */}
      <div className="w-full max-w-sm mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">{isLogin ? "Welcome back" : "Create Account"}</h1>

        {/* Toggle */}
        <div className="flex mb-6 bg-gray-900 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm ${isLogin ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm ${!isLogin ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isLogin && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="mt-2 text-xs text-gray-400 hover:text-white underline"
              >
                Forgot password?
              </button>
            )}
          </div>

        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 flex items-center justify-center gap-2"
          disabled={authLoading}
        >
          {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
        </button>

          {authError && <div className="text-sm text-red-400">{authError}</div>}
          {authInfo && <div className="text-sm text-green-400">{authInfo}</div>}
          {authLoading && <div className="text-sm text-gray-400">Processing…</div>}
        </form>

        {/* Social */}
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
                setAuthError(null);
                setAuthLoading(true);
                // Use REDIRECT to avoid COOP/popup issues
                const { error } = await firebaseAuth.signInWithOAuth();
                if (error) setAuthError(error.message);
                setAuthLoading(false);
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 border border-gray-700 flex items-center justify-center gap-3"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black font-bold">
                G
              </span>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-8 text-gray-300 italic text-center">
          “{dailyQuote.quote}” — {dailyQuote.source}
        </div>
      </div>

      {/* Right panel for backdrop */}
      <div className="flex-1 hidden md:block bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
    </div>
  );
};

export default AuthPage;
