import React from 'react';
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { CalculatorTab, TdsSubTab } from './Header';

interface EpfWithdrawalGuideArticleProps {
  onNavigate: (path: string, tool?: CalculatorTab, tdsSubTab?: TdsSubTab) => void;
  showBackButton?: boolean;
}

const EPF_WITHDRAWAL_FAQS = [
  {
    q: '1. How many days does an online EPF withdrawal take to credit?',
    a: 'Once submitted online, EPFO typically processes and credits standard claims within 7 to 15 working days. Auto-settled advance claims (with the auto-settlement limit enhanced up to ₹5,00,000 for eligible illness, marriage, education, and housing advances) generally process within 3 to 4 working days.',
  },
  {
    q: '2. Can I apply for an EPF withdrawal without my employer’s approval?',
    a: 'Yes. If your UAN is active and seeded with a verified Aadhaar and bank account, your online claim goes directly to the EPFO without requiring employer attestation or signatures.',
  },
  {
    q: '3. How do I check my EPF withdrawal claim status?',
    a: 'Log in to the EPFO Member e-Sewa Portal, click on Online Services, and select Track Claim Status. You can also track claim status anytime on the UMANG app using your UAN.',
  },
  {
    q: '4. Is a cancelled cheque mandatory for online EPF withdrawal?',
    a: 'No. EPFO has removed the mandatory requirement to upload a scanned copy of a cancelled cheque leaf or attested bank passbook for online claims where your bank account KYC is already digitally verified via Aadhaar.',
  },
  {
    q: '5. What is the maximum EPF withdrawal limit for medical emergencies?',
    a: 'Under Paragraph 68J, for medical treatment of yourself or immediate family members, you can withdraw up to 6 months’ basic wages and dearness allowance (DA), or your total employee share with interest—whichever is lower (subject to retaining any statutory minimum balance for ongoing accounts).',
  },
  {
    q: '6. Can I withdraw EPF while still working in the same company?',
    a: 'Yes. You can apply for a partial EPF advance using Form 31 while still employed, provided you meet the eligibility, purpose, and minimum service duration criteria set by EPFO.',
  },
  {
    q: '7. Why does an EPF withdrawal claim get rejected?',
    a: 'Common rejection reasons include a mismatch in name, gender, or date of birth between Aadhaar and EPFO records, incorrect bank account or IFSC details, or your previous employer not updating your "Date of Exit" (which employees can mark online 2 months after leaving a job).',
  },
  {
    q: '8. Is there any charge for submitting an EPF withdrawal online?',
    a: 'No. Submitting an online EPF withdrawal or advance claim through the official EPFO Member Portal or UMANG app is 100% free of cost.',
  },
];

const ARTICLE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'EPF Withdrawal Online: Complete Rules, Procedure & Tax Guide (2026)',
  image: 'https://calctax.in/assets/epf-withdrawal-feature.jpg',
  description:
    'Learn the complete EPF withdrawal procedure online. Check updated EPF withdrawal rules, claim status steps, forms, and taxability in simple terms.',
  keywords:
    'EPF Withdrawal, EPF withdrawal online, EPF withdrawal rules, EPF withdrawal procedure, EPF withdrawal claim status, EPF withdrawal taxability, EPF withdrawal limit',
  author: {
    '@type': 'Person',
    name: 'Sumit Roy',
  },
  publisher: {
    '@type': 'Organization',
    name: 'calctax.in',
    url: 'https://calctax.in',
  },
  dateModified: '2026-11-17',
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: EPF_WITHDRAWAL_FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q.replace(/^\d+\.\s*/, ''),
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export const EpfWithdrawalGuideArticle: React.FC<EpfWithdrawalGuideArticleProps> = ({
  onNavigate,
  showBackButton = true,
}) => {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {showBackButton && (
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Calculators</span>
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-9 space-y-7">
        {/* Header & Meta */}
        <header className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500">
            <span className="text-teal-700 font-semibold">PF Withdrawal &amp; Tax Guide</span>
            <span aria-hidden="true">·</span>
            <span>Updated for 2026 EPFO &amp; Income Tax Rules</span>
            <span aria-hidden="true">·</span>
            <span>6 min read</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            EPF Withdrawal Online: Rules, Step-by-Step Procedure, and Tax Guide
          </h1>

          <figure className="pt-2 pb-1">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-emerald-50/40">
              <picture>
                <source srcSet="/assets/epf-withdrawal-feature.webp" type="image/webp" />
                <img
                  src="/assets/epf-withdrawal-feature.jpg"
                  alt="Online EPF withdrawal claim approved on laptop with Aadhaar and PAN KYC cards"
                  width={1024}
                  height={572}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-auto aspect-[1024/572] object-cover block"
                />
              </picture>
            </div>
            <figcaption className="mt-2 text-xs text-slate-500">
              Online EPF withdrawal requires an active UAN with verified Aadhaar, PAN, and bank KYC details.
            </figcaption>
          </figure>

          <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
            Managing your Employees&apos; Provident Fund (EPF) does not require standing in long queues or chasing
            former employers for signatures anymore. Thanks to the unified EPFO Member e-Sewa Portal and the UMANG
            app, completing an EPF withdrawal from home takes just a few minutes—provided your KYC details are updated.
          </p>
          <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
            Whether you are switching jobs, planning a major life milestone, or facing a financial emergency,
            understanding the latest EPF withdrawal rules and procedure ensures your money reaches your bank account
            without unnecessary rejections.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/epf-interest-calculator', 'epf')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Open EPF Interest Calculator (8.25%)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/form-15g-pf-withdrawal', 'tds', 'fd')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-teal-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Form 15G / 15H Rules for PF</span>
            </button>
          </div>
        </header>

        {/* Section 1: Latest EPF Withdrawal Rules */}
        <section className="space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            What Are the Latest EPF Withdrawal Rules?
          </h2>
          <p className="text-slate-700 leading-relaxed text-[15px]">
            The Employees&apos; Provident Fund Organisation (EPFO) allows two types of withdrawals depending on your
            employment status:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-teal-800 font-display font-bold text-base">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h3>Full Withdrawal (Final Settlement)</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                You can withdraw <strong>100% of your EPF corpus</strong> upon retirement (at <strong>age 55+</strong>{' '}
                under EPF Scheme rules; age 58 for EPS pension), permanent incapacity, VRS, retrenchment, or permanent
                migration abroad.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>If unemployed:</strong> You can withdraw up to <strong>75%</strong> of your EPF balance after{' '}
                <strong>1 month</strong> of continuous unemployment. Under the updated 2025–2026 EPFO framework, the
                remaining <strong>25% minimum balance</strong> stays invested and can be settled in full after{' '}
                <strong>12 months</strong> of continuous unemployment (previously 2 months under legacy rules) to
                protect pension and service continuity.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
                <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                <h3>Partial Withdrawal (EPF Advance)</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                While still employed, you can withdraw a portion of your balance via <strong>Form 31</strong> for
                verified needs (subject to retaining the 25% minimum balance where applicable):
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-slate-700">
                <li>
                  <strong>Medical Emergencies (Para 68J):</strong> Up to <strong>6 months&apos; basic wages + DA</strong>{' '}
                  or employee share with interest (whichever is lower).
                </li>
                <li>
                  <strong>Marriage / Education (Para 68K):</strong> Up to <strong>50% of employee share</strong> with
                  interest after <strong>7 years</strong> of service.
                </li>
                <li>
                  <strong>Buying / Constructing a House (Para 68B):</strong> After <strong>5 years</strong> of service
                  (home loan repayment requires 10 years).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Step-by-Step Procedure */}
        <section className="space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Step-by-Step EPF Withdrawal Procedure Online
          </h2>
          <p className="text-slate-700 leading-relaxed text-[15px]">
            Before starting your EPF withdrawal online, ensure your Universal Account Number (UAN) is active, and your
            Aadhaar, PAN, and bank account details are verified on the portal.
          </p>

          <ol className="space-y-3">
            {[
              {
                title: 'Log in to the EPFO Portal',
                desc: 'Visit the official EPFO Member e-Sewa Portal (unifiedportal-mem.epfindia.gov.in) and sign in using your UAN, password, and captcha code.',
              },
              {
                title: 'Verify KYC Details',
                desc: 'Go to the Manage tab and click KYC to confirm that your Aadhaar, PAN, and bank account number with IFSC are marked as "Verified".',
              },
              {
                title: 'Select Online Claim',
                desc: 'Click on the Online Services tab in the top menu and select Claim (Form-31, 19, 10C & 10D) from the dropdown.',
              },
              {
                title: 'Authenticate Bank Account',
                desc: 'Enter the last four digits of your seeded bank account number, click Verify, and agree to the certificate of undertaking.',
              },
              {
                title: 'Choose Claim Type',
                desc: 'Click Proceed for Online Claim and select the exact form you need:',
                sublist: [
                  'Form 19: For final EPF settlement.',
                  'Form 10C: For EPS pension withdrawal benefit (< 10 years service) or Scheme Certificate.',
                  'Form 10D: For monthly EPS pension after age 58 (with 10+ years of service).',
                  'Form 31: For partial EPF advance while working.',
                ],
              },
              {
                title: 'Enter Amount and Address',
                desc: 'Fill in the required withdrawal amount, select the purpose of advance (if using Form 31), and enter your current residential address.',
              },
              {
                title: 'Submit with Aadhaar OTP',
                desc: 'Tick the declaration checkbox, click Get Aadhaar OTP, enter the OTP sent to your Aadhaar-linked mobile number, and submit the form.',
              },
            ].map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3.5 bg-slate-50/80 border border-slate-200 rounded-lg p-4"
              >
                <span className="w-7 h-7 rounded-full bg-teal-700 text-white font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <p className="font-display font-bold text-slate-900">{step.title}</p>
                  <p className="leading-relaxed">{step.desc}</p>
                  {step.sublist && (
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-700">
                      {step.sublist.map((sub) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 3: Taxability */}
        <section className="space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            EPF Withdrawal Taxability: When Is It Tax-Free?
          </h2>
          <p className="text-slate-700 leading-relaxed text-[15px]">
            Understanding EPF withdrawal taxability under <strong>Section 192A</strong> of the Income Tax Act saves you
            from surprise TDS deductions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-display font-bold text-teal-900 text-base">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <h3>After 5 Years of Continuous Service</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Any withdrawal (full or partial) made after completing <strong>5 years of continuous service</strong> is{' '}
                <strong>100% tax-free</strong>. If you changed jobs and transferred your old PF balance to your new
                employer using your UAN, service across all previous employers counts toward the 5-year period.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-display font-bold text-amber-950 text-base">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <h3>Before 5 Years of Service (Sec 192A TDS)</h3>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                If you withdraw <strong>₹50,000 or more</strong> before completing 5 years of continuous service, TDS
                applies at <strong>10% (if PAN is linked)</strong> or <strong>20% (if PAN is not linked</strong>,
                reduced from the earlier Maximum Marginal Rate via Finance Act 2023).
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">
                No TDS is deducted if you submit <strong>Form 15G / 15H</strong> (when total taxable income is nil), or
                if withdrawal is due to ill health, business closure, or reasons beyond your control.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Withdrawal Scenario</th>
                  <th className="py-2.5 px-4 font-semibold">TDS Rate (Sec 192A)</th>
                  <th className="py-2.5 px-4 font-semibold">How to Avoid TDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">5+ Years Continuous Service</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-teal-800">0% (Tax-Free)</td>
                  <td className="py-2.5 px-4">Automatically exempt; transfer PF on job switch</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">&lt; 5 Years &amp; Amount &lt; ₹50,000</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-teal-800">0% (No TDS)</td>
                  <td className="py-2.5 px-4">Below Section 192A threshold</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">&lt; 5 Years, ₹50,000+ (With PAN)</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">10%</td>
                  <td className="py-2.5 px-4">Submit Form 15G / 15H if income is below exempt limit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">&lt; 5 Years, ₹50,000+ (No PAN)</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-amber-800">20%</td>
                  <td className="py-2.5 px-4">Link PAN under Manage &gt; KYC before claiming</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: FAQs */}
        <section className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-700 shrink-0" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="space-y-3">
            {EPF_WITHDRAWAL_FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-slate-50/80 border border-slate-200 rounded-lg px-4 py-3.5"
                open
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-display font-semibold text-slate-900 text-sm sm:text-base">
                  <span>{faq.q}</span>
                </summary>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
