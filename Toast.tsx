import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast, darkMode } = useApp();
  if (!toast) return null;

  const colors = {
    success: "bg-success text-white",
    error: "bg-error text-white",
    info: darkMode ? "bg-[#263244] text-sage-light border border-[#475569]" : "bg-sage-light text-sage-dark border border-sage-100",
  };

  const icons = {
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  return (
    <div className={`absolute bottom-20 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pop-in ${colors[toast.type]}`}>
      <span className="shrink-0">{icons[toast.type]}</span>
      <span className="text-sm font-semibold leading-snug">{toast.message}</span>
    </div>
  );
}
