export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`relative bg-surface rounded-[1.75rem] shadow-soft border border-white/75 p-4 transition-all duration-200 hover:border-white hover:shadow-[0_26px_45px_-30px_rgba(112,72,128,0.45)] ${className}`}
      {...rest}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[1.75rem] bg-gradient-to-r from-transparent via-coral/30 to-transparent" />
      {children}
    </div>
  );
}
