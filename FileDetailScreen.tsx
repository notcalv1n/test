import { useApp } from "../context/AppContext";

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  PDF: { bg: "bg-coral-light", text: "text-coral", icon: "📄" },
  PPTX: { bg: "bg-mustard-light", text: "text-mustard", icon: "📊" },
  DOCX: { bg: "bg-muted-blue-light", text: "text-muted-blue", icon: "📝" },
  TXT: { bg: "bg-sage-light", text: "text-sage-dark", icon: "📃" },
  IMAGE: { bg: "bg-purple-50", text: "text-purple-500", icon: "🖼️" },
};

export default function FileDetailScreen() {
  const { materials, currentMaterialId, goBack, navigate, darkMode, showOverlay, setQuizGenerationSource, setReviewerGenerationRequest, showAIConsent, offlineMode } = useApp();
  const material = materials.find(m => m.id === currentMaterialId);
  if (!material) return null;

  const colors = TYPE_COLORS[material.type] || { bg: "bg-sage-light", text: "text-sage-dark", icon: "📄" };
  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const handleGenerateReviewer = () => {
    if (offlineMode) return;
    showAIConsent(() => {
      setReviewerGenerationRequest({ materialIds: [material.id] });
      navigate("generating-reviewer");
    });
  };

  const handleGenerateQuiz = () => {
    if (offlineMode) return;
    showAIConsent(() => {
      setQuizGenerationSource({ type: "material", id: material.id, title: material.filename.replace(/\.[^.]+$/, "") });
      navigate("quiz-generation");
    });
  };

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={`flex-1 text-base font-extrabold font-heading truncate ${textPrimary}`}>File Details</h1>
        <button
          onClick={() => showOverlay("more-menu")}
          className={`w-9 h-9 rounded-xl flex items-center justify-center pressable ${darkMode ? "text-[#94A3B8]" : "text-[#94A3B8]"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-5 space-y-4">
        {/* File preview card */}
        <div className={`rounded-3xl border p-6 flex flex-col items-center ${cardBg}`}>
          <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center text-4xl mb-4`}>
            {material.type === "IMAGE" ? "🖼️" : colors.icon}
          </div>
          <h2 className={`text-base font-extrabold font-heading text-center leading-snug mb-1 ${textPrimary}`}>
            {material.filename}
          </h2>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${colors.bg} ${colors.text}`}>{material.type}</span>
            <span className={`text-xs ${textSecondary}`}>{material.size}</span>
          </div>
        </div>

        {/* Details */}
        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <h3 className={`text-xs font-extrabold tracking-wider mb-3 ${textSecondary}`}>FILE INFORMATION</h3>
          {[
            { label: "Subject", value: material.subject },
            { label: "Topic", value: material.topic },
            { label: "File Type", value: material.type },
            { label: "File Size", value: material.size },
            { label: "Uploaded", value: material.uploadedAt },
          ].map(({ label, value }) => (
            <div key={label} className={`flex justify-between py-2.5 border-b last:border-0 ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}>
              <span className={`text-xs font-semibold ${textSecondary}`}>{label}</span>
              <span className={`text-xs font-bold ${textPrimary}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* AI availability notice */}
        {!material.canGenerateAI && (
          <div className={`rounded-2xl p-4 flex gap-3 ${darkMode ? "bg-[#2A1A10] border border-[#3A2A10]" : "bg-mustard-light border border-mustard/15"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4930A" strokeWidth="2.5" className="shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p className="text-xs text-mustard font-semibold leading-relaxed">
              AI generation is currently available for text-based files (PDF, DOCX, PPTX, TXT) only. Image files cannot be processed for reviewer or quiz generation.
            </p>
          </div>
        )}

        {/* Offline notice */}
        {offlineMode && (
          <div className={`rounded-2xl p-4 flex gap-3 ${darkMode ? "bg-[#1A1A2E] border border-[#2A2A40]" : "bg-muted-blue-light border border-muted-blue/20"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B87B5" strokeWidth="2.5" className="shrink-0 mt-0.5">
              <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
            </svg>
            <p className="text-xs text-muted-blue font-semibold leading-relaxed">
              Internet connection required for AI generation. Viewing is available offline.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className={`text-xs text-center leading-relaxed px-2 ${textSecondary}`}>
          Only text-based files (PDF, DOCX, PPTX, TXT) can be used for AI-generated reviewers and quizzes.
        </p>

        {/* Actions */}
        <div className="space-y-2.5 pb-4">
          {material.canGenerateAI && (
            <>
              <button
                onClick={handleGenerateReviewer}
                disabled={offlineMode}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable transition-all ${offlineMode ? "bg-slate-300 text-slate-500" : "bg-sage text-white hover:opacity-90"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                Generate Reviewer
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={offlineMode}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable transition-all border ${
                  offlineMode
                    ? darkMode ? "border-[#263244] text-[#64748B]" : "border-[#CBD5E1] text-[#A0B8A5]"
                    : darkMode ? "border-sage bg-sage/10 text-sage" : "border-sage text-sage hover:bg-sage-light"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                Generate Quiz
              </button>
            </>
          )}
          <button
            onClick={() => navigate("document-viewer")}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable transition-all border ${darkMode ? "border-[#263244] text-[#94A3B8] hover:bg-[#111827]" : "border-[#CBD5E1] text-[#64748B] hover:bg-sage-lighter"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Open Document
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => showOverlay("rename", { id: material.id, currentName: material.filename })}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable border ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Rename
            </button>
            <button
              onClick={() => showOverlay("delete-confirm", { type: "material", id: material.id, name: material.filename })}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable bg-coral-light text-coral border border-coral/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
