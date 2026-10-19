import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

function ProgressBar({ value, max = 100, color = "bg-sage" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 bg-sage-lighter rounded-full overflow-hidden">
      <div className={`h-2 ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ProgressScreen() {
  const { quizHistory, navigate, setCurrentQuiz, darkMode, materials } = useApp();

  const avgScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length) : 0;
  const highest = quizHistory.length > 0 ? Math.max(...quizHistory.map(q => q.score)) : 0;
  const totalCompleted = quizHistory.length;

  // Per-subject performance
  const subjectMap: Record<string, { total: number; count: number }> = {};
  quizHistory.forEach(q => {
    const subject = q.sourceTitle || "General";
    if (!subjectMap[subject]) subjectMap[subject] = { total: 0, count: 0 };
    subjectMap[subject].total += q.score;
    subjectMap[subject].count++;
  });
  const subjectPerf = Object.entries(subjectMap).map(([name, v]) => ({
    name,
    avg: Math.round(v.total / v.count),
  })).sort((a, b) => b.avg - a.avg);

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const scoreColor = (s: number) => s >= 80 ? "text-success" : s >= 60 ? "text-mustard" : "text-coral";
  const barColor = (s: number) => s >= 80 ? "bg-success" : s >= 60 ? "bg-mustard" : "bg-coral";

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <h1 className={`text-xl font-extrabold font-heading ${textPrimary}`}>Score & Progress</h1>
        <p className={`text-xs ${textSecondary}`}>Your practice performance overview</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4 space-y-4">
        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Average Score", value: `${avgScore}%`, color: scoreColor(avgScore), bg: darkMode ? "bg-[#111827]" : "bg-white" },
            { label: "Highest Score", value: `${highest}%`, color: "text-success", bg: darkMode ? "bg-[#111827]" : "bg-white" },
            { label: "Quizzes Done", value: totalCompleted, color: darkMode ? "text-sage-light" : "text-[#111827]", bg: darkMode ? "bg-[#111827]" : "bg-white" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-4 text-center ${cardBg}`}>
              <p className={`text-2xl font-extrabold font-heading ${stat.color}`}>{stat.value}</p>
              <p className={`text-[9px] font-semibold mt-1 leading-tight ${textSecondary}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Subject performance */}
        {subjectPerf.length > 0 && (
          <div className={`rounded-2xl border p-4 ${cardBg}`}>
            <h3 className={`text-sm font-extrabold font-heading mb-4 ${textPrimary}`}>Subject Performance</h3>
            <div className="space-y-3.5">
              {subjectPerf.map(({ name, avg }) => (
                <div key={name}>
                  <div className="flex justify-between mb-1.5">
                    <p className={`text-xs font-semibold truncate flex-1 ${textPrimary}`}>{name}</p>
                    <span className={`text-xs font-extrabold font-heading ml-2 ${scoreColor(avg)}`}>{avg}%</span>
                  </div>
                  <ProgressBar value={avg} color={barColor(avg)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall progress */}
        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <h3 className={`text-sm font-extrabold font-heading mb-4 ${textPrimary}`}>Overall Average</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke={darkMode ? "#172033" : "#DBEAFE"} strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke={avgScore >= 80 ? "#3A9E60" : avgScore >= 60 ? "#D4930A" : "#D45C4A"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(avgScore / 100) * 201} 201`}
                  strokeDashoffset="50"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-extrabold font-heading ${scoreColor(avgScore)}`}>{avgScore}%</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-bold mb-1 ${textPrimary}`}>
                {avgScore >= 80 ? "Excellent Performance!" : avgScore >= 60 ? "Keep it up!" : "Need more practice"}
              </p>
              <p className={`text-xs leading-relaxed ${textSecondary}`}>
                Based on {totalCompleted} quiz{totalCompleted !== 1 ? "zes" : ""} completed. Keep practicing to improve your scores!
              </p>
            </div>
          </div>
        </div>

        {/* Recent quizzes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-extrabold font-heading ${textPrimary}`}>Recent Quizzes</h3>
          </div>
          {quizHistory.length === 0 ? (
            <div className={`rounded-2xl border p-6 flex flex-col items-center ${cardBg}`}>
              <span className="text-4xl mb-3">🎯</span>
              <p className={`text-sm font-bold mb-1 font-heading ${textPrimary}`}>No quizzes yet</p>
              <p className={`text-xs mb-4 ${textSecondary}`}>Start practicing to track your progress.</p>
              <button
                onClick={() => navigate("materials")}
                className="px-6 py-2.5 bg-sage text-white rounded-xl text-sm font-bold pressable"
              >
                Create Practice Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {quizHistory.slice(0, 6).map(q => (
                <div key={q.id} className={`rounded-2xl border p-4 ${cardBg}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${darkMode ? "bg-sage/15" : "bg-sage-light"}`}>
                      {q.score >= 80 ? "🏆" : q.score >= 60 ? "✅" : "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${textPrimary}`}>{q.title}</p>
                      <p className={`text-xs ${textSecondary}`}>{q.sourceTitle} · {q.completedAt}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs font-extrabold font-heading ${scoreColor(q.score)}`}>{q.score}%</span>
                        <span className={`text-xs ${textSecondary}`}>{q.correctAnswers}/{q.totalQuestions} correct</span>
                      </div>
                      <p className={`text-[10px] capitalize mt-1 ${textSecondary}`}>{q.quizType.replaceAll("-", " ")} · {q.difficulty} · {q.totalQuestions} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  );
}
