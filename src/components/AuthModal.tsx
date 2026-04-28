import { X, EyeOff, QrCode, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, handleFirestoreError, OperationType, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <circle cx="12" cy="12" r="12" fill="#1877F2"/>
     <path d="M14.91 12H12.9v7.88h-3.26V12H8.38V9.33h1.26V7.47c0-2.06.98-3.35 3.35-3.35h2.06v2.58h-1.3c-.97 0-1.12.37-1.12 1.1v1.53h2.46L14.91 12z" fill="white"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg" className="mr-1">
    <path d="M12.03 2.01c-5.5 0-9.98 4.47-9.98 9.97 0 1.94.52 3.82 1.5 5.51L2 22l4.63-1.46c1.63.92 3.49 1.41 5.4 1.41 5.49 0 9.97-4.48 9.97-9.97 0-5.5-4.48-9.97-9.97-9.97zM18.15 16.5c-.32.91-1.63 1.74-2.58 1.94-.85.17-1.89.37-3.66-.46-3.07-1.44-5.06-4.59-5.21-4.79-.15-.2-1.25-1.65-1.25-3.15s.8-2.27 1.09-2.55c.27-.27.59-.34.79-.34.2 0 .4.01.59.01.21.01.49-.07.74.52.27.64.91 2.22.99 2.38.08.16.14.34.04.54s-.15.31-.3.46l-.42.48c-.14.15-.29.31-.13.58.16.27.72 1.18 1.55 1.91 1.07.95 1.97 1.25 2.24 1.39.27.14.43.12.59-.06s.69-.79.87-1.07c.18-.28.36-.23.61-.14M18 15.68" fill="#25D366"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  view: 'login' | 'signup';
  onClose: () => void;
  onSwitchView: (view: 'login' | 'signup') => void;
}

export default function AuthModal({ isOpen, view, onClose, onSwitchView }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || 'Lazada User',
          createdAt: serverTimestamp()
        });
      }
      onClose();
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Authentication failed. Please try again.');
        handleFirestoreError(error, OperationType.CREATE, 'users');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-[420px] overflow-hidden shadow-2xl relative p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {view === 'login' ? (
          <>
            {/* Login Header */}
            <div className="flex items-center justify-between mb-8 relative">
              <QrCode className="text-gray-500 cursor-pointer absolute left-0" size={24} strokeWidth={1.5} />
              <div className="flex items-center gap-4 mx-auto pt-1">
                <span className="font-bold text-gray-800 text-lg cursor-pointer">Password</span>
                <span className="w-px h-4 bg-gray-200"></span>
                <span className="text-gray-400 font-medium text-lg cursor-pointer hover:text-gray-600 transition-colors">Phone Number</span>
              </div>
              <button onClick={onClose} className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Login Form */}
            <div className="space-y-4 mb-2">
              <input 
                type="text" 
                placeholder="Please enter your Phone or Email" 
                className="w-full border border-gray-300 rounded px-3 py-3 outline-none focus:border-lazada-orange text-[15px] transition-colors" 
              />
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Please enter your password" 
                  className="w-full border border-gray-300 rounded px-3 py-3 outline-none focus:border-lazada-orange text-[15px] transition-colors" 
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} strokeWidth={1.5} />
              </div>
            </div>

            {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{errorMsg}</div>}

            <div className="flex justify-end mb-6">
              <a href="#" className="text-sm text-gray-500 hover:text-lazada-orange transition-colors">Forgot password?</a>
            </div>

            <button className="w-full bg-lazada-orange text-white font-bold py-3.5 rounded text-[15px] mb-4 hover:bg-[#e06633] transition-colors shadow-sm">
              LOGIN
            </button>

            <div className="text-center text-sm text-gray-500 mb-8">
              Don't have an account? <span onClick={() => onSwitchView('signup')} className="text-blue-600 cursor-pointer hover:underline font-medium">Sign up</span>
            </div>

            {/* Login Footer */}
            <div className="text-center text-sm text-gray-500 mb-5 relative">
              <span className="bg-white px-2 relative z-10">Or, login with</span>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-100 z-0"></div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-gray-50 flex-1 py-2.5 border border-gray-200 rounded text-sm transition-colors disabled:opacity-50"
              >
                <GoogleIcon /> Google
              </button>
              <button disabled className="flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-gray-50 flex-1 py-2.5 border border-gray-200 rounded text-sm transition-colors opacity-50 cursor-not-allowed">
                <FacebookIcon /> Facebook
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Signup Header */}
            <div className="flex items-center justify-center mb-8 relative pt-1">
              <span className="font-bold text-gray-800 text-xl">Sign up</span>
              <button onClick={onClose} className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Signup Form */}
            <div className="flex gap-3 mb-5">
              <div className="border border-gray-300 rounded px-3 py-3 text-[15px] flex items-center justify-center bg-gray-50 w-[100px] shrink-0 text-gray-800 font-medium">
                PH+63
              </div>
              <input 
                type="text" 
                placeholder="Please enter your phone number" 
                className="w-full border border-gray-300 rounded px-3 py-3 outline-none focus:border-lazada-orange text-[15px] transition-colors" 
              />
            </div>

            <div className="flex items-start gap-3 mb-6">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 border-gray-300 rounded text-lazada-orange focus:ring-lazada-orange cursor-pointer w-4 h-4 shrink-0 transition-colors" 
              />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-tight cursor-pointer">
                By creating and/or using your account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button className="w-full bg-lazada-orange text-white font-bold py-3.5 rounded text-[15px] mb-3 flex items-center justify-center gap-2 hover:bg-[#e06633] transition-colors shadow-sm">
              <Smartphone size={18} strokeWidth={2} /> 
              Send code via SMS
            </button>
            
            <button className="w-full bg-white text-lazada-orange border border-lazada-orange font-bold py-3 rounded text-[15px] mb-8 flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
              <WhatsappIcon />
              Send code via Whatsapp
            </button>

            <div className="text-center text-[15px] text-gray-500 mb-8">
              Already have an account? <span onClick={() => onSwitchView('login')} className="text-blue-600 cursor-pointer hover:underline font-medium">Log in Now</span>
            </div>

            {/* Signup Footer */}
            <div className="text-center text-sm text-gray-500 mb-5 relative">
              <span className="bg-white px-2 relative z-10">Or, sign up with</span>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-100 z-0"></div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-gray-50 flex-1 py-2.5 border border-gray-200 rounded text-sm transition-colors disabled:opacity-50"
              >
                <GoogleIcon /> Google
              </button>
              <button disabled className="flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-gray-50 flex-1 py-2.5 border border-gray-200 rounded text-sm transition-colors opacity-50 cursor-not-allowed">
                <FacebookIcon /> Facebook
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
