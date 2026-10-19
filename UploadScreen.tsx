import { useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../lib/api";
import type { Material } from "../context/AppContext";

type FileType = "PDF" | "DOCX" | "PPTX" | "TXT" | "IMAGE";
type Step = "select-type" | "preview" | "details" | "uploading" | "success";

const FILE_TYPES: { type: FileType; label: string; icon: string; desc: string; color: string; textColor: string }[] = [
  { type: "PDF", label: "PDF Document", icon: "📄", desc: "Portable Document Format", color: "bg-coral-light", textColor: "text-coral" },
  { type: "DOCX", label: "Word Document", icon: "📝", desc: "Microsoft Word .docx", color: "bg-muted-blue-light", textColor: "text-muted-blue" },
  { type: "PPTX", label: "Presentation", icon: "📊", desc: "PowerPoint .pptx", color: "bg-mustard-light", textColor: "text-mustard" },
  { type: "TXT", label: "Text File", icon: "📃", desc: "Plain text .txt", color: "bg-sage-light", textColor: "text-sage-dark" },
  { type: "IMAGE", label: "Image File", icon: "🖼️", desc: "JPG, PNG, etc.", color: "bg-purple-50", textColor: "text-purple-500" },
];

const SUBJECTS = ["Information Technology", "Information Systems", "Web Development", "Quantitative Methods", "Natural Sciences", "Business Administration", "Education", "Other"];



export default function UploadScreen() {
  const { goBack, navigate, addMaterial, folders, showToast, addNotification, darkMode, userId } = useApp();
  const [step, setStep] = useState<Step>("select-type");
  const [fileType, setFileType] = useState<FileType>("PDF");
  const [filename, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [folderId, setFolderId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#0B1220] border-[#263244] text-sage-light focus:border-sage" : "bg-sage-lighter border-[#CBD5E1] text-[#111827] focus:border-sage";

  const selectedType = FILE_TYPES.find(f => f.type === fileType)!;

  const handleSelectType = (type: FileType) => {
    setFileType(type); setFilename(""); setSelectedFile(null); setStep("preview");
  };

  const handleContinueToDetails = () => setStep("details");

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!subject) e.subject = "Please select a subject.";
    if (!topic.trim()) e.topic = "Please enter a topic.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpload = async () => {
    if (!validateDetails()) return;
    if (!selectedFile) { showToast("Please choose a file from your device.", "error"); return; }
    if (!userId) { showToast("Please sign in before uploading materials.", "error"); return; }
    setStep("uploading");
    try {
      const form = new FormData(); form.append("file", selectedFile); form.append("subject", subject); form.append("topic", topic); form.append("week", "Week 1");
      const material:any = await api("/api/materials/upload", {method:"POST", body:form});
      const newMaterial: Material = { id:material.id, filename:material.filename || selectedFile.name, type:(material.type || fileType) as FileType, subject:material.subject || subject, topic:material.topic || topic, uploadedAt:material.uploadedAt || new Date().toLocaleDateString(), size:material.size || `${(selectedFile.size/1024/1024).toFixed(2)} MB`, canGenerateAI:material.canGenerateAI !== false, folderId:folderId || null };
      addMaterial(newMaterial);
      if (folderId) await api(`/api/materials/${encodeURIComponent(newMaterial.id)}/folder`, {method:"PATCH", body:JSON.stringify({folderId})});
      addNotification({ message:`Material uploaded: ${newMaterial.filename}`, type:"success", time:"Just now" });
      showToast("Material uploaded successfully!", "success"); setStep("success");
    } catch (error) { setStep("details"); showToast(error instanceof Error ? error.message : "Upload failed.", "error"); }
  };

  const STEP_LABELS = ["Select Type", "File Preview", "Details", "", ""];
  const currentStepIdx = ["select-type", "preview", "details", "uploading", "success"].indexOf(step);

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button
          onClick={step === "select-type" || step === "success" ? goBack : () => setStep(step === "details" ? "preview" : step === "preview" ? "select-type" : "select-type")}
          className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={`text-base font-extrabold font-heading ${textPrimary}`}>Upload Material</h1>
      </div>

      {/* Progress steps */}
      {step !== "uploading" && step !== "success" && (
        <div className={`flex items-center justify-center gap-2 px-5 py-3 border-b ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < currentStepIdx ? "bg-sage text-white" : i === currentStepIdx ? "bg-sage text-white ring-2 ring-sage ring-offset-2" : darkMode ? "bg-[#263244] text-[#64748B]" : "bg-[#CBD5E1] text-[#94A3B8]"}`}>
                {i < currentStepIdx ? "✓" : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 ${i < currentStepIdx ? "bg-sage" : darkMode ? "bg-[#263244]" : "bg-[#CBD5E1]"}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-5">
        {/* Step 1: Select type */}
        {step === "select-type" && (
          <div className="space-y-3 screen-enter">
            <h2 className={`text-lg font-extrabold font-heading mb-4 ${textPrimary}`}>What type of file are you uploading?</h2>
            {FILE_TYPES.map(ft => (
              <button
                key={ft.type}
                onClick={() => handleSelectType(ft.type)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border pressable transition-all ${cardBg}`}
              >
                <div className={`w-12 h-12 rounded-xl ${ft.color} flex items-center justify-center text-2xl shrink-0`}>
                  {ft.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-bold ${textPrimary}`}>{ft.label}</p>
                  <p className={`text-xs ${textSecondary}`}>{ft.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && (
          <div className="space-y-5 screen-enter">
            <h2 className={`text-lg font-extrabold font-heading ${textPrimary}`}>File Preview</h2>

            <div className={`rounded-2xl border p-6 flex flex-col items-center ${cardBg}`}>
              <div className={`w-20 h-20 rounded-2xl ${selectedType.color} flex items-center justify-center text-4xl mb-4`}>{selectedType.icon}</div>
              <p className={`text-sm font-bold text-center ${textPrimary}`}>{selectedFile?.name || "No file selected"}</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-xl mt-2 ${selectedType.color} ${selectedType.textColor}`}>{fileType}</span>
              <label className="w-full mt-5 px-4 py-3 rounded-xl bg-sage text-white text-sm font-bold text-center cursor-pointer">
                Choose file from device
                <input type="file" className="hidden" accept={fileType === "PDF" ? ".pdf" : fileType === "DOCX" ? ".docx,.doc" : fileType === "PPTX" ? ".pptx,.ppt" : fileType === "TXT" ? ".txt,.md,.csv" : "image/*"} onChange={event => { const file=event.target.files?.[0] || null; setSelectedFile(file); setFilename(file?.name || ""); }} />
              </label>
              <p className={`text-[10px] text-center mt-3 ${textSecondary}`}>Your selected file will be uploaded to your account. Maximum size: 25 MB.</p>
            </div>

            {fileType === "IMAGE" && (
              <div className={`rounded-2xl p-3.5 flex gap-3 ${darkMode ? "bg-mustard/10 border border-mustard/20" : "bg-mustard-light border border-mustard/15"}`}>
                <span className="text-mustard shrink-0 mt-0.5">⚠️</span>
                <p className="text-xs text-mustard font-semibold leading-relaxed">
                  Image files can be stored and viewed as academic materials, but AI reviewer and quiz generation requires text-based files.
                </p>
              </div>
            )}

            <button
              onClick={handleContinueToDetails}
              className="w-full py-4 rounded-2xl bg-sage text-white font-bold text-base pressable shadow-lg shadow-sage/25"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Details */}
        {step === "details" && (
          <div className="space-y-4 screen-enter">
            <h2 className={`text-lg font-extrabold font-heading ${textPrimary}`}>File Details</h2>

            <div className={`rounded-2xl border p-3.5 flex items-center gap-3 ${cardBg}`}>
              <div className={`w-10 h-10 rounded-xl ${selectedType.color} flex items-center justify-center text-xl shrink-0`}>{selectedType.icon}</div>
              <p className={`text-sm font-bold truncate ${textPrimary}`}>{filename}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${selectedType.color} ${selectedType.textColor}`}>{fileType}</span>
            </div>

            {/* Subject */}
            <div>
              <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
                SUBJECT <span className="text-coral">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowSubjectMenu(s => !s)}
                  className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none text-left flex items-center justify-between ${
                    subject ? textPrimary : textSecondary
                  } ${inputBg} ${errors.subject ? "border-coral!" : ""}`}
                >
                  <span>{subject || "Select a subject"}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showSubjectMenu ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showSubjectMenu && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-2xl shadow-xl border z-20 overflow-hidden pop-in ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#CBD5E1]"}`}>
                    {SUBJECTS.map(s => (
                      <button key={s} onClick={() => { setSubject(s); setShowSubjectMenu(false); setErrors(p => ({ ...p, subject: undefined! })); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-b last:border-0 pressable ${s === subject ? "bg-sage-light text-sage-dark font-bold" : darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#F1F5F9] text-[#111827]"}`}>
                        {s === subject && <span className="text-sage mr-2">✓</span>}{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.subject && <p className="text-xs text-coral mt-1 ml-1">{errors.subject}</p>}
            </div>

            {/* Topic */}
            <div>
              <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
                TOPIC <span className="text-coral">*</span>
              </label>
              <input
                value={topic}
                onChange={e => { setTopic(e.target.value); setErrors(p => ({ ...p, topic: undefined! })); }}
                placeholder="e.g. Chapter 3: Data Types"
                className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all ${inputBg} ${errors.topic ? "border-coral!" : ""}`}
              />
              {errors.topic && <p className="text-xs text-coral mt-1 ml-1">{errors.topic}</p>}
            </div>

            <div>
              <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>FOLDER · OPTIONAL</label>
              <select value={folderId} onChange={event => setFolderId(event.target.value)} className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none ${inputBg}`}>
                <option value="">My Materials</option>
                {folders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
              </select>
            </div>

            <button
              onClick={handleUpload}
              className="w-full py-4 rounded-2xl bg-sage text-white font-bold text-base pressable shadow-lg shadow-sage/25 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Material
            </button>
          </div>
        )}

        {/* Step 4: Uploading */}
        {step === "uploading" && (
          <div className="flex flex-col items-center justify-center py-16 fade-in">
            <div className="w-24 h-24 rounded-3xl bg-sage flex items-center justify-center mb-8 shadow-xl shadow-sage/30"
              style={{ animation: "splashPulse 1.5s ease-in-out infinite" }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h2 className={`text-xl font-extrabold font-heading mb-2 ${textPrimary}`}>Uploading Material</h2>
            <p className={`text-sm mb-6 ${textSecondary}`}>Organizing your material...</p>
            <div className={`w-full h-2.5 rounded-full mb-2 ${darkMode ? "bg-[#111827]" : "bg-sage-light"}`}>
              <div className="h-2.5 bg-sage rounded-full" style={{ width: "65%", transition: "width 2s ease" }} />
            </div>
            <p className={`text-xs font-bold text-sage`}>Processing...</p>
          </div>
        )}

        {/* Step 5: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-12 fade-in">
            <div className="w-24 h-24 rounded-3xl bg-success flex items-center justify-center mb-6 shadow-xl shadow-success/30">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 className={`text-2xl font-extrabold font-heading mb-2 ${textPrimary}`}>Material Uploaded!</h2>
            <p className={`text-sm text-center mb-2 ${textSecondary}`}>
              <span className={`font-bold ${textPrimary}`}>{filename}</span> has been added to {folderId ? folders.find(folder => folder.id === folderId)?.name : "My Materials"}.
            </p>
            <p className={`text-xs text-center mb-8 ${textSecondary}`}>
              {fileType !== "IMAGE" ? "You can now generate a reviewer or quiz from this material." : "Image stored. Note: AI generation is not available for image files."}
            </p>
            <div className="w-full space-y-2.5">
              <button
                onClick={() => navigate("materials")}
                className="w-full py-4 rounded-2xl bg-sage text-white font-bold text-sm pressable shadow-lg shadow-sage/25"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                View My Materials
              </button>
              <button
                onClick={() => { setStep("select-type"); setFilename(""); setSubject(""); setTopic(""); setErrors({}); }}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
              >
                Upload Another
              </button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
