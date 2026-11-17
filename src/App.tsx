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
  '/pf-withdrawal-guide': 'EPF Withdrawal Online: Complete Rules, Procedure & Tax Guide (2026)',
  '/form-15g-pf-withdrawal': 'Form 15G & 15H Guide for PF Withdrawal & FD | calctax.in',
  '/tds-rates-2026-27': 'TDS Rates Chart FY 2026-27 (AY 2027-28) | calctax.in',
  '/tds-vs-tcs': 'TDS vs TCS Difference Explained | calctax.in',
  '/guides': 'EPF Withdrawal Online: Complete Rules, Procedure & Tax Guide (2026)',
  '/about-us': 'About Us – calctax.in',
  '/contact-us': 'Contact – calctax.in',
  '/disclaimer': 'Disclaimer – calctax.in',
  '/privacy-policy': 'Privacy Policy – calctax.in',
  '/terms-and-conditions': 'Terms & Conditions – calctax.in',
};

const DEFAULT_META_DESCRIPTION =
  'Calculate Indian TDS on Salary (192), FD Interest (194A), Rent (194I/194IB), HRA Exemption (10(13A)), and EPF Interest (8.25%) for FY 2026-27 on calctax.in.';

const EPF_GUIDE_META_DESCRIPTION =
  'Learn the complete EPF withdrawal procedure online. Check updated EPF withdrawal rules, claim status steps, forms, and taxability in simple terms.';

const EPF_GUIDE_KEYWORDS =
  'EPF Withdrawal, EPF withdrawal online, EPF withdrawal rules, EPF withdrawal procedure, EPF withdrawal claim status, EPF withdrawal taxability, EPF withdrawal limit';

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
    const title = ROUTE_TITLES[currentPath] || ROUTE_TITLES['/'];
    const isEpfGuide = currentPath === '/guides' || currentPath === '/pf-withdrawal-guide';
    const description = isEpfGuide ? EPF_GUIDE_META_DESCRIPTION : DEFAULT_META_DESCRIPTION;

    document.title = title;

    const setMeta = (selector: string, attrName: 'name' | 'property', attrVal: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (isEpfGuide) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', EPF_GUIDE_KEYWORDS);
      setMeta(
        'meta[property="og:image"]',
        'property',
        'og:image',
        `${window.location.origin}/assets/epf-withdrawal-feature.jpg`
      );
    }
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
    <div className="relative min-h-screen flex flex-col bg-[#ECF8F2] text-slate-900 overflow-x-hidden">
      {/* Subtle Light-Green Backdrop with Medium-Size Rupee (₹) Symbol Watermark Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-0 z-0 opacity-[0.065]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ctext x='90' y='110' text-anchor='middle' font-family='Plus Jakarta Sans, Arial, sans-serif' font-size='64' font-weight='700' fill='%230F766E' transform='rotate(-15 90 90)'%3E%E2%82%B9%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
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
    </div>
  );
}
