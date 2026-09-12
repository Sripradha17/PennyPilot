// A composed illustration: the raccoon set inside a small finance-themed environment.
// Used for the Home hero and for empty/success states, so the mascot reads as a character
// living inside the product rather than a logo pasted next to text.
import Raccoon from "./Raccoon.jsx";
import { Coin, CoinStack, SparkleBurst, Blob, SavingsJar } from "../illustrations.jsx";

const VARIANTS = {
  home: {
    pose: "coins",
    bg: "bg-gradient-to-br from-sage-light via-surface to-cream",
    decor: (
      <>
        <CoinStack className="absolute left-[8%] bottom-[14%] h-14 w-14 animate-float-slow" />
        <Coin className="absolute right-[12%] top-[18%] h-9 w-9 animate-coin-bounce" size={36} />
        <SparkleBurst className="absolute right-[22%] bottom-[30%] h-5 w-5 text-gold animate-sparkle" />
        <SparkleBurst className="absolute left-[20%] top-[14%] h-4 w-4 text-forest/60 animate-sparkle" />
      </>
    ),
  },
  "empty-wallet": {
    pose: "searching",
    bg: "bg-surface2",
    decor: <SparkleBurst className="absolute right-[28%] top-[20%] h-4 w-4 text-mist animate-sparkle" />,
  },
  goals: {
    pose: "climbing",
    bg: "bg-gradient-to-b from-sage-light to-surface",
    decor: (
      <>
        <Coin className="absolute left-[14%] top-[24%] h-7 w-7 animate-coin-bounce" size={28} />
        <SparkleBurst className="absolute right-[16%] top-[16%] h-5 w-5 text-gold animate-sparkle" />
      </>
    ),
  },
  success: {
    pose: "celebrating",
    bg: "bg-gradient-to-br from-cream via-surface to-sage-light",
    decor: (
      <>
        <SparkleBurst className="absolute left-[18%] top-[12%] h-5 w-5 text-gold animate-sparkle" />
        <SparkleBurst className="absolute right-[16%] top-[22%] h-4 w-4 text-coral animate-sparkle" />
        <SparkleBurst className="absolute right-[30%] bottom-[16%] h-4 w-4 text-forest animate-sparkle" />
      </>
    ),
  },
  loading: {
    pose: "counting",
    bg: "bg-surface2",
    decor: null,
  },
  budget: {
    pose: "jar",
    bg: "bg-gradient-to-br from-sage-light via-surface to-surface2",
    decor: <SparkleBurst className="absolute right-[18%] top-[18%] h-4 w-4 text-gold animate-sparkle" />,
  },
  receipts: {
    pose: "receipt",
    bg: "bg-surface2",
    decor: null,
  },
};

export default function RaccoonScene({ variant = "home", size = 200, className = "", showGround = true }) {
  const v = VARIANTS[variant] || VARIANTS.home;
  return (
    <div className={`relative overflow-hidden rounded-2xl ${v.bg} ${className}`}>
      <Blob className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 text-forest/[0.05]" />
      <Blob className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 text-coral/[0.05]" />
      {v.decor}
      <div className="relative flex items-center justify-center h-full py-6">
        <Raccoon pose={v.pose} size={size} />
      </div>
      {showGround && (
        <div className="pointer-events-none absolute inset-x-6 bottom-4 h-2 rounded-full bg-ink/[0.05]" />
      )}
    </div>
  );
}
