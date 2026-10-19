import { useApp } from "../context/AppContext";
import AcademicBg from "../components/AcademicBg";
import BottomNav from "../components/BottomNav";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "IS";
}

export default function HomeScreen() {
  const { profile, darkMode, navigate, setCurrentMaterial, setCurrentReviewer, notifications, quizHistory, reviewers, materials } = useApp();

  const displayName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") || "Student";
  const firstName = profile.firstName || "Student";
  const unread = notifications.filter(n => !n.read).length;
  const avgScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length)
    : 0;

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const recentItems = [
    ...(materials.filter(m => m.canGenerateAI).slice(0, 2).map(m => ({ type: "material" as const, id: m.id, title: m.filename.replace(/\.[^.]+$/, ""), sub: m.subject, icon: m.type }))),
    ...(reviewers.slice(0, 1).map(r => ({ type: "reviewer" as const, id: r.id, title: r.title, sub: r.subject, icon: "REVIEWER" as const }))),
  ].slice(0, 3);

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className="relative bg-gradient-to-b from-sage to-sage-dark px-5 pt-2 pb-6 overflow-hidden shrink-0">
        <div className="absolute inset-0"><AcademicBg dark /></div>
        <div className="absolute top-[-40px] right-[-30px] w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium tracking-wide">{getGreeting()},</p>
            <h2 className="text-2xl font-extrabold text-white font-heading truncate">{firstName}!</h2>
            <p className="text-white/60 text-xs mt-0.5 font-medium">Ready to continue learning?</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("search")}
              className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center pressable"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button
              onClick={() => navigate("notifications")}
              className="relative w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center pressable"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none" style={{ minWidth: 18, minHeight: 18 }}>
                  {unread}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("profile")}
              className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center font-bold text-white text-sm pressable"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {getInitials(displayName)}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative grid grid-cols-4 gap-2 mt-5">
          {[
            { label: "Materials", value: materials.length, color: "bg-white/15", nav: "materials" as const },
            { label: "Reviewers", value: reviewers.length, color: "bg-white/15", nav: "reviewer-library" as const },
            { label: "Quizzes", value: quizHistory.length, color: "bg-white/15", nav: "progress" as const },
            { label: "Avg Score", value: `${avgScore}%`, color: "bg-mustard/30", nav: "progress" as const },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => navigate(stat.nav)}
              className={`${stat.color} rounded-2xl px-2 py-3 flex flex-col items-center pressable`}
            >
              <span className="text-xl font-extrabold text-white font-heading leading-none">{stat.value}</span>
              <span className="text-white/65 text-[9px] font-medium mt-1 text-center leading-tight">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4 space-y-5">
        {/* Quick Actions */}
        <div>
          <h3 className={`text-sm font-extrabold mb-3 font-heading ${textPrimary}`}>Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Upload\nMaterial",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
                color: "bg-sage text-white",
                action: () => navigate("upload"),
              },
              {
                label: "Generate\nReviewer",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                color: darkMode ? "bg-[#111827] text-sage border border-[#263244]" : "bg-sage-light text-sage-dark border border-sage-100",
                action: () => navigate("reviewer-generation"),
              },
              {
                label: "Practice\nQuiz",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
                color: darkMode ? "bg-[#2A1A10] text-mustard border border-[#3A2A10]" : "bg-mustard-light text-mustard border border-mustard/20",
                action: () => navigate("quiz-generation"),
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`${item.color} rounded-2xl p-4 flex flex-col items-center gap-2 pressable transition-all`}
              >
                {item.icon}
                <span className="text-[10px] font-bold text-center leading-tight whitespace-pre-line" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Learning */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-extrabold font-heading ${textPrimary}`}>Continue Learning</h3>
            <button onClick={() => navigate("materials")} className="text-xs text-sage font-bold pressable">See all</button>
          </div>
          <div className="space-y-2.5">
            {recentItems.map(item => {
              const typeColors: Record<string, string> = {
                PDF: "bg-coral-light text-coral",
                PPTX: "bg-mustard-light text-mustard",
                DOCX: "bg-muted-blue-light text-muted-blue",
                TXT: "bg-sage-light text-sage-dark",
                REVIEWER: "bg-sage-light text-sage-dark",
              };
              const tColor = typeColors[item.icon] || "bg-sage-light text-sage-dark";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === "material") { setCurrentMaterial(item.id); navigate("file-detail"); }
                    else { setCurrentReviewer(item.id); navigate("reviewer"); }
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border pressable transition-all ${cardBg}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${tColor}`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {item.icon === "REVIEWER" ? "📖" : item.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-bold truncate ${textPrimary}`}>{item.title}</p>
                    <p className={`text-xs truncate ${textSecondary}`}>{item.sub}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* Study Reminder */}
        <div className={`rounded-2xl p-4 border flex items-center gap-3 ${darkMode ? "bg-mustard/10 border-mustard/20" : "bg-mustard-light border-mustard/15"}`}>
          <div className="w-10 h-10 rounded-xl bg-mustard/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4930A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-mustard">Study Reminder</p>
            <p className={`text-xs font-medium truncate ${darkMode ? "text-[#C8A060]" : "text-[#9A6A0A]"}`}>
              Probability & Statistics — Review scheduled today
            </p>
          </div>
          <button onClick={() => { setCurrentMaterial("m2"); navigate("file-detail"); }} className="pressable text-mustard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Offline indicator */}
        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  );
}
