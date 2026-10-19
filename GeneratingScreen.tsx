import { useEffect, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import type { Question, Reviewer, QuizType } from "../context/AppContext";
import { api } from "../lib/api";

type Mode = "reviewer" | "quiz";
interface GeneratingScreenProps { mode: Mode }

export default function GeneratingScreen({ mode }: GeneratingScreenProps) {
  const {
    materials, reviewers, currentMaterialId, navigate, addReviewer, setCurrentReviewer,
    addNotification, darkMode, quizGenerationRequest, reviewerGenerationRequest, setReviewerGenerationRequest, setCurrentQuiz, showToast,
  } = useApp();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const cancelRef = useRef<(() => void) | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const material = materials.find(m => m.id === currentMaterialId);
  const steps = mode === "reviewer"
    ? ["Reading your document...", "Analyzing main topics...", "Identifying key concepts...", "Building important terms...", "Preparing your reviewer..."]
    : ["Gathering selected materials...", "Analyzing learning objectives...", "Generating your chosen question types...", "Preparing answers and explanations...", "Finalizing your practice quiz..."];
  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    cancelRef.current = () => { active = false; controller.abort(); setCancelled(true); setError("Generation cancelled."); setReviewerGenerationRequest(null); navigate(mode === "reviewer" ? "reviewer-generation" : "quiz-generation"); };
    let progress = 0;
    const timer = window.setInterval(() => {
      progress = Math.min(progress + 1, steps.length - 1);
      if (active) setStep(progress);
    }, 1800);

    const run = async () => {
      try {
        if (mode === "reviewer") {
          const ids = reviewerGenerationRequest?.materialIds?.length ? reviewerGenerationRequest.materialIds : (currentMaterialId ? [currentMaterialId] : []);
          if (!ids.length) throw new Error("Choose at least one material before generating a reviewer.");
          let lastReviewer: Reviewer | null = null;
          for (const id of ids) {
            const sourceMaterial = materials.find(m => m.id === id);
            if (!sourceMaterial) continue;
            const generated: any = await api("/api/reviewers", { method: "POST", body: JSON.stringify({ materialId: id, force: true }), signal: controller.signal });
            if (!active) return;
            const reviewer: Reviewer = {
              id: generated.id, title: generated.title || `${sourceMaterial.filename.replace(/\.[^.]+$/, "")} Reviewer`,
              sourceFile: generated.sourceFile || sourceMaterial.filename, sourceMaterialId: generated.sourceMaterialId || sourceMaterial.id,
              generatedAt: generated.generatedAt || new Date().toLocaleDateString(), subject: generated.subject || sourceMaterial.subject || "General",
              mainTopics: generated.mainTopics || [], keyConcepts: generated.keyConcepts || [], importantTerms: generated.importantTerms || [],
              summary: generated.summary || "", detailedContent: generated.detailedContent || {}, isRead: !!generated.isRead, isBookmarked: !!generated.isBookmarked,
            };
            addReviewer(reviewer); lastReviewer = reviewer;
          }
          if (!lastReviewer) throw new Error("No selected materials could be processed.");
          setCurrentReviewer(lastReviewer.id);
          setReviewerGenerationRequest(null);
          addNotification({ message: `${ids.length} reviewer${ids.length === 1 ? "" : "s"} generated successfully`, type: "success", time: "Just now" });
          setStep(steps.length - 1);
          window.setTimeout(() => { if (active) navigate("reviewer-library"); }, 350);
        } else {
          if (!quizGenerationRequest || !quizGenerationRequest.materialIds.length) throw new Error("Select at least one material before generating a quiz.");
          const requestTypes = quizGenerationRequest.questionTypes.map(t => t === "coding-analysis" ? "code-analysis" : t);
          const result: any = await api("/api/quizzes/generate", {
            method: "POST",
            body: JSON.stringify({
              sources: quizGenerationRequest.materialIds.map(id => ({ type: "material", id })),
              count: quizGenerationRequest.count,
              questionType: requestTypes.length === 1 ? requestTypes[0] : "mixed",
              questionTypes: requestTypes,
              difficulty: quizGenerationRequest.difficulty,
            }),
            signal: controller.signal,
          });
          if (!active) return;
          const questions: Question[] = (result.questions || []).map((q: any, index: number) => ({
            id: q.id || `q-${index}`,
            text: q.text || q.question || "",
            type: (q.type === "code-analysis" ? "coding-analysis" : q.type || requestTypes[0] || "multiple-choice") as QuizType,
            choices: q.choices || [],
            correctAnswer: q.correctAnswer || q.answer || "",
          }));
          if (!questions.length) throw new Error("The server returned no quiz questions. Please try again.");
          const titles = quizGenerationRequest.materialIds.map(id => materials.find(m => m.id === id)?.filename || "Material");
          setCurrentQuiz({
            questions,
            title: result.title || "Practice Quiz",
            sourceTitle: result.sourceTitle || titles.join(", "),
            quizType: quizGenerationRequest.questionTypes[0] || "multiple-choice",
            difficulty: quizGenerationRequest.difficulty,
          });
          addNotification({ message: `Practice quiz generated: ${result.title || "Practice Quiz"}`, type: "success", time: "Just now" });
          setStep(steps.length - 1);
          window.setTimeout(() => { if (active) navigate("quiz"); }, 350);
        }
      } catch (e) {
        if (!active) return;
        const message = e instanceof Error ? e.message : "Generation failed. Please try again.";
        if (mode === "reviewer") setReviewerGenerationRequest(null);
        setError(message);
        showToast(message, "error");
        window.setTimeout(() => { if (active) navigate(mode === "reviewer" ? "file-detail" : "quiz-generation"); }, 900);
      }
    };
    void run();
    return () => { active = false; controller.abort(); window.clearInterval(timer); };
  }, []);

  const progress = error ? 0 : Math.min(92, Math.round(((step + 1) / steps.length) * 100));
  return <div className={`flex-1 flex flex-col items-center justify-center ${bg} px-8`}>
    <div className="w-24 h-24 rounded-3xl bg-sage flex items-center justify-center mb-8 shadow-2xl shadow-sage/30" style={{ animation: "splashPulse 1.5s ease-in-out infinite" }}>
      {mode === "reviewer" ? <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> : <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
    </div>
    <h2 className={`text-xl font-extrabold font-heading text-center mb-2 ${textPrimary}`}>{error ? "Generation failed" : mode === "reviewer" ? "Generating Reviewer" : "Creating Practice Quiz"}</h2>
    <p className={`text-sm text-center mb-8 ${textSecondary}`}>{error || (mode === "reviewer" ? "AI is analyzing your selected material. This may take a moment." : "AI is building your quiz from the selected materials and question types.")}</p>
    <div className={`w-full h-2.5 rounded-full mb-3 ${darkMode ? "bg-[#111827]" : "bg-sage-light"}`}><div className="h-2.5 bg-sage rounded-full transition-all duration-700" style={{ width: `${progress}%` }}/></div>
    <p className="text-xs font-bold text-sage mb-8">{error ? "Please try again" : `${progress}%`}</p>
    {!error && <div className="w-full space-y-3">{steps.map((label, index) => <div key={label} className={`flex items-center gap-3 text-xs ${index <= step ? "text-sage font-bold" : textSecondary}`}><span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${index < step ? "bg-sage text-white" : index === step ? "border-2 border-sage animate-pulse" : darkMode ? "border border-slate-700" : "border border-slate-300"}`}>{index < step ? "✓" : index + 1}</span>{label}</div>)}</div>}
    {!error && <button onClick={() => cancelRef.current?.()} className="mt-7 px-6 py-3 rounded-xl border border-coral text-coral font-bold text-sm">Cancel generation</button>}
    <p className={`text-[10px] text-center mt-4 ${textSecondary}`}>{cancelled ? "Generation cancelled." : "Keep this screen open while your content is being generated."}</p>
  </div>;
}
