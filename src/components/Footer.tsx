import React from 'react';
import { CalculatorTab, TdsSubTab } from './Header';

interface FooterProps {
  onNavigate: (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (e: React.MouseEvent, path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => {
    e.preventDefault();
    onNavigate(path, tool, tdsSubTab);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a
              href="/"
              onClick={(e) => go(e, '/')}
              className="font-display text-xl font-bold tracking-tight text-white inline-block"
            >
              calctax<span className="text-teal-400">.in</span>
            </a>
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              Updated for FY 2026-27 as per Income Tax Act. Fast TDS, HRA Exemption, and EPF Interest calculators
              for Indian taxpayers.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-3">Calculators &amp; Guides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/tds-calculator"
                  onClick={(e) => go(e, '/tds-calculator', 'tds', 'salary')}
                  className="hover:text-white transition-colors"
                >
                  TDS Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tds-on-salary-calculator"
                  onClick={(e) => go(e, '/tds-on-salary-calculator', 'tds', 'salary')}
                  className="hover:text-white transition-colors"
                >
                  TDS on Salary Calculator
                </a>
              </li>
              <li>
                <a
                  href="/hra-exemption-calculator"
                  onClick={(e) => go(e, '/hra-exemption-calculator', 'hra')}
                  className="hover:text-white transition-colors"
                >
                  HRA Exemption Calculator
                </a>
              </li>
              <li>
                <a
                  href="/epf-interest-calculator"
                  onClick={(e) => go(e, '/epf-interest-calculator', 'epf')}
                  className="hover:text-white transition-colors"
                >
                  EPF Calculator
                </a>
              </li>
              <li>
                <a
                  href="/pf-withdrawal-guide"
                  onClick={(e) => go(e, '/pf-withdrawal-guide')}
                  className="hover:text-white transition-colors"
                >
                  PF Withdrawal Rules
                </a>
              </li>
            </ul>
          </div>

          {/* Information & Legal Section — Buttons only as requested */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-3">Information &amp; Legal</h3>
            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/about-us')}
                className="w-full sm:w-auto px-3.5 py-2 text-left text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/disclaimer')}
                className="w-full sm:w-auto px-3.5 py-2 text-left text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Disclaimer
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/contact-us')}
                className="w-full sm:w-auto px-3.5 py-2 text-left text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Contact Us
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/privacy-policy')}
                className="w-full sm:w-auto px-3.5 py-2 text-left text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/terms-and-conditions')}
                className="w-full sm:w-auto px-3.5 py-2 text-left text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 calctax.in. Managed by Sumit Roy, Bamangachi, West Bengal.</p>
          <p>
            Email:{' '}
            <a href="mailto:sumitroy2110@gmail.com" className="text-slate-200 hover:underline">
              sumitroy2110@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
