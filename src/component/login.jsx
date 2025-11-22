import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api/login_api";
import logo from "../assets/images/logo.png";
import { QrCode } from "lucide-react";
import { testFirebaseConnection, requestNotificationPermission, registerServiceWorker } from "../firebase_config";
import { t as _t, getLang as _getLang, subscribe as _subscribe, setLang as _setLang } from "../i18n/i18n";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    _setLang(next);
  };

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('[Login] 🚀 Starting Firebase initialization...');
        
        // Register service worker first
        await registerServiceWorker();
        console.log('[Login] ✅ Service worker registered');
        
        // Test Firebase connection
        testFirebaseConnection();
        console.log('[Login] ✅ Firebase connection tested');
      } catch (error) {
        console.error('[Login] ❌ Firebase initialization error:', error);
      }
    };

    initializeFirebase();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ username, password });
      console.log('[Login] ✅ Login response data:', data);
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role ?? '');
        localStorage.setItem('code', String(data.code ?? ''));
        localStorage.setItem('userData', JSON.stringify(data));

        // Request notification permission after successful login
        console.log('[Login] 🔔 Requesting notification permission...');
        
        // Wait a bit for storage to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const token = await requestNotificationPermission();
        if (token) {
          console.log('[Login] ✅ FCM Token obtained:', token);
        } else {
          console.warn('[Login] ⚠️ FCM Token not obtained (check console for details)');
        }

        // Navigate based on role
        if ((data.role || '').toUpperCase() === 'ADMIN') {
          navigate('/Dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError(_t('LOGIN_TOKEN_MISSING'));
      }
    } catch (err) {
      console.error('[Login] ❌ Login failed:', err);
      setError(err.message || _t('LOGIN_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 py-12 bg-white shadow-2xl rounded-r-3xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-300 rounded-full translate-x-12 translate-y-12 opacity-30"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo and Language Toggle */}
          <div className="mb-12 w-full flex justify-between items-center">
            <img
              src={logo}
              alt="HR Logo"
              className="h-20 drop-shadow-lg"
              draggable="false"
            />
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              {lang === 'en' ? 'EN' : 'ع'}
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-8 text-center">
              {_t('LOGIN')}
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Username Input */}
              <div className="group">
                <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-xl px-4 py-4 shadow-sm border border-gray-200 hover:border-green-300 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={_t('USERNAME')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent ml-4 w-full outline-none text-gray-700 placeholder-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-xl px-4 py-4 shadow-sm border border-gray-200 hover:border-green-300 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                  </svg>
                  <input
                    type="password"
                    placeholder={_t('PASSWORD')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent ml-4 w-full outline-none text-gray-700 placeholder-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & QR Code */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  
                  
                  
                </label>
                <div className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                  {/*<QrCode className="w-5 h-5 text-gray-500" />*/}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:shadow-lg disabled:hover:translate-y-0"
              >
                {loading ? _t('LOGGING_IN') : _t('LOGIN')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-green-400 to-green-500 flex-col justify-center items-center px-8 py-12 text-white">
        <h2 className="text-5xl font-bold mb-6 text-center">{_t('WELCOME_BACK')}</h2>
        <p className="text-xl text-center leading-relaxed">
          {_t('WELCOME_SUB')}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
