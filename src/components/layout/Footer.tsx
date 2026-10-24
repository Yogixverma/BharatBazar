import React from 'react';
import { Globe, ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#232f3e] text-white">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3.5 text-center text-xs font-semibold tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        <ArrowUp className="w-4 h-4" />
        <span>Back to top</span>
      </button>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-300">
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:underline text-left">
                About BharatBazaar
              </button>
            </li>
            <li>
              <a href="#careers" className="hover:underline">
                Careers at BharatBazaar
              </a>
            </li>
            <li>
              <a href="#press" className="hover:underline">
                Press Releases
              </a>
            </li>
            <li>
              <a href="#science" className="hover:underline">
                Bharat Science & AI
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Connect with Us</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">
                Twitter / X
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="#whatsapp" className="hover:underline">
                WhatsApp Deals Channel
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('admin')} className="hover:underline text-amber-400 font-medium text-left">
                Sell on BharatBazaar (Admin)
              </button>
            </li>
            <li>
              <a href="#accelerator" className="hover:underline">
                Sell under Bharat Accelerator
              </a>
            </li>
            <li>
              <a href="#protect" className="hover:underline">
                Protect and Build Your Brand
              </a>
            </li>
            <li>
              <a href="#affiliate" className="hover:underline">
                Become an Affiliate Partner
              </a>
            </li>
            <li>
              <a href="#fbb" className="hover:underline">
                Fulfilment by BharatBazaar (FBB)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:underline text-left">
                Your Account & Pincodes
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:underline text-left">
                Returns Centre & Tracking
              </button>
            </li>
            <li>
              <a href="#protection" className="hover:underline">
                100% Purchase Protection
              </a>
            </li>
            <li>
              <button onClick={() => onNavigate('help')} className="hover:underline text-left">
                Customer Service & FAQs
              </button>
            </li>
            <li>
              <a href="#app" className="hover:underline">
                BharatBazaar App Download
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Brand & Language Middle Bar */}
      <div className="border-t border-[#3a4553] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-gray-300">
          <div className="flex items-center gap-1 font-black text-xl text-white">
            <span>Bharat<span className="text-[#febd69]">Bazaar</span></span>
            <span className="text-xs text-amber-400">.in</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border border-gray-500 rounded-sm px-3 py-1 bg-transparent text-gray-200">
              <Globe className="w-3.5 h-3.5" />
              <span>English - EN</span>
            </div>

            <div className="flex items-center gap-1.5 border border-gray-500 rounded-sm px-3 py-1 bg-transparent text-gray-200">
              <span>🇮🇳 India</span>
            </div>

            <div className="flex items-center gap-1.5 border border-gray-500 rounded-sm px-3 py-1 bg-transparent text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Indian Payment Badges */}
        <div className="max-w-3xl mx-auto mt-4 pt-4 border-t border-[#3a4553]/60 flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400">
          <span className="font-semibold text-gray-300">Supported Payment Methods:</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-amber-300 font-bold">UPI / GPay / PhonePe</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-blue-300 font-bold">RuPay</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-white font-bold">Visa & Mastercard</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-emerald-300 font-bold">Cash on Delivery</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-purple-300 font-bold">Net Banking</span>
        </div>
      </div>

      {/* Sub-footer Legal */}
      <div className="bg-[#131a22] py-6 px-4 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <a href="#terms" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#privacy" className="hover:underline">Privacy Notice</a>
          <a href="#ads" className="hover:underline">Interest-Based Ads</a>
          <a href="#security" className="hover:underline">Security & Verification</a>
        </div>
        <p className="text-gray-500">
          © 2026, BharatBazaar.in, Inc. or its affiliates. Built for college project portfolio demonstration.
        </p>
      </div>
    </footer>
  );
};
