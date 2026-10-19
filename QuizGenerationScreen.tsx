import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Material, QuizDifficulty, QuizType } from "../context/AppContext";

const COUNTS = [10, 20, 40, 60, 80] as const;
const TYPES: { value: QuizType; label: string; description: string }[] = [
  { value: "multiple-choice", label: "Multiple Choice", description: "Choose the best answer from several options" },
  { value: "true-false", label: "True / False", description: "Judge whether each statement is correct" },
  { value: "enumeration", label: "Enumeration", description: "List important terms, steps, or concepts" },
  { value: "identification", label: "Identification", description: "Identify the term described" },
  { value: "practical-coding", label: "Practical Coding", description: "Write a short code solution" },
  { value: "coding-analysis", label: "Coding Analysis", description: "Analyze code behavior or find issues" },
  { value: "expected-output", label: "Expected Output", description: "Predict what a code snippet produces" },
];

export default function QuizGenerationScreen() {
  const { goBack, navigate, showAIConsent, darkMode, materials, folders, offlineMode, showToast, setQuizGenerationRequest } = useApp();
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [count, setCount] = useState<number | "custom">(10);
  const [customCount, setCustomCount] = useState("");
  const [questionTypes, setQuestionTypes] = useState<QuizType[]>(["multiple-choice"]);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("normal");
  const [countError, setCountError] = useState("");
  const selectedMaterials = useMemo(() => selectedMaterialIds.map(id => materials.find(m => m.id === id)).filter(Boolean), [selectedMaterialIds, materials]);
  const requestedCount = count === "custom" ? Number(customCount) : count;
  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const card = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-blue-100";
  const text = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const toggleMaterial = (id: string) => setSelectedMaterialIds(current => {
    if (current.includes(id)) return current.filter(value => value !== id);
    if (current.length >= 5) { showToast("You can select up to 5 materials.", "error"); return current; }
    return [...current, id];
  });
  const toggleType = (type: QuizType) => setQuestionTypes(current => current.includes(type) ? current.filter(t => t !== type) : [...current, type]);

  const generate = () => {
    if (offlineMode) { showToast("Internet connection required for automated quiz generation.", "error"); return; }
    if (count === "custom" && (!customCount || !Number.isInteger(Number(customCount)) || Number(customCount) < 1 || Number(customCount) > 100)) {
      setCountError(!customCount ? "Please enter the number of items." : "Enter a whole number from 1 to 100."); return;
    }
    setCountError("");
    if (!selectedMaterialIds.length) { showToast("Select at least one material first.", "error"); setPickerOpen(true); return; }
    if (!questionTypes.length) { showToast("Choose at least one question type.", "error"); return; }
    showAIConsent(() => {
      setQuizGenerationRequest({ materialIds: selectedMaterialIds, count: requestedCount, questionTypes, difficulty });
      navigate("generating-quiz");
    });
  };

  const renderMaterial = (material: Material) => {
    const checked = selectedMaterialIds.includes(material.id);
    return <button type="button" key={material.id} onClick={() => toggleMaterial(material.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${checked ? "border-sage bg-sage-light/60" : darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
      <span className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center text-xs ${checked ? "bg-sage border-sage text-white" : "border-slate-400"}`}>{checked ? "✓" : ""}</span>
      <span className="min-w-0 flex-1"><span className={`block text-xs font-bold truncate ${text}`}>{material.filename}</span><span className={`block text-[10px] mt-0.5 ${muted}`}>{material.type} · {material.size}</span></span>
    </button>;
  };

  return <div className={`flex-1 flex flex-col overflow-hidden ${bg}`}>
    <div className={`flex items-center gap-3 px-5 py-4 border-b ${card}`}>
      <button onClick={goBack} className="w-9 h-9 rounded-xl text-sage font-bold pressable">←</button>
      <div><h1 className={`text-base font-extrabold font-heading ${text}`}>Generate Practice Quiz</h1><p className={`text-[10px] ${muted}`}>Build a quiz from your selected materials</p></div>
    </div>
    <div className="flex-1 overflow-y-auto scroll-y px-5 py-5 space-y-4">
      <section className={`rounded-2xl border p-4 ${card}`}>
        <div className="flex items-center justify-between gap-2"><p className={`text-xs font-extrabold tracking-wider ${text}`}>QUIZ MATERIALS</p><span className={`text-[10px] font-bold ${selectedMaterialIds.length >= 5 ? "text-coral" : muted}`}>{selectedMaterialIds.length}/5 selected</span></div>
        <p className={`text-[10px] mt-1 mb-3 ${muted}`}>Choose up to five files from your folders. Only selected files appear here.</p>
        <button onClick={() => setPickerOpen(true)} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sage py-3 text-sm font-extrabold text-sage"><span>＋</span> Select Materials</button>
        {selectedMaterials.length > 0 && <div className="mt-3 space-y-2">{selectedMaterials.map(m => m && <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}><span className="text-lg">📄</span><span className={`flex-1 min-w-0 text-xs font-bold truncate ${text}`}>{m.filename}</span><button aria-label={`Remove ${m.filename}`} onClick={() => toggleMaterial(m.id)} className="text-slate-400 hover:text-red-500 text-lg">×</button></div>)}</div>}
        {!selectedMaterials.length && <p className={`mt-3 text-xs ${muted}`}>No materials selected yet.</p>}
      </section>

      <section className={`rounded-2xl border p-4 ${card}`}><p className={`text-xs font-extrabold mb-3 ${text}`}>Number of Items</p><div className="grid grid-cols-3 gap-2">{COUNTS.map(value => <button key={value} onClick={() => { setCount(value); setCountError(""); }} className={`py-2.5 rounded-xl text-xs font-extrabold border pressable ${count === value ? "bg-sage border-sage text-white" : darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>{value}</button>)}<button onClick={() => setCount("custom")} className={`py-2.5 rounded-xl text-xs font-extrabold border pressable ${count === "custom" ? "bg-sage border-sage text-white" : darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>Custom</button></div>
        {count === "custom" && <div className="mt-3"><label className={`text-[10px] font-bold ${muted}`}>ENTER NUMBER OF ITEMS</label><input type="number" min="1" max="100" step="1" value={customCount} onChange={e => { setCustomCount(e.target.value); setCountError(""); }} placeholder="Enter number of questions" className={`w-full mt-1 px-4 py-3 rounded-xl border outline-none focus:border-sage text-sm ${darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/>{countError && <p className="text-xs text-coral mt-1">{countError}</p>}</div>}
      </section>

      <section className={`rounded-2xl border p-4 ${card}`}><div className="flex items-center justify-between mb-1"><p className={`text-xs font-extrabold ${text}`}>Question Types</p><span className={`text-[10px] ${muted}`}>Select any combination</span></div><p className={`text-[10px] mb-3 ${muted}`}>All selected question types can be included in the same generation.</p><div className="space-y-2">{TYPES.map(option => { const checked = questionTypes.includes(option.value); return <button type="button" key={option.value} onClick={() => toggleType(option.value)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${checked ? "border-sage bg-sage-light/60" : darkMode ? "border-slate-700" : "border-slate-200"}`}><span className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs shrink-0 ${checked ? "bg-sage border-sage text-white" : "border-slate-400"}`}>{checked ? "✓" : ""}</span><span><span className={`block text-sm font-bold ${text}`}>{option.label}</span><span className={`block text-[10px] mt-0.5 ${muted}`}>{option.description}</span></span></button>; })}</div></section>

      <section className={`rounded-2xl border p-4 ${card}`}><p className={`text-xs font-extrabold mb-3 ${text}`}>Difficulty Level</p><div className="grid grid-cols-3 gap-2">{([ ["easy", "Easy", "border-success bg-success text-white"], ["normal", "Normal", "border-mustard bg-mustard text-white"], ["hard", "Hard", "border-coral bg-coral text-white"] ] as const).map(([value,label,active]) => <button key={value} onClick={() => setDifficulty(value)} className={`py-3 rounded-xl border text-xs font-extrabold pressable ${difficulty === value ? active : darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>{difficulty === value ? "✓ " : ""}{label}</button>)}</div></section>
      <button onClick={generate} className="w-full py-4 rounded-2xl bg-sage text-white font-extrabold shadow-lg shadow-sage/25 pressable">Generate {requestedCount || ""}-Item Quiz</button>
      <button onClick={() => navigate("saved-quizzes")} className={`w-full py-3 rounded-xl border text-sm font-extrabold ${darkMode ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-600"}`}>View Generated & Saved Quizzes</button><p className={`text-[10px] text-center leading-relaxed px-3 ${muted}`}>AI-generated questions are supplementary and may contain inaccuracies. Verify them using the original materials.</p>
    </div>

    {pickerOpen && <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/50 p-3" role="dialog" aria-modal="true" aria-label="Select materials"><div className={`w-full max-h-[88%] rounded-3xl flex flex-col overflow-hidden shadow-2xl ${darkMode ? "bg-slate-950" : "bg-white"}`}><div className={`p-4 border-b flex items-center gap-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`}><div className="flex-1"><h2 className={`font-extrabold ${text}`}>Select Materials</h2><p className={`text-xs ${muted}`}>Select up to 5 files · {selectedMaterialIds.length}/5</p></div><button onClick={() => setPickerOpen(false)} className={`w-9 h-9 rounded-xl ${darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>✕</button></div><div className="flex-1 overflow-y-auto p-4 space-y-3">
      {materials.length === 0 ? <p className={`text-sm ${muted}`}>No uploaded materials yet. Upload files first.</p> : <>
        <div className={`rounded-xl border p-3 ${darkMode ? "border-slate-800" : "border-slate-200"}`}><p className={`text-xs font-extrabold mb-2 ${text}`}>📁 My Materials</p><div className="space-y-2">{materials.filter(m => !m.folderId || !folders.some(f => f.id === m.folderId)).map(renderMaterial)}{materials.filter(m => !m.folderId || !folders.some(f => f.id === m.folderId)).length === 0 && <p className={`text-xs ${muted}`}>No files in My Materials.</p>}</div></div>
        {folders.map(folder => { const items = materials.filter(m => m.folderId === folder.id); const expanded = expandedFolders.includes(folder.id); return <div key={folder.id} className={`rounded-xl border overflow-hidden ${darkMode ? "border-slate-800" : "border-slate-200"}`}><button onClick={() => setExpandedFolders(current => expanded ? current.filter(id => id !== folder.id) : [...current, folder.id])} className={`w-full flex items-center gap-2 p-3 text-left ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}><span>📁</span><span className={`flex-1 text-xs font-extrabold ${text}`}>{folder.name}</span><span className={`text-[10px] ${muted}`}>{items.length} file{items.length === 1 ? "" : "s"}</span><span className={muted}>{expanded ? "⌃" : "⌄"}</span></button>{expanded && <div className="p-3 space-y-2">{items.length ? items.map(renderMaterial) : <p className={`text-xs ${muted}`}>This folder is empty.</p>}</div>}</div>; })}
      </>}
      </div><div className={`p-4 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}><button onClick={() => setPickerOpen(false)} className="w-full py-3 rounded-xl bg-sage text-white font-extrabold">Done · {selectedMaterialIds.length} selected</button></div></div></div>}
  </div>;
}
