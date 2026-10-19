import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function RenameOverlay() {
  const { hideOverlay, overlayData, renameMaterial, showToast, darkMode } = useApp();
  const { id, currentName } = overlayData as { id: string; currentName: string };
  const [name, setName] = useState((currentName as string) || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) { setError("Please enter a filename."); return; }
    renameMaterial(id as string, name.trim());
    showToast("File renamed successfully.", "success");
    hideOverlay();
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 fade-in px-6" onClick={hideOverlay}>
      <div
        className={`w-full rounded-3xl p-6 pop-in ${darkMode ? "bg-[#111827]" : "bg-white"}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={`text-xl font-bold mb-1 font-heading ${darkMode ? "text-sage-light" : "text-[#111827]"}`}>
          Rename File
        </h2>
        <p className={`text-sm mb-4 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>Enter a new filename for this material.</p>

        <label className={`text-xs font-bold tracking-wide mb-1.5 block ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
          FILENAME
        </label>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          className={`w-full rounded-2xl px-4 py-3.5 text-sm font-medium border outline-none transition-all mb-1 ${
            darkMode
              ? "bg-[#0B1220] text-sage-light border-[#263244] focus:border-sage"
              : "bg-sage-lighter text-[#111827] border-[#CBD5E1] focus:border-sage"
          } ${error ? "border-coral!" : ""}`}
          autoFocus
        />
        {error && <p className="text-xs text-coral mb-3">{error}</p>}

        <div className="flex gap-3 mt-4">
          <button
            onClick={hideOverlay}
            className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all pressable ${darkMode ? "border-[#475569] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-sage text-white transition-all pressable hover:bg-sage-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
