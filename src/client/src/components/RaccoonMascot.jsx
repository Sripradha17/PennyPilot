// A hand-drawn (not emoji) raccoon mascot, built from plain SVG shapes so it
// stays crisp at any size and can be animated with CSS alone — no image
// assets, no animation library.
export default function RaccoonMascot({ size = 96, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`raccoon-mascot ${className}`}
      role="img"
      aria-label="Budget Raccoon mascot"
    >
      <style>{`
        .raccoon-mascot { overflow: visible; }
        .raccoon-mascot .rc-body { animation: rc-bob 3.2s ease-in-out infinite; transform-origin: 100px 180px; }
        .raccoon-mascot .rc-tail { animation: rc-tail 2.6s ease-in-out infinite; transform-origin: 165px 150px; }
        .raccoon-mascot .rc-eye { animation: rc-blink 4.5s ease-in-out infinite; transform-origin: center; }
        .raccoon-mascot .rc-eye-right { animation-delay: 0.05s; }
        @keyframes rc-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-1.5deg); }
        }
        @keyframes rc-tail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes rc-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>

      <g className="rc-body">
        {/* Striped tail, peeking out behind */}
        <g className="rc-tail">
          <path
            d="M150 165 C185 160 195 120 165 95 C185 110 180 150 150 165 Z"
            fill="#8a8a96"
          />
          <path d="M158 152 C172 145 178 128 168 112" stroke="#3a3a44" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M163 130 C173 122 176 110 170 100" stroke="#3a3a44" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>

        {/* Ears */}
        <circle cx="62" cy="62" r="26" fill="#8a8a96" />
        <circle cx="64" cy="65" r="13" fill="#3a3a44" />
        <circle cx="138" cy="62" r="26" fill="#8a8a96" />
        <circle cx="136" cy="65" r="13" fill="#3a3a44" />

        {/* Head */}
        <circle cx="100" cy="112" r="62" fill="#9b9ba6" />

        {/* Face mask */}
        <path
          d="M45 100 C45 82 70 78 100 78 C130 78 155 82 155 100 C155 122 132 128 100 128 C68 128 45 122 45 100 Z"
          fill="#3a3a44"
        />

        {/* Muzzle */}
        <ellipse cx="100" cy="122" rx="34" ry="26" fill="#e9e8ee" />

        {/* Eyes */}
        <g className="rc-eye rc-eye-left">
          <circle cx="82" cy="100" r="9" fill="#151519" />
          <circle cx="85" cy="97" r="2.5" fill="#fff" />
        </g>
        <g className="rc-eye rc-eye-right">
          <circle cx="118" cy="100" r="9" fill="#151519" />
          <circle cx="121" cy="97" r="2.5" fill="#fff" />
        </g>

        {/* Nose */}
        <ellipse cx="100" cy="118" rx="7" ry="5" fill="#c9776b" />

        {/* Neckerchief — a small nod to the brand color */}
        <path d="M68 150 C85 165 115 165 132 150 L124 172 C110 180 90 180 76 172 Z" fill="#4a9186" />
      </g>
    </svg>
  );
}
