import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { CLUSTER_ARTICLES, FY2627_TDS_TABLE } from '../data/seoContent';
import { CalculatorWorkspace } from './CalculatorWorkspace';
import { CalculatorTab, TdsSubTab } from './Header';
import { EpfWithdrawalGuideArticle } from './EpfWithdrawalGuideArticle';

interface SubPagesProps {
  path: string;
  activeTab: CalculatorTab;
  onTabChange: (tab: CalculatorTab) => void;
  tdsSubTab: TdsSubTab;
  onTdsSubTabChange: (sub: TdsSubTab) => void;
  onNavigate: (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => void;
}

export const SubPages: React.FC<SubPagesProps> = ({
  path,
  activeTab,
  onTabChange,
  tdsSubTab,
  onTdsSubTabChange,
  onNavigate,
}) => {
  const matchedCluster = CLUSTER_ARTICLES.find((a) => a.slug === path);

  // Dedicated Calculator & Guide Cluster Pages
  if (matchedCluster) {
    return (
      <div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Calculators</span>
          </button>
        </div>

        {matchedCluster.linkedTool && (
          <CalculatorWorkspace
            activeTab={activeTab}
            onTabChange={onTabChange}
            tdsSubTab={tdsSubTab}
            onTdsSubTabChange={onTdsSubTabChange}
            compactTitle={matchedCluster.title}
          />
        )}

        {matchedCluster.slug === '/pf-withdrawal-guide' ? (
          <EpfWithdrawalGuideArticle onNavigate={onNavigate} showBackButton={false} />
        ) : (
          <article className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="text-xs text-slate-500">
              <span>{matchedCluster.category}</span>
              <span aria-hidden="true"> · </span>
              <span>Target: {matchedCluster.targetKeyword}</span>
              <span aria-hidden="true"> · </span>
              <span>Last verified for FY 2026-27</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-slate-900">{matchedCluster.title}</h2>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Key Rules Summary (FY 2026-27)</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                {matchedCluster.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-5 pt-2">
              {matchedCluster.sections.map((sec) => (
                <section key={sec.heading} className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">{sec.heading}</h3>
                  <p className="text-slate-700 leading-relaxed text-[15px]">{sec.body}</p>
                </section>
              ))}
            </div>

            {matchedCluster.slug === '/tds-rates-2026-27' && (
              <div className="overflow-x-auto border border-slate-200 rounded-lg mt-4">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Section</th>
                      <th className="py-2.5 px-3 font-semibold">Payment</th>
                      <th className="py-2.5 px-3 font-semibold">Threshold</th>
                      <th className="py-2.5 px-3 font-semibold">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {FY2627_TDS_TABLE.map((row) => (
                      <tr key={`${row.section}-${row.natureOfPayment}`}>
                        <td className="py-2.5 px-3 font-mono font-semibold text-teal-800">{row.section}</td>
                        <td className="py-2.5 px-3 text-slate-800">{row.natureOfPayment}</td>
                        <td className="py-2.5 px-3 text-slate-700 tabular-nums">{row.thresholdFY2627}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-900 tabular-nums">{row.rateWithPan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </article>
        )}
      </div>
    );
  }

  // Dedicated PF Withdrawal & Tax Guide Blog Post (/guides)
  if (path === '/guides') {
    return <EpfWithdrawalGuideArticle onNavigate={onNavigate} />;
  }

  // Empty Page Shells for Header ("Contact") and Footer ("Information & Legal")
  const emptyShellPages: Record<string, { title: string }> = {
    '/about-us': { title: 'About Us' },
    '/disclaimer': { title: 'Disclaimer' },
    '/contact-us': { title: 'Contact' },
    '/privacy-policy': { title: 'Privacy Policy' },
    '/terms-and-conditions': { title: 'Terms & Conditions' },
  };

  const page = emptyShellPages[path] || emptyShellPages['/about-us'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="text-xs text-slate-500">
          <span>calctax.in</span>
          <span aria-hidden="true"> · </span>
          <span className="text-teal-700 font-semibold">Last verified for FY 2026-27</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{page.title}</h1>

        {path === '/about-us' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
            <img
              src="/assets/aistudio/IMG_20241112_153310217_HDR_AE_86169a88.jpg"
              alt="Sumit Roy – calctax.in"
              referrerPolicy="no-referrer"
              className="w-28 h-28 rounded-xl object-cover object-center border border-slate-200 shrink-0"
            />
            <div className="space-y-1.5 text-sm text-slate-600">
              <p className="font-display text-base font-bold text-slate-900">Sumit Roy</p>
              <p>Publisher, calctax.in</p>
              <p className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Bamangachi, Murali, North 24 Parganas, West Bengal, India</span>
              </p>
            </div>
          </div>
        )}

        <div className="min-h-[160px] bg-slate-50 border border-dashed border-slate-200 rounded-lg p-5" />

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            ← Back to calctax.in Calculators
          </button>
        </div>
      </div>
    </div>
  );
};
