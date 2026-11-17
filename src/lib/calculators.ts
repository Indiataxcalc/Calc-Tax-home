/**
 * CalcTax.in Modular Indian Tax & Financial Calculation Engine
 * Verified for FY 2026-27 (AY 2027-28) as per Income Tax Act, 1961 & EPFO Circulars
 */

export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safe);
}

export function formatINRCompact(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (safe >= 10000000) {
    return `₹${(safe / 10000000).toFixed(2)} Cr`;
  }
  if (safe >= 100000) {
    return `₹${(safe / 100000).toFixed(2)} L`;
  }
  return formatINR(safe);
}

export type TaxRegime = 'new' | 'old';
export type AgeBracket = 'below60' | '60to80' | 'above80';

export interface SalaryTdsInput {
  annualGrossSalary: number;
  regime: TaxRegime;
  ageGroup: AgeBracket;
  deductionsChapter6A: number;
  hraExemption: number;
}

export interface SlabLine {
  label: string;
  rate: number;
  taxableInSlab: number;
  tax: number;
}

export interface SalaryTdsResult {
  regime: TaxRegime;
  grossSalary: number;
  standardDeduction: number;
  otherDeductions: number;
  netTaxableIncome: number;
  slabBreakdown: SlabLine[];
  slabTax: number;
  rebate87A: number;
  marginalRelief: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalAnnualTax: number;
  monthlyTds: number;
  effectiveRate: number;
  alternateRegimeTax: number;
  recommendedRegime: TaxRegime;
  savingsVsAlternate: number;
}

function computeSlabTaxOnly(
  netTaxableIncome: number,
  regime: TaxRegime,
  ageGroup: AgeBracket
): { slabTax: number; slabBreakdown: SlabLine[] } {
  const slabBreakdown: SlabLine[] = [];
  let slabTax = 0;

  if (regime === 'new') {
    const slabs: Array<{ min: number; max: number; rate: number; label: string }> = [
      { min: 0, max: 400000, rate: 0, label: 'Up to ₹4,00,000' },
      { min: 400000, max: 800000, rate: 0.05, label: '₹4,00,001 – ₹8,00,000' },
      { min: 800000, max: 1200000, rate: 0.1, label: '₹8,00,001 – ₹12,00,000' },
      { min: 1200000, max: 1600000, rate: 0.15, label: '₹12,00,001 – ₹16,00,000' },
      { min: 1600000, max: 2000000, rate: 0.2, label: '₹16,00,001 – ₹20,00,000' },
      { min: 2000000, max: 2400000, rate: 0.25, label: '₹20,00,001 – ₹24,00,000' },
      { min: 2400000, max: Infinity, rate: 0.3, label: 'Above ₹24,00,000' },
    ];

    for (const s of slabs) {
      const taxableInSlab = Math.max(0, Math.min(netTaxableIncome, s.max) - s.min);
      const tax = taxableInSlab * s.rate;
      if (taxableInSlab > 0 || s.min === 0) {
        slabBreakdown.push({
          label: s.label,
          rate: s.rate * 100,
          taxableInSlab,
          tax: Math.round(tax),
        });
      }
      slabTax += tax;
    }
  } else {
    const basicExempt = ageGroup === 'above80' ? 500000 : ageGroup === '60to80' ? 300000 : 250000;
    const slabs: Array<{ min: number; max: number; rate: number; label: string }> = [
      { min: 0, max: basicExempt, rate: 0, label: `Up to ${formatINR(basicExempt)}` },
      ...(basicExempt < 500000
        ? [
            {
              min: basicExempt,
              max: 500000,
              rate: 0.05,
              label: `${formatINR(basicExempt + 1)} – ₹5,00,000`,
            },
          ]
        : []),
      { min: 500000, max: 1000000, rate: 0.2, label: '₹5,00,001 – ₹10,00,000' },
      { min: 1000000, max: Infinity, rate: 0.3, label: 'Above ₹10,00,000' },
    ];

    for (const s of slabs) {
      const taxableInSlab = Math.max(0, Math.min(netTaxableIncome, s.max) - s.min);
      const tax = taxableInSlab * s.rate;
      if (taxableInSlab > 0 || s.min === 0) {
        slabBreakdown.push({
          label: s.label,
          rate: s.rate * 100,
          taxableInSlab,
          tax: Math.round(tax),
        });
      }
      slabTax += tax;
    }
  }

  return { slabTax, slabBreakdown };
}

function computeSurchargeWithMarginalRelief(
  taxAfterRebate: number,
  taxableIncome: number,
  regime: TaxRegime,
  ageGroup: AgeBracket
): number {
  if (taxableIncome <= 5000000 || taxAfterRebate <= 0) return 0;

  let rate = 0.1;
  let threshold = 5000000;
  let prevRate = 0;

  if (taxableIncome > 50000000) {
    rate = regime === 'new' ? 0.25 : 0.37;
    prevRate = 0.25;
    threshold = 50000000;
  } else if (taxableIncome > 20000000) {
    rate = 0.25;
    prevRate = 0.15;
    threshold = 20000000;
  } else if (taxableIncome > 10000000) {
    rate = 0.15;
    prevRate = 0.1;
    threshold = 10000000;
  }

  const rawSurcharge = taxAfterRebate * rate;
  const { slabTax: baseTaxAtThreshold } = computeSlabTaxOnly(threshold, regime, ageGroup);
  const taxWithPrevSurchargeAtThreshold = baseTaxAtThreshold * (1 + prevRate);
  const maxAllowedTotalTax = taxWithPrevSurchargeAtThreshold + (taxableIncome - threshold);
  const currentTotalBeforeCess = taxAfterRebate + rawSurcharge;

  if (currentTotalBeforeCess > maxAllowedTotalTax) {
    return Math.max(0, Math.round(maxAllowedTotalTax - taxAfterRebate));
  }
  return Math.round(rawSurcharge);
}

function computeRegimeTax(
  grossSalary: number,
  regime: TaxRegime,
  ageGroup: AgeBracket,
  deductionsChapter6A: number,
  hraExemption: number
) {
  const safeGross = Math.max(0, grossSalary);
  const standardDeduction = regime === 'new' ? Math.min(75000, safeGross) : Math.min(50000, safeGross);
  const otherDeductions =
    regime === 'old' ? Math.max(0, deductionsChapter6A) + Math.max(0, hraExemption) : 0;

  const netTaxableIncome = Math.max(0, safeGross - standardDeduction - otherDeductions);
  const { slabTax, slabBreakdown } = computeSlabTaxOnly(netTaxableIncome, regime, ageGroup);

  let rebate87A = 0;
  let marginalRelief = 0;
  let taxAfterRebate = slabTax;

  if (regime === 'new') {
    if (netTaxableIncome <= 1200000) {
      rebate87A = slabTax;
      taxAfterRebate = 0;
    } else {
      const excessOver12L = netTaxableIncome - 1200000;
      if (slabTax > excessOver12L) {
        marginalRelief = slabTax - excessOver12L;
        taxAfterRebate = excessOver12L;
      }
    }
  } else {
    if (netTaxableIncome <= 500000) {
      rebate87A = Math.min(12500, slabTax);
      taxAfterRebate = Math.max(0, slabTax - rebate87A);
    }
  }

  const surcharge = computeSurchargeWithMarginalRelief(
    taxAfterRebate,
    netTaxableIncome,
    regime,
    ageGroup
  );
  const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
  const totalAnnualTax = Math.round(taxAfterRebate + surcharge + cess);

  return {
    standardDeduction,
    otherDeductions,
    netTaxableIncome,
    slabBreakdown,
    slabTax: Math.round(slabTax),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(marginalRelief),
    taxAfterRebate: Math.round(taxAfterRebate),
    surcharge,
    cess,
    totalAnnualTax,
  };
}

export function calculateSalaryTDS(input: SalaryTdsInput): SalaryTdsResult {
  const primary = computeRegimeTax(
    input.annualGrossSalary,
    input.regime,
    input.ageGroup,
    input.deductionsChapter6A,
    input.hraExemption
  );
  const altRegime: TaxRegime = input.regime === 'new' ? 'old' : 'new';
  const alternate = computeRegimeTax(
    input.annualGrossSalary,
    altRegime,
    input.ageGroup,
    input.deductionsChapter6A,
    input.hraExemption
  );

  const recommendedRegime: TaxRegime =
    primary.totalAnnualTax <= alternate.totalAnnualTax ? input.regime : altRegime;
  const savingsVsAlternate = Math.abs(alternate.totalAnnualTax - primary.totalAnnualTax);
  const effectiveRate =
    input.annualGrossSalary > 0
      ? Number(((primary.totalAnnualTax / input.annualGrossSalary) * 100).toFixed(2))
      : 0;

  return {
    regime: input.regime,
    grossSalary: Math.max(0, input.annualGrossSalary),
    ...primary,
    monthlyTds: Math.round(primary.totalAnnualTax / 12),
    effectiveRate,
    alternateRegimeTax: alternate.totalAnnualTax,
    recommendedRegime,
    savingsVsAlternate,
  };
}

/* ==========================================================================
   Section 194A — Bank / Post Office Fixed Deposit Interest TDS
   ========================================================================== */

export type FdDepositorCategory = 'general' | 'senior';
export type FdLimitStandard = 'fy2627' | 'legacy';

export interface FdTdsInput {
  annualInterest: number;
  category: FdDepositorCategory;
  limitStandard: FdLimitStandard;
  hasPan: boolean;
  form15Submitted: boolean;
}

export interface FdTdsResult {
  annualInterest: number;
  threshold: number;
  isThresholdCrossed: boolean;
  applicableRate: number;
  tdsAmount: number;
  netInterestReceived: number;
  statusNote: string;
}

export function calculateFdTDS(input: FdTdsInput): FdTdsResult {
  const safeInterest = Math.max(0, input.annualInterest);
  const threshold =
    input.limitStandard === 'fy2627'
      ? input.category === 'senior'
        ? 100000
        : 50000
      : input.category === 'senior'
        ? 50000
        : 40000;

  const isThresholdCrossed = safeInterest > threshold;
  const applicableRate = input.hasPan ? 10 : 20;

  if (input.form15Submitted && input.hasPan) {
    return {
      annualInterest: safeInterest,
      threshold,
      isThresholdCrossed,
      applicableRate: 0,
      tdsAmount: 0,
      netInterestReceived: safeInterest,
      statusNote:
        'Zero TDS deducted because Form 15G/15H declaration is active with a valid PAN.',
    };
  }

  if (!isThresholdCrossed) {
    return {
      annualInterest: safeInterest,
      threshold,
      isThresholdCrossed: false,
      applicableRate: 0,
      tdsAmount: 0,
      netInterestReceived: safeInterest,
      statusNote: `Interest is within the ${formatINR(threshold)} Section 194A annual exemption limit. No TDS deducted by bank.`,
    };
  }

  const tdsAmount = Math.round((safeInterest * applicableRate) / 100);
  return {
    annualInterest: safeInterest,
    threshold,
    isThresholdCrossed: true,
    applicableRate,
    tdsAmount,
    netInterestReceived: Math.max(0, safeInterest - tdsAmount),
    statusNote: input.hasPan
      ? `Annual interest exceeds ${formatINR(threshold)}. Bank deducts 10% TDS on total interest under Sec 194A.`
      : `PAN not furnished/inoperative: 20% higher TDS applies under Section 206AA on entire interest.`,
  };
}

/* ==========================================================================
   Section 194I / 194IB — Rent TDS Calculator
   ========================================================================== */

export type RentSectionType = '194IB' | '194I_building' | '194I_machinery';

export interface RentTdsInput {
  monthlyRent: number;
  monthsOccupied: number;
  section: RentSectionType;
  hasPan: boolean;
}

export interface RentTdsResult {
  monthlyRent: number;
  monthsOccupied: number;
  totalAnnualRent: number;
  monthlyThreshold: number;
  isApplicable: boolean;
  tdsRate: number;
  monthlyTds: number;
  totalTds: number;
  netPayableToLandlord: number;
  deductionTiming: string;
}

export function calculateRentTDS(input: RentTdsInput): RentTdsResult {
  const safeRent = Math.max(0, input.monthlyRent);
  const safeMonths = Math.min(12, Math.max(1, Math.round(input.monthsOccupied)));
  const totalAnnualRent = safeRent * safeMonths;
  const monthlyThreshold = 50000;
  const isApplicable = safeRent > monthlyThreshold;

  let baseRate = 2;
  if (input.section === '194I_building') {
    baseRate = 10;
  } else if (input.section === '194I_machinery' || input.section === '194IB') {
    baseRate = 2;
  }

  const tdsRate = isApplicable ? (input.hasPan ? baseRate : 20) : 0;
  let totalTds = isApplicable ? Math.round((totalAnnualRent * tdsRate) / 100) : 0;

  if (input.section === '194IB' && isApplicable && totalTds > safeRent) {
    totalTds = Math.round(safeRent);
  }

  const monthlyTds =
    input.section === '194IB' ? 0 : isApplicable ? Math.round((safeRent * tdsRate) / 100) : 0;

  const deductionTiming = !isApplicable
    ? `Monthly rent does not exceed ₹50,000. No TDS liability under Section ${input.section === '194IB' ? '194IB' : '194I'}.`
    : input.section === '194IB'
      ? 'Deducted once in March (or final month of tenancy) at 2% (reduced from 5% w.e.f. Oct 2024) and deposited via Form 26QC within 30 days.'
      : 'Deducted every month at credit/payment and deposited by 7th of the following month (Form 26Q).';

  return {
    monthlyRent: safeRent,
    monthsOccupied: safeMonths,
    totalAnnualRent,
    monthlyThreshold,
    isApplicable,
    tdsRate,
    monthlyTds,
    totalTds,
    netPayableToLandlord: Math.max(0, totalAnnualRent - totalTds),
    deductionTiming,
  };
}

/* ==========================================================================
   Section 10(13A) — HRA Exemption Calculator
   ========================================================================== */

export interface HraInput {
  basicSalary: number;
  da: number;
  hraReceived: number;
  rentPaid: number;
  isMetro: boolean;
  period: 'monthly' | 'annual';
}

export interface HraResult {
  annualBasicDa: number;
  annualHraReceived: number;
  annualRentPaid: number;
  clause1ActualHra: number;
  clause2MetroPercent: number;
  clause3ExcessRent: number;
  limitingClause: 1 | 2 | 3;
  annualExemptHra: number;
  monthlyExemptHra: number;
  annualTaxableHra: number;
  monthlyTaxableHra: number;
}

export function calculateHraExemption(input: HraInput): HraResult {
  const factor = input.period === 'monthly' ? 12 : 1;
  const annualBasic = Math.max(0, input.basicSalary) * factor;
  const annualDa = Math.max(0, input.da) * factor;
  const annualBasicDa = annualBasic + annualDa;
  const annualHraReceived = Math.max(0, input.hraReceived) * factor;
  const annualRentPaid = Math.max(0, input.rentPaid) * factor;

  const clause1ActualHra = Math.round(annualHraReceived);
  const clause2MetroPercent = Math.round(annualBasicDa * (input.isMetro ? 0.5 : 0.4));
  const clause3ExcessRent = Math.max(0, Math.round(annualRentPaid - annualBasicDa * 0.1));

  const annualExemptHra = Math.max(
    0,
    Math.min(clause1ActualHra, clause2MetroPercent, clause3ExcessRent)
  );
  const annualTaxableHra = Math.max(0, clause1ActualHra - annualExemptHra);

  let limitingClause: 1 | 2 | 3 = 1;
  if (annualExemptHra === clause3ExcessRent) limitingClause = 3;
  else if (annualExemptHra === clause2MetroPercent) limitingClause = 2;
  else limitingClause = 1;

  return {
    annualBasicDa,
    annualHraReceived,
    annualRentPaid,
    clause1ActualHra,
    clause2MetroPercent,
    clause3ExcessRent,
    limitingClause,
    annualExemptHra,
    monthlyExemptHra: Math.round(annualExemptHra / 12),
    annualTaxableHra,
    monthlyTaxableHra: Math.round(annualTaxableHra / 12),
  };
}

/* ==========================================================================
   EPF Interest Calculator — FY 2026-27 @ 8.25% p.a.
   ========================================================================== */

export type EmployerEpfRule = 'standard_367' | 'eps_capped' | 'full_12';

export interface EpfInput {
  monthlyBasicDa: number;
  openingBalance: number;
  employeePercent: number;
  employerRule: EmployerEpfRule;
  annualIncrementPercent: number;
  currentAge: number;
  retirementAge: number;
}

export interface EpfMonthRow {
  month: string;
  opening: number;
  employeeContrib: number;
  employerContrib: number;
  closingBeforeInterest: number;
  monthlyInterest: number;
}

export interface EpfResult {
  ratePercent: number;
  monthlyEmployeeContrib: number;
  monthlyEmployerEpf: number;
  monthlyEpsRedirected: number;
  annualEmployeeContrib: number;
  annualEmployerContrib: number;
  annualInterestEarned: number;
  closingBalanceFY: number;
  isInterestTaxableAlert: boolean;
  taxableEmployeeExcess: number;
  monthlySchedule: EpfMonthRow[];
  yearsToRetire: number;
  projectedRetirementCorpus: number;
  totalPrincipalAtRetirement: number;
  totalInterestAtRetirement: number;
}

const FY_MONTHS = [
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
];

function getEmployerSplit(monthlyBasicDa: number, rule: EmployerEpfRule) {
  const safeBasic = Math.max(0, monthlyBasicDa);
  const total12 = safeBasic * 0.12;
  if (rule === 'full_12') {
    return { epfShare: total12, epsShare: 0 };
  }
  if (rule === 'eps_capped') {
    const epsShare = Math.min(1250, safeBasic * 0.0833);
    return { epfShare: Math.max(0, total12 - epsShare), epsShare };
  }
  const epsShare = safeBasic * 0.0833;
  const epfShare = safeBasic * 0.0367;
  return { epfShare, epsShare };
}

export function calculateEpfInterest(input: EpfInput): EpfResult {
  const ratePercent = 8.25;
  const annualRate = ratePercent / 100;
  const monthlyRate = annualRate / 12;

  const safeBasic = Math.max(0, input.monthlyBasicDa);
  const safeOpening = Math.max(0, input.openingBalance);
  const safeEmpPct = Math.min(100, Math.max(0, input.employeePercent));

  const monthlyEmployeeContrib = Math.round(safeBasic * (safeEmpPct / 100));
  const { epfShare, epsShare } = getEmployerSplit(safeBasic, input.employerRule);
  const monthlyEmployerEpf = Math.round(epfShare);
  const monthlyEpsRedirected = Math.round(epsShare);

  let running = safeOpening;
  let accruedInterest = 0;
  const monthlySchedule: EpfMonthRow[] = [];

  for (const month of FY_MONTHS) {
    const opening = running;
    running += monthlyEmployeeContrib + monthlyEmployerEpf;
    const interestForMonth = running * monthlyRate;
    accruedInterest += interestForMonth;
    monthlySchedule.push({
      month,
      opening: Math.round(opening),
      employeeContrib: monthlyEmployeeContrib,
      employerContrib: monthlyEmployerEpf,
      closingBeforeInterest: Math.round(running),
      monthlyInterest: Math.round(interestForMonth),
    });
  }

  const annualInterestEarned = Math.round(accruedInterest);
  const closingBalanceFY = Math.round(running + annualInterestEarned);
  const annualEmployeeContrib = monthlyEmployeeContrib * 12;
  const annualEmployerContrib = monthlyEmployerEpf * 12;
  const taxableEmployeeExcess = Math.max(0, annualEmployeeContrib - 250000);

  const yearsToRetire = Math.max(1, Math.min(45, Math.round(input.retirementAge - input.currentAge)));
  const hikeFactor = 1 + Math.max(0, input.annualIncrementPercent) / 100;

  let projBalance = safeOpening;
  let totalPrincipal = safeOpening;
  let currentMonthlyBasic = safeBasic;

  for (let y = 0; y < yearsToRetire; y++) {
    const empM = currentMonthlyBasic * (safeEmpPct / 100);
    const { epfShare: erM } = getEmployerSplit(currentMonthlyBasic, input.employerRule);
    let yearInterest = 0;

    for (let m = 0; m < 12; m++) {
      projBalance += empM + erM;
      totalPrincipal += empM + erM;
      yearInterest += projBalance * monthlyRate;
    }

    projBalance += yearInterest;
    currentMonthlyBasic *= hikeFactor;
  }

  const projectedRetirementCorpus = Math.round(projBalance);
  const totalPrincipalAtRetirement = Math.round(totalPrincipal);
  const totalInterestAtRetirement = Math.max(0, projectedRetirementCorpus - totalPrincipalAtRetirement);

  return {
    ratePercent,
    monthlyEmployeeContrib,
    monthlyEmployerEpf,
    monthlyEpsRedirected,
    annualEmployeeContrib,
    annualEmployerContrib,
    annualInterestEarned,
    closingBalanceFY,
    isInterestTaxableAlert: taxableEmployeeExcess > 0,
    taxableEmployeeExcess,
    monthlySchedule,
    yearsToRetire,
    projectedRetirementCorpus,
    totalPrincipalAtRetirement,
    totalInterestAtRetirement,
  };
}
