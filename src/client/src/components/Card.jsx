export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`relative bg-surface rounded-2xl shadow-soft border border-white/[0.06] p-4 transition-all duration-200 hover:border-white/[0.1] hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] ${className}`}
      {...rest}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      {children}
    </div>
  );
}
