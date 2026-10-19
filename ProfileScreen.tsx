import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "IS";
}

export default function ProfileScreen() {
  const { profile, navigate, darkMode, quizHistory, reviewers, materials, generatedQuizzes } = useApp();

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const avgScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length) : 0;
  const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") || "Student";

  const MENU_ITEMS = [
    { group: "Learning", items: [
      { label: "Saved Quizzes", icon: "🧪", action: () => navigate("saved-quizzes") },
      { label: "My Reviewer", icon: "📖", action: () => navigate("reviewer-library") },
    ]},
    { group: "Preferences", items: [
      { label: "Notifications", icon: "🔔", action: () => navigate("notifications") },
      { label: "Settings", icon: "⚙️", action: () => navigate("settings") },
    ]},
    { group: "Account", items: [
      { label: "Edit Profile", icon: "✏️", action: () => navigate("edit-profile") },
      { label: "Privacy", icon: "🔒", action: () => {} },
      { label: "Help & Support", icon: "❓", action: () => {} },
      { label: "About ISLearning", icon: "ℹ️", action: () => {} },
    ]},
    { group: "", items: [
      { label: "Log Out", icon: "🚪", action: () => navigate("login"), danger: true },
    ]},
  ];

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      <div className="flex-1 overflow-y-auto scroll-y">
        {/* Profile header */}
        <div className="bg-gradient-to-b from-sage to-sage-dark px-5 pt-4 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[60, 120, 180, 240, 300].map(y => (
              <div key={y} className="absolute w-full border-t border-white" style={{ top: y }} />
            ))}
          </div>
          <div className="absolute top-[-30px] right-[-20px] w-32 h-32 rounded-full bg-white/5" />

          <div className="flex items-start gap-4 mb-4">
            <div className="w-18 h-18 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-extrabold font-heading shrink-0"
              style={{ width: 72, height: 72 }}>
              {getInitials(fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-white font-heading truncate">
                {fullName}
              </h2>
              <p className="text-white/70 text-xs font-medium mt-0.5 truncate">
                ID: {profile.studentId || "—"}
              </p>
              <p className="text-white/60 text-xs mt-0.5 truncate leading-snug">
                {profile.course || "SDCC Student"}
              </p>
            </div>
            <button
              onClick={() => navigate("edit-profile")}
              className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center pressable shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Materials", value: materials.length },
              { label: "Saved", value: generatedQuizzes.filter(q => q.saved).length },
              { label: "Avg Score", value: `${avgScore}%` },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl py-3 px-2 text-center">
                <p className="text-xl font-extrabold text-white font-heading">{s.value}</p>
                <p className="text-white/60 text-[9px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="px-5 py-4 space-y-4">
          {MENU_ITEMS.map(({ group, items }) => (
            <div key={group}>
              {group && <p className={`text-xs font-extrabold tracking-wider mb-2 ${textSecondary}`}>{group.toUpperCase()}</p>}
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                {items.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all pressable border-b last:border-0 ${
                      darkMode ? "border-[#263244] hover:bg-[#0B1220]" : "border-[#F1F5F9] hover:bg-sage-lighter"
                    } ${(item as { danger?: boolean }).danger ? "text-coral!" : ""}`}
                  >
                    <span className="text-xl w-8 flex items-center justify-center">{item.icon}</span>
                    <span className={`flex-1 text-sm font-semibold ${(item as { danger?: boolean }).danger ? "text-coral" : textPrimary}`}>
                      {item.label}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#64748B" : "#CBD5E1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className={`text-center text-xs pb-6 ${textSecondary}`}>ISLearning v1.0 · SDCC</p>
        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  );
}
