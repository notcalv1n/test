import { useApp } from "../context/AppContext";

export default function StatusBar() {
  const { darkMode, offlineMode } = useApp();
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className={`flex items-center justify-between px-5 pt-3 pb-1 text-xs font-semibold shrink-0 z-10 ${darkMode ? "text-sage-light" : "text-[#111827]"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {offlineMode && (
          <span className="text-[9px] bg-coral/20 text-coral px-1.5 py-0.5 rounded-full font-bold tracking-wide">OFFLINE</span>
        )}
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" fill="currentColor" opacity={offlineMode ? "0.3" : "1"} />
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="currentColor" opacity={offlineMode ? "0.2" : "1"} />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5C8.69 9.5 9.25 10.06 9.25 10.75S8.69 12 8 12s-1.25-.56-1.25-1.25S7.31 9.5 8 9.5z" fill={offlineMode ? "#C94040" : "currentColor"} />
          <path d="M4.5 7C5.7 5.8 7.2 5 8 5s2.3.8 3.5 2" stroke={offlineMode ? "#C94040" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={offlineMode ? "1" : "0.7"} />
          <path d="M1.5 4C3.5 2 5.7 1 8 1s4.5 1 6.5 3" stroke={offlineMode ? "#C94040" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={offlineMode ? "0.5" : "0.4"} />
        </svg>
        {/* Battery */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" />
          <rect x="18.5" y="3.5" width="3" height="5" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="13" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
