import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

export default function SavedQuizzesScreen() {
  const { generatedQuizzes, navigate, goBack, darkMode, openGeneratedQuiz, toggleSavedQuiz, deleteGeneratedQuiz } = useApp();
  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const card = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const text = darkMode ? "text-sage-light" : "text-[#111827]";
  const muted = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  return <div className={`flex-1 flex flex-col overflow-hidden ${bg}`}>
    <header className={`flex items-center gap-3 px-5 py-4 border-b ${card}`}><button onClick={goBack} className="w-9 h-9 rounded-xl text-sage font-bold">←</button><div className="flex-1"><h1 className={`text-lg font-extrabold ${text}`}>Saved Quizzes</h1><p className={`text-xs ${muted}`}>Stored on this device for offline practice</p></div><button onClick={() => navigate("quiz-generation")} className="rounded-xl bg-sage px-3 py-2 text-xs font-extrabold text-white">＋ Generate</button></header>
    <div className="flex-1 overflow-y-auto p-5 space-y-3">
      {generatedQuizzes.length === 0 ? <div className="text-center py-16"><div className="text-4xl mb-3">🧪</div><p className={`font-extrabold ${text}`}>No quizzes generated yet</p><p className={`text-xs mt-2 mb-5 ${muted}`}>Generated quizzes stay here until you delete them.</p><button onClick={() => navigate("quiz-generation")} className="rounded-xl bg-sage px-5 py-3 text-sm font-extrabold text-white">Generate Quiz</button></div> : generatedQuizzes.map(q => <div key={q.id} className={`rounded-2xl border p-4 ${card}`}><button className="w-full text-left" onClick={() => openGeneratedQuiz(q.id)}><p className={`font-extrabold text-sm ${text}`}>{q.title}</p><p className={`text-xs mt-1 ${muted}`}>{q.sourceTitle}</p><p className={`text-[10px] mt-2 ${muted}`}>{q.questions.length} questions · {q.difficulty} · {new Date(q.createdAt).toLocaleDateString()}</p></button><div className="flex gap-2 mt-3"><button onClick={() => openGeneratedQuiz(q.id)} className="flex-1 rounded-xl bg-sage py-2.5 text-xs font-extrabold text-white">Take Quiz Again</button><button onClick={() => toggleSavedQuiz(q.id)} className={`rounded-xl border px-3 py-2.5 text-xs font-extrabold ${q.saved ? "border-mustard text-mustard" : muted}`}>{q.saved ? "★ Saved" : "☆ Save"}</button><button onClick={() => { if (window.confirm("Delete this quiz permanently?")) deleteGeneratedQuiz(q.id); }} className="rounded-xl border border-coral/30 px-3 py-2.5 text-xs font-extrabold text-coral">Delete</button></div></div>)}
    </div><BottomNav />
  </div>;
}
