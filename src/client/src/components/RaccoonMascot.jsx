// Hand-drawn (not emoji) raccoon mascot family — soft rounded "kawaii" style
// (no heavy bandit mask, closed happy eyes, connected white belly/chin patch,
// striped tail, grounded with a soft shadow), inspired directly by a
// reference sheet the user provided. Every shape gets a gentle outline so
// limbs read clearly against the app's black background.
const OUTLINE = "#4a4a55";
const BODY = "#b3b3bf";
const BODY_SHADE = "#96969f";
const BELLY = "#f5f3f0";
const NOSE = "#3a3a44";
const VEST = "#c9776b";
const COIN = "#c99a52";

const S = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: "round" };

function Shadow() {
  return <ellipse cx="100" cy="249" rx="52" ry="9" fill="#000" opacity="0.35" />;
}

function Ears() {
  return (
    <>
      <circle cx="60" cy="60" r="25" fill={BODY} {...S} />
      <circle cx="62" cy="63" r="12" fill={BELLY} />
      <circle cx="140" cy="60" r="25" fill={BODY} {...S} />
      <circle cx="138" cy="63" r="12" fill={BELLY} />
    </>
  );
}

// Closed, happy curved eyes instead of round pupils — matches the reference's
// friendlier "always smiling" expression.
function HappyEyes() {
  return (
    <>
      <path d="M72 98 Q80 90 88 98" stroke={NOSE} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M112 98 Q120 90 128 98" stroke={NOSE} strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </>
  );
}

function OpenEyes({ className = "" }) {
  return (
    <g className={className} style={{ transformOrigin: "100px 100px" }}>
      <circle cx="80" cy="99" r="7" fill={NOSE} />
      <circle cx="82.5" cy="96.5" r="2" fill="#fff" />
      <circle cx="120" cy="99" r="7" fill={NOSE} />
      <circle cx="122.5" cy="96.5" r="2" fill="#fff" />
    </g>
  );
}

function Head({ eyes = "happy" }) {
  return (
    <>
      <circle cx="100" cy="110" r="60" fill={BODY} {...S} />
      <path
        d="M100 74 C128 74 142 96 138 118 C134 142 118 148 100 148 C82 148 66 142 62 118 C58 96 72 74 100 74 Z"
        fill={BELLY}
      />
      {eyes === "happy" ? <HappyEyes /> : <OpenEyes className="rc-eyes" />}
      <ellipse cx="100" cy="118" rx="6.5" ry="4.5" fill={NOSE} />
      <path d="M100 122 Q100 127 94 128" stroke={NOSE} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M100 122 Q100 127 106 128" stroke={NOSE} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  );
}

function Tail({ className }) {
  return (
    <g className={className}>
      <path
        d="M136 198 C180 195 198 142 160 106 C190 128 190 182 136 198 Z"
        fill={BODY}
        {...S}
      />
      <path d="M146 180 C168 168 178 146 165 124" stroke={BODY_SHADE} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M153 152 C165 142 170 126 161 112" stroke={BODY_SHADE} strokeWidth="11" strokeLinecap="round" fill="none" />
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
        <path
          d="M75 175 C90 165 115 165 128 178 C134 195 122 210 100 210 C78 210 68 192 75 175 Z"
          fill={BELLY}
        />
        <path d="M78 168 Q86 160 94 168" stroke={NOSE} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M100 172 Q108 164 116 172" stroke={NOSE} strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="100" cy="188" rx="5.5" ry="4" fill={NOSE} />
        <circle cx="52" cy="150" r="20" fill={BODY} {...S} />
        <circle cx="54" cy="152" r="9" fill={BELLY} />
        <path d="M150 165 C185 160 195 122 165 100 C188 118 186 158 150 165 Z" fill={BODY} {...S} />
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
