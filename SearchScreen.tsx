import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function SearchScreen() {
  const { materials, reviewers, quizHistory, navigate, setCurrentMaterial, setCurrentReviewer, goBack, darkMode } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#111827] border-[#263244] text-sage-light" : "bg-white border-[#CBD5E1] text-[#111827]";

  const q = query.toLowerCase();

  const materialResults = q
    ? materials.filter(m => m.filename.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q))
    : [];
  const reviewerResults = q
    ? reviewers.filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q))
    : [];
  const quizResults = q
    ? quizHistory.filter(qr => qr.title.toLowerCase().includes(q) || qr.sourceTitle.toLowerCase().includes(q))
    : [];

  const total = materialResults.length + reviewerResults.length + quizResults.length;
  const hasResults = total > 0;
  const showEmpty = q.length > 0 && !hasResults;

  const suggestions = ["Probability", "Database", "HTML", "System Analysis"];

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search materials, reviewers, quizzes..."
              className={`w-full pl-9 pr-10 py-3 rounded-xl text-sm border outline-none font-medium ${inputBg}`}
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pressable">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4">
        {/* Suggestions (when no query) */}
        {!query && (
          <div>
            <p className={`text-xs font-extrabold tracking-wider mb-3 ${textSecondary}`}>SUGGESTIONS</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border pressable ${darkMode ? "border-[#263244] bg-[#111827] text-[#94A3B8]" : "border-[#CBD5E1] bg-white text-[#64748B]"}`}
                >
                  🔍 {s}
                </button>
              ))}
            </div>

            <p className={`text-xs font-extrabold tracking-wider mb-3 ${textSecondary}`}>BROWSE ALL</p>
            <div className="space-y-2">
              {[
                { label: "All Materials", count: materials.length, icon: "📁", action: () => navigate("materials") },
                { label: "All Reviewers", count: reviewers.length, icon: "📖", action: () => navigate("reviewer-library") },
                { label: "Quiz History", count: quizHistory.length, icon: "🎯", action: () => navigate("progress") },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border pressable ${cardBg}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`flex-1 text-sm font-semibold ${textPrimary}`}>{item.label}</span>
                  <span className={`text-xs font-bold ${textSecondary}`}>{item.count}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div>
            {hasResults && (
              <p className={`text-xs font-semibold mb-4 ${textSecondary}`}>
                {total} result{total !== 1 ? "s" : ""} for "<span className={`font-bold ${textPrimary}`}>{query}</span>"
              </p>
            )}

            {materialResults.length > 0 && (
              <div className="mb-5">
                <p className={`text-xs font-extrabold tracking-wider mb-2 ${textSecondary}`}>MATERIALS ({materialResults.length})</p>
                <div className="space-y-2">
                  {materialResults.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setCurrentMaterial(m.id); navigate("file-detail"); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border pressable ${cardBg}`}
                    >
                      <span className="text-xl">📄</span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-bold truncate ${textPrimary}`}>{m.filename}</p>
                        <p className={`text-xs ${textSecondary}`}>{m.subject}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg bg-coral-light text-coral`}>{m.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {reviewerResults.length > 0 && (
              <div className="mb-5">
                <p className={`text-xs font-extrabold tracking-wider mb-2 ${textSecondary}`}>REVIEWERS ({reviewerResults.length})</p>
                <div className="space-y-2">
                  {reviewerResults.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setCurrentReviewer(r.id); navigate("reviewer"); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border pressable ${cardBg}`}
                    >
                      <span className="text-xl">📖</span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-bold truncate ${textPrimary}`}>{r.title}</p>
                        <p className={`text-xs ${textSecondary}`}>{r.subject}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizResults.length > 0 && (
              <div className="mb-5">
                <p className={`text-xs font-extrabold tracking-wider mb-2 ${textSecondary}`}>QUIZZES ({quizResults.length})</p>
                <div className="space-y-2">
                  {quizResults.map(qr => (
                    <button
                      key={qr.id}
                      onClick={() => navigate("progress")}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border pressable ${cardBg}`}
                    >
                      <span className="text-xl">🎯</span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-bold truncate ${textPrimary}`}>{qr.title}</p>
                        <p className={`text-xs ${textSecondary}`}>{qr.score}% · {qr.completedAt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showEmpty && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <span className="text-5xl mb-3">🔍</span>
                <p className={`text-base font-bold mb-1 font-heading ${textPrimary}`}>No results found</p>
                <p className={`text-xs ${textSecondary}`}>No items match "{query}"</p>
              </div>
            )}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}
