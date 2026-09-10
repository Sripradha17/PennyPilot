// A hand-drawn (not emoji) full-body raccoon mascot, built from plain SVG
// shapes so it stays crisp at any size and can be animated with CSS alone —
// no image assets, no animation library.
export default function RaccoonMascot({ size = 96, className = "" }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 200 260"
      className={`raccoon-mascot ${className}`}
      role="img"
      aria-label="Budget Raccoon mascot"
    >
      <style>{`
        .raccoon-mascot { overflow: visible; }
        .raccoon-mascot .rc-figure { animation: rc-hop 2.8s ease-in-out infinite; transform-origin: 100px 250px; }
        .raccoon-mascot .rc-tail { animation: rc-tail 2.4s ease-in-out infinite; transform-origin: 148px 175px; }
        .raccoon-mascot .rc-arm-wave { animation: rc-wave 1.4s ease-in-out infinite; transform-origin: 148px 158px; }
        .raccoon-mascot .rc-eye { animation: rc-blink 4.5s ease-in-out infinite; transform-origin: center; }
        .raccoon-mascot .rc-eye-right { animation-delay: 0.05s; }
        @keyframes rc-hop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes rc-tail {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes rc-wave {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-55deg); }
        }
        @keyframes rc-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>

      <g className="rc-figure">
        {/* Tail, behind the body */}
        <g className="rc-tail">
          <path d="M140 190 C185 185 200 130 165 100 C190 125 185 175 140 190 Z" fill="#8a8a96" />
          <path d="M150 175 C170 165 178 140 165 118" stroke="#3a3a44" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M156 148 C168 138 172 122 163 108" stroke="#3a3a44" strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>

        {/* Legs / feet */}
        <ellipse cx="78" cy="242" rx="20" ry="13" fill="#3a3a44" />
        <ellipse cx="124" cy="242" rx="20" ry="13" fill="#3a3a44" />

        {/* Body */}
        <ellipse cx="100" cy="195" rx="50" ry="46" fill="#9b9ba6" />
        {/* Belly / vest */}
        <ellipse cx="100" cy="202" rx="29" ry="32" fill="#4a9186" />

        {/* Resting left arm */}
        <path d="M56 172 C40 182 34 205 44 222" stroke="#9b9ba6" strokeWidth="22" strokeLinecap="round" fill="none" />
        <circle cx="45" cy="224" r="12" fill="#9b9ba6" />

        {/* Waving right arm */}
        <g className="rc-arm-wave">
          <path d="M148 158 C170 150 182 130 178 110" stroke="#9b9ba6" strokeWidth="22" strokeLinecap="round" fill="none" />
          <circle cx="178" cy="108" r="13" fill="#9b9ba6" />
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

        {/* Neckerchief */}
        <path d="M68 150 C85 165 115 165 132 150 L124 172 C110 180 90 180 76 172 Z" fill="#c9776b" />
      </g>
    </svg>
  );
}
