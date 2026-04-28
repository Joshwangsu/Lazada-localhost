import React, { useState } from 'react';
import { 
  Globe, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2, 
  PlayCircle, 
  HelpCircle, 
  Users, 
  Briefcase,
  ChevronRight,
  EyeOff,
  MessageCircle,
  Percent,
  TrendingUp,
  Gift,
  Target
} from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface SellerLandingProps {
  onBackToMain: () => void;
  onLoginClick: () => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SellerLanding({ onBackToMain, onLoginClick }: SellerLandingProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'sms'>('sms');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Since App.tsx listens to onAuthStateChanged, the user state will update automatically
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing in with Google", error);
    }
  };

  const steps = [
    { title: "Sign up with your local phone number.", content: "Start your journey by creating an account securely with your phone number." },
    { title: "Fill in Email and Address", content: "Provide your basic contact and location details." },
    { title: "Submit ID and Bank Account", content: "Verify your identity and set up your bank account to receive payments." },
    { title: "Upload Products and Start Selling", content: "List your inventory and start accepting orders from millions of buyers." }
  ];

  const faqs = [
    { q: "What documentation is required for registering on Lazada?", a: "You need a valid government-issued ID and a registered bank account under your name." },
    { q: "What are Prohibited and Restricted product for sale on Lazada?", a: "We prohibit the sale of illegal items, hazardous materials, and certain branded goods without authorization. Please refer to our seller policies." },
    { q: "What happens when sellers list Prohibited Products?", a: "Listings will be deactivated, and repeated offenses may lead to store suspension." },
    { q: "Why we need the return process and what is the benefit of return process?", a: "A robust return process builds buyer trust, resulting in higher conversion rates." }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white h-[60px] flex items-center justify-between px-6 lg:px-20 shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToMain}>
            <svg width="40" height="35" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#2525F5"/>
            </svg>
            <div className="flex flex-col pt-1">
              <span className="text-[#0f136d] font-bold text-xl leading-none">Lazada</span>
              <span className="text-[#2525F5] font-semibold text-lg leading-none tracking-tight">Seller Center</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="flex items-center gap-2 text-blue-600">
              <span className="material-icons bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">S</span> MarketPlace
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Globe size={18} className="text-purple-600" /> LazGlobal
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <img src="https://flagcdn.com/w20/ph.png" alt="PH" className="w-full h-full object-cover" />
            </div>
            Pilipinas <ChevronDown size={14} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            English <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f136d] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f136d] via-[#1b1c4b] to-transparent z-10 w-2/3"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-1/2">
          {/* using an unsplash placeholder for the seller image */}
          <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=2574" 
            alt="Seller" 
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-20 flex flex-col md:flex-row gap-10">
          <div className="flex-1 pt-10">
            <h1 className="text-5xl md:text-7xl font-black mb-1 leading-tight tracking-tight text-white">
              GROW YOUR<br />BUSINESS<br />WITH US!
            </h1>
            
            <div className="flex flex-wrap gap-8 md:gap-12 mt-16 pb-8">
              <div className="flex items-center gap-2">
                <div className="text-[64px] font-black leading-none flex items-baseline">80<span className="text-2xl ml-1 text-blue-400 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold">M</span></div>
                <div className="text-sm font-medium max-w-[120px] leading-tight text-gray-300 border-l border-white/20 pl-4 h-full flex items-center">Monthly Active Users on Lazada</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[64px] font-black leading-none flex items-baseline">1<span className="text-2xl ml-1 text-blue-400 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold">M</span></div>
                <div className="text-sm font-medium max-w-[120px] leading-tight text-gray-300 border-l border-white/20 pl-4 h-full flex items-center">Products across 100+ countries</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[64px] font-black leading-none flex items-baseline">70<span className="text-2xl ml-1 text-blue-400 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold">%</span></div>
                <div className="text-sm font-medium max-w-[140px] leading-tight text-gray-300 border-l border-white/20 pl-4 h-full flex items-center">New sellers make their first sale within 4 weeks</div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[420px] shrink-0 xl:mr-10">
            <div className="bg-white text-gray-800 rounded-xl p-8 shadow-2xl relative">
              {authMode === 'signup' ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">Create your Lazada Store now</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Already have an account? Click to <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }} className="text-blue-600 font-medium hover:underline">Log in</a>
                  </p>

                  <div className="flex justify-center gap-8 mb-6 border-b border-gray-100">
                    <button 
                      onClick={() => setActiveTab('voice')}
                      className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'voice' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                    >
                      Voice Call
                    </button>
                    <button 
                      onClick={() => setActiveTab('sms')}
                      className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'sms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                    >
                      SMS
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 transition-colors">
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-300 flex items-center gap-2 font-medium bg-gray-50 text-[15px]">
                        <img src="https://flagcdn.com/w20/ph.png" alt="PH" className="w-5" /> +63
                      </div>
                      <input type="text" placeholder="Phone number" className="flex-1 px-3 outline-none text-[15px] font-medium" />
                    </div>
                    <div className="relative border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 transition-colors">
                      <input type="password" placeholder="New Password" className="w-full px-3 py-3 outline-none text-[15px]" />
                      <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" size={18} />
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded mb-4 transition-colors">
                    {activeTab === 'voice' ? 'Send OTP via Voice Call' : 'Verify with SMS'}
                  </button>

                  <div className="text-xs text-gray-500 mb-6 leading-relaxed">
                    By clicking Next, you agree to these <a href="#" className="text-blue-600">Terms & Conditions</a> , <a href="#" className="text-blue-600">Seller Instant Messaging Al Terms</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
                  </div>

                  <div className="relative text-center mb-6">
                    <span className="bg-white px-2 text-xs text-gray-400 relative z-10">or</span>
                    <div className="absolute top-1/2 left-0 right-0 border-t border-gray-200 z-0"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <button className="flex-1 border border-gray-200 rounded py-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-600 rounded-md flex items-center justify-center shrink-0 mr-2">
                         <span className="text-white text-[10px] font-bold">Laz</span>
                      </div>
                      <span className="text-sm font-medium">Lazada App</span>
                    </button>
                    <button onClick={handleGoogleLogin} className="flex-1 border border-gray-200 rounded py-2.5 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <GoogleIcon />
                      <span className="text-sm font-medium ml-2 sm:hidden text-gray-700">Google</span>
                    </button>
                  </div>

                  <a href="#" className="text-blue-600 font-medium text-sm flex items-center gap-1 justify-center hover:underline">
                    <Globe size={16} /> Sign up as LazGlobal Seller <ChevronRight size={16} />
                  </a>
                </>
              ) : (
                <>
                  {/* QR Code corner fold effect */}
                  <div className="absolute top-0 right-0 overflow-hidden rounded-tr-xl">
                    <div className="w-16 h-16 bg-blue-50/50 relative transform translate-x-3 -translate-y-3 rotate-45 border-l border-b border-gray-200"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Login with Password</h2>
                    <button className="flex items-center gap-2 text-blue-600 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors z-10 relative mr-6 sm:mr-8">
                      Log in with QR Code
                    </button>
                    {/* The small QR code icon floating at top right */}
                    <div className="absolute right-0 top-0 sm:top-1/2 sm:-translate-y-1/2 bg-blue-600 text-white rounded p-1 w-8 h-10 flex flex-col items-center justify-center">
                       <div className="border-2 border-white rounded-sm w-4 h-4 mt-1 relative flex items-center justify-center">
                          <span className="text-[8px] font-bold">$</span>
                          <div className="absolute top-0 left-0 w-1 h-1 bg-white"></div>
                          <div className="absolute bottom-0 right-0 w-1 h-1 bg-white"></div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5 mb-6">
                    <input 
                      type="text" 
                      placeholder="Mobile Number/ Email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded text-[15px] outline-none focus:border-blue-500 transition-colors bg-white focus:bg-white inset-shadow-none" 
                    />
                    <div className="relative border border-gray-300 rounded focus-within:border-blue-500 bg-white transition-colors">
                      <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full px-4 py-3 outline-none text-[15px] bg-transparent" 
                      />
                      <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" size={18} />
                    </div>
                  </div>

                  {authError && <div className="text-red-500 text-sm mb-4">{authError}</div>}

                  <button className="w-full bg-[#1e61f9] hover:bg-blue-700 text-white font-medium py-3 rounded mb-3 transition-colors text-base" onClick={(e) => { e.preventDefault(); alert("Please login using the Google button below.");}}>
                    Login
                  </button>

                  <button className="w-full bg-white border border-blue-200 text-[#1e61f9] font-medium py-3 rounded mb-4 hover:bg-blue-50 transition-colors text-base">
                    Login with OTP
                  </button>

                  <div className="flex justify-end mb-8">
                    <a href="#" className="text-[#1e61f9] text-sm font-medium hover:underline">Reset password</a>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    -- Connect with --
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
                    <button className="flex items-center justify-center gap-2 bg-[#f2f4f8] hover:bg-gray-200 text-gray-600 rounded-full py-2 px-4 transition-colors w-full sm:w-auto">
                      <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                         <span className="text-white text-[10px] font-bold">Laz</span>
                      </div>
                      <span className="text-sm">Lazada Buyer APP</span>
                    </button>
                    <button className="flex items-center justify-center bg-white rounded-full p-2 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto" onClick={handleGoogleLogin}>
                      <GoogleIcon />
                      <span className="text-sm text-gray-600 sm:hidden">Google</span>
                    </button>
                  </div>

                  <div className="text-center pt-6 border-t border-gray-100 text-[13px] text-gray-500 bg-gray-50 -mx-8 -mb-8 pb-8 rounded-b-xl">
                    Don't have an account yet? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); }} className="text-[#1e61f9] font-medium hover:underline">Create a new account</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm flex items-center gap-2">
          Scroll down to explore more <ChevronDown size={16} />
        </div>
      </section>

      {/* New Seller Benefits */}
      <section className="bg-white py-16 px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">New Seller Benefits</h2>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center max-w-[150px]">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 transition-transform hover:scale-110">
              <Percent size={32} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">0% commission fee</h3>
            <p className="text-xs text-gray-500">0% Platform commission fee for first 90 days</p>
          </div>
          <div className="flex flex-col items-center max-w-[150px]">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4 transition-transform hover:scale-110">
              <Gift size={32} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Free Campaign Voucher</h3>
            <p className="text-xs text-gray-500">0% Campaign Vouchers Commission Rate for 1 Campaign</p>
          </div>
          <div className="flex flex-col items-center max-w-[150px]">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 mb-4 transition-transform hover:scale-110">
              <Target size={32} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Seller Coins & Boost Traffic</h3>
            <p className="text-xs text-gray-500">Extra seller coins & 14 days free trial for traffic exchange</p>
          </div>
          <div className="flex flex-col items-center max-w-[150px]">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 transition-transform hover:scale-110">
              <TrendingUp size={32} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Ads Credit for you</h3>
            <p className="text-xs text-gray-500">Get PHP 1,200 Ads Credit</p>
          </div>
          <div className="flex flex-col items-center max-w-[150px]">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 transition-transform hover:scale-110">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Incubation support</h3>
            <p className="text-xs text-gray-500">Personal consultant with Lazada University</p>
          </div>
        </div>
      </section>

      {/* Steps to Start Selling */}
      <section className="bg-[#f2f4f8] py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Steps to Start Selling</h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1 md:pr-10">
            <p className="text-gray-600 leading-relaxed mb-6">
              Selling on Lazada provides you with good opportunity to step into the SEA market and access to learning materials and support you to achieve your business goals. Seller can be easily benefited through Lazada's platform since product would be displayed to a wide rang of buyers.
            </p>
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded transition-colors">
              Sign up now
            </button>
          </div>
          <div className="flex-1 space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenStep(openStep === idx ? null : idx)}
                >
                  <span className="font-bold text-gray-800">{idx + 1}. {step.title}</span>
                  {openStep === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
                {openStep === idx && (
                  <div className="px-6 pb-4 pt-1 text-sm text-gray-600">
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller's Story */}
      <section className="bg-white py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Seller's Story</h2>
        <div className="max-w-5xl mx-auto bg-[#fafafa] rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-[45%]">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" 
              alt="Seller Story" 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          <div className="flex-1 p-10 flex flex-col justify-center">
            <p className="text-gray-700 leading-relaxed italic mb-6">
              "When we took the risk of starting a business here in the Philippines, we began with just a team of five. Our daily orders grew from 20 to 20x more, allowing us to create more jobs and expand our team to around 50 now!"
            </p>
            <p className="text-sm text-gray-500 font-medium mb-10">- Kroos Gu, COO of Commalax</p>
            
            <div className="flex bg-blue-600 text-white rounded-lg p-6 justify-between items-center text-center">
              <div>
                <div className="text-3xl font-black mb-1">147%</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80 max-w-[80px] mx-auto leading-tight">Achieved a new CMV high</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div>
                <div className="text-3xl font-black mb-1">15%</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Order Uplift</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div>
                <div className="text-3xl font-black mb-1">40K</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Followers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller's Program */}
      <section className="bg-[#0f136d] py-16 px-6 lg:px-20 text-white">
        <h2 className="text-3xl font-bold mb-12 text-center">Seller's Program</h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white text-gray-800 rounded-xl p-8 flex flex-col items-start relative overflow-hidden group">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-600 mb-2">
              <span className="material-icons bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">S</span> MarketPlace
            </div>
            <p className="text-sm text-gray-500 mb-6">Offer consumers the widest assortment of goods from local sellers</p>
            <ul className="space-y-4 text-sm bg-gray-50 p-5 rounded-lg w-full mb-8">
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> You are based locally</li>
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Access to wide array of seller tools</li>
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> 0% commission for the first 90 days</li>
            </ul>
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded transition-colors text-sm">
              Sign up now
            </button>
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-xl p-8 flex flex-col items-start relative overflow-hidden group">
            <div className="flex items-center gap-2 text-xl font-bold text-purple-600 mb-2">
              <Globe size={24} /> LazGlobal
            </div>
            <p className="text-sm text-gray-500 mb-6">You want to sell across South East Asia</p>
            <ul className="space-y-4 text-sm bg-gray-50 p-5 rounded-lg w-full mb-8">
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> You want to sell across South East Asia</li>
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> New seller is eligible for 90 days commission free plan after approval</li>
              <li className="flex gap-3 items-start"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Enterprise Alipay with a balance of not less than 3000RMB</li>
            </ul>
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded transition-colors text-sm">
              Find Out More
            </button>
          </div>
        </div>
      </section>

      {/* Seller's Support */}
      <section className="bg-[#f9f9f9] py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Seller's Support</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-lazada-dark">
                <PlayCircle className="text-lazada-orange" size={20} /> Lazada <span className="font-light text-gray-500">University</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Free onboarding video course</h3>
            <p className="text-xs text-gray-500 leading-relaxed">which will teach you the essential e-commerce knowledge in content, operations, order fulfillment, and policies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-lazada-dark">
                <HelpCircle className="text-blue-600" size={20} /> Help Center
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Helping sellers with the problems</h3>
            <p className="text-xs text-gray-500 leading-relaxed">they face when starting a shop on Lazada.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-lazada-dark">
                <Users className="text-green-500" size={20} /> Seller's Community
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">Go-to hub</h3>
            <p className="text-xs text-gray-500 leading-relaxed">where sellers gather to elevate their ecommerce business. Connect with thousands of like-minded & supportive sellers to engage in discussion & share insights.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-lazada-dark">
                <Briefcase className="text-purple-600" size={20} /> Lazada <span className="font-light text-gray-500">ServiceMarketplace</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-2">We helps sellers find digital services</h3>
            <p className="text-xs text-gray-500 leading-relaxed">provided by selected Lazada partners.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-6 lg:px-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4">
                <div 
                  className="flex items-center justify-between py-2 cursor-pointer group"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} className="text-gray-400 shrink-0 ml-4" /> : <ChevronDown size={20} className="text-gray-400 shrink-0 ml-4" />}
                </div>
                {openFaq === idx && (
                  <div className="py-2 text-sm text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded transition-colors text-sm">
              Need more help
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f0f2f5] pt-12 pb-6 px-6 lg:px-20 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="28" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#2525F5"/>
              </svg>
              <div className="flex flex-col justify-center">
                <span className="text-[#0f136d] font-bold text-sm leading-none">Lazada</span>
                <span className="text-[#2525F5] font-semibold text-xs leading-none">Seller Center</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">We are Lazada</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600">Our Story</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Seller Center</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600">Service Marketplace</a></li>
              <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Social Media</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600">Facebook</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Download Seller App</h4>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="w-24 h-24 mb-2 opacity-70" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-200 pt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Lazada Seller Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
