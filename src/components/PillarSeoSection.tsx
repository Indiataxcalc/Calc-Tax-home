import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FY2627_TDS_TABLE, HINGLISH_FAQS } from '../data/seoContent';

export const PillarSeoSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
      {/* 600–700 Word SEO Pillar Content Block */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl space-y-5 text-slate-700 leading-relaxed text-[15px] sm:text-base">
          <div className="text-xs font-medium text-slate-500">
            <span>Income Tax and TDS Calculation Tools</span>
            <span aria-hidden="true"> · </span>
            <span>Last verified for FY 2026-27</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            TDS Calculator India: Income Tax, HRA Exemption &amp; EPF Tools for FY 2026-27
          </h2>

          <p>
            Planning your take-home pay, fixed deposit returns, or house rent compliance starts with an accurate{' '}
            <strong>TDS calculator India</strong> tool. On <strong>calctax.in</strong>, we combine a fast{' '}
            <strong>TDS Calculator</strong> (covering Section 192 Salary, Section 194A Fixed Deposit Interest, and
            Section 194I/194IB Rent), a <strong>TDS on Salary Calculator</strong>, an{' '}
            <strong>HRA Exemption Calculator</strong> (Section 10(13A)), and an{' '}
            <strong>EPF Interest Calculator</strong> (8.25% p.a.)—all verified for Financial Year 2026-27
            (Assessment Year 2027-28).
          </p>

          <h3 className="font-display text-xl font-bold text-slate-900 pt-2">
            How Tax Deducted at Source (TDS) Works in India
          </h3>

          <p>
            Under Chapter XVII-B of the Income Tax Act, 1961, Tax Deducted at Source collects income tax directly at
            the point of payment. Employers, banks, and tenants deduct a prescribed percentage before releasing funds
            and deposit it against your PAN. Every deduction is recorded in your Form 26AS and Annual Information
            Statement (AIS), so you receive full tax credit—or a refund if excess TDS was deducted—when filing your
            Income Tax Return (ITR).
          </p>

          <p>
            For FY 2026-27, salaried individuals under the default New Tax Regime (Section 115BAC) receive a ₹75,000
            standard deduction and full Section 87A rebate up to ₹12,00,000 net taxable income—meaning zero monthly
            salary TDS up to ₹12,75,000 gross salary. Taxpayers claiming house rent exemption via our{' '}
            <strong>HRA Exemption Calculator</strong> or Section 80C/80D deductions can compare their tax liability
            against the Old Tax Regime before submitting Form 12BB to HR.
          </p>

          <h3 className="font-display text-xl font-bold text-slate-900 pt-2">
            Working TDS Formula Breakdown &amp; Solved Numerical Example
          </h3>

          <p>
            While bank FD interest (10% above threshold under Section 194A) and residential rent above ₹50,000/month
            (2% under Section 194IB) use flat percentages, employer salary TDS under Section 192 divides your
            projected full-year income tax evenly across 12 months:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-800 space-y-1.5">
            <p className="font-semibold text-teal-800">
              Monthly Salary TDS = (Estimated Annual Tax + 4% Health &amp; Education Cess) ÷ 12
            </p>
            <p className="text-slate-600">
              Net Taxable Income = Gross Annual Salary − Standard Deduction − Eligible Exemptions
            </p>
          </div>

          <p>
            <strong>Solved Numerical Example (FY 2026-27 New Tax Regime):</strong> Suppose an employee earns{' '}
            <strong>₹14,50,000</strong> gross annual salary:
          </p>

          <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-[15px]">
            <li>
              <strong>Standard Deduction:</strong> ₹14,50,000 − ₹75,000 ={' '}
              <span className="font-mono font-semibold text-slate-900 tabular-nums">₹13,75,000</span> net taxable
              income.
            </li>
            <li>
              <strong>Slab Tax Computation:</strong> ₹0–₹4L (0%) = ₹0; ₹4L–₹8L (5%) ={' '}
              <span className="font-mono tabular-nums">₹20,000</span>; ₹8L–₹12L (10%) ={' '}
              <span className="font-mono tabular-nums">₹40,000</span>; ₹12L–₹13.75L (15% on ₹1,75,000) ={' '}
              <span className="font-mono tabular-nums">₹26,250</span>. Total Slab Tax ={' '}
              <span className="font-mono font-semibold text-slate-900 tabular-nums">₹86,250</span>.
            </li>
            <li>
              <strong>Add 4% Health &amp; Education Cess:</strong> 4% of ₹86,250 ={' '}
              <span className="font-mono tabular-nums">₹3,450</span>. Total Annual Tax ={' '}
              <span className="font-mono font-semibold text-slate-900 tabular-nums">₹89,700</span>.
            </li>
            <li>
              <strong>Monthly TDS (Section 192):</strong> ₹89,700 ÷ 12 ={' '}
              <span className="font-mono font-semibold text-teal-800 tabular-nums">₹7,475 per month</span>.
            </li>
          </ol>

          <h3 className="font-display text-xl font-bold text-slate-900 pt-2">
            PF Withdrawal Rules &amp; EPF Interest Compliance
          </h3>

          <p>
            Beyond TDS and HRA, our <strong>EPF Calculator</strong> tracks monthly running balances at the FY 2026-27
            EPFO rate of 8.25% p.a. When planning a <strong>PF Withdrawal</strong>, remember that withdrawals after 5
            years of continuous service are tax-free, whereas premature withdrawals of ₹50,000 or more attract 10%
            TDS under Section 192A unless Form 15G or Form 15H is submitted. Always verify your PAN linkage to avoid
            higher 20% TDS deductions under Section 206AA.
          </p>
        </div>
      </section>

      {/* Quick Reference Tax & TDS Rate Table for FY 2026-27 */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Quick Reference TDS Rate &amp; Threshold Table (FY 2026-27)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Verified statutory exemption thresholds and deduction rates applicable across India for FY 2026-27.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Section</th>
                  <th className="py-3 px-4 font-semibold">Nature of Payment</th>
                  <th className="py-3 px-4 font-semibold">FY 2026-27 Threshold</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">With PAN</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Without PAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {FY2627_TDS_TABLE.map((row) => (
                  <tr key={`${row.section}-${row.natureOfPayment}`} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-semibold text-teal-800 whitespace-nowrap">
                      {row.section}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{row.natureOfPayment}</td>
                    <td className="py-3 px-4 text-slate-700 tabular-nums">{row.thresholdFY2627}</td>
                    <td className="py-3 px-4 font-mono text-slate-900 tabular-nums">{row.rateWithPan}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">{row.rateNoPan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Conversational Hinglish FAQ Section */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Frequently Asked Questions (Conversational Hinglish Guide)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Common questions Indian taxpayers ask about TDS, Form 15G/15H, HRA, and PF withdrawal.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {HINGLISH_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-display text-sm sm:text-base font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-teal-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
};
