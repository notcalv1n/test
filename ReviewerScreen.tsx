import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function ReviewerScreen() {
  const { reviewers, currentReviewerId, goBack, navigate, darkMode, showAIConsent, setQuizGenerationSource, showToast, toggleBookmarkReviewer, showOverlay, offlineMode } = useApp();
  const reviewer = reviewers.find(r => r.id === currentReviewerId);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["topics", "concepts", "study-guide"]));

  if (!reviewer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p>Reviewer not found.</p>
        <button onClick={goBack}>Go back</button>
      </div>
    );
  }

  const toggleSection = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleUseForQuiz = () => {
    if (offlineMode) return;
    showAIConsent(() => {
      setQuizGenerationSource({ type: "reviewer", id: reviewer.id, title: reviewer.title });
      navigate("quiz-generation");
    });
  };

  const handleRegenerate = () => {
    if (offlineMode) return;
    showAIConsent(() => navigate("generating-reviewer"));
  };

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold truncate ${textPrimary}`}>Lesson Reviewer</p>
          <p className={`text-[10px] truncate ${textSecondary}`}>{reviewer.subject}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => showOverlay("delete-confirm", { type: "reviewer", id: reviewer.id, name: reviewer.title })}
            className={`w-9 h-9 rounded-xl flex items-center justify-center pressable ${darkMode ? "text-[#94A3B8]" : "text-[#94A3B8]"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4 space-y-4">
        {/* Title + source */}
        <div>
          <h1 className={`text-xl font-extrabold font-heading mb-1 ${textPrimary}`}>{reviewer.title}</h1>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 text-[#94A3B8]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <p className={`text-xs ${textSecondary}`}>Generated from <span className="font-bold">{reviewer.sourceFile}</span></p>
          </div>
          <p className={`text-xs mt-1 ${textSecondary}`}>Generated on {reviewer.generatedAt}</p>
        </div>

        {/* Disclaimer */}
        <div className={`rounded-2xl p-3.5 flex gap-3 ${darkMode ? "bg-mustard/10 border border-mustard/20" : "bg-mustard-light border border-mustard/15"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4930A" strokeWidth="2.5" className="shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs text-mustard font-semibold leading-relaxed">
            Supplementary only — verify information with your original material. Generated content may contain inaccuracies.
          </p>
        </div>

        {/* Main Topics */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <button onClick={() => toggleSection("topics")} className="w-full flex items-center justify-between px-4 py-3.5 pressable">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sage-light flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <span className={`text-sm font-extrabold font-heading ${textPrimary}`}>Main Topics</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94A3B8" : "#94A3B8"} strokeWidth="2" className={`transition-transform ${expanded.has("topics") ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expanded.has("topics") && (
            <div className={`px-4 pb-4 border-t ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              <div className="flex flex-wrap gap-2 pt-3">
                {reviewer.mainTopics.map((topic, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${darkMode ? "bg-sage/15 text-sage" : "bg-sage-light text-sage-dark"}`}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Concepts */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <button onClick={() => toggleSection("concepts")} className="w-full flex items-center justify-between px-4 py-3.5 pressable">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-muted-blue-light flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B87B5" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <span className={`text-sm font-extrabold font-heading ${textPrimary}`}>Key Concepts</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94A3B8" : "#94A3B8"} strokeWidth="2" className={`transition-transform ${expanded.has("concepts") ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expanded.has("concepts") && (
            <div className={`px-4 pb-4 border-t ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              <div className="space-y-3 pt-3">
                {reviewer.keyConcepts.map((c, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 shrink-0" />
                    <p className={`text-sm leading-relaxed ${textSecondary}`}>{c}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Important Terms */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <button onClick={() => toggleSection("terms")} className="w-full flex items-center justify-between px-4 py-3.5 pressable">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-mustard-light flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4930A" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              </div>
              <span className={`text-sm font-extrabold font-heading ${textPrimary}`}>Important Terms</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94A3B8" : "#94A3B8"} strokeWidth="2" className={`transition-transform ${expanded.has("terms") ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expanded.has("terms") && (
            <div className={`px-4 pb-4 border-t ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              <div className="space-y-3 pt-3">
                {reviewer.importantTerms.map((t, i) => (
                  <div key={i} className={`rounded-xl p-3 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}>
                    <p className={`text-xs font-extrabold mb-1 text-mustard`}>{t.term}</p>
                    <p className={`text-xs leading-relaxed ${textSecondary}`}>{t.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <button onClick={() => toggleSection("summary")} className="w-full flex items-center justify-between px-4 py-3.5 pressable">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-coral-light flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D45C4A" strokeWidth="2.5"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
              </div>
              <span className={`text-sm font-extrabold font-heading ${textPrimary}`}>Summary</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94A3B8" : "#94A3B8"} strokeWidth="2" className={`transition-transform ${expanded.has("summary") ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expanded.has("summary") && (
            <div className={`px-4 pb-4 border-t ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              <p className={`text-sm leading-relaxed pt-3 ${textSecondary}`}>{reviewer.summary}</p>
            </div>
          )}
        </div>

        {/* Full source-grounded study guide, formatted like an academic Word reviewer */}
        {reviewer.detailedContent && (
          <section className={`rounded-2xl border overflow-hidden ${cardBg}`}>
            <button onClick={() => toggleSection("study-guide")} className="w-full flex items-center justify-between px-4 py-3.5 pressable">
              <div>
                <p className={`text-sm font-extrabold font-heading text-left ${textPrimary}`}>Full Study Reviewer</p>
                <p className={`text-[10px] mt-0.5 ${textSecondary}`}>Detailed sections, examples, comparisons, and practice questions</p>
              </div>
              <span className={textSecondary}>{expanded.has("study-guide") ? "⌃" : "⌄"}</span>
            </button>
            {expanded.has("study-guide") && <div className={`px-4 pb-5 border-t ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              {reviewer.detailedContent.overview && <p className={`pt-4 pb-2 text-sm leading-relaxed ${textSecondary}`}>{reviewer.detailedContent.overview}</p>}
              {!!reviewer.detailedContent.learningObjectives?.length && <div className={`mt-2 rounded-xl p-3 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}><h3 className={`text-xs font-extrabold mb-2 ${textPrimary}`}>Learning Objectives</h3><ul className={`pl-5 list-disc space-y-1 text-sm leading-relaxed ${textSecondary}`}>{reviewer.detailedContent.learningObjectives.map((objective, i) => <li key={i}>{objective}</li>)}</ul></div>}
              {(reviewer.detailedContent.sections || []).map((section, si) => <article key={`${section.heading}-${si}`} className="pt-4">
                <h2 className={`text-sm font-extrabold ${textPrimary}`}>{section.heading}</h2>
                {section.explanation && <p className={`mt-2 text-sm leading-relaxed whitespace-pre-wrap ${textSecondary}`}>{section.explanation}</p>}
                {!!section.points?.length && <ul className={`mt-2 pl-5 list-disc space-y-1.5 text-sm leading-relaxed ${textSecondary}`}>{section.points.map((point, i) => <li key={i}>{point}</li>)}</ul>}
                {!!section.subsections?.length && section.subsections.map((sub, subi) => <div key={`${sub.heading}-${subi}`} className={`mt-3 ml-2 pl-3 border-l-2 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <h3 className={`text-xs font-extrabold ${textPrimary}`}>{sub.heading}</h3>
                  {sub.explanation && <p className={`mt-1.5 text-sm leading-relaxed ${textSecondary}`}>{sub.explanation}</p>}
                  {!!sub.points?.length && <ul className={`mt-2 pl-5 list-disc space-y-1 text-sm ${textSecondary}`}>{sub.points.map((point, i) => <li key={i}>{point}</li>)}</ul>}
                  {!!sub.examples?.length && <div className={`mt-2 rounded-xl p-3 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}><p className="text-[10px] font-extrabold text-sage mb-1">Examples</p>{sub.examples.map((example, i) => <p key={i} className={`text-xs leading-relaxed ${textSecondary}`}>{example}</p>)}</div>}
                </div>)}
                {!!section.examples?.length && <div className={`mt-3 rounded-xl p-3 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}><p className="text-[10px] font-extrabold text-sage mb-1">Examples</p>{section.examples.map((example, i) => <p key={i} className={`text-xs leading-relaxed mb-1 last:mb-0 ${textSecondary}`}>{example}</p>)}</div>}
                {!!section.importantNotes?.length && <div className={`mt-3 rounded-xl p-3 ${darkMode ? "bg-mustard/10" : "bg-mustard-light/60"}`}><p className="text-[10px] font-extrabold text-mustard mb-1">Important Notes</p><ul className={`pl-4 list-disc space-y-1 text-xs ${textSecondary}`}>{section.importantNotes.map((note, i) => <li key={i}>{note}</li>)}</ul></div>}
              </article>)}
              {!!reviewer.detailedContent.comparisons?.length && <div className="pt-5 space-y-4">{reviewer.detailedContent.comparisons.map((comparison, ci) => <div key={`${comparison.title}-${ci}`}><h3 className={`text-xs font-extrabold mb-2 ${textPrimary}`}>{comparison.title}</h3><div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-xs"><thead><tr className={darkMode ? "bg-slate-800" : "bg-slate-50"}>{comparison.columns.map((column, i) => <th key={i} className={`p-2 font-extrabold ${textPrimary}`}>{column}</th>)}</tr></thead><tbody>{comparison.rows.map((row, ri) => <tr key={ri} className="border-t border-slate-200">{row.map((cell, ci2) => <td key={ci2} className={`p-2 align-top ${textSecondary}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>)}</div>}
              {!!reviewer.detailedContent.keyTakeaways?.length && <div className="pt-5"><h3 className={`text-xs font-extrabold mb-2 ${textPrimary}`}>Key Takeaways</h3><ul className={`pl-5 list-disc space-y-1.5 text-sm leading-relaxed ${textSecondary}`}>{reviewer.detailedContent.keyTakeaways.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
              {!!reviewer.detailedContent.practiceQuestions?.length && <div className="pt-5"><h3 className={`text-xs font-extrabold mb-2 ${textPrimary}`}>Possible Examination Questions</h3><div className="space-y-3">{reviewer.detailedContent.practiceQuestions.map((item, i) => <div key={i} className={`rounded-xl p-3 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}><p className={`text-[10px] uppercase font-bold text-sage mb-1`}>{item.type || "Practice"}</p><p className={`text-sm font-semibold ${textPrimary}`}>{i + 1}. {item.question}</p><p className={`mt-1.5 text-xs leading-relaxed ${textSecondary}`}><span className="font-bold">Answer: </span>{item.answer}</p></div>)}</div></div>}
            </div>}
          </section>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pb-4">
          <button
            onClick={handleUseForQuiz}
            disabled={offlineMode}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable shadow-lg ${offlineMode ? "bg-sage/40 text-white/50" : "bg-sage text-white shadow-sage/25 hover:bg-sage-dark"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Use for Quiz
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { toggleBookmarkReviewer(reviewer.id); showToast(reviewer.isBookmarked ? "Reviewer removed from saved reviewers." : "Reviewer saved for offline access.", reviewer.isBookmarked ? "info" : "success"); }}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable border ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
            >
              {reviewer.isBookmarked ? "✓ Saved" : "💾 Save"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={offlineMode}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable border ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
            >
              🔄 Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
