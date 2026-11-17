import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CLUSTER_ARTICLES } from '../data/seoContent';
import { CalculatorTab, TdsSubTab } from './Header';

interface ClusterLinksGridProps {
  onNavigate: (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => void;
}

export const ClusterLinksGrid: React.FC<ClusterLinksGridProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            All Calculators &amp; Tax Guides on calctax.in
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Dedicated pages for TDS on Salary Calculator, HRA Exemption Calculator, EPF Interest Calculator, and PF Withdrawal Rules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/guides')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
        >
          <span>View all guides</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLUSTER_ARTICLES.slice(0, 6).map((item) => (
          <a
            key={item.slug}
            href={item.slug}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.slug, item.linkedTool, item.tdsSubTab);
            }}
            className="group bg-white border border-slate-200 hover:border-teal-700/60 rounded-xl p-5 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="text-xs text-slate-500 mb-2">
                <span>{item.category}</span>
                <span aria-hidden="true"> · </span>
                <span>{item.readTime}</span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.summary}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>{item.slug}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
