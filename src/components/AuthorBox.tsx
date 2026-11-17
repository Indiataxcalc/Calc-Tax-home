import React, { useState } from 'react';
import { MapPin, Mail, ShieldCheck } from 'lucide-react';

interface AuthorBoxProps {
  onNavigate?: (path: string) => void;
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({ onNavigate }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      aria-label="About the Author and Legal Disclaimer"
      className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-10"
    >
      {/* Author Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
            {!imgError ? (
              <img
                src="/assets/aistudio/IMG_20241112_153310217_HDR_AE_86169a88.jpg"
                alt="Sumit Roy – Founder and Publisher at calctax.in"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <span className="font-display text-xl font-bold text-teal-800">SR</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-1.5">
              <span>About the Author</span>
              <span aria-hidden="true">·</span>
              <span>Last verified for FY 2026-27</span>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Sumit Roy
            </h2>

            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-700">
              Sumit Roy is an independent digital publisher and personal finance researcher based in
              Bamangachi, Murali, North 24 Parganas, West Bengal. Through <strong>calctax.in</strong>, he builds
              fast, transparent calculation tools and plain-language tax guides so salaried employees, senior
              citizens, and small businesses across India can verify TDS deductions, HRA exemptions, and EPF
              interest before final filing.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Bamangachi, Murali, North 24 Parganas, West Bengal, India</span>
              </span>
              <a
                href="mailto:sumitroy2110@gmail.com"
                className="inline-flex items-center gap-1.5 text-blue-700 hover:underline"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>sumitroy2110@gmail.com</span>
              </a>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/about-us')}
                  className="text-teal-700 font-medium hover:underline"
                >
                  About Us
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Legal Financial Disclaimer */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Last verified for FY 2026-27.</strong> Disclaimer: This tool provides estimates for
            informational purposes only. Please consult a qualified Chartered Accountant (CA) or check official
            Income Tax portals before final filing.
          </p>
        </div>
      </div>
    </section>
  );
};
