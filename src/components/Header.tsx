import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export type CalculatorTab = 'tds' | 'hra' | 'epf';
export type TdsSubTab = 'salary' | 'fd' | 'rent';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLinkClick = (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => {
    setToolsOpen(false);
    setMobileMenuOpen(false);
    onNavigate(path, tool, tdsSubTab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-md"
          aria-label="calctax.in Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="28" height="28" rx="6" fill="#0F766E" />
            <path d="M7 9.5H21M7 14H15M7 18.5H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="19.5" cy="17.5" r="3.5" fill="#1D4ED8" stroke="white" strokeWidth="1.5" />
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            calc<span className="text-teal-700">tax</span>
            <span className="text-blue-700">.in</span>
          </span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center md:gap-4 lg:gap-7 text-sm font-medium text-slate-700" aria-label="Main navigation">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-teal-700 ${
              currentPath === '/' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Home
          </a>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((prev) => !prev)}
              aria-expanded={toolsOpen}
              className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded"
            >
              <span>Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div
                className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleLinkClick('/tds-calculator', 'tds', 'salary')}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                >
                  <div className="font-semibold">TDS Calculator</div>
                  <div className="text-xs text-slate-500 mt-0.5">Salary (192), FD (194A) &amp; Rent (194I/194IB)</div>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleLinkClick('/hra-exemption-calculator', 'hra')}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition-colors border-t border-slate-100"
                >
                  <div className="font-semibold">HRA Exemption Calculator</div>
                  <div className="text-xs text-slate-500 mt-0.5">Section 10(13A) Metro &amp; Non-Metro</div>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleLinkClick('/epf-interest-calculator', 'epf')}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-50 hover:text-teal-700 transition-colors border-t border-slate-100"
                >
                  <div className="font-semibold">EPF Calculator</div>
                  <div className="text-xs text-slate-500 mt-0.5">8.25% monthly running balance</div>
                </button>
              </div>
            )}
          </div>

          <a
            href="/guides"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/guides');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-teal-700 ${
              currentPath === '/guides' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            PF Withdrawal &amp; Tax Guide
          </a>

          <a
            href="/contact-us"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/contact-us');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-teal-700 ${
              currentPath === '/contact-us' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('/', 'tds', 'salary')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
          >
            TDS Calculator
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/tds-calculator', 'tds', 'salary')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            TDS Calculator
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/hra-exemption-calculator', 'hra')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            HRA Exemption Calculator
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/epf-interest-calculator', 'epf')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            EPF Calculator
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/guides')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            PF Withdrawal &amp; Tax Guide
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/contact-us')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
