import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function SplashScreen() {
  const { navigate, profile, userId } = useApp();

  useEffect(() => {
    if (userId) return; // Existing sessions are restored by AppContext.
    const t = setTimeout(() => navigate("onboarding"), 2600);
    return () => clearTimeout(t);
  }, [userId, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-sage to-sage-dark relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-60px] w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute bottom-[-60px] left-[-40px] w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute top-1/4 left-[-30px] w-32 h-32 rounded-full bg-white/5" />

      {/* Logo */}
      <div className="flex flex-col items-center gap-4 fade-in" style={{ animationDelay: "0.2s" }}>
        {/* Logo mark */}
        <div
          className="w-28 h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center relative overflow-hidden"
          style={{ animation: "splashPulse 2s ease-in-out infinite" }}
        >
          {/* Notebook illustration */}
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Notebook body */}
            <rect x="14" y="8" width="38" height="48" rx="4" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
            {/* Spine */}
            <rect x="14" y="8" width="7" height="48" rx="4" fill="#2563EB" />
            {/* Binding holes */}
            {[16, 24, 32, 40, 48].map(y => (
              <circle key={y} cx="17.5" cy={y} r="2" fill="white" />
            ))}
            {/* Lines */}
            {[22, 30, 38, 46].map(y => (
              <line key={y} x1="26" y1={y} x2="46" y2={y} stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            ))}
            {/* Pen */}
            <rect x="46" y="28" width="9" height="30" rx="2" fill="#1E40AF" transform="rotate(-20 46 28)" />
            <polygon points="46,55 55,55 50.5,64" fill="#D4930A" transform="rotate(-20 46 28)" />
            <rect x="46" y="28" width="9" height="6" rx="1" fill="#D4930A" transform="rotate(-20 46 28)" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            ISLearning
          </h1>
          <p className="text-white/80 text-sm font-medium mt-1 tracking-wide">
            SDCC Student-Centered Learning App
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2" style={{ animation: "fadeIn 0.5s ease-out 1.2s both" }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-white/60 rounded-full"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      {/* Tagline */}
      <div className="absolute bottom-8 text-white/50 text-xs font-medium tracking-widest" style={{ animation: "fadeIn 0.5s ease-out 1s both" }}>
        ORGANIZE · REVIEW · PRACTICE
      </div>
    </div>
  );
}
