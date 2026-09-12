// Budget Raccoon, the mascot — a single rigged SVG character reused across the app.
// The body/head/tail stay constant so the raccoon reads as the same character everywhere;
// only the arms and held prop change per `pose`, keeping every scene visually consistent.

const FUR = "#8A7A66";
const FUR_DARK = "#6E6152";
const MASK = "#3A332A";
const BELLY = "#F3ECDD";
const SNOUT = "#EFE6D2";
const NOSE = "#2B261F";
const STRIPE = "#3A332A";

function Ears() {
  return (
    <g>
      <circle cx="94" cy="46" r="15" fill={FUR} />
      <circle cx="146" cy="46" r="15" fill={FUR} />
      <circle cx="94" cy="47" r="7.5" fill="#C9A98A" />
      <circle cx="146" cy="47" r="7.5" fill="#C9A98A" />
    </g>
  );
}

function Head({ eyeState = "open" }) {
  return (
    <g>
      <circle cx="120" cy="76" r="38" fill={FUR} />
      {/* mask */}
      <path
        d="M85 68c6-10 18-15 35-15s29 5 35 15c2 9-3 20-10 24-6-4-16-6-25-6s-19 2-25 6c-7-4-12-15-10-24Z"
        fill={MASK}
      />
      {/* snout */}
      <ellipse cx="120" cy="88" rx="16" ry="12" fill={SNOUT} />
      <ellipse cx="120" cy="90" rx="4.2" ry="3.2" fill={NOSE} />
      {/* eyes */}
      <g className="raccoon-eye" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        {eyeState === "happy" ? (
          <>
            <path d="M104 70q5-6 10 0" stroke={BELLY} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M126 70q5-6 10 0" stroke={BELLY} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="109" cy="70" rx="4.4" ry="5.2" fill={BELLY} />
            <ellipse cx="131" cy="70" rx="4.4" ry="5.2" fill={BELLY} />
            <circle cx="110" cy="71.5" r="2.1" fill={NOSE} />
            <circle cx="132" cy="71.5" r="2.1" fill={NOSE} />
          </>
        )}
      </g>
    </g>
  );
}

function Tail({ variant = "curl" }) {
  const d =
    variant === "up"
      ? "M172 150c22-4 34-24 30-46-3-16-16-26-30-24 10 4 16 14 17 25 1 14-6 28-17 34Z"
      : "M170 156c24 2 40-16 39-38-1-18-14-30-29-30 9 6 14 17 13 28-1 15-10 30-23 40Z";
  return (
    <g className="raccoon-tail" style={{ transformBox: "fill-box", transformOrigin: "15% 90%" }}>
      <path d={d} fill={FUR} stroke={FUR_DARK} strokeWidth="0" />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={178 + i * 11}
          cy={150 - i * 20}
          rx="8"
          ry="10"
          fill={STRIPE}
          opacity="0.85"
          transform={`rotate(${-30 + i * 8} ${178 + i * 11} ${150 - i * 20})`}
        />
      ))}
    </g>
  );
}

function Body() {
  return (
    <g>
      <ellipse cx="120" cy="168" rx="46" ry="16" fill="rgba(32,36,31,0.08)" />
      <path
        d="M76 150c0-30 20-46 44-46s44 16 44 46c0 20-16 32-44 32s-44-12-44-32Z"
        fill={FUR}
      />
      <path d="M96 150c0-18 11-30 24-30s24 12 24 30c0 13-10 20-24 20s-24-7-24-20Z" fill={BELLY} />
    </g>
  );
}

function Paw({ x, y, rotate = 0, animate = false }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx="9.5"
      ry="8"
      fill={FUR}
      transform={`rotate(${rotate} ${x} ${y})`}
      className={animate ? "raccoon-paw" : undefined}
      style={animate ? { transformBox: "fill-box", transformOrigin: "50% 0%" } : undefined}
    />
  );
}

function Coin({ x, y, size = 20, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <circle r={size / 2} fill="#E1AE55" stroke="#B98639" strokeWidth="1.4" />
      <text y={size * 0.14} textAnchor="middle" fontSize={size * 0.5} fontWeight="700" fill="#8A5F22">
        $
      </text>
    </g>
  );
}

function Wallet({ x, y, w = 44, h = 32 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="6" fill="#2B5F47" />
      <rect width={w} height={h * 0.42} rx="6" fill="#356F53" />
      <circle cx={w - 9} cy={h / 2} r="4.5" fill="#E1AE55" />
    </g>
  );
}

function Receipt({ x, y, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0h30v42l-4-4-4 4-4-4-4 4-4-4-4 4-4-4-2 2V0Z" fill="#FBFAF5" stroke="#E4E4DA" strokeWidth="1" />
      <rect x="6" y="8" width="18" height="2.4" rx="1.2" fill="#C9C6B8" />
      <rect x="6" y="14" width="18" height="2.4" rx="1.2" fill="#C9C6B8" />
      <rect x="6" y="20" width="12" height="2.4" rx="1.2" fill="#C9C6B8" />
      <rect x="6" y="28" width="18" height="2.8" rx="1.2" fill="#D77F6C" />
    </g>
  );
}

function Magnifier({ x, y, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <circle r="12" fill="rgba(108,151,192,0.18)" stroke="#6C97C0" strokeWidth="3.4" />
      <line x1="8.5" y1="8.5" x2="19" y2="19" stroke="#6C97C0" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function Jar({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="4" y="0" width="20" height="5" rx="2" fill="#8A7A66" />
      <path d="M0 7c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v22a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8Z" fill="#EAF1EC" stroke="#A9C6A0" strokeWidth="1.4" />
      <path d="M0 18h28v11a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8Z" fill="#CFE3D2" />
      <circle cx="14" cy="14" r="3.4" fill="#E1AE55" />
    </g>
  );
}

const PROP_RENDERERS = { Coin, Wallet, Receipt, Magnifier, Jar };

/**
 * pose: "idle" | "coins" | "wallet" | "receipt" | "jar" | "climbing" | "celebrating" | "searching" | "magnifier" | "counting" | "concerned"
 */
export default function Raccoon({ pose = "idle", size = 140, className = "", flip = false }) {
  const eyeState = pose === "celebrating" ? "happy" : "open";
  const tailVariant = pose === "celebrating" || pose === "climbing" ? "up" : "curl";

  let leftArm, rightArm, extra;

  switch (pose) {
    case "coins":
      leftArm = <Paw x={90} y={122} rotate={-10} />;
      rightArm = <Paw x={150} y={110} rotate={20} animate />;
      extra = <Coin x={158} y={98} size={22} rotate={-8} />;
      break;
    case "wallet":
      leftArm = <Paw x={92} y={116} rotate={-8} />;
      rightArm = <Paw x={148} y={116} rotate={8} />;
      extra = <Wallet x={98} y={104} />;
      break;
    case "receipt":
      leftArm = <Paw x={92} y={118} rotate={-6} />;
      rightArm = <Paw x={146} y={100} rotate={18} animate />;
      extra = <Receipt x={138} y={62} rotate={10} />;
      break;
    case "jar":
      leftArm = <Paw x={90} y={118} rotate={-10} />;
      rightArm = <Paw x={150} y={104} rotate={22} animate />;
      extra = (
        <>
          <Jar x={62} y={128} />
          <Coin x={156} y={90} size={16} rotate={-10} />
        </>
      );
      break;
    case "climbing":
      leftArm = <Paw x={84} y={100} rotate={-32} animate />;
      rightArm = <Paw x={156} y={116} rotate={14} />;
      extra = null;
      break;
    case "celebrating":
      leftArm = <Paw x={82} y={96} rotate={-40} animate />;
      rightArm = <Paw x={158} y={96} rotate={40} animate />;
      extra = (
        <>
          <Coin x={64} y={72} size={14} rotate={-16} />
          <Coin x={176} y={72} size={14} rotate={16} />
        </>
      );
      break;
    case "searching":
      leftArm = <Paw x={92} y={120} rotate={-14} />;
      rightArm = <Paw x={132} y={128} rotate={40} />;
      extra = <Wallet x={104} y={116} w={40} h={26} />;
      break;
    case "magnifier":
      leftArm = <Paw x={92} y={116} rotate={-8} />;
      rightArm = <Paw x={152} y={92} rotate={26} animate />;
      extra = <Magnifier x={166} y={80} rotate={12} />;
      break;
    case "counting":
      leftArm = <Paw x={98} y={122} rotate={-4} animate />;
      rightArm = <Paw x={142} y={122} rotate={4} animate />;
      extra = (
        <>
          <Coin x={112} y={132} size={14} />
          <Coin x={128} y={130} size={14} rotate={8} />
        </>
      );
      break;
    case "concerned":
      leftArm = <Paw x={94} y={118} rotate={-10} />;
      rightArm = <Paw x={140} y={108} rotate={-4} animate />;
      extra = <Receipt x={132} y={78} rotate={-6} />;
      break;
    case "idle":
    default:
      leftArm = <Paw x={94} y={124} rotate={-6} />;
      rightArm = <Paw x={146} y={124} rotate={6} />;
      extra = null;
  }

  return (
    <svg
      viewBox="0 0 240 210"
      width={size}
      height={size * (210 / 240)}
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
      role="img"
      aria-hidden="true"
    >
      <g className="raccoon-breathe" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <Tail variant={tailVariant} />
        <Body />
        <Ears />
        <Head eyeState={eyeState} />
        {leftArm}
        {rightArm}
        {extra}
      </g>
    </svg>
  );
}
