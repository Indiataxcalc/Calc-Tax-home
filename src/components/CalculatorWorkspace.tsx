import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Calculator,
  FileDown,
  ArrowRight,
} from 'lucide-react';
import {
  AgeBracket,
  EmployerEpfRule,
  EpfResult,
  FdDepositorCategory,
  FdLimitStandard,
  FdTdsResult,
  HraResult,
  RentSectionType,
  RentTdsResult,
  SalaryTdsResult,
  TaxRegime,
  calculateEpfInterest,
  calculateFdTDS,
  calculateHraExemption,
  calculateRentTDS,
  calculateSalaryTDS,
  formatINR,
  formatINRCompact,
} from '../lib/calculators';
import { CalculatorTab, TdsSubTab } from './Header';
import { downloadCalculationPdf } from '../lib/pdfExport';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 13.84 2.5 15.57 3.37 17.05L2.12 21.62L6.82 20.39C8.26 21.18 10.08 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#25D366"
    />
    <path
      d="M16.92 14.57C16.65 14.43 15.32 13.78 15.07 13.69C14.83 13.6 14.65 13.55 14.47 13.82C14.29 14.09 13.78 14.69 13.62 14.87C13.47 15.05 13.31 15.07 13.04 14.94C12.77 14.8 11.9 14.52 10.87 13.6C10.07 12.89 9.53 12.01 9.37 11.74C9.22 11.47 9.35 11.33 9.49 11.19C9.61 11.07 9.76 10.88 9.89 10.72C10.03 10.56 10.07 10.45 10.16 10.27C10.25 10.09 10.21 9.93 10.14 9.79C10.07 9.66 9.53 8.33 9.31 7.79C9.09 7.27 8.87 7.34 8.7 7.33C8.54 7.32 8.36 7.32 8.18 7.32C8 7.32 7.71 7.39 7.46 7.66C7.22 7.93 6.53 8.57 6.53 9.89C6.53 11.21 7.49 12.48 7.62 12.66C7.76 12.84 9.5 15.53 12.18 16.69C12.82 16.96 13.31 17.13 13.7 17.25C14.34 17.45 14.92 17.42 15.38 17.35C15.89 17.28 16.96 16.71 17.19 16.08C17.41 15.45 17.41 14.91 17.34 14.8C17.28 14.68 17.19 14.64 16.92 14.57Z"
      fill="#FFFFFF"
    />
  </svg>
);

interface CalculatorWorkspaceProps {
  activeTab: CalculatorTab;
  onTabChange: (tab: CalculatorTab) => void;
  tdsSubTab: TdsSubTab;
  onTdsSubTabChange: (sub: TdsSubTab) => void;
  compactTitle?: string;
}

const DEFAULT_SALARY = {
  annualGrossSalary: '1450000',
  regime: 'new' as TaxRegime,
  ageGroup: 'below60' as AgeBracket,
  deductionsChapter6A: '150000',
  hraExemption: '120000',
};

const DEFAULT_FD = {
  annualInterest: '65000',
  category: 'general' as FdDepositorCategory,
  limitStandard: 'fy2627' as FdLimitStandard,
  hasPan: true,
  form15Submitted: false,
};

const DEFAULT_RENT = {
  monthlyRent: '60000',
  monthsOccupied: '12',
  section: '194IB' as RentSectionType,
  hasPan: true,
};

const DEFAULT_HRA = {
  period: 'monthly' as 'monthly' | 'annual',
  basicSalary: '55000',
  da: '0',
  hraReceived: '22000',
  rentPaid: '20000',
  isMetro: true,
};

const DEFAULT_EPF = {
  monthlyBasicDa: '45000',
  openingBalance: '350000',
  employeePercent: '12',
  employerRule: 'standard_367' as EmployerEpfRule,
  annualIncrementPercent: '8',
  currentAge: '29',
  retirementAge: '58',
};

function parseNum(val: string): number {
  const n = parseFloat(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export const CalculatorWorkspace: React.FC<CalculatorWorkspaceProps> = ({
  activeTab,
  tdsSubTab,
  onTdsSubTabChange,
  compactTitle,
}) => {
  // Draft input states
  const [salaryDraft, setSalaryDraft] = useState(DEFAULT_SALARY);
  const [fdDraft, setFdDraft] = useState(DEFAULT_FD);
  const [rentDraft, setRentDraft] = useState(DEFAULT_RENT);
  const [hraDraft, setHraDraft] = useState(DEFAULT_HRA);
  const [epfDraft, setEpfDraft] = useState(DEFAULT_EPF);

  // Committed result states (only populated when user clicks "Calculate")
  const [salaryResult, setSalaryResult] = useState<SalaryTdsResult | null>(null);
  const [fdResult, setFdResult] = useState<FdTdsResult | null>(null);
  const [rentResult, setRentResult] = useState<RentTdsResult | null>(null);
  const [hraResult, setHraResult] = useState<HraResult | null>(null);
  const [epfResult, setEpfResult] = useState<EpfResult | null>(null);

  // Dirty indicators to show when inputs changed since last Calculate press
  const [salaryDirty, setSalaryDirty] = useState(false);
  const [fdDirty, setFdDirty] = useState(false);
  const [rentDirty, setRentDirty] = useState(false);
  const [hraDirty, setHraDirty] = useState(false);
  const [epfDirty, setEpfDirty] = useState(false);

  const [epfView, setEpfView] = useState<'fy' | 'retirement'>('fy');
  const [copied, setCopied] = useState(false);
  const resultsPanelRef = useRef<HTMLDivElement>(null);

  const runCalculation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (activeTab === 'tds') {
      if (tdsSubTab === 'salary') {
        setSalaryResult(
          calculateSalaryTDS({
            annualGrossSalary: parseNum(salaryDraft.annualGrossSalary),
            regime: salaryDraft.regime,
            ageGroup: salaryDraft.ageGroup,
            deductionsChapter6A: parseNum(salaryDraft.deductionsChapter6A),
            hraExemption: parseNum(salaryDraft.hraExemption),
          })
        );
        setSalaryDirty(false);
      } else if (tdsSubTab === 'fd') {
        setFdResult(
          calculateFdTDS({
            annualInterest: parseNum(fdDraft.annualInterest),
            category: fdDraft.category,
            limitStandard: fdDraft.limitStandard,
            hasPan: fdDraft.hasPan,
            form15Submitted: fdDraft.form15Submitted,
          })
        );
        setFdDirty(false);
      } else {
        setRentResult(
          calculateRentTDS({
            monthlyRent: parseNum(rentDraft.monthlyRent),
            monthsOccupied: Math.max(1, Math.min(12, parseNum(rentDraft.monthsOccupied) || 12)),
            section: rentDraft.section,
            hasPan: rentDraft.hasPan,
          })
        );
        setRentDirty(false);
      }
    } else if (activeTab === 'hra') {
      setHraResult(
        calculateHraExemption({
          basicSalary: parseNum(hraDraft.basicSalary),
          da: parseNum(hraDraft.da),
          hraReceived: parseNum(hraDraft.hraReceived),
          rentPaid: parseNum(hraDraft.rentPaid),
          isMetro: hraDraft.isMetro,
          period: hraDraft.period,
        })
      );
      setHraDirty(false);
    } else {
      setEpfResult(
        calculateEpfInterest({
          monthlyBasicDa: parseNum(epfDraft.monthlyBasicDa),
          openingBalance: parseNum(epfDraft.openingBalance),
          employeePercent: parseNum(epfDraft.employeePercent),
          employerRule: epfDraft.employerRule,
          annualIncrementPercent: parseNum(epfDraft.annualIncrementPercent),
          currentAge: Math.max(18, Math.min(59, parseNum(epfDraft.currentAge) || 29)),
          retirementAge: Math.max(20, Math.min(70, parseNum(epfDraft.retirementAge) || 58)),
        })
      );
      setEpfDirty(false);
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1024 && resultsPanelRef.current) {
      resultsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleReset = () => {
    if (activeTab === 'tds') {
      if (tdsSubTab === 'salary') {
        setSalaryDraft(DEFAULT_SALARY);
        setSalaryResult(null);
        setSalaryDirty(false);
      } else if (tdsSubTab === 'fd') {
        setFdDraft(DEFAULT_FD);
        setFdResult(null);
        setFdDirty(false);
      } else {
        setRentDraft(DEFAULT_RENT);
        setRentResult(null);
        setRentDirty(false);
      }
    } else if (activeTab === 'hra') {
      setHraDraft(DEFAULT_HRA);
      setHraResult(null);
      setHraDirty(false);
    } else {
      setEpfDraft(DEFAULT_EPF);
      setEpfResult(null);
      setEpfDirty(false);
    }
  };

  const getActiveSummaryText = (): string => {
    if (activeTab === 'tds' && tdsSubTab === 'salary' && salaryResult) {
      return [
        `calctax.in — Salary TDS Estimate (FY 2026-27 / AY 2027-28)`,
        `Regime: ${salaryResult.regime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}`,
        `Gross Salary: ${formatINR(salaryResult.grossSalary)}`,
        `Net Taxable Income: ${formatINR(salaryResult.netTaxableIncome)}`,
        `Total Annual Tax (incl. 4% Cess): ${formatINR(salaryResult.totalAnnualTax)}`,
        `Estimated Monthly TDS (Sec 192): ${formatINR(salaryResult.monthlyTds)}/month`,
      ].join('\n');
    }
    if (activeTab === 'tds' && tdsSubTab === 'fd' && fdResult) {
      return [
        `calctax.in — FD Interest TDS (Sec 194A, FY 2026-27)`,
        `Annual FD Interest: ${formatINR(fdResult.annualInterest)}`,
        `Threshold Applied: ${formatINR(fdResult.threshold)}`,
        `TDS Rate: ${fdResult.applicableRate}%`,
        `Estimated TDS Deducted: ${formatINR(fdResult.tdsAmount)}`,
        `Net Interest Received: ${formatINR(fdResult.netInterestReceived)}`,
      ].join('\n');
    }
    if (activeTab === 'tds' && tdsSubTab === 'rent' && rentResult) {
      return [
        `calctax.in — Rent TDS (${rentDraft.section}, FY 2026-27)`,
        `Monthly Rent: ${formatINR(rentResult.monthlyRent)} x ${rentResult.monthsOccupied} months`,
        `TDS Rate: ${rentResult.tdsRate}%`,
        `Total Annual TDS: ${formatINR(rentResult.totalTds)}`,
        `Net Payable to Landlord: ${formatINR(rentResult.netPayableToLandlord)}`,
      ].join('\n');
    }
    if (activeTab === 'hra' && hraResult) {
      return [
        `calctax.in — HRA Exemption (Sec 10(13A), FY 2026-27)`,
        `Annual Exempt HRA: ${formatINR(hraResult.annualExemptHra)} (${formatINR(hraResult.monthlyExemptHra)}/mo)`,
        `Annual Taxable HRA: ${formatINR(hraResult.annualTaxableHra)}`,
      ].join('\n');
    }
    if (activeTab === 'epf' && epfResult) {
      return [
        `calctax.in — EPF Interest Estimate (8.25% FY 2026-27)`,
        `FY 2026-27 Interest Earned: ${formatINR(epfResult.annualInterestEarned)}`,
        `FY Closing Balance: ${formatINR(epfResult.closingBalanceFY)}`,
        `Projected Corpus (${epfResult.yearsToRetire} yrs): ${formatINR(epfResult.projectedRetirementCorpus)}`,
      ].join('\n');
    }
    return '';
  };

  const activeSummaryText = getActiveSummaryText();
  const hasActiveResult = activeSummaryText.length > 0;

  const handleCopyResult = async () => {
    if (!activeSummaryText) return;
    try {
      await navigator.clipboard.writeText(activeSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadPdf = () => {
    if (activeTab === 'tds' && tdsSubTab === 'salary' && salaryResult) {
      downloadCalculationPdf({
        filename: 'salary-tds-fy2026-27-calctax.pdf',
        heading: 'Salary TDS Calculation (Section 192)',
        subtitle: `${salaryResult.regime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} | FY 2026-27 (AY 2027-28)`,
        rows: [
          { label: 'Annual Gross Salary', value: formatINR(salaryResult.grossSalary) },
          { label: 'Standard Deduction', value: `- ${formatINR(salaryResult.standardDeduction)}` },
          ...(salaryResult.otherDeductions > 0
            ? [{ label: 'HRA + Chapter VI-A Deductions', value: `- ${formatINR(salaryResult.otherDeductions)}` }]
            : []),
          { label: 'Net Taxable Income', value: formatINR(salaryResult.netTaxableIncome), bold: true },
          { label: 'Income Tax on Slabs', value: formatINR(salaryResult.slabTax) },
          ...(salaryResult.rebate87A > 0
            ? [{ label: 'Section 87A Rebate', value: `- ${formatINR(salaryResult.rebate87A)}` }]
            : []),
          ...(salaryResult.marginalRelief > 0
            ? [{ label: '87A Marginal Relief', value: `- ${formatINR(salaryResult.marginalRelief)}` }]
            : []),
          ...(salaryResult.surcharge > 0
            ? [{ label: 'Surcharge', value: formatINR(salaryResult.surcharge) }]
            : []),
          { label: 'Health & Education Cess (4%)', value: formatINR(salaryResult.cess) },
          { label: 'Total Annual Tax Payable', value: formatINR(salaryResult.totalAnnualTax), bold: true },
          { label: 'Estimated Monthly TDS (Sec 192)', value: `${formatINR(salaryResult.monthlyTds)} / mo`, bold: true },
        ],
        note: `Effective tax rate: ${salaryResult.effectiveRate}%. Recommended regime: ${
          salaryResult.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'
        }.`,
      });
      return;
    }

    if (activeTab === 'tds' && tdsSubTab === 'fd' && fdResult) {
      downloadCalculationPdf({
        filename: 'fd-interest-tds-194a-calctax.pdf',
        heading: 'FD Interest TDS Summary (Section 194A)',
        subtitle: `${fdDraft.category === 'senior' ? 'Senior Citizen (60+)' : 'General Depositor (< 60 yrs)'} | FY 2026-27`,
        rows: [
          { label: 'Total Annual FD / RD Interest', value: formatINR(fdResult.annualInterest) },
          { label: 'Exemption Threshold Applied', value: formatINR(fdResult.threshold) },
          { label: 'Threshold Status', value: fdResult.isThresholdCrossed ? 'Exceeded' : 'Within Exemption Limit' },
          { label: 'Applicable TDS Rate', value: `${fdResult.applicableRate}%` },
          { label: 'Estimated TDS Deducted', value: formatINR(fdResult.tdsAmount), bold: true },
          { label: 'Net Interest Credited', value: formatINR(fdResult.netInterestReceived), bold: true },
        ],
        note: fdResult.statusNote,
      });
      return;
    }

    if (activeTab === 'tds' && tdsSubTab === 'rent' && rentResult) {
      downloadCalculationPdf({
        filename: 'rent-tds-calculation-calctax.pdf',
        heading: `Rent TDS Summary (${rentDraft.section === '194IB' ? 'Section 194IB' : 'Section 194I'})`,
        subtitle: `FY 2026-27 (AY 2027-28) | Tenancy: ${rentResult.monthsOccupied} months`,
        rows: [
          { label: 'Monthly Rent', value: formatINR(rentResult.monthlyRent) },
          { label: `Total Rent (${rentResult.monthsOccupied} months)`, value: formatINR(rentResult.totalAnnualRent) },
          { label: 'Monthly Rent Threshold', value: `${formatINR(rentResult.monthlyThreshold)} / mo` },
          { label: 'Applicable TDS Rate', value: `${rentResult.tdsRate}%` },
          { label: 'Total TDS Liability', value: formatINR(rentResult.totalTds), bold: true },
          { label: 'Net Paid to Landlord', value: formatINR(rentResult.netPayableToLandlord), bold: true },
        ],
        note: rentResult.deductionTiming,
      });
      return;
    }

    if (activeTab === 'hra' && hraResult) {
      downloadCalculationPdf({
        filename: 'hra-exemption-10-13a-calctax.pdf',
        heading: 'HRA Tax Exemption (Section 10(13A))',
        subtitle: `${hraDraft.isMetro ? 'Metro City (50%)' : 'Non-Metro City (40%)'} | Old Tax Regime`,
        rows: [
          { label: '1. Actual HRA Received (Annual)', value: formatINR(hraResult.clause1ActualHra) },
          {
            label: `2. ${hraDraft.isMetro ? '50%' : '40%'} of (Basic + DA)`,
            value: formatINR(hraResult.clause2MetroPercent),
          },
          { label: '3. Rent Paid - 10% of (Basic + DA)', value: formatINR(hraResult.clause3ExcessRent) },
          {
            label: 'Annual Exempt HRA (Lowest of 3)',
            value: `${formatINR(hraResult.annualExemptHra)} (${formatINR(hraResult.monthlyExemptHra)}/mo)`,
            bold: true,
          },
          {
            label: 'Annual Taxable HRA',
            value: `${formatINR(hraResult.annualTaxableHra)} (${formatINR(hraResult.monthlyTaxableHra)}/mo)`,
            bold: true,
          },
        ],
        note: 'HRA exemption under Section 10(13A) is available only under the Old Tax Regime.',
      });
      return;
    }

    if (activeTab === 'epf' && epfResult) {
      downloadCalculationPdf({
        filename: 'epf-interest-projection-calctax.pdf',
        heading: 'EPF Interest & Corpus Calculation (8.25% p.a.)',
        subtitle: `FY 2026-27 EPFO Circular | Retirement Horizon: ${epfResult.yearsToRetire} years`,
        rows: [
          { label: 'Monthly Employee PF Share', value: `${formatINR(epfResult.monthlyEmployeeContrib)} / mo` },
          { label: 'Monthly Employer EPF Share', value: `${formatINR(epfResult.monthlyEmployerEpf)} / mo` },
          { label: 'FY 2026-27 Interest Earned (8.25%)', value: formatINR(epfResult.annualInterestEarned), bold: true },
          { label: 'FY 2026-27 Closing Balance', value: formatINR(epfResult.closingBalanceFY), bold: true },
          { label: 'Total Principal at Retirement', value: formatINR(epfResult.totalPrincipalAtRetirement) },
          { label: 'Total Compounded Interest', value: formatINR(epfResult.totalInterestAtRetirement) },
          {
            label: `Projected Corpus at Age ${epfDraft.retirementAge}`,
            value: formatINR(epfResult.projectedRetirementCorpus),
            bold: true,
          },
        ],
        note: epfResult.isInterestTaxableAlert
          ? `Note: Annual employee PF contribution exceeds Rs. 2,50,000 by ${formatINR(epfResult.taxableEmployeeExcess)}; interest on excess is taxable.`
          : 'EPF interest is tax-exempt subject to 5 years of continuous service and statutory thresholds.',
      });
    }
  };

  const isDirty =
    (activeTab === 'tds' && tdsSubTab === 'salary' && salaryDirty) ||
    (activeTab === 'tds' && tdsSubTab === 'fd' && fdDirty) ||
    (activeTab === 'tds' && tdsSubTab === 'rent' && rentDirty) ||
    (activeTab === 'hra' && hraDirty) ||
    (activeTab === 'epf' && epfDirty);

  return (
    <section id="calculator-workspace" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-7 pb-8">
      {/* Compact Zero-Scroll Heading + Verification Meta */}
      <div className="mb-4 sm:mb-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500 mb-1">
          <span className="text-teal-700 font-semibold">Last verified for FY 2026-27</span>
          <span aria-hidden="true">·</span>
          <span>AY 2027-28</span>
          <span aria-hidden="true">·</span>
          <span>Updated as per Income Tax Act</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
          {compactTitle || 'TDS Calculator India (FY 2026-27)'}
        </h1>
      </div>

      {/* Main Calculator Card (Single Elevation Level, Hairline Border) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Sub-Toolbar for TDS Calculator */}
        {activeTab === 'tds' && (
          <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto" role="tablist" aria-label="TDS sections">
              <button
                type="button"
                role="tab"
                aria-selected={tdsSubTab === 'salary'}
                onClick={() => onTdsSubTabChange('salary')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  tdsSubTab === 'salary'
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                Salary (Sec 192)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tdsSubTab === 'fd'}
                onClick={() => onTdsSubTabChange('fd')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  tdsSubTab === 'fd'
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                FD Interest (Sec 194A)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tdsSubTab === 'rent'}
                onClick={() => onTdsSubTabChange('rent')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  tdsSubTab === 'rent'
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                Rent (Sec 194I / 194IB)
              </button>
            </div>

            {hasActiveResult && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeSummaryText + '\n\nCalculated via calctax.in')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-3.5 h-3.5 shrink-0" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sub-Toolbar for HRA / EPF */}
        {activeTab !== 'tds' && (
          <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              {activeTab === 'hra'
                ? 'HRA Exemption Calculator — Section 10(13A)'
                : 'EPF Calculator — 8.25% p.a. (Verified from EPFO Circular, FY 2026-27)'}
            </p>
            {hasActiveResult && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeSummaryText + '\n\nCalculated via calctax.in')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-3.5 h-3.5 shrink-0" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* LEFT: Form Inputs + Calculate Button */}
          <form onSubmit={runCalculation} className="lg:col-span-6 p-4 sm:p-6 space-y-5">
            {/* 1. SALARY TDS INPUTS */}
            {activeTab === 'tds' && tdsSubTab === 'salary' && (
              <>
                <div>
                  <label htmlFor="salary-gross" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Annual Gross Salary (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      id="salary-gross"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
                      value={salaryDraft.annualGrossSalary}
                      onChange={(e) => {
                        setSalaryDraft({ ...salaryDraft, annualGrossSalary: e.target.value });
                        if (salaryResult) setSalaryDirty(true);
                      }}
                      className="w-full min-h-[44px] pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                      placeholder="e.g. 1450000"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      { label: '₹8L', val: '800000' },
                      { label: '₹12.75L', val: '1275000' },
                      { label: '₹14.5L', val: '1450000' },
                      { label: '₹24L', val: '2400000' },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => {
                          setSalaryDraft({ ...salaryDraft, annualGrossSalary: preset.val });
                          if (salaryResult) setSalaryDirty(true);
                        }}
                        className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Tax Regime (FY 2026-27)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSalaryDraft({ ...salaryDraft, regime: 'new' });
                        if (salaryResult) setSalaryDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                        salaryDraft.regime === 'new'
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      New Regime (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSalaryDraft({ ...salaryDraft, regime: 'old' });
                        if (salaryResult) setSalaryDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                        salaryDraft.regime === 'old'
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                {salaryDraft.regime === 'old' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <label htmlFor="salary-age" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Age Bracket (Old Regime Slabs)
                      </label>
                      <select
                        id="salary-age"
                        value={salaryDraft.ageGroup}
                        onChange={(e) => {
                          setSalaryDraft({ ...salaryDraft, ageGroup: e.target.value as AgeBracket });
                          if (salaryResult) setSalaryDirty(true);
                        }}
                        className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                      >
                        <option value="below60">Below 60 Years (₹2.5L Exempt)</option>
                        <option value="60to80">Senior Citizen 60–80 Years (₹3L Exempt)</option>
                        <option value="above80">Super Senior 80+ Years (₹5L Exempt)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="salary-80c" className="block text-sm font-semibold text-slate-800 mb-1.5">
                          80C / 80D / NPS Deductions
                        </label>
                        <input
                          id="salary-80c"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          value={salaryDraft.deductionsChapter6A}
                          onChange={(e) => {
                            setSalaryDraft({ ...salaryDraft, deductionsChapter6A: e.target.value });
                            if (salaryResult) setSalaryDirty(true);
                          }}
                          className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                        />
                      </div>
                      <div>
                        <label htmlFor="salary-hra" className="block text-sm font-semibold text-slate-800 mb-1.5">
                          HRA / LTA Exemption (₹)
                        </label>
                        <input
                          id="salary-hra"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          value={salaryDraft.hraExemption}
                          onChange={(e) => {
                            setSalaryDraft({ ...salaryDraft, hraExemption: e.target.value });
                            if (salaryResult) setSalaryDirty(true);
                          }}
                          className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {salaryDraft.regime === 'new' && (
                  <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
                    New Regime applies <strong>₹75,000 Standard Deduction</strong> automatically and grants full{' '}
                    <strong>Section 87A rebate</strong> up to ₹12,00,000 net taxable income (₹12,75,000 gross salary).
                  </p>
                )}
              </>
            )}

            {/* 2. FD INTEREST TDS INPUTS */}
            {activeTab === 'tds' && tdsSubTab === 'fd' && (
              <>
                <div>
                  <label htmlFor="fd-interest" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Total Annual FD / RD Interest (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      id="fd-interest"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={fdDraft.annualInterest}
                      onChange={(e) => {
                        setFdDraft({ ...fdDraft, annualInterest: e.target.value });
                        if (fdResult) setFdDirty(true);
                      }}
                      className="w-full min-h-[44px] pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-slate-800 mb-1.5">Depositor Category</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFdDraft({ ...fdDraft, category: 'general' });
                        if (fdResult) setFdDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                        fdDraft.category === 'general'
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      General (&lt; 60 yrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFdDraft({ ...fdDraft, category: 'senior' });
                        if (fdResult) setFdDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                        fdDraft.category === 'senior'
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Senior Citizen (60+)
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fd-threshold-rule" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Section 194A Threshold Limit
                  </label>
                  <select
                    id="fd-threshold-rule"
                    value={fdDraft.limitStandard}
                    onChange={(e) => {
                      setFdDraft({ ...fdDraft, limitStandard: e.target.value as FdLimitStandard });
                      if (fdResult) setFdDirty(true);
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="fy2627">FY 2026-27 Limit (₹50,000 General / ₹1,00,000 Senior)</option>
                    <option value="legacy">Earlier Limit (₹40,000 General / ₹50,000 Senior)</option>
                  </select>
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer min-h-[40px]">
                    <input
                      type="checkbox"
                      checked={fdDraft.hasPan}
                      onChange={(e) => {
                        setFdDraft({ ...fdDraft, hasPan: e.target.checked });
                        if (fdResult) setFdDirty(true);
                      }}
                      className="w-4 h-4 accent-teal-700 rounded"
                    />
                    <span className="text-sm text-slate-800">
                      PAN linked with bank (10% TDS; otherwise 20% u/s 206AA)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer min-h-[40px]">
                    <input
                      type="checkbox"
                      checked={fdDraft.form15Submitted}
                      disabled={!fdDraft.hasPan}
                      onChange={(e) => {
                        setFdDraft({ ...fdDraft, form15Submitted: e.target.checked });
                        if (fdResult) setFdDirty(true);
                      }}
                      className="w-4 h-4 accent-teal-700 rounded disabled:opacity-50"
                    />
                    <span className={`text-sm ${fdDraft.hasPan ? 'text-slate-800' : 'text-slate-400'}`}>
                      Form 15G / 15H submitted to bank (Total income tax-exempt)
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* 3. RENT TDS INPUTS */}
            {activeTab === 'tds' && tdsSubTab === 'rent' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rent-monthly" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Monthly Rent (₹)
                    </label>
                    <input
                      id="rent-monthly"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={rentDraft.monthlyRent}
                      onChange={(e) => {
                        setRentDraft({ ...rentDraft, monthlyRent: e.target.value });
                        if (rentResult) setRentDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="rent-months" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Months in FY (1–12)
                    </label>
                    <input
                      id="rent-months"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="12"
                      value={rentDraft.monthsOccupied}
                      onChange={(e) => {
                        setRentDraft({ ...rentDraft, monthsOccupied: e.target.value });
                        if (rentResult) setRentDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rent-section" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Tenant Category &amp; TDS Section
                  </label>
                  <select
                    id="rent-section"
                    value={rentDraft.section}
                    onChange={(e) => {
                      setRentDraft({ ...rentDraft, section: e.target.value as RentSectionType });
                      if (rentResult) setRentDirty(true);
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="194IB">Sec 194IB — Individual / HUF (Non-Audit) · 2%</option>
                    <option value="194I_building">Sec 194I(b) — Business / Building Rent · 10%</option>
                    <option value="194I_machinery">Sec 194I(a) — Plant / Machinery Rent · 2%</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer min-h-[40px]">
                  <input
                    type="checkbox"
                    checked={rentDraft.hasPan}
                    onChange={(e) => {
                      setRentDraft({ ...rentDraft, hasPan: e.target.checked });
                      if (rentResult) setRentDirty(true);
                    }}
                    className="w-4 h-4 accent-teal-700 rounded"
                  />
                  <span className="text-sm text-slate-800">
                    Landlord PAN provided (20% TDS applies without PAN)
                  </span>
                </label>
              </>
            )}

            {/* 4. HRA EXEMPTION INPUTS */}
            {activeTab === 'hra' && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800">Input Period</span>
                  <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setHraDraft({ ...hraDraft, period: 'monthly' });
                        if (hraResult) setHraDirty(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        hraDraft.period === 'monthly'
                          ? 'bg-white text-teal-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHraDraft({ ...hraDraft, period: 'annual' });
                        if (hraResult) setHraDirty(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        hraDraft.period === 'annual'
                          ? 'bg-white text-teal-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hra-basic" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Basic Salary ({hraDraft.period === 'monthly' ? '₹/mo' : '₹/yr'})
                    </label>
                    <input
                      id="hra-basic"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={hraDraft.basicSalary}
                      onChange={(e) => {
                        setHraDraft({ ...hraDraft, basicSalary: e.target.value });
                        if (hraResult) setHraDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="hra-da" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Dearness Allowance (DA)
                    </label>
                    <input
                      id="hra-da"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={hraDraft.da}
                      onChange={(e) => {
                        setHraDraft({ ...hraDraft, da: e.target.value });
                        if (hraResult) setHraDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hra-received" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      HRA Received ({hraDraft.period === 'monthly' ? '₹/mo' : '₹/yr'})
                    </label>
                    <input
                      id="hra-received"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={hraDraft.hraReceived}
                      onChange={(e) => {
                        setHraDraft({ ...hraDraft, hraReceived: e.target.value });
                        if (hraResult) setHraDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="hra-rent" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Actual Rent Paid ({hraDraft.period === 'monthly' ? '₹/mo' : '₹/yr'})
                    </label>
                    <input
                      id="hra-rent"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={hraDraft.rentPaid}
                      onChange={(e) => {
                        setHraDraft({ ...hraDraft, rentPaid: e.target.value });
                        if (hraResult) setHraDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-slate-800 mb-1.5">City of Residence</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHraDraft({ ...hraDraft, isMetro: true });
                        if (hraResult) setHraDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                        hraDraft.isMetro
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Metro (50%) — Del/Mum/Kol/Che
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHraDraft({ ...hraDraft, isMetro: false });
                        if (hraResult) setHraDirty(true);
                      }}
                      className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                        !hraDraft.isMetro
                          ? 'bg-teal-50 border-teal-700 text-teal-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Non-Metro (40%)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 5. EPF INTEREST INPUTS */}
            {activeTab === 'epf' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="epf-basic" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Monthly Basic + DA (₹)
                    </label>
                    <input
                      id="epf-basic"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={epfDraft.monthlyBasicDa}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, monthlyBasicDa: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="epf-opening" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Opening EPF Balance (₹)
                    </label>
                    <input
                      id="epf-opening"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={epfDraft.openingBalance}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, openingBalance: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="epf-emp-pct" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Employee PF + VPF (%)
                    </label>
                    <input
                      id="epf-emp-pct"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      step="0.5"
                      value={epfDraft.employeePercent}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, employeePercent: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-base font-medium text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="epf-employer-rule" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Employer EPF Split
                    </label>
                    <select
                      id="epf-employer-rule"
                      value={epfDraft.employerRule}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, employerRule: e.target.value as EmployerEpfRule });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                    >
                      <option value="standard_367">Standard (3.67% EPF + 8.33% EPS)</option>
                      <option value="eps_capped">EPS Capped ₹1,250/mo (Rest to EPF)</option>
                      <option value="full_12">Full 12% to EPF (No EPS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="epf-age" className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Age
                    </label>
                    <input
                      id="epf-age"
                      type="number"
                      inputMode="numeric"
                      min="18"
                      max="59"
                      value={epfDraft.currentAge}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, currentAge: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="epf-retire" className="block text-xs font-semibold text-slate-700 mb-1">
                      Retire Age
                    </label>
                    <input
                      id="epf-retire"
                      type="number"
                      inputMode="numeric"
                      min="25"
                      max="70"
                      value={epfDraft.retirementAge}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, retirementAge: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="epf-hike" className="block text-xs font-semibold text-slate-700 mb-1">
                      Salary Hike %
                    </label>
                    <input
                      id="epf-hike"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="50"
                      value={epfDraft.annualIncrementPercent}
                      onChange={(e) => {
                        setEpfDraft({ ...epfDraft, annualIncrementPercent: e.target.value });
                        if (epfResult) setEpfDirty(true);
                      }}
                      className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Primary Calculate CTA + Reset */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
              >
                <span>Calculate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </form>

          {/* RIGHT: Results Panel (Shown after pressing Calculate) */}
          <div ref={resultsPanelRef} className="lg:col-span-6 p-4 sm:p-6 bg-slate-50/75 flex flex-col justify-between">
            {isDirty && (
              <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-900">
                Inputs updated — press <strong>Calculate</strong> to refresh your results.
              </div>
            )}

            {/* SALARY TDS OUTPUT */}
            {activeTab === 'tds' && tdsSubTab === 'salary' && (
              salaryResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Estimated Monthly TDS (Section 192)
                      </p>
                      <p className="font-mono text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums mt-0.5">
                        {formatINR(salaryResult.monthlyTds)}
                        <span className="text-sm font-normal text-slate-500">/mo</span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">Total Annual Tax</p>
                      <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                        {formatINR(salaryResult.totalAnnualTax)}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        Effective rate: {salaryResult.effectiveRate}%
                      </p>
                    </div>
                  </div>

                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Gross Salary</dt>
                      <dd className="font-mono font-medium text-slate-900 tabular-nums">
                        {formatINR(salaryResult.grossSalary)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Standard Deduction</dt>
                      <dd className="font-mono font-medium text-teal-700 tabular-nums">
                        − {formatINR(salaryResult.standardDeduction)}
                      </dd>
                    </div>
                    {salaryResult.otherDeductions > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-slate-600">HRA + Chapter VI-A Deductions</dt>
                        <dd className="font-mono font-medium text-teal-700 tabular-nums">
                          − {formatINR(salaryResult.otherDeductions)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                      <dt className="text-slate-800">Net Taxable Income</dt>
                      <dd className="font-mono text-slate-900 tabular-nums">
                        {formatINR(salaryResult.netTaxableIncome)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Income Tax on Slabs</dt>
                      <dd className="font-mono text-slate-900 tabular-nums">{formatINR(salaryResult.slabTax)}</dd>
                    </div>
                    {salaryResult.rebate87A > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Section 87A Rebate</dt>
                        <dd className="font-mono text-teal-700 tabular-nums">− {formatINR(salaryResult.rebate87A)}</dd>
                      </div>
                    )}
                    {salaryResult.marginalRelief > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-slate-600">87A Marginal Relief</dt>
                        <dd className="font-mono text-teal-700 tabular-nums">
                          − {formatINR(salaryResult.marginalRelief)}
                        </dd>
                      </div>
                    )}
                    {salaryResult.surcharge > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Surcharge</dt>
                        <dd className="font-mono text-slate-900 tabular-nums">{formatINR(salaryResult.surcharge)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Health &amp; Education Cess (4%)</dt>
                      <dd className="font-mono text-slate-900 tabular-nums">{formatINR(salaryResult.cess)}</dd>
                    </div>
                  </dl>

                  <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-700">
                    {salaryResult.savingsVsAlternate === 0 ? (
                      <span>Both regimes yield identical tax liability ({formatINR(salaryResult.totalAnnualTax)}).</span>
                    ) : salaryResult.recommendedRegime === salaryResult.regime ? (
                      <span className="text-teal-800 font-medium">
                        {salaryResult.regime === 'new' ? 'New Regime' : 'Old Regime'} saves you{' '}
                        <strong className="font-mono tabular-nums">{formatINR(salaryResult.savingsVsAlternate)}</strong>{' '}
                        annually compared to the {salaryResult.regime === 'new' ? 'Old' : 'New'} Regime (
                        {formatINR(salaryResult.alternateRegimeTax)}).
                      </span>
                    ) : (
                      <span className="text-blue-800 font-medium">
                        Switching to the {salaryResult.recommendedRegime === 'new' ? 'New' : 'Old'} Regime could save{' '}
                        <strong className="font-mono tabular-nums">{formatINR(salaryResult.savingsVsAlternate)}</strong>{' '}
                        annually ({formatINR(salaryResult.alternateRegimeTax)} total tax).
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Slab-wise Tax Breakdown</p>
                    <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 font-semibold">Income Slab</th>
                            <th className="py-2 px-2 font-semibold text-right">Rate</th>
                            <th className="py-2 px-3 font-semibold text-right">Tax</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums font-mono">
                          {salaryResult.slabBreakdown.map((row) => (
                            <tr key={row.label}>
                              <td className="py-1.5 px-3 font-sans text-slate-700">{row.label}</td>
                              <td className="py-1.5 px-2 text-right text-slate-600">{row.rate}%</td>
                              <td className="py-1.5 px-3 text-right text-slate-900">{formatINR(row.tax)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyResultPrompt
                  title="Salary TDS Breakdown (Section 192)"
                  description="Enter your annual gross salary and regime, then press Calculate to see monthly TDS, Section 87A rebate, and slab breakdown for FY 2026-27."
                />
              )
            )}

            {/* FD INTEREST TDS OUTPUT */}
            {activeTab === 'tds' && tdsSubTab === 'fd' && (
              fdResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Estimated TDS Deducted (Sec 194A)</p>
                      <p className="font-mono text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums mt-0.5">
                        {formatINR(fdResult.tdsAmount)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">Net Interest Credited</p>
                      <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                        {formatINR(fdResult.netInterestReceived)}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        TDS Rate: {fdResult.applicableRate}%
                      </p>
                    </div>
                  </div>

                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Total Annual Interest</dt>
                      <dd className="font-mono font-medium text-slate-900 tabular-nums">
                        {formatINR(fdResult.annualInterest)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Exemption Threshold Applied</dt>
                      <dd className="font-mono font-medium text-slate-900 tabular-nums">
                        {formatINR(fdResult.threshold)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Threshold Status</dt>
                      <dd className="font-semibold text-slate-900">
                        {fdResult.isThresholdCrossed ? 'Exceeded' : 'Within Exemption Limit'}
                      </dd>
                    </div>
                  </dl>

                  <p className="text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3.5 leading-relaxed">
                    {fdResult.statusNote}
                  </p>
                </div>
              ) : (
                <EmptyResultPrompt
                  title="Bank FD Interest TDS (Section 194A)"
                  description="Enter your total annual FD/RD interest, depositor category, and Form 15G/15H status, then press Calculate to verify bank TDS."
                />
              )
            )}

            {/* RENT TDS OUTPUT */}
            {activeTab === 'tds' && tdsSubTab === 'rent' && (
              rentResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Total TDS ({rentDraft.section === '194IB' ? 'Sec 194IB' : 'Sec 194I'})
                      </p>
                      <p className="font-mono text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums mt-0.5">
                        {formatINR(rentResult.totalTds)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">Net Paid to Landlord</p>
                      <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                        {formatINR(rentResult.netPayableToLandlord)}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">Rate: {rentResult.tdsRate}%</p>
                    </div>
                  </div>

                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Total Rent ({rentResult.monthsOccupied} months)</dt>
                      <dd className="font-mono font-medium text-slate-900 tabular-nums">
                        {formatINR(rentResult.totalAnnualRent)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Monthly Rent Threshold</dt>
                      <dd className="font-mono font-medium text-slate-900 tabular-nums">
                        {formatINR(rentResult.monthlyThreshold)} / month
                      </dd>
                    </div>
                    {rentDraft.section !== '194IB' && (
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Monthly TDS Deduction</dt>
                        <dd className="font-mono font-semibold text-teal-800 tabular-nums">
                          {formatINR(rentResult.monthlyTds)} / month
                        </dd>
                      </div>
                    )}
                  </dl>

                  <p className="text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3.5 leading-relaxed">
                    {rentResult.deductionTiming}
                  </p>
                </div>
              ) : (
                <EmptyResultPrompt
                  title="Rent TDS Estimate (Section 194IB / 194I)"
                  description="Enter monthly rent, tenancy duration, and tenant section, then press Calculate to check TDS liability and Form 26QC rules."
                />
              )
            )}

            {/* HRA EXEMPTION OUTPUT */}
            {activeTab === 'hra' && (
              hraResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Annual Exempt HRA (Sec 10(13A))</p>
                      <p className="font-mono text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums mt-0.5">
                        {formatINR(hraResult.annualExemptHra)}
                      </p>
                      <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        {formatINR(hraResult.monthlyExemptHra)} / month exempt
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500">Taxable HRA</p>
                      <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                        {formatINR(hraResult.annualTaxableHra)}
                      </p>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        {formatINR(hraResult.monthlyTaxableHra)} / mo taxable
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      3 Statutory Clauses (Lowest Value Is Exempt)
                    </p>
                    <div className="space-y-2 text-sm">
                      <div
                        className={`flex justify-between p-2.5 rounded-lg border ${
                          hraResult.limitingClause === 1
                            ? 'bg-teal-50 border-teal-300 font-semibold text-teal-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>1. Actual HRA Received</span>
                        <span className="font-mono tabular-nums">{formatINR(hraResult.clause1ActualHra)}</span>
                      </div>
                      <div
                        className={`flex justify-between p-2.5 rounded-lg border ${
                          hraResult.limitingClause === 2
                            ? 'bg-teal-50 border-teal-300 font-semibold text-teal-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>2. {hraDraft.isMetro ? '50%' : '40%'} of (Basic + DA)</span>
                        <span className="font-mono tabular-nums">{formatINR(hraResult.clause2MetroPercent)}</span>
                      </div>
                      <div
                        className={`flex justify-between p-2.5 rounded-lg border ${
                          hraResult.limitingClause === 3
                            ? 'bg-teal-50 border-teal-300 font-semibold text-teal-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>3. Rent Paid − 10% of (Basic + DA)</span>
                        <span className="font-mono tabular-nums">{formatINR(hraResult.clause3ExcessRent)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Note: HRA exemption under Section 10(13A) applies when filing under the{' '}
                    <strong>Old Tax Regime</strong>.
                  </p>
                </div>
              ) : (
                <EmptyResultPrompt
                  title="HRA Exemption Breakdown (Section 10(13A))"
                  description="Enter your Basic Salary, DA, HRA received, rent paid, and city category, then press Calculate to compare all 3 statutory clauses."
                />
              )
            )}

            {/* EPF INTEREST OUTPUT */}
            {activeTab === 'epf' && (
              epfResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="inline-flex p-0.5 bg-slate-200/80 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setEpfView('fy')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          epfView === 'fy' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-700'
                        }`}
                      >
                        FY 2026-27 Interest
                      </button>
                      <button
                        type="button"
                        onClick={() => setEpfView('retirement')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          epfView === 'retirement' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-700'
                        }`}
                      >
                        Retirement Corpus ({epfResult.yearsToRetire}y)
                      </button>
                    </div>
                    <span className="text-xs font-mono font-semibold text-teal-800">Rate: 8.25% p.a.</span>
                  </div>

                  {epfView === 'fy' ? (
                    <>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500">FY 2026-27 Interest Earned</p>
                          <p className="font-mono text-3xl font-semibold text-teal-800 tabular-nums mt-0.5">
                            {formatINR(epfResult.annualInterestEarned)}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-medium text-slate-500">Year-End Closing Balance</p>
                          <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                            {formatINR(epfResult.closingBalanceFY)}
                          </p>
                        </div>
                      </div>

                      <dl className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
                        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                          <dt className="text-slate-500">Monthly Employee Share</dt>
                          <dd className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                            {formatINR(epfResult.monthlyEmployeeContrib)}/mo
                          </dd>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                          <dt className="text-slate-500">Monthly Employer EPF</dt>
                          <dd className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                            {formatINR(epfResult.monthlyEmployerEpf)}/mo
                          </dd>
                        </div>
                      </dl>

                      {epfResult.isInterestTaxableAlert && (
                        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                          Annual employee contribution ({formatINR(epfResult.annualEmployeeContrib)}) exceeds the
                          ₹2,50,000 tax-free threshold by {formatINR(epfResult.taxableEmployeeExcess)}. Interest on
                          the excess is taxable.
                        </p>
                      )}

                      <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="sticky top-0 bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                              <th className="py-1.5 px-2.5 font-semibold">Month</th>
                              <th className="py-1.5 px-2 font-semibold text-right">Running Bal</th>
                              <th className="py-1.5 px-2.5 font-semibold text-right">Monthly Int.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                            {epfResult.monthlySchedule.map((m) => (
                              <tr key={m.month}>
                                <td className="py-1 px-2.5 font-sans text-slate-700">{m.month}</td>
                                <td className="py-1 px-2 text-right text-slate-900">
                                  {formatINR(m.closingBeforeInterest)}
                                </td>
                                <td className="py-1 px-2.5 text-right text-teal-700">
                                  +{formatINR(m.monthlyInterest)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Projected EPF Corpus at Age {epfDraft.retirementAge} ({epfResult.yearsToRetire} years)
                        </p>
                        <p className="font-mono text-3xl sm:text-4xl font-semibold text-teal-800 tabular-nums mt-0.5">
                          {formatINRCompact(epfResult.projectedRetirementCorpus)}
                        </p>
                        <p className="font-mono text-xs text-slate-500 tabular-nums mt-0.5">
                          Exact: {formatINR(epfResult.projectedRetirementCorpus)}
                        </p>
                      </div>

                      <dl className="space-y-2 text-sm pt-2 border-t border-slate-200">
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Total Principal + Opening Balance</dt>
                          <dd className="font-mono font-medium text-slate-900 tabular-nums">
                            {formatINR(epfResult.totalPrincipalAtRetirement)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Total Compounded Interest (8.25%)</dt>
                          <dd className="font-mono font-semibold text-teal-700 tabular-nums">
                            + {formatINR(epfResult.totalInterestAtRetirement)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Annual Salary Hike Assumed</dt>
                          <dd className="font-mono text-slate-900 tabular-nums">
                            {epfDraft.annualIncrementPercent}% p.a.
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyResultPrompt
                  title="EPF Interest & Retirement Corpus (8.25%)"
                  description="Enter your Monthly Basic + DA, opening EPF balance, and contribution percentages, then press Calculate to compute FY 2026-27 interest."
                />
              )
            )}

            {/* Mobile Copy, WhatsApp Share & PDF Download Row (when result exists) */}
            {hasActiveResult && (
              <div className="grid grid-cols-3 sm:hidden gap-2 pt-4 mt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeSummaryText + '\n\nCalculated via calctax.in')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-4 h-4 shrink-0" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const EmptyResultPrompt: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-8">
    <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3">
      <Calculator className="w-5 h-5" />
    </div>
    <h2 className="font-display text-base font-bold text-slate-900">{title}</h2>
    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">{description}</p>
  </div>
);
