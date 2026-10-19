import { useApp } from "../../context/AppContext";

export default function DeleteConfirmOverlay() {
  const { hideOverlay, overlayData, deleteMaterial, deleteReviewer, navigate, showToast, darkMode, goBack, screen } = useApp();
  const { type, id, name } = overlayData as { type: "material" | "reviewer"; id: string; name: string };

  const handleDelete = () => {
    if (type === "material") {
      deleteMaterial(id as string);
      showToast("Material deleted.", "info");
      hideOverlay();
      if (screen === "file-detail" || screen === "document-viewer") goBack();
    } else if (type === "reviewer") {
      deleteReviewer(id as string);
      showToast("Reviewer deleted.", "info");
      hideOverlay();
      if (screen === "reviewer") goBack();
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 fade-in px-6" onClick={hideOverlay}>
      <div
        className={`w-full rounded-3xl p-6 pop-in ${darkMode ? "bg-[#111827]" : "bg-white"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D45C4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
        </div>

        <h2 className={`text-xl font-bold text-center mb-2 font-heading ${darkMode ? "text-sage-light" : "text-[#111827]"}`}>
          Delete {type === "material" ? "Material" : "Reviewer"}?
        </h2>
        <p className={`text-sm text-center mb-6 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
          Are you sure you want to delete{" "}
          <span className={`font-bold ${darkMode ? "text-sage-light" : "text-[#111827]"}`}>{name}</span>?{" "}
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={hideOverlay}
            className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all pressable ${darkMode ? "border-[#475569] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-coral text-white transition-all pressable"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
