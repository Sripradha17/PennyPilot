export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft p-4 transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
}
