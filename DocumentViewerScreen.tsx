import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api, apiBlob } from "../lib/api";

export default function DocumentViewerScreen() {
  const { materials, currentMaterialId, goBack, navigate, darkMode, showAIConsent, setQuizGenerationSource, offlineMode } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const material = materials.find(m => m.id === currentMaterialId);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    async function loadDocument() {
      if (!material) return;
      setLoading(true); setError(""); setContent(""); setImageUrl(null);
      try {
        if (material.type === "IMAGE" || material.type === "PDF") {
          const blob = await apiBlob(`/api/materials/${encodeURIComponent(material.id)}/preview?raw=1`);
          objectUrl = URL.createObjectURL(blob);
          if (!cancelled) setImageUrl(objectUrl);
        } else {
          const result = await api<{ filename: string; content: string }>(`/api/materials/${encodeURIComponent(material.id)}/preview`);
          if (!cancelled) setContent(result.content || "No readable text was found in this document.");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load this document.");
      } finally { if (!cancelled) setLoading(false); }
    }
    void loadDocument();
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [material?.id, material?.type]);

  if (!material) return <div className="flex-1 flex items-center justify-center">Material not found.</div>;

  const bg = darkMode ? "bg-[#0B1220]" : "bg-[#FAFCFA]";
  const docBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const visibleContent = searchText ? content.split("\n").map((line, i) => ({ line, i, match: line.toLowerCase().includes(searchText.toLowerCase()) })) : [];

  const handleGenerateReviewer = () => {
    if (offlineMode) return;
    showAIConsent(() => navigate("reviewer-generation"));
  };
  const handleGenerateQuiz = () => {
    if (offlineMode) return;
    showAIConsent(() => { setQuizGenerationSource(null); navigate("quiz-generation"); });
  };

  return <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
    <div className={`flex items-center gap-2 px-4 py-3 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
      <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage" aria-label="Go back">←</button>
      <div className="flex-1 min-w-0"><p className={`text-xs font-bold truncate ${textPrimary}`}>{material.filename}</p><p className={`text-[10px] ${textSecondary}`}>{material.type} · {material.size}</p></div>
      <button onClick={() => setSearchOpen(s => !s)} className={`w-9 h-9 rounded-xl ${searchOpen ? "bg-sage text-white" : textSecondary}`} aria-label="Search document">⌕</button>
    </div>
    {searchOpen && <div className={`px-4 py-2 border-b ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}><input autoFocus value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search in document..." className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${darkMode ? "bg-[#0B1220] border-[#263244] text-sage-light" : "bg-sage-lighter border-[#CBD5E1] text-[#111827]"}`}/></div>}
    <div className="flex-1 overflow-y-auto scroll-y p-4">
      <div className={`rounded-2xl shadow-sm border ${docBg} overflow-hidden mb-4`}>
        <div className={`px-5 py-4 border-b ${darkMode ? "bg-[#172033] border-[#263244]" : "bg-sage-lighter border-[#DBEAFE]"}`}><h1 className={`text-lg font-extrabold font-heading ${textPrimary}`}>{material.filename.replace(/\.[^.]+$/, "")}</h1><p className={`text-xs mt-1 ${textSecondary}`}>{material.subject} · {material.topic} · Uploaded {material.uploadedAt}</p><p className={`text-[10px] mt-2 ${textSecondary}`}>Document preview · Original uploaded content</p></div>
        <div className="px-5 py-5 min-h-56">
          {loading ? <div className={`py-10 text-center text-sm ${textSecondary}`}><div className="animate-spin w-7 h-7 rounded-full border-2 border-sage border-t-transparent mx-auto mb-3"/>Loading document…</div>
          : error ? <div className="py-8 text-center"><p className="text-sm text-coral font-bold">Unable to preview this file</p><p className={`text-xs mt-2 ${textSecondary}`}>{error}</p><button onClick={() => { setLoading(true); setError(""); const url = `/api/materials/${encodeURIComponent(material.id)}/preview`; void api<{content:string}>(url).then(r => setContent(r.content || "")).catch(e => setError(e instanceof Error ? e.message : "Could not load document.")).finally(() => setLoading(false)); }} className="mt-3 px-4 py-2 rounded-xl bg-sage text-white text-xs font-bold">Try again</button></div>
          : imageUrl ? (material.type === "PDF" ? <iframe src={imageUrl} title={material.filename} className="w-full h-[58vh] rounded-xl border border-slate-200" /> : <img src={imageUrl} alt={material.filename} className="max-w-full h-auto mx-auto rounded-xl" />)
          : <div className={`text-sm leading-7 whitespace-pre-wrap break-words ${textSecondary}`}>{searchText ? visibleContent.map(({line,i,match}) => <span key={i} className={match ? "bg-yellow-200 text-slate-900 rounded px-0.5" : ""}>{line}{"\n"}</span>) : content || "No readable text was found in this document."}</div>}
        </div>
      </div>
      {material.canGenerateAI && <div className="flex gap-2 pb-4"><button onClick={handleGenerateReviewer} disabled={offlineMode} className={`flex-1 py-3.5 rounded-2xl text-sm font-bold ${offlineMode ? "bg-sage/40 text-white/50" : "bg-sage text-white shadow-lg shadow-sage/20"}`}>📖 Generate Reviewer</button><button onClick={handleGenerateQuiz} disabled={offlineMode} className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border ${offlineMode ? "border-slate-300 text-slate-400" : "border-sage text-sage"}`}>🧪 Generate Quiz</button></div>}
    </div>
  </div>;
}
