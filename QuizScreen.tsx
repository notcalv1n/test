import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import type { QuizResult } from "../context/AppContext";

export default function QuizScreen() {
  const { currentQuiz, navigate, darkMode, currentQuizAnswers, setCurrentQuizAnswers, addQuizResult, setPendingQuizResult, addNotification, quizGenerationSource, saveCurrentQuiz, goBack, generatedQuizzes } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(currentQuizAnswers || {});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => { setAnswers({}); setQIndex(0); }, []);

  if (!currentQuiz || currentQuiz.questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">No quiz available.</p>
      </div>
    );
  }

  const { questions, title, sourceTitle, quizType, difficulty } = currentQuiz;
  const question = questions[qIndex];
  const total = questions.length;
  const progress = ((qIndex + 1) / total) * 100;
  const selectedAnswer = answers[question.id];
  const isLast = qIndex === total - 1;

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const handleAnswer = (a: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: a }));
  };

  const handleNext = () => {
    setCurrentQuizAnswers(answers);
    if (isLast) { setShowSubmitModal(true); }
    else { setQIndex(i => i + 1); }
  };

  const handleSubmit = () => {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / total) * 100);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    const result: QuizResult = {
      id: `qr${Date.now()}`,
      title,
      sourceType: quizGenerationSource?.type || "material",
      sourceTitle,
      totalQuestions: total,
      correctAnswers: correct,
      score,
      completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timeSpent,
      questions,
      answers,
      quizType,
      difficulty,
    };

    addQuizResult(result);
    setPendingQuizResult(result);
    addNotification({ message: `Quiz complete! Score: ${correct}/${total} (${score}%)`, type: "success", time: "Just now" });
    setShowSubmitModal(false);
    navigate("quiz-results");
  };

  const getAnswerStyle = (choice: string) => {
    const isSelected = selectedAnswer === choice;
    if (isSelected) {
      return darkMode
        ? "border-sage bg-sage/20 text-sage-light"
        : "border-sage bg-sage-light text-sage-dark shadow-md shadow-sage/15";
    }
    return darkMode
      ? "border-[#263244] bg-[#111827] text-[#94A3B8]"
      : "border-[#DBEAFE] bg-white text-[#64748B]";
  };

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-3 border-b shrink-0 min-w-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button onClick={goBack} aria-label="Back" className="w-8 h-8 rounded-lg text-sage font-bold">←</button>
        <div className="flex-1 min-w-0 overflow-hidden">
          <p title={title} className={`text-xs font-bold truncate ${textSecondary}`}>{title}</p>
          <p title={sourceTitle} className={`text-[10px] truncate ${textSecondary} opacity-70`}>{sourceTitle}</p>
        </div>
        <span className={`hidden sm:inline-block text-[9px] uppercase font-extrabold px-2 py-1 rounded-lg ${
          difficulty === "easy" ? "bg-success-light text-success" : difficulty === "hard" ? "bg-coral-light text-coral" : "bg-mustard-light text-mustard"
        }`}>{difficulty}</span>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-1.5 rounded-xl ${darkMode ? "bg-sage/15 text-sage" : "bg-sage-light text-sage-dark"}`}>{qIndex + 1}/{total}</span>
        <button onClick={saveCurrentQuiz} className="shrink-0 rounded-xl bg-sage px-2.5 py-2 text-[10px] font-extrabold text-white">{generatedQuizzes.some(q => q.id === currentQuiz.id && q.saved) ? "Saved ✓" : "Save"}</button>
      </div>

      {/* Progress */}
      <div className={`h-1.5 ${darkMode ? "bg-[#111827]" : "bg-[#DBEAFE]"}`}>
        <div className="h-1.5 bg-sage transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto scroll-y px-5 py-5 flex flex-col">
        <div className="flex-1 space-y-5">
          {/* Type badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl tracking-wide ${
              question.type === "multiple-choice"
                ? darkMode ? "bg-muted-blue/20 text-muted-blue" : "bg-muted-blue-light text-muted-blue"
                : darkMode ? "bg-sage/20 text-sage" : "bg-sage-light text-sage-dark"
            }`}>
              {question.type.replaceAll("-", " ").toUpperCase()}
            </span>
            <span className={`text-[10px] ${textSecondary}`}>Question {qIndex + 1} of {total}</span>
          </div>

          {/* Question text */}
          <div className={`rounded-2xl border p-5 ${cardBg}`}>
            <p className={`text-base font-bold leading-relaxed ${textPrimary}`}>{question.text}</p>
          </div>

          {/* Choices */}
          <div className="space-y-2.5 screen-enter" key={question.id}>
            {question.type === "multiple-choice" && question.choices?.map((choice, i) => {
              const labels = ["A", "B", "C", "D"];
              const isSelected = selectedAnswer === choice;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(choice)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all pressable text-left ${getAnswerStyle(choice)}`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 font-heading transition-all ${
                    isSelected ? "bg-sage text-white" : darkMode ? "bg-[#0B1220] text-[#94A3B8]" : "bg-sage-lighter text-[#64748B]"
                  }`}>
                    {labels[i]}
                  </span>
                  <span className="text-sm font-semibold leading-snug">{choice}</span>
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" className="ml-auto shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}

            {question.type === "true-false" && ["True", "False"].map(opt => {
              const isSelected = selectedAnswer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full flex items-center gap-3 p-5 rounded-2xl border-2 transition-all pressable ${getAnswerStyle(opt)}`}
                >
                  <span className="text-2xl">{opt === "True" ? "✅" : "❌"}</span>
                  <span className={`text-base font-extrabold font-heading`}>{opt}</span>
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" className="ml-auto">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}

            {!["multiple-choice", "true-false"].includes(question.type) && (
              <div>
                {question.type === "enumeration" && (
                  <p className={`text-xs mb-2 ${textSecondary}`}>Enter each answer on a separate line.</p>
                )}
                <textarea
                  value={selectedAnswer || ""}
                  onChange={event => handleAnswer(event.target.value)}
                  rows={question.type === "practical-coding" || question.type === "coding-analysis" ? 9 : 5}
                  placeholder={
                    question.type === "practical-coding" ? "Write your code here..."
                      : question.type === "coding-analysis" ? "Explain the code or identify the issue..."
                        : question.type === "expected-output" ? "Enter the expected output..."
                          : "Enter your answer..."
                  }
                  className={`w-full rounded-2xl border-2 p-4 outline-none focus:border-sage text-sm leading-relaxed ${
                    question.type === "practical-coding" || question.type === "coding-analysis" ? "font-mono" : ""
                  } ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-blue-100 text-slate-900"}`}
                />
                {["practical-coding", "coding-analysis", "expected-output"].includes(question.type) && (
                  <p className={`text-[10px] mt-2 leading-relaxed ${textSecondary}`}>Prototype feedback is simulated. Code is not executed and arbitrary written answers are not reliably graded.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6 pb-4">
          {qIndex > 0 && (
            <button
              onClick={() => setQIndex(i => i - 1)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center pressable shrink-0 ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`flex-1 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all pressable ${
              selectedAnswer
                ? "bg-sage text-white shadow-lg shadow-sage/25"
                : darkMode ? "bg-[#111827] text-[#64748B] border border-[#263244]" : "bg-[#CBD5E1] text-[#94A3B8]"
            }`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {isLast ? "Submit Quiz" : "Next Question"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 fade-in px-6">
          <div className={`w-full rounded-3xl p-6 pop-in ${darkMode ? "bg-[#111827]" : "bg-white"}`}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center text-3xl">🎯</div>
            </div>
            <h2 className={`text-xl font-extrabold text-center mb-2 font-heading ${darkMode ? "text-sage-light" : "text-[#111827]"}`}>
              Submit Quiz?
            </h2>
            <p className={`text-sm text-center mb-5 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              You've answered {Object.keys(answers).length} of {total} questions. Are you ready to submit and see your results?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border ${darkMode ? "border-[#475569] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-sage text-white pressable"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
