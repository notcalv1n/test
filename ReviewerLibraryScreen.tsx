import { useState } from "react";
import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

export default function ReviewerLibraryScreen() {
  const { reviewers, navigate, setCurrentReviewer, darkMode, offlineMode } = useApp();
  const [search, setSearch] = useState("");

  const filtered = reviewers.filter(r => (!search || r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase()) || r.sourceFile.toLowerCase().includes(search.toLowerCase())));

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#111827] border-[#263244] text-sage-light" : "bg-white border-[#CBD5E1] text-[#111827]";

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className={`text-xl font-extrabold font-heading ${textPrimary}`}>My Reviewer</h1>
          <button onClick={() => navigate("reviewer-generation")} className="px-3 py-2 rounded-xl bg-sage text-white text-xs font-extrabold">＋ Generate</button>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviewers..."
            className={`w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none font-medium ${inputBg}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mb-4 text-3xl">📖</div>
            <p className={`text-base font-bold mb-1 font-heading ${textPrimary}`}>
              {search ? "No results found" : "No reviewers yet"}
            </p>
            <p className={`text-xs font-medium mb-5 ${textSecondary}`}>
              {search ? "Try a different search term." : "Reviewers you generate or save will appear here."}
            </p>
            {!search && (
              <div className="flex gap-2"><button onClick={() => navigate("reviewer-generation")} className="px-5 py-3 bg-sage text-white rounded-2xl text-sm font-bold pressable">Generate Reviewer</button><button onClick={() => navigate("materials")} className={`px-5 py-3 rounded-2xl text-sm font-bold pressable border ${darkMode ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-600"}`}>Materials</button></div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <button
                key={r.id}
                onClick={() => { setCurrentReviewer(r.id); navigate("reviewer"); }}
                className={`w-full rounded-2xl border p-4 text-left pressable transition-all ${cardBg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl ${darkMode ? "bg-sage/15" : "bg-sage-light"}`}>
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold leading-snug ${textPrimary}`}>{r.title}</p>
                      {r.isBookmarked && <span className="text-mustard text-sm shrink-0">🔖</span>}
                    </div>
                    <p className={`text-xs mt-0.5 ${textSecondary}`}>From: {r.sourceFile}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${darkMode ? "bg-sage/15 text-sage" : "bg-sage-light text-sage-dark"}`}>
                        {r.subject}
                      </span>
                      <span className={`text-[10px] ${textSecondary}`}>{r.generatedAt}</span>
                      {!r.isRead && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-coral-light text-coral">New</span>
                      )}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="shrink-0 mt-1">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] font-semibold ${textSecondary}`}>{r.isRead ? "Read" : "Unread"}</span>
                    <span className={`text-[10px] font-bold text-sage`}>{r.mainTopics.length} topics</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}>
                    <div className={`h-1.5 bg-sage rounded-full`} style={{ width: r.isRead ? "100%" : "0%" }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  );
}
