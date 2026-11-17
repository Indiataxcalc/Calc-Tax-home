export interface TaxRateRow {
  section: string;
  natureOfPayment: string;
  thresholdFY2627: string;
  rateWithPan: string;
  rateNoPan: string;
}

export const FY2627_TDS_TABLE: TaxRateRow[] = [
  {
    section: 'Sec 192',
    natureOfPayment: 'Salary Income (New / Old Regime)',
    thresholdFY2627: '₹12,00,000 taxable (New) / ₹5,00,000 (Old)',
    rateWithPan: 'Slab Rates (0%–30% + 4% Cess)',
    rateNoPan: '20% or Slab Rate (higher)',
  },
  {
    section: 'Sec 194A',
    natureOfPayment: 'Bank / Post Office FD Interest (General)',
    thresholdFY2627: '₹50,000 p.a. (earlier ₹40,000)',
    rateWithPan: '10%',
    rateNoPan: '20%',
  },
  {
    section: 'Sec 194A',
    natureOfPayment: 'Bank / Post Office FD Interest (Senior 60+)',
    thresholdFY2627: '₹1,00,000 p.a. (earlier ₹50,000)',
    rateWithPan: '10%',
    rateNoPan: '20%',
  },
  {
    section: 'Sec 194I(b)',
    natureOfPayment: 'Rent of Land, Building or Furniture (Business)',
    thresholdFY2627: '₹50,000 per month',
    rateWithPan: '10%',
    rateNoPan: '20%',
  },
  {
    section: 'Sec 194IB',
    natureOfPayment: 'Rent by Individual / HUF (Non-Audit)',
    thresholdFY2627: '₹50,000 per month',
    rateWithPan: '2% (reduced from 5% w.e.f. Oct 2024)',
    rateNoPan: '20% (capped at last month rent)',
  },
  {
    section: 'Sec 194J',
    natureOfPayment: 'Professional Fees / Technical Services',
    thresholdFY2627: '₹50,000 p.a. (earlier ₹30,000)',
    rateWithPan: '10% (2% Technical)',
    rateNoPan: '20%',
  },
  {
    section: 'Sec 194C',
    natureOfPayment: 'Contractor Payments (Individual / Company)',
    thresholdFY2627: '₹30,000 single / ₹1,00,000 aggregate',
    rateWithPan: '1% (Ind/HUF) / 2% (Others)',
    rateNoPan: '20%',
  },
  {
    section: 'Sec 192A',
    natureOfPayment: 'Premature EPF Withdrawal (< 5 yrs service)',
    thresholdFY2627: '₹50,000',
    rateWithPan: '10% (0% with Form 15G/15H)',
    rateNoPan: 'Maximum Marginal Rate',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const HINGLISH_FAQS: FaqItem[] = [
  {
    question: 'TDS kya hota hai?',
    answer:
      'TDS (Tax Deducted at Source) ek advance tax collection system hai jisme payment karne wala person ya company (jaise aapka employer ya bank) aapko paise dene se pehle ek fixed percentage tax kaat kar Income Tax Department ko jama kar deta hai. Yeh aapke Form 26AS aur AIS mein reflect hota hai aur ITR file karte waqt adjust ho jata hai.',
  },
  {
    question: 'Salary par TDS kaise bachega?',
    answer:
      'FY 2026-27 mein New Tax Regime ke tahat ₹12,00,000 tak ki taxable income (yani ₹75,000 standard deduction milakar ₹12,75,000 gross salary) par Section 87A rebate ke kaaran zero TDS lagta hai. Agar aapki salary isse zyada hai aur aap Old Tax Regime choose karte hain, toh HRA exemption (Section 10(13A)), Section 80C (₹1.5 lakh), Section 80D health insurance, aur NPS (80CCD(1B)) ke proofs submit karke aap apna monthly TDS bacha sakte hain.',
  },
  {
    question: 'FD par TDS kab kat-ta hai aur Form 15G/15H kya hai?',
    answer:
      'Section 194A ke tahat agar ek financial year mein aapka total FD interest threshold limit (FY 2026-27 mein General citizens ke liye ₹50,000 aur Senior Citizens ke liye ₹1,00,000; earlier rules mein ₹40,000/₹50,000) cross karta hai, toh bank poore interest par 10% TDS (PAN link na hone par 20%) kaat-ta hai. Agar aapki total annual income tax-free limit ke andar hai, toh April mein Form 15G (below 60) ya Form 15H (60+) submit karke TDS rok sakte hain.',
  },
  {
    question: 'TDS return kab bharna hai aur Form 26QC kya hai?',
    answer:
      'Employers aur businesses (Section 192, 194I, 194A, 194J) har mahine ki 7 tareekh tak TDS jama karte hain aur quarterly Form 24Q/26Q file karte hain. Agar aap salaried individual hain aur monthly rent ₹50,000 se zyada dete hain (Section 194IB), toh aapko saal ke aakhri mahine (March) mein 2% TDS kaat kar 30 days ke andar Form 26QC bharna hota hai.',
  },
  {
    question: 'PF se paise kaise nikale aur EPF interest tax-free hai kya?',
    answer:
      'EPFO UAN Unified Portal par Aadhaar, PAN aur bank KYC verify karke aap online Form 19 (final settlement) ya Form 31 (advance) se PF nikal sakte hain. FY 2026-27 mein EPF par 8.25% p.a. interest milta hai. Agar aapne 5 saal continuous service complete ki hai aur annual employee contribution ₹2,50,000 tak hai, toh poora PF corpus aur interest tax-free rehta hai.',
  },
];

export interface ClusterArticle {
  slug: string;
  title: string;
  targetKeyword: string;
  category: string;
  summary: string;
  readTime: string;
  linkedTool?: 'tds' | 'hra' | 'epf';
  tdsSubTab?: 'salary' | 'fd' | 'rent';
  highlights: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export const CLUSTER_ARTICLES: ClusterArticle[] = [
  {
    slug: '/tds-calculator',
    title: 'TDS Calculator India (All Sections Hub)',
    targetKeyword: 'tds calculator',
    category: 'Main Tool',
    summary:
      'All-in-one TDS Calculator covering Section 192 Salary, Section 194A Bank FD Interest, and Section 194I / 194IB Rent TDS for FY 2026-27.',
    readTime: 'Tool & Reference',
    linkedTool: 'tds',
    tdsSubTab: 'salary',
    highlights: [
      'Instant Section 192 Salary TDS calculation under New and Old Tax Regimes.',
      'Section 194A FD interest check across ₹50,000 / ₹1,00,000 and classic ₹40,000 / ₹50,000 thresholds.',
      'Section 194IB (2%) and Section 194I (10%) rent TDS compliance rules.',
    ],
    sections: [
      {
        heading: 'Using the TDS Calculator on calctax.in',
        body: 'Select your TDS category—Salary (192), FD Interest (194A), or Rent (194I / 194IB)—enter your gross figures, and click Calculate to view exact TDS deductions, slab breakdowns, and net take-home payouts verified for FY 2026-27.',
      },
    ],
  },
  {
    slug: '/tds-on-salary-calculator',
    title: 'TDS on Salary Calculator (Section 192)',
    targetKeyword: 'tds calculator on salary',
    category: 'Salary Tax',
    summary:
      'Calculate monthly employer TDS on salary under New vs Old Tax Regime with ₹75,000 standard deduction and Section 87A rebate.',
    readTime: 'Sub Tool',
    linkedTool: 'tds',
    tdsSubTab: 'salary',
    highlights: [
      'New Regime zero tax up to ₹12,75,000 gross salaried income (₹12L taxable + ₹75K standard deduction).',
      'Employers divide estimated annual tax liability by 12 to deduct monthly TDS under Section 192.',
      'Submit Form 12BB investment proofs before January to prevent excess Q4 TDS deductions.',
    ],
    sections: [
      {
        heading: 'How Employers Compute Monthly Salary TDS in FY 2026-27',
        body: 'Under Section 192 of the Income Tax Act, your employer estimates your total annual taxable salary at the start of the financial year. After deducting eligible exemptions like Standard Deduction (₹75,000 in New Regime, ₹50,000 in Old Regime) and declared Chapter VI-A investments (if Old Regime is opted), total annual tax plus 4% Health and Education Cess is divided by 12 to arrive at your monthly TDS deduction.',
      },
      {
        heading: 'Section 87A Rebate & Marginal Relief Check',
        body: 'For FY 2026-27 under the New Tax Regime, resident individuals with taxable income up to ₹12,00,000 receive a full Section 87A rebate, resulting in zero TDS. If your taxable income crosses ₹12,00,000 marginally, marginal relief ensures your income tax before cess never exceeds the extra income above ₹12,00,000.',
      },
    ],
  },
  {
    slug: '/tds-on-rent-calculator',
    title: 'TDS on Rent Calculator (Sec 194IB & 194I)',
    targetKeyword: 'tds on rent calculator',
    category: 'Property & Rent',
    summary:
      'Compute 2% TDS under Section 194IB for residential tenants paying over ₹50,000/month or 10% under Section 194I for commercial leases.',
    readTime: 'Sub Tool',
    linkedTool: 'tds',
    tdsSubTab: 'rent',
    highlights: [
      'Section 194IB rate is 2% (reduced from 5% w.e.f. Oct 2024) when monthly rent exceeds ₹50,000.',
      'No TAN required for Section 194IB; file Form 26QC within 30 days of deduction month.',
      'Business tenants under audit deduct 10% monthly under Section 194I(b) and file Form 26Q.',
    ],
    sections: [
      {
        heading: 'Form 26QC Filing Deadline for Individual Tenants',
        body: 'If your monthly residential rent exceeds ₹50,000, Section 194IB requires you to deduct 2% TDS on the total annual rent in the month of March (or the last month of vacating the property). Submit Form 26QC on the Income Tax e-Filing portal within 30 days and download Form 16C for your landlord.',
      },
      {
        heading: 'Why Commercial Tenants Use Section 194I Instead',
        body: 'Companies, partnership firms, and individuals subject to tax audit must deduct TDS under Section 194I every month at 10% for land/building rent or 2% for plant and machinery when rent crosses ₹50,000/month.',
      },
    ],
  },
  {
    slug: '/tds-on-fd-calculator',
    title: 'TDS on FD Calculator (Section 194A)',
    targetKeyword: 'tds on fd calculator',
    category: 'Banking & FD',
    summary:
      'Check Section 194A Fixed Deposit TDS thresholds (₹50,000 General / ₹1,00,000 Senior Citizen; earlier ₹40K/₹50K) and Form 15G/15H rules.',
    readTime: 'Sub Tool',
    linkedTool: 'tds',
    tdsSubTab: 'fd',
    highlights: [
      'Threshold is aggregated across all branches of the same bank using your PAN.',
      'Crossing the threshold makes the ENTIRE annual interest subject to 10% TDS, not just the excess.',
      'Senior citizens enjoy enhanced ₹1,00,000 threshold under updated FY 2026-27 rules.',
    ],
    sections: [
      {
        heading: 'How Banks Aggregate FD Interest Across Branches',
        body: 'Banks aggregate interest across all Fixed Deposits and Recurring Deposits held under your PAN across every branch of that bank. Once the combined annual interest exceeds the Section 194A threshold (₹50,000 for regular individuals and ₹1,00,000 for senior citizens in FY 2026-27; earlier ₹40,000 and ₹50,000), the bank deducts 10% TDS on total accrued interest (20% without PAN).',
      },
    ],
  },
  {
    slug: '/hra-exemption-calculator',
    title: 'HRA Exemption Calculator (Section 10(13A))',
    targetKeyword: 'hra exemption calculator',
    category: 'Salary Exemptions',
    summary:
      'Calculate exact House Rent Allowance exemption across Metro (50%) and Non-Metro (40%) cities for Old Regime tax filing.',
    readTime: 'Tool & Guide',
    linkedTool: 'hra',
    highlights: [
      'Least of 3 statutory clauses determines your exempt HRA amount.',
      'Metro rate (50%) applies strictly to Delhi, Mumbai, Kolkata, and Chennai.',
      'Landlord PAN is mandatory if annual rent exceeds ₹1,00,000 (₹8,333/month).',
    ],
    sections: [
      {
        heading: 'The 3-Clause HRA Exemption Rule Explained',
        body: 'Section 10(13A) read with Rule 2A restricts HRA exemption to the lowest of three values: (1) Actual HRA received from your employer, (2) 50% of Basic Salary + DA if residing in Delhi, Mumbai, Kolkata, or Chennai (40% for all other cities), and (3) Actual Rent Paid minus 10% of Basic Salary + DA.',
      },
    ],
  },
  {
    slug: '/epf-interest-calculator',
    title: 'EPF Interest Calculator (8.25% FY 2026-27)',
    targetKeyword: 'epf interest calculator',
    category: 'Retirement & EPF',
    summary:
      'Calculate monthly running-balance EPF interest at 8.25% p.a. and project your long-term retirement corpus.',
    readTime: 'Tool & Guide',
    linkedTool: 'epf',
    highlights: [
      'Current EPFO interest rate for FY 2026-27 is 8.25% p.a.',
      'Interest is computed monthly on running balances and credited annually on March 31.',
      'Interest on employee + VPF contributions up to ₹2,50,000/year is tax-free.',
    ],
    sections: [
      {
        heading: 'How EPFO Calculates 8.25% Compound Interest',
        body: 'While EPF interest is credited into your passbook once a year, EPFO computes interest every month at 8.25% ÷ 12 (0.6875%) on your monthly running balance. Both your 12% employee share and the employer EPF share earn interest continuously.',
      },
    ],
  },
  {
    slug: '/pf-withdrawal-guide',
    title: 'PF Withdrawal Rules 2026 & Tax Guide',
    targetKeyword: 'pf withdrawal rules 2026',
    category: 'High-Traffic Guide',
    summary:
      'Complete PF withdrawal rules for FY 2026-27: UAN & KYC steps, 5-year continuous service rule, Section 192A TDS, and Form 15G.',
    readTime: '6 min read',
    linkedTool: 'epf',
    highlights: [
      'Withdrawal after 5 years of continuous service is 100% tax-free.',
      'Withdrawal ≥ ₹50,000 before 5 years attracts 10% TDS u/s 192A (avoidable via Form 15G/15H if total income is non-taxable).',
      'Online Form 19, Form 10C, and Form 31 advances require Aadhaar-linked UAN and verified bank KYC.',
    ],
    sections: [
      {
        heading: 'Online PF Withdrawal Step-by-Step (UAN Portal)',
        body: 'Log in to the EPFO Unified Member Portal using your UAN and password, verify that Aadhaar, PAN, and Bank IFSC are digitally approved under Manage > KYC, navigate to Online Services > Claim (Form-31, 19, 10C), verify your bank account digits, and authenticate via Aadhaar OTP.',
      },
      {
        heading: 'When Does Section 192A TDS Apply on PF Withdrawal?',
        body: 'If your total continuous service (including transferred PF accounts from previous employers) is less than 5 years and the taxable withdrawal exceeds ₹50,000, EPFO deducts 10% TDS under Section 192A. You can submit Form 15G (or Form 15H for senior citizens) during claim submission if your annual income is below the basic exemption limit.',
      },
    ],
  },
  {
    slug: '/form-15g-pf-withdrawal',
    title: 'Form 15G & 15H Guide for PF & FD TDS',
    targetKeyword: 'form 15g for pf withdrawal',
    category: 'Compliance Guide',
    summary:
      'How to fill Form 15G/15H to stop unnecessary TDS on bank FD interest and premature PF withdrawals under ₹50,000+.',
    readTime: '4 min read',
    linkedTool: 'tds',
    tdsSubTab: 'fd',
    highlights: [
      'Form 15G is for resident individuals below 60 years; Form 15H is strictly for senior citizens 60+.',
      'Final tax liability on estimated annual income must be NIL.',
      'Valid PAN is mandatory before submitting Form 15G/15H to banks or EPFO.',
    ],
    sections: [
      {
        heading: 'Eligibility Conditions for Form 15G and 15H',
        body: 'For Form 15G, two conditions must hold simultaneously: your final tax liability on total estimated income is zero, and your total interest/withdrawal income alone does not exceed the basic exemption limit. For Form 15H (senior citizens aged 60+), only zero final tax liability after Section 87A rebate is required.',
      },
    ],
  },
  {
    slug: '/tds-rates-2026-27',
    title: 'TDS Rates Chart FY 2026-27 (AY 2027-28)',
    targetKeyword: 'tds rates 2026-27',
    category: 'Reference Table',
    summary:
      'Updated FY 2026-27 TDS sections, threshold limits, PAN vs non-PAN rates across Salary, FD, Rent, Contractors, and Professionals.',
    readTime: 'Reference',
    linkedTool: 'tds',
    tdsSubTab: 'salary',
    highlights: [
      'Updated thresholds effective from FY 2025-26 / FY 2026-27: FD ₹50K/₹1L, Rent ₹50K/month, 194J ₹50K.',
      'Section 194IB individual rent TDS rate is 2% (reduced from 5%).',
      'Missing PAN triggers 20% minimum TDS under Section 206AA.',
    ],
    sections: [
      {
        heading: 'Annual TDS Threshold & Rate Reference',
        body: 'Always verify the latest CBDT circulars before deducting or claiming TDS. Missing or inoperative PAN automatically attracts a minimum 20% deduction rate under Section 206AA.',
      },
    ],
  },
  {
    slug: '/tds-vs-tcs',
    title: 'TDS vs TCS — Difference Explained (Hinglish)',
    targetKeyword: 'difference tds tcs',
    category: 'Tax Basics',
    summary:
      'Simple Hinglish & English comparison between Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) with examples.',
    readTime: '3 min read',
    linkedTool: 'tds',
    tdsSubTab: 'salary',
    highlights: [
      'TDS is deducted by the buyer/payer on salary, rent, FD interest, and professional fees.',
      'TCS is collected by the seller/bank on specified goods, foreign remittances (LRS), and luxury vehicles over ₹10 lakh.',
      'Both TDS and TCS appear in Form 26AS / AIS and can be adjusted against final tax liability.',
    ],
    sections: [
      {
        heading: 'TDS aur TCS mein Main Fark Kya Hai?',
        body: 'TDS tab kat-ta hai jab aap kisi ko payment karte hain (jaise employer salary deta hai ya tenant rent deta hai). TCS tab collect hota hai jab seller aapko specified cheezein bechta hai ya bank LRS foreign remittance process karta hai. Dono hi advance tax credits hain jo ITR mein claim kiye jate hain.',
      },
    ],
  },
];
