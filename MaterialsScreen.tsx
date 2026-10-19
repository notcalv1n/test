import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";
import type { Material } from "../context/AppContext";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PDF: { bg: "bg-coral-light", text: "text-coral" },
  PPTX: { bg: "bg-mustard-light", text: "text-mustard" },
  DOCX: { bg: "bg-muted-blue-light", text: "text-muted-blue" },
  TXT: { bg: "bg-sage-light", text: "text-sage-dark" },
  IMAGE: { bg: "bg-purple-50", text: "text-purple-500" },
};

const FILE_ICONS: Record<string, React.ReactElement> = {
  PDF: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  PPTX: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  DOCX: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  TXT: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  IMAGE: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

const FILTERS = ["All", "PDF", "DOCX", "PPTX", "TXT", "Images"] as const;
type FilterType = typeof FILTERS[number];

export default function MaterialsScreen() {
  const { materials, folders, addFolder, renameFolder, deleteFolder, moveMaterial, navigate, setCurrentMaterial, darkMode, showOverlay, showToast, offlineMode } = useApp();
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [movingMaterialId, setMovingMaterialId] = useState<string | null>(null);

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#111827] border-[#263244] text-sage-light" : "bg-white border-[#CBD5E1] text-[#111827]";

  const filtered = materials.filter(m => {
    const matchType = filter === "All" || (filter === "Images" ? m.type === "IMAGE" : m.type === filter);
    const matchSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchFolder = selectedFolderId ? m.folderId === selectedFolderId : !m.folderId;
    return matchType && matchSearch && matchFolder;
  });

  const handleOpenMaterial = (m: Material) => { setCurrentMaterial(m.id); navigate("file-detail"); };

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`} onClick={() => menuId && setMenuId(null)}>
      {/* Header */}
      <div className={`px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {selectedFolderId && <button onClick={() => setSelectedFolderId(null)} className="text-sage font-bold pressable">←</button>}
            <h1 className={`text-xl font-extrabold font-heading truncate ${textPrimary}`}>
              {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : "My Materials"}
            </h1>
          </div>
          <div className="flex gap-2">
            {!selectedFolderId && <button onClick={() => setShowFolderModal(true)} className={`px-3 py-2 rounded-xl text-xs font-bold border pressable ${darkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>+ Folder</button>}
            <button
              onClick={() => { if (!offlineMode) navigate("upload"); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white pressable transition-all ${offlineMode ? "bg-sage/50" : "bg-sage hover:bg-sage-dark"}`}
            >
              + Upload
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search materials..."
            className={`w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none font-medium ${inputBg}`}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pressable">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all pressable ${
                filter === f
                  ? "bg-sage text-white"
                  : darkMode ? "bg-[#0B1220] text-[#94A3B8] border border-[#263244]" : "bg-sage-lighter text-[#64748B] border border-[#CBD5E1]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4">
        {!selectedFolderId && !search && filter === "All" && folders.length > 0 && (
          <div className="mb-5">
            <p className={`text-xs font-extrabold tracking-wide mb-2 ${textSecondary}`}>FOLDERS</p>
            <div className="grid grid-cols-2 gap-3">
              {folders.map(folder => {
                const count = materials.filter(m => m.folderId === folder.id).length;
                return (
                  <div key={folder.id} className={`relative rounded-2xl border p-4 pressable ${cardBg}`} onClick={() => setSelectedFolderId(folder.id)}>
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-sage-light text-sage rounded-xl flex items-center justify-center">▰</div>
                      <button onClick={event => { event.stopPropagation(); setFolderMenuId(folderMenuId === folder.id ? null : folder.id); }} className={textSecondary}>•••</button>
                    </div>
                    <p className={`text-sm font-bold mt-3 truncate ${textPrimary}`}>{folder.name}</p>
                    <p className={`text-[10px] ${textSecondary}`}>{count} material{count === 1 ? "" : "s"}</p>
                    {folderMenuId === folder.id && (
                      <div className={`absolute right-2 top-10 z-20 w-32 rounded-xl border shadow-xl overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`} onClick={event => event.stopPropagation()}>
                        <button onClick={() => { const name = window.prompt("Rename folder", folder.name); if (name?.trim()) { renameFolder(folder.id, name.trim()); showToast("Folder renamed successfully."); } setFolderMenuId(null); }} className={`w-full px-3 py-2.5 text-left text-xs font-bold ${textPrimary}`}>Rename</button>
                        <button onClick={() => { if (window.confirm("Delete this folder? Its materials will be moved back to My Materials.")) { deleteFolder(folder.id); showToast("Folder deleted. Materials moved to My Materials."); } setFolderMenuId(null); }} className="w-full px-3 py-2.5 text-left text-xs font-bold text-coral">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className={`text-base font-bold mb-1 font-heading ${textPrimary}`}>
              {search ? "No results found" : "No materials yet"}
            </p>
            <p className={`text-xs font-medium mb-5 ${textSecondary}`}>
              {search ? `No materials match "${search}"` : "You haven't uploaded any materials yet."}
            </p>
            {!search && !offlineMode && (
              <button onClick={() => navigate("upload")} className="px-6 py-3 bg-sage text-white rounded-2xl text-sm font-bold pressable">
                Upload Material
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className={`text-xs font-semibold ${textSecondary}`}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.map(m => {
              const colors = TYPE_COLORS[m.type] || { bg: "bg-sage-light", text: "text-sage-dark" };
              return (
                <div
                  key={m.id}
                  className={`relative rounded-2xl border p-4 pressable transition-all ${cardBg}`}
                  onClick={(e) => { e.stopPropagation(); handleOpenMaterial(m); }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                      {FILE_ICONS[m.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-tight truncate mb-0.5 ${textPrimary}`}>{m.filename}</p>
                      <p className={`text-xs font-medium ${textSecondary}`}>{m.subject}</p>
                      <p className={`text-xs ${textSecondary} opacity-70`}>{m.topic}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${colors.bg} ${colors.text}`}>{m.type}</span>
                        <span className={`text-[10px] ${textSecondary}`}>{m.size}</span>
                        <span className={`text-[10px] ${textSecondary}`}>{m.uploadedAt}</span>
                        {!m.canGenerateAI && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#F5F0E8] text-[#8A7A5A]">No AI</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); setMenuId(menuId === m.id ? null : m.id); }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 pressable ${darkMode ? "text-[#94A3B8]" : "text-[#94A3B8]"}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </div>

                  {/* Context Menu */}
                  {menuId === m.id && (
                    <div className={`absolute right-3 top-12 z-30 rounded-2xl shadow-xl border py-1 w-48 pop-in ${darkMode ? "bg-[#172033] border-[#263244]" : "bg-white border-[#CBD5E1]"}`}
                      onClick={e => e.stopPropagation()}>
                      {[
                        { label: "Open", icon: "👁", action: () => { handleOpenMaterial(m); setMenuId(null); } },
                        ...(m.canGenerateAI ? [
                          { label: "Generate Reviewer", icon: "📖", action: () => { setCurrentMaterial(m.id); setMenuId(null); navigate("file-detail"); } },
                          { label: "Generate Quiz", icon: "🧪", action: () => { setMenuId(null); navigate("quiz-generation"); } },
                        ] : []),
                        { label: "Rename", icon: "✏️", action: () => { showOverlay("rename", { id: m.id, currentName: m.filename }); setMenuId(null); } },
                        { label: "Move to Folder", icon: "↗", action: () => { setMovingMaterialId(m.id); setMenuId(null); } },
                        { label: "Delete", icon: "🗑️", action: () => { showOverlay("delete-confirm", { type: "material", id: m.id, name: m.filename }); setMenuId(null); }, danger: true },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all pressable ${
                            (item as { danger?: boolean }).danger
                              ? "text-coral"
                              : darkMode ? "text-sage-light hover:bg-[#0B1220]" : "text-[#111827] hover:bg-sage-lighter"
                          }`}
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="h-2" />
      </div>

      <BottomNav />
      {showFolderModal && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center px-6 fade-in">
          <div className={`w-full rounded-3xl p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
            <h2 className={`text-xl font-extrabold font-heading ${textPrimary}`}>Create Folder</h2>
            <p className={`text-xs mt-1 mb-4 ${textSecondary}`}>Group materials by subject or semester.</p>
            <input autoFocus value={folderName} onChange={event => setFolderName(event.target.value)} placeholder="Folder name" className={`w-full px-4 py-3.5 rounded-2xl border outline-none focus:border-sage ${inputBg}`} />
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowFolderModal(false); setFolderName(""); }} className={`flex-1 py-3 rounded-2xl border font-bold ${darkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Cancel</button>
              <button onClick={() => { if (!folderName.trim()) { showToast("Please enter a folder name.", "error"); return; } addFolder(folderName.trim()); setFolderName(""); setShowFolderModal(false); showToast("Folder created successfully."); }} className="flex-1 py-3 rounded-2xl bg-sage text-white font-bold">Create</button>
            </div>
          </div>
        </div>
      )}
      {movingMaterialId && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center px-6 fade-in">
          <div className={`w-full rounded-3xl p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
            <h2 className={`text-lg font-extrabold font-heading mb-4 ${textPrimary}`}>Move to Folder</h2>
            <div className="space-y-2">
              {[{ id: "", name: "My Materials" }, ...folders].map(folder => (
                <button key={folder.id} onClick={() => { moveMaterial(movingMaterialId, folder.id || null); setMovingMaterialId(null); showToast("Material moved successfully."); }} className={`w-full p-3.5 rounded-xl border text-left text-sm font-bold pressable ${darkMode ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"}`}>
                  {folder.name}
                </button>
              ))}
            </div>
            <button onClick={() => setMovingMaterialId(null)} className={`w-full py-3 mt-3 text-sm font-bold ${textSecondary}`}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
