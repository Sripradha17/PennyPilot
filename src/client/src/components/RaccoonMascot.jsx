// Hand-drawn (not emoji) raccoon mascot family. Two features make something
// actually read as a raccoon rather than a generic bear cub: a dark mask
// across the eyes, and a bold ringed tail — both were missing from an
// earlier pass that over-corrected toward a maskless "soft" style. This
// version keeps the mask (with light closed-eye crescents sitting on top of
// it, cartoon-style) and a much bigger, clearly-banded tail.
const OUTLINE = "#33333c";
const BODY = "#b3b3bf";
const BODY_SHADE = "#96969f";
const MASK = "#3f3f4a";
const BELLY = "#f5f3f0";
const NOSE = "#26262e";
const VEST = "#c9776b";
const COIN = "#c99a52";

const S = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: "round" };

function Shadow() {
  return <ellipse cx="100" cy="249" rx="52" ry="9" fill="#000" opacity="0.35" />;
}

function Ears() {
  return (
    <>
      <circle cx="60" cy="58" r="25" fill={BODY} {...S} />
      <circle cx="62" cy="61" r="12" fill={BELLY} />
      <circle cx="140" cy="58" r="25" fill={BODY} {...S} />
      <circle cx="138" cy="61" r="12" fill={BELLY} />
    </>
  );
}

// The raccoon's signature dark mask — two overlapping patches forming one
// continuous band across the eyes.
function Mask() {
  return (
    <>
      <ellipse cx="79" cy="97" rx="27" ry="20" fill={MASK} />
      <ellipse cx="121" cy="97" rx="27" ry="20" fill={MASK} />
    </>
  );
}

// Closed, happy curved eyes drawn light-on-dark so they read clearly against
// the mask, cartoon-raccoon style.
function HappyEyes() {
  return (
    <>
      <path d="M68 96 Q79 84 90 96" stroke={BELLY} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M110 96 Q121 84 132 96" stroke={BELLY} strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  );
}

function OpenEyes({ className = "" }) {
  return (
    <g className={className} style={{ transformOrigin: "100px 97px" }}>
      <circle cx="79" cy="97" r="10" fill={BELLY} {...S} />
      <circle cx="79" cy="97" r="5" fill={NOSE} />
      <circle cx="121" cy="97" r="10" fill={BELLY} {...S} />
      <circle cx="121" cy="97" r="5" fill={NOSE} />
    </g>
  );
}

function Head({ eyes = "happy" }) {
  return (
    <>
      <circle cx="100" cy="110" r="60" fill={BODY} {...S} />
      <Mask />
      <path
        d="M100 104 C124 102 136 120 132 140 C128 158 115 162 100 162 C85 162 72 158 68 140 C64 120 76 102 100 104 Z"
        fill={BELLY}
      />
      {eyes === "happy" ? <HappyEyes /> : <OpenEyes className="rc-eyes" />}
      <ellipse cx="100" cy="126" rx="6.5" ry="4.5" fill={NOSE} />
      <path d="M100 130 Q100 135 94 136" stroke={NOSE} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M100 130 Q100 135 106 136" stroke={NOSE} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  );
}

// Big, clearly-banded tail — the other signature raccoon feature.
function Tail({ className }) {
  return (
    <g className={className}>
      <path
        d="M130 208 C190 204 214 132 164 88 C204 114 206 190 130 208 Z"
        fill={BODY}
        {...S}
      />
      <path d="M142 190 C168 176 182 150 173 124" stroke={MASK} strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M155 152 C170 138 177 116 166 96" stroke={MASK} strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="168" cy="92" r="15" fill={MASK} {...S} />
    </g>
  );
}

function Legs() {
  return (
    <>
      <ellipse cx="76" cy="240" rx="20" ry="13" fill={BODY_SHADE} {...S} />
      <ellipse cx="124" cy="240" rx="20" ry="13" fill={BODY_SHADE} {...S} />
    </>
  );
}

function Torso({ children }) {
  return (
    <>
      <ellipse cx="100" cy="192" rx="50" ry="48" fill={BODY} {...S} />
      <path
        d="M100 158 C128 158 142 180 138 208 C134 232 118 238 100 238 C82 238 66 232 62 208 C58 180 72 158 100 158 Z"
        fill={BELLY}
      />
      {children}
    </>
  );
}

function Bandana() {
  return (
    <path d="M66 150 C84 166 116 166 134 150 L126 174 C110 182 90 182 74 174 Z" fill={VEST} {...S} />
  );
}

export function RaccoonWave({ size = 128, className = "" }) {
  return (
    <Scene size={size} className={className} label="waving hello">
      <style>{`
        .rw-figure { animation: rc-hop 2.8s ease-in-out infinite; transform-origin: 100px 249px; }
        .rw-tail { animation: rc-tail 2.4s ease-in-out infinite; transform-origin: 146px 178px; }
        .rw-arm { animation: rc-wave 1.3s ease-in-out infinite; transform-origin: 146px 165px; }
        @keyframes rc-hop { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-9px) rotate(-2deg); } }
        @keyframes rc-tail { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(12deg); } }
        @keyframes rc-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
      `}</style>
      <Shadow />
      <g className="rw-figure">
        <Tail className="rw-tail" />
        <Legs />
        <Torso>
          <path d="M56 168 C40 178 34 202 44 220" stroke={BODY} strokeWidth="24" strokeLinecap="round" fill="none" {...S} />
          <circle cx="44" cy="222" r="13" fill={BODY} {...S} />
        </Torso>
        <Ears />
        <Head />
        <Bandana />
        <g className="rw-arm">
          <path d="M146 165 C162 157 170 142 166 124" stroke={BODY} strokeWidth="24" strokeLinecap="round" fill="none" {...S} />
          <circle cx="166" cy="122" r="13" fill={BODY} {...S} />
        </g>
      </g>
    </Scene>
  );
}

export function RaccoonCoins({ size = 128, className = "" }) {
  return (
    <Scene size={size} className={className} label="counting coins">
      <style>{`
        .rc-figure2 { animation: rc-sway 3.2s ease-in-out infinite; transform-origin: 100px 249px; }
        .rc-coin-1 { animation: rc-coin-fall 1.8s ease-in infinite; }
        .rc-coin-2 { animation: rc-coin-fall 1.8s ease-in infinite 0.6s; }
        .rc-coin-3 { animation: rc-coin-fall 1.8s ease-in infinite 1.2s; }
        @keyframes rc-sway { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
        @keyframes rc-coin-fall {
          0% { transform: translateY(-30px); opacity: 0; }
          15% { opacity: 1; } 85% { opacity: 1; }
          100% { transform: translateY(0px); opacity: 0; }
        }
      `}</style>
      <Shadow />
      <g className="rc-figure2">
        <Tail />
        <Legs />
        <Torso>
          <path d="M56 172 C44 182 42 198 50 206" stroke={BODY} strokeWidth="22" strokeLinecap="round" fill="none" {...S} />
          <circle cx="51" cy="207" r="12" fill={BODY} {...S} />
          <path d="M144 172 C156 182 158 198 150 206" stroke={BODY} strokeWidth="22" strokeLinecap="round" fill="none" {...S} />
          <circle cx="149" cy="207" r="12" fill={BODY} {...S} />
        </Torso>
        <Ears />
        <Head />
        <Bandana />
      </g>
      <circle className="rc-coin-1" cx="58" cy="88" r="9" fill={COIN} stroke={OUTLINE} strokeWidth="3" />
      <circle className="rc-coin-2" cx="100" cy="78" r="9" fill={COIN} stroke={OUTLINE} strokeWidth="3" />
      <circle className="rc-coin-3" cx="142" cy="88" r="9" fill={COIN} stroke={OUTLINE} strokeWidth="3" />
    </Scene>
  );
}

export function RaccoonCelebrate({ size = 128, className = "" }) {
  return (
    <Scene size={size} className={className} label="celebrating">
      <style>{`
        .rc-figure3 { animation: rc-jump 0.9s ease-in-out infinite; transform-origin: 100px 249px; }
        .rc-arm-up-l { animation: rc-cheer-l 0.9s ease-in-out infinite; transform-origin: 58px 165px; }
        .rc-arm-up-r { animation: rc-cheer-r 0.9s ease-in-out infinite; transform-origin: 142px 165px; }
        @keyframes rc-jump { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes rc-cheer-l { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(-42deg); } }
        @keyframes rc-cheer-r { 0%,100% { transform: rotate(20deg); } 50% { transform: rotate(42deg); } }
      `}</style>
      <Shadow />
      <g className="rc-figure3">
        <Tail />
        <Legs />
        <Torso />
        <Ears />
        <Head eyes="open" />
        <Bandana />
        <g className="rc-arm-up-l">
          <path d="M58 165 C40 152 32 128 40 106" stroke={BODY} strokeWidth="24" strokeLinecap="round" fill="none" {...S} />
          <circle cx="40" cy="104" r="13" fill={BODY} {...S} />
        </g>
        <g className="rc-arm-up-r">
          <path d="M142 165 C160 152 168 128 160 106" stroke={BODY} strokeWidth="24" strokeLinecap="round" fill="none" {...S} />
          <circle cx="160" cy="104" r="13" fill={BODY} {...S} />
        </g>
      </g>
    </Scene>
  );
}

export function RaccoonSleep({ size = 128, className = "" }) {
  return (
    <Scene size={size} className={className} label="sleeping">
      <style>{`
        .rc-figure4 { animation: rc-breathe 3.4s ease-in-out infinite; transform-origin: 100px 200px; }
        .rc-zzz { animation: rc-float 2.6s ease-in-out infinite; }
        @keyframes rc-breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.03); } }
        @keyframes rc-float { 0% { transform: translateY(4px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-14px); opacity: 0; } }
      `}</style>
      <ellipse cx="100" cy="215" rx="66" ry="12" fill="#000" opacity="0.35" />
      <g className="rc-figure4">
        <path d="M40 200 C30 160 55 130 100 130 C150 130 175 165 165 200 C155 225 45 225 40 200 Z" fill={BODY} {...S} />
        <ellipse cx="83" cy="167" rx="19" ry="14" fill={MASK} />
        <ellipse cx="115" cy="167" rx="19" ry="14" fill={MASK} />
        <path
          d="M78 178 C88 170 112 170 122 178 C128 192 118 208 100 208 C82 208 72 192 78 178 Z"
          fill={BELLY}
        />
        <path d="M76 167 Q84 160 92 167" stroke={BELLY} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M108 167 Q116 160 124 167" stroke={BELLY} strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="100" cy="188" rx="5.5" ry="4" fill={NOSE} />
        <circle cx="52" cy="150" r="20" fill={BODY} {...S} />
        <circle cx="54" cy="152" r="9" fill={BELLY} />
        <path d="M150 165 C185 160 195 122 165 100 C188 118 186 158 150 165 Z" fill={BODY} {...S} />
        <path d="M158 150 C172 142 178 126 170 110" stroke={MASK} strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
      <text className="rc-zzz" x="150" y="90" fontSize="22" fontWeight="700" fill={BODY}>
        z
      </text>
      <text
        className="rc-zzz"
        x="165"
        y="70"
        fontSize="16"
        fontWeight="700"
        fill={BODY}
        style={{ animationDelay: "0.7s" }}
      >
        z
      </text>
    </Scene>
  );
}

function Scene({ size, className, label, children }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 200 260"
      className={`raccoon-mascot ${className}`}
      role="img"
      aria-label={`Budget Raccoon mascot, ${label}`}
    >
      {children}
    </svg>
  );
}

// Default export keeps existing call sites (Header, etc.) working.
export default function RaccoonMascot(props) {
  return <RaccoonWave {...props} />;
}
