// The finance illustration system: reusable animated scenes for money/budgeting concepts,
// kept entirely separate from the raccoon mascot (Raccoon.jsx / RaccoonScene.jsx), which
// this file never imports or renders. Compose a scene per `type`, then sprinkle a couple
// of small decorative pieces — not everything animates at once.
import {
  Coin,
  CoinStack,
  SparkleBurst,
  Blob,
  SavingsJar,
  ReceiptStack,
  WalletIllustration,
  Flag,
} from "../illustrations.jsx";
import { ChartBars, ChartLine, Calculator, CreditCard, BudgetEnvelope } from "./pieces.jsx";

const VARIANTS = {
  home: {
    bg: "bg-gradient-to-br from-sage-light via-surface to-cream",
    content: (
      <>
        <WalletIllustration size={64} className="drop-shadow-[0_14px_20px_rgba(43,95,71,0.25)]" />
        <CoinStack size={44} className="absolute left-[16%] bottom-[18%] animate-float-slow" />
        <ChartBars size={44} className="absolute right-[14%] bottom-[14%]" />
        <Coin size={30} className="absolute right-[22%] top-[16%] animate-coin-bounce" />
        <SparkleBurst size={18} className="absolute left-[26%] top-[14%] text-gold animate-sparkle" />
        <SparkleBurst size={14} className="absolute right-[8%] top-[42%] text-forest/60 animate-sparkle" />
      </>
    ),
  },
  expenses: {
    bg: "bg-surface2",
    content: (
      <>
        <ReceiptStack size={52} />
        <CreditCard size={44} className="absolute right-[14%] bottom-[22%]" />
        <Coin size={22} className="absolute left-[16%] bottom-[16%] animate-coin-bounce" />
        <SparkleBurst size={14} className="absolute right-[20%] top-[18%] text-coral animate-sparkle" />
      </>
    ),
  },
  emptyExpenses: {
    bg: "bg-surface2",
    content: (
      <>
        <WalletIllustration size={56} className="opacity-70" />
        <ReceiptStack size={30} className="absolute right-[24%] top-[22%] opacity-40 finance-flutter" />
        <SparkleBurst size={14} className="absolute left-[22%] top-[20%] text-mist animate-sparkle" />
      </>
    ),
  },
  budget: {
    bg: "bg-gradient-to-br from-sage-light via-surface to-surface2",
    content: (
      <>
        <BudgetEnvelope size={58} />
        <SavingsJar size={40} className="absolute left-[14%] bottom-[14%]" />
        <ChartBars size={34} className="absolute right-[12%] bottom-[18%]" />
        <SparkleBurst size={14} className="absolute right-[22%] top-[16%] text-gold animate-sparkle" />
      </>
    ),
  },
  income: {
    bg: "bg-gradient-to-br from-surface2 via-surface to-sage-light",
    content: (
      <>
        <WalletIllustration size={58} />
        <Coin size={20} className="absolute left-[18%] top-[20%] animate-coin-drop" />
        <Coin size={24} className="absolute left-[30%] top-[10%] animate-coin-bounce" />
        <ChartLine size={46} className="absolute right-[10%] bottom-[18%]" />
      </>
    ),
  },
  goals: {
    bg: "bg-gradient-to-b from-sage-light to-surface",
    content: (
      <>
        <SavingsJar size={56} />
        <Flag size={22} className="absolute right-[18%] top-[14%] text-teal animate-float-slow" />
        <ChartLine size={40} className="absolute left-[12%] bottom-[16%]" />
        <SparkleBurst size={14} className="absolute right-[26%] top-[30%] text-gold animate-sparkle" />
      </>
    ),
  },
  goalReached: {
    bg: "bg-gradient-to-br from-cream via-surface to-sage-light",
    content: (
      <>
        <SavingsJar size={56} />
        <Flag size={24} className="absolute right-[16%] top-[10%] text-gold animate-bob" />
        <SparkleBurst size={18} className="absolute left-[18%] top-[14%] text-gold animate-sparkle" />
        <SparkleBurst size={14} className="absolute right-[10%] top-[38%] text-coral animate-sparkle" />
        <SparkleBurst size={14} className="absolute left-[30%] bottom-[16%] text-forest animate-sparkle" />
      </>
    ),
  },
  reports: {
    bg: "bg-surface2",
    content: (
      <>
        <ChartLine size={56} />
        <Calculator size={34} className="absolute right-[14%] bottom-[12%]" />
        <ChartBars size={30} className="absolute left-[14%] bottom-[16%]" />
      </>
    ),
  },
};

export default function FinanceIllustration({ type = "home", size = 140, className = "" }) {
  const v = VARIANTS[type] || VARIANTS.home;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${v.bg} ${className}`}
      style={{ minHeight: size }}
      aria-hidden="true"
    >
      <Blob className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 text-forest/[0.05]" />
      <Blob className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 text-coral/[0.05]" />
      <div className="relative flex h-full items-center justify-center" style={{ minHeight: size }}>
        {v.content}
      </div>
    </div>
  );
}
