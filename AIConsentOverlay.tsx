import { useApp } from "../../context/AppContext";

export default function AIConsentOverlay() {
  const { hideOverlay, aiConsentCallback, navigate, darkMode } = useApp();

  const handleAgree = () => {
    hideOverlay();
    if (aiConsentCallback) aiConsentCallback();
  };

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 fade-in" onClick={hideOverlay}>
      <div
        className={`w-full rounded-t-3xl p-6 slide-up ${darkMode ? "bg-[#111827]" : "bg-white"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
          </div>
        </div>

        <h2 className={`text-xl font-bold text-center mb-2 font-heading ${darkMode ? "text-sage-light" : "text-[#111827]"}`}>
          AI Content Notice
        </h2>

        <p className={`text-sm text-center mb-4 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
          The content of your selected material will be sent to an external AI service to generate your reviewer or practice quiz.
        </p>

        <div className={`rounded-2xl p-4 mb-5 ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}>
          <div className="flex gap-3 mb-3">
            <span className="text-mustard shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              AI-generated content may contain inaccuracies, omissions, or unclear explanations. Always verify generated reviewers and questions against your original learning materials.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-blue shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              Your academic content will be processed by the selected AI/LLM service for the purpose of generating educational content only.
            </p>
          </div>
        </div>

        <p className={`text-xs text-center mb-5 ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
          Do you agree to continue?
        </p>

        <div className="flex gap-3">
          <button
            onClick={hideOverlay}
            className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all pressable ${darkMode ? "border-[#475569] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleAgree}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-sage text-white transition-all pressable hover:bg-sage-dark"
          >
            Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
