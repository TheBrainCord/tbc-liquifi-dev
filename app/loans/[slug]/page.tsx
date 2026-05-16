import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoanDetailPage, type LoanConfig } from "@/components/LoanDetailPage";

const LOANS: Record<
  string,
  LoanConfig & { metaTitle: string; metaDesc: string }
> = {
  personal: {
    title: "Personal Loan",
    badge: "No Collateral · Instant Approval · 50+ Lenders",
    headline: "Get Up to ₹40 Lakh in Your Account Within 24 Hours",
    subhead:
      "No security, no collateral, no hassle. Apply once, get matched with 50+ lenders competing for your business.",
    gradient: "from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8]",
    color: "#1e3a8a",
    rate: 10.5,
    rateDisplay: "10.5% p.a.",
    maxAmountDisplay: "₹40 Lakh",
    maxAmount: 4000000,
    tenureMonths: 84,
    tenureDisplay: "7 years",
    approvalTime: "24 hrs",
    loanType: "personal",
    metaTitle: "Personal Loan up to ₹40L at 10.5% | LiquiFi",
    metaDesc:
      "Get instant personal loan up to ₹40 lakh at 10.5% p.a. No collateral. Compare 50+ lenders. Approved in 24 hours.",
    disbursementSteps: [
      {
        step: "01",
        title: "Apply in 2 Minutes",
        time: "2 min",
        desc: "Fill a simple form — loan type, amount, basic KYC. No branch visit, no paperwork.",
      },
      {
        step: "02",
        title: "AI Matches You",
        time: "60 sec",
        desc: "Our engine scans 50+ lenders and finds those most likely to approve your profile instantly.",
      },
      {
        step: "03",
        title: "Pick Your Offer",
        time: "2 hrs",
        desc: "Compare interest rates, processing fees, and prepayment terms side by side. Zero pressure.",
      },
      {
        step: "04",
        title: "Money in Account",
        time: "24 hrs",
        desc: "After document submission, funds hit your account via NEFT/IMPS the same or next day.",
      },
    ],
    highlights: [
      {
        title: "Zero Collateral",
        desc: "No gold, no property pledge. Your credit profile does the work. Fully unsecured loan.",
        stat: "₹40L unsecured",
      },
      {
        title: "AI Credit Match",
        desc: "We pick lenders most likely to approve you — higher approval chances, better rates for you.",
        stat: "50+ lenders",
      },
      {
        title: "No Prepayment Penalty",
        desc: "Repay early without extra charges. Most lenders on LiquiFi waive prepayment fees entirely.",
        stat: "Zero extra charges",
      },
    ],
    faq: [
      {
        q: "What documents do I need?",
        a: "PAN card, Aadhaar, 3 months salary slips, 6 months bank statement. That's it — fully digital upload.",
      },
      {
        q: "Will this affect my CIBIL score?",
        a: "Checking eligibility on LiquiFi uses a soft pull — zero CIBIL impact. A hard pull only happens after you formally accept a lender's offer.",
      },
      {
        q: "Can I apply with a low CIBIL score?",
        a: "Yes. We have lender partners who work with scores as low as 650. Our AI matches you with the right lender for your profile.",
      },
    ],
  },

  home: {
    title: "Home Loan",
    badge: "Tax Benefits up to ₹3.5L/yr · Balance Transfer Available",
    headline: "Own Your Dream Home Starting at ₹8.5% Per Year",
    subhead:
      "India's lowest home loan rates. Save lakhs on interest, claim tax benefits up to ₹3.5L/yr, or transfer your existing high-rate loan.",
    gradient: "from-[#052e16] via-[#14532d] to-[#166534]",
    color: "#16a34a",
    rate: 8.5,
    rateDisplay: "8.5% p.a.",
    maxAmountDisplay: "₹5 Crore",
    maxAmount: 50000000,
    tenureMonths: 360,
    tenureDisplay: "30 years",
    approvalTime: "7 days",
    loanType: "home",
    metaTitle: "Home Loan up to ₹5Cr at 8.5% | LiquiFi",
    metaDesc:
      "Home loan up to ₹5 crore starting 8.5% p.a. Tax benefits under 80C & 24b. Balance transfer available. Compare SBI, HDFC, ICICI & more.",
    disbursementSteps: [
      {
        step: "01",
        title: "Eligibility Check",
        time: "2 min",
        desc: "Share income details, CIBIL score, and property type for an instant in-principle approval.",
      },
      {
        step: "02",
        title: "Property Evaluation",
        time: "3–5 days",
        desc: "Lender conducts legal verification and technical assessment of the property value.",
      },
      {
        step: "03",
        title: "Loan Sanction",
        time: "Day 6",
        desc: "Receive your official sanction letter with the approved amount, rate, and terms.",
      },
      {
        step: "04",
        title: "Disbursement",
        time: "Day 7",
        desc: "Funds transferred directly to builder or seller as per the sale agreement schedule.",
      },
    ],
    highlights: [
      {
        title: "Tax Savings ₹3.5L/yr",
        desc: "Claim deductions under Section 80C (principal repayment) and Section 24b (interest paid). Massive annual savings.",
        stat: "₹3.5L annual saving",
      },
      {
        title: "Balance Transfer",
        desc: "If your current home loan rate is above 9%, transfer instantly to a lender at 8.5% and save lakhs over the tenure.",
        stat: "Save lakhs",
      },
      {
        title: "Top-Up Loan",
        desc: "Already have a home loan? Get additional funds as a top-up at home loan interest rates — cheaper than a personal loan.",
        stat: "Up to ₹50L extra",
      },
    ],
    faq: [
      {
        q: "How much loan can I get?",
        a: "Banks typically fund 75–90% of the property value. For a ₹50L property, you can get ₹37.5L–₹45L. LiquiFi helps you find lenders with the highest LTV ratio.",
      },
      {
        q: "What is the minimum CIBIL score needed?",
        a: "Most lenders require 700+. With 750+, you unlock the lowest interest rates. If your score is lower, we can help fix it first through our CIBIL Fix program.",
      },
      {
        q: "Can I prepay my home loan?",
        a: "Yes. Floating rate home loans have zero prepayment penalty as per RBI guidelines. Fixed rate loans may have a small charge — check your sanction letter.",
      },
    ],
  },

  business: {
    title: "Business Loan",
    badge: "GST-Based Underwriting · No Collateral up to ₹50L",
    headline: "Fund Your Business Growth. Up to ₹2 Crore in 48 Hours.",
    subhead:
      "Collateral-free business loans based on your GST returns and bank statements. No ITR needed for amounts up to ₹50 lakh.",
    gradient: "from-[#2e1065] via-[#4c1d95] to-[#6d28d9]",
    color: "#7c3aed",
    rate: 12,
    rateDisplay: "12% p.a.",
    maxAmountDisplay: "₹2 Crore",
    maxAmount: 20000000,
    tenureMonths: 60,
    tenureDisplay: "5 years",
    approvalTime: "48 hrs",
    loanType: "business",
    metaTitle: "Business Loan up to ₹2Cr at 12% | LiquiFi",
    metaDesc:
      "Business loan up to ₹2 crore. Collateral-free up to ₹50L. GST-based underwriting. Compare 20+ NBFCs and banks. Fast approval in 48 hours.",
    disbursementSteps: [
      {
        step: "01",
        title: "Business Profile",
        time: "10 min",
        desc: "Submit GST returns, 6-month bank statements, and basic business details digitally.",
      },
      {
        step: "02",
        title: "AI Revenue Analysis",
        time: "1 hr",
        desc: "Our AI analyses your turnover, cash flows, and repayment capacity automatically — no manual review delays.",
      },
      {
        step: "03",
        title: "Choose Your Offer",
        time: "24 hrs",
        desc: "Compare offers from NBFCs and banks — interest rate, tenure, processing fee, prepayment terms.",
      },
      {
        step: "04",
        title: "Working Capital Ready",
        time: "48 hrs",
        desc: "Funds credited to your business current account for immediate deployment.",
      },
    ],
    highlights: [
      {
        title: "GST-Based Underwriting",
        desc: "No ITR? No problem. We lend based on your GST filings and bank statement cash flows. Simple and fast.",
        stat: "No ITR needed",
      },
      {
        title: "Overdraft Option",
        desc: "Get an OD facility up to ₹50L. Draw funds as needed and pay interest only on what you actually use — not the full limit.",
        stat: "OD up to ₹50L",
      },
      {
        title: "Flexible EMI Cycles",
        desc: "Align repayment with your business's seasonal revenue cycles. No rigid monthly dates that hurt cash flow.",
        stat: "Custom schedule",
      },
    ],
    faq: [
      {
        q: "Do I need collateral?",
        a: "No collateral needed up to ₹50L. Above ₹50L, some lenders may ask for property or equipment as security. We'll match you with collateral-free options first.",
      },
      {
        q: "What is the minimum business age?",
        a: "Most lenders require 2+ years of business vintage. For newer businesses, our NBFC partners offer startup-friendly products from 6 months vintage.",
      },
      {
        q: "Can proprietors and partnerships apply?",
        a: "Yes. Sole proprietors, partnerships, LLPs, and private limited companies are all eligible. We have lenders for every business structure.",
      },
    ],
  },

  car: {
    title: "Car Loan",
    badge: "New & Used Cars · Same Day Approval at 300+ Dealers",
    headline: "Drive Home Your Dream Car Today. Up to ₹1 Crore.",
    subhead:
      "90% on-road funding. New and used cars financed. Same-day sanction letter accepted at 300+ partner dealerships across India.",
    gradient: "from-[#431407] via-[#7c2d12] to-[#9a3412]",
    color: "#ea580c",
    rate: 8.75,
    rateDisplay: "8.75% p.a.",
    maxAmountDisplay: "₹1 Crore",
    maxAmount: 10000000,
    tenureMonths: 84,
    tenureDisplay: "7 years",
    approvalTime: "Same Day",
    loanType: "car",
    metaTitle: "Car Loan up to ₹1Cr at 8.75% | LiquiFi",
    metaDesc:
      "Car loan up to ₹1 crore at 8.75% p.a. 90% on-road funding. New & used cars. Same day approval at 300+ dealerships across India.",
    disbursementSteps: [
      {
        step: "01",
        title: "Pick Your Car",
        time: "Your time",
        desc: "Choose any new or used car — any make, any model, any price range. We finance them all.",
      },
      {
        step: "02",
        title: "Online Sanction",
        time: "30 min",
        desc: "Submit basic documents online and get an in-principle sanction letter emailed to you.",
      },
      {
        step: "03",
        title: "Visit Dealer",
        time: "Same day",
        desc: "Walk into any of our 300+ partner dealerships with the digital sanction letter on your phone.",
      },
      {
        step: "04",
        title: "Drive Away",
        time: "Same day",
        desc: "Dealer confirms payment from the lender, you sign the documents, and your keys are handed over.",
      },
    ],
    highlights: [
      {
        title: "90% On-Road Funding",
        desc: "We finance up to 90% of the on-road price, including insurance and registration charges. You pay just 10% down.",
        stat: "Only 10% down",
      },
      {
        title: "New & Used Cars",
        desc: "Finance brand new cars or pre-owned vehicles up to 10 years old from certified dealer networks.",
        stat: "Any car, any age",
      },
      {
        title: "300+ Partner Dealers",
        desc: "Walk in with our sanction letter at Maruti, Hyundai, Tata, Toyota, and 300+ more partner dealerships pan-India.",
        stat: "Pan-India network",
      },
    ],
    faq: [
      {
        q: "Can I get a loan for a used car?",
        a: "Yes. We finance pre-owned cars up to 10 years old from certified used car dealers and platforms like Cars24, Spinny, and CarDekho.",
      },
      {
        q: "Is insurance included in the loan?",
        a: "Yes. You can include the first-year insurance premium in your loan amount, reducing your upfront cash outflow.",
      },
      {
        q: "What is the minimum down payment?",
        a: "Typically 10–15% of the on-road price. For premium and luxury cars above ₹20L, some lenders require 20%. We find you the lowest down payment offer.",
      },
    ],
  },
};

type LoanSlug = keyof typeof LOANS;

export function generateStaticParams() {
  return (Object.keys(LOANS) as LoanSlug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loan = LOANS[slug as LoanSlug];
  if (!loan) return {};
  return {
    title: loan.metaTitle,
    description: loan.metaDesc,
  };
}

export default async function LoanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loan = LOANS[slug as LoanSlug];
  if (!loan) notFound();

  return (
    <>
      <Navbar />
      <LoanDetailPage loan={loan} />
      <Footer />
    </>
  );
}
