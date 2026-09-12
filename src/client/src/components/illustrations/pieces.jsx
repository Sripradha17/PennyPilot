// Additional finance illustration pieces, matching the flat/geometric style already
// established in ../illustrations.jsx (Coin, CoinStack, SparkleBurst, Blob, SavingsJar,
// ReceiptStack, WalletIllustration, Flag). Kept separate from the raccoon mascot art.

export function ChartBars({ className = "", size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
      <rect x="4" y="26" width="8" height="18" rx="2" fill="#A9C6A0" />
      <rect x="16" y="18" width="8" height="26" rx="2" fill="#5C8FA8" />
      <rect
        x="28"
        y="10"
        width="8"
        height="34"
        rx="2"
        fill="#2B5F47"
        className="finance-bar-grow"
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      />
      <line x1="2" y1="44.5" x2="40" y2="44.5" stroke="#C9C6B8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ChartLine({ className = "", size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 36" className={className} fill="none">
      <polyline
        points="2,30 13,22 23,26 34,10 46,6"
        fill="none"
        stroke="#2B5F47"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="6" r="3.4" fill="#E1AE55" stroke="#B98639" strokeWidth="1.1" className="finance-pulse-dot" />
    </svg>
  );
}

export function Calculator({ className = "", size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 48" className={className} fill="none">
      <rect x="1" y="1" width="38" height="46" rx="6" fill="#F1E9D6" stroke="#D9CBA6" strokeWidth="1.4" />
      <rect x="7" y="7" width="26" height="10" rx="2.5" fill="#20241F" />
      <text x="30" y="14.5" textAnchor="end" fontSize="7" fill="#A9E6C6" fontFamily="monospace">
        128.40
      </text>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={7 + col * 9}
            y={22 + row * 6.2}
            width="6.6"
            height="4.6"
            rx="1.4"
            fill={row === 0 && col === 2 ? "#D77F6C" : "#E4EEE0"}
            className={row === 0 && col === 2 ? "finance-key-press" : undefined}
            style={row === 0 && col === 2 ? { transformBox: "fill-box", transformOrigin: "50% 50%" } : undefined}
          />
        ))
      )}
    </svg>
  );
}

export function CreditCard({ className = "", size = 46 }) {
  return (
    <svg width={size} height={size * 0.64} viewBox="0 0 46 30" className={className} fill="none">
      <rect x="0.5" y="0.5" width="45" height="29" rx="5" fill="#5C8FA8" stroke="#4A7690" strokeWidth="1" />
      <rect x="0.5" y="7" width="45" height="5.5" fill="#3F6C85" />
      <rect x="5" y="19" width="14" height="3.2" rx="1.6" fill="#E4EEE0" />
      <rect x="5" y="24" width="22" height="2.4" rx="1.2" fill="#E4EEE0" opacity="0.65" />
      <circle cx="37" cy="20" r="5" fill="#E1AE55" opacity="0.9" />
      <circle cx="32" cy="20" r="5" fill="#D77F6C" opacity="0.75" />
    </svg>
  );
}

export function BudgetEnvelope({ className = "", size = 46 }) {
  return (
    <svg width={size} height={size * 0.76} viewBox="0 0 46 35" className={className} fill="none">
      <rect x="0.5" y="0.5" width="45" height="34" rx="4" fill="#FBFAF5" stroke="#E4E4DA" strokeWidth="1" />
      <path d="M1 1.5 22.5 19 45 1.5" stroke="#C9C6B8" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <circle
        cx="22.5"
        cy="14"
        r="6"
        fill="#E1AE55"
        stroke="#B98639"
        strokeWidth="1.2"
        className="finance-float"
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      />
      <text x="22.5" y="16.7" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#8A5F22">
        $
      </text>
    </svg>
  );
}
