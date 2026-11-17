import { useState, useEffect } from 'react';
import { Header, CalculatorTab, TdsSubTab } from './components/Header';
import { CalculatorWorkspace } from './components/CalculatorWorkspace';
import { PillarSeoSection } from './components/PillarSeoSection';
import { ClusterLinksGrid } from './components/ClusterLinksGrid';
import { SubPages } from './components/SubPages';
import { AuthorBox } from './components/AuthorBox';
import { Footer } from './components/Footer';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'calctax.in – TDS Calculator India, HRA Exemption & EPF Calculator (FY 2026-27)',
  '/tds-calculator': 'TDS Calculator India (Sec 192, 194A, 194I/194IB) – FY 2026-27 | calctax.in',
  '/tds-on-salary-calculator': 'TDS on Salary Calculator (Section 192) – FY 2026-27 | calctax.in',
  '/tds-on-rent-calculator': 'TDS on Rent Calculator (Section 194IB & 194I) – FY 2026-27 | calctax.in',
  '/tds-on-fd-calculator': 'TDS on FD Calculator (Section 194A) – FY 2026-27 | calctax.in',
  '/hra-exemption-calculator': 'HRA Exemption Calculator (Section 10(13A)) – FY 2026-27 | calctax.in',
  '/epf-interest-calculator': 'EPF Interest Calculator (8.25%) – FY 2026-27 | calctax.in',
  '/pf-withdrawal-guide': 'PF Withdrawal Rules 2026 & Tax Guide | calctax.in',
  '/form-15g-pf-withdrawal': 'Form 15G & 15H Guide for PF Withdrawal & FD | calctax.in',
  '/tds-rates-2026-27': 'TDS Rates Chart FY 2026-27 (AY 2027-28) | calctax.in',
  '/tds-vs-tcs': 'TDS vs TCS Difference Explained | calctax.in',
  '/guides': 'Indian Tax, TDS & PF Withdrawal Guides (FY 2026-27) | calctax.in',
  '/about-us': 'About Us – calctax.in',
  '/contact-us': 'Contact Us – calctax.in',
  '/disclaimer': 'Disclaimer – calctax.in',
  '/privacy-policy': 'Privacy Policy – calctax.in',
  '/terms-and-conditions': 'Terms & Conditions – calctax.in',
};

function resolveInitialTool(path: string): { tab: CalculatorTab; sub: TdsSubTab } {
  if (path === '/hra-exemption-calculator') return { tab: 'hra', sub: 'salary' };
  if (path === '/epf-interest-calculator' || path === '/pf-withdrawal-guide') {
    return { tab: 'epf', sub: 'salary' };
  }
  if (path === '/tds-on-fd-calculator' || path === '/form-15g-pf-withdrawal') {
    return { tab: 'tds', sub: 'fd' };
  }
  if (path === '/tds-on-rent-calculator') return { tab: 'tds', sub: 'rent' };
  return { tab: 'tds', sub: 'salary' };
}

export default function App() {
  const initialPath = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';
  const initialTools = resolveInitialTool(initialPath);

  const [currentPath, setCurrentPath] = useState<string>(
    ROUTE_TITLES[initialPath] ? initialPath : '/'
  );
  const [activeTab, setActiveTab] = useState<CalculatorTab>(initialTools.tab);
  const [tdsSubTab, setTdsSubTab] = useState<TdsSubTab>(initialTools.sub);

  useEffect(() => {
    const onPopState = () => {
      const nextPath = window.location.pathname || '/';
      setCurrentPath(ROUTE_TITLES[nextPath] ? nextPath : '/');
      const resolved = resolveInitialTool(nextPath);
      setActiveTab(resolved.tab);
      setTdsSubTab(resolved.sub);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[currentPath] || ROUTE_TITLES['/'];
  }, [currentPath]);

  const handleNavigate = (path: string, tool?: CalculatorTab, sub?: TdsSubTab) => {
    const normalized = ROUTE_TITLES[path] ? path : '/';
    if (tool) setActiveTab(tool);
    if (sub) setTdsSubTab(sub);
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPath === '/' ? (
          <>
            <CalculatorWorkspace
              activeTab="tds"
              onTabChange={setActiveTab}
              tdsSubTab={tdsSubTab}
              onTdsSubTabChange={setTdsSubTab}
            />
            <ClusterLinksGrid onNavigate={handleNavigate} />
            <PillarSeoSection />
          </>
        ) : (
          <SubPages
            path={currentPath}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tdsSubTab={tdsSubTab}
            onTdsSubTabChange={setTdsSubTab}
            onNavigate={handleNavigate}
          />
        )}

        {/* Author Box & Mandatory Financial Disclaimer on EVERY page */}
        <AuthorBox onNavigate={handleNavigate} />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
