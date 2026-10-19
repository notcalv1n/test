import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function QuizResultsScreen() {
  const { pendingQuizResult, navigate, goBack, darkMode, setCurrentQuiz, setCurrentQuizAnswers, quizGenerationSource, currentQuiz, saveCurrentQuiz, generatedQuizzes } = useApp();
  const [showReview, setShowReview] = useState(false);
  const result = pendingQuizResult;

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <button onClick={() => navigate("progress")} className="text-sage font-bold">View Progress</button>
      </div>
    );
  }

  const { score, correctAnswers, totalQuestions, title, timeSpent, questions, answers, quizType, difficulty } = result;
  const wrong = totalQuestions - correctAnswers;
  const mins = Math.floor(timeSpent / 60);
  const secs = timeSpent % 60;

  const getScoreEmoji = (s: number) => {
    if (s >= 90) return "🏆";
    if (s >= 80) return "🌟";
    if (s >= 70) return "✅";
    if (s >= 60) return "💪";
    return "📚";
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success";
    if (s >= 60) return "text-mustard";
    return "text-coral";
  };

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  if (showReview) {
    return (
      <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
        <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
          <button onClick={() => setShowReview(false)} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className={`text-base font-extrabold font-heading ${textPrimary}`}>Review Answers</h1>
        </div>
        <div className="flex-1 overflow-y-auto scroll-y px-5 py-4 space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`rounded-2xl border p-4 ${cardBg}`}>
                <div className="flex items-start gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${darkMode ? "bg-sage/15 text-sage" : "bg-sage-light text-sage-dark"}`}>{i + 1}</span>
                  <p className={`text-sm font-bold leading-snug flex-1 ${textPrimary}`}>{q.text}</p>
                  <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
                </div>
                <div className={`rounded-xl p-3 mb-2 ${isCorrect ? (darkMode ? "bg-success/10 border border-success/20" : "bg-success-light border border-success/20") : (darkMode ? "bg-coral/10 border border-coral/20" : "bg-coral-light border border-coral/20")}`}>
                  <p className={`text-xs font-semibold ${isCorrect ? "text-success" : "text-coral"}`}>
                    Your answer: {userAnswer || "No answer"}
                  </p>
                </div>
                {!isCorrect && (
                  <div className={`rounded-xl p-3 ${darkMode ? "bg-success/10 border border-success/20" : "bg-success-light border border-success/20"}`}>
                    <p className="text-xs font-semibold text-success">
                      Correct answer: {q.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          <div className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <h1 className={`text-base font-extrabold font-heading ${textPrimary}`}>Quiz Complete!</h1>
        <p className={`text-xs ${textSecondary}`}>{title}</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-5 space-y-4">
        {/* Score circle */}
        <div className={`rounded-3xl border p-6 flex flex-col items-center ${cardBg}`}>
          <div className="text-6xl mb-2">{getScoreEmoji(score)}</div>
          <div className={`text-6xl font-extrabold font-heading mb-1 ${getScoreColor(score)}`}>{score}%</div>
          <p className={`text-sm font-bold ${textPrimary}`}>
            {correctAnswers} out of {totalQuestions} correct
          </p>
          <div className="w-full mt-5">
            <div className={`h-3 rounded-full ${darkMode ? "bg-[#0B1220]" : "bg-sage-lighter"}`}>
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${score >= 80 ? "bg-success" : score >= 60 ? "bg-mustard" : "bg-coral"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Correct", value: correctAnswers, icon: "✅", color: "bg-success-light text-success" },
            { label: "Incorrect", value: wrong, icon: "❌", color: "bg-coral-light text-coral" },
            { label: "Accuracy", value: `${score}%`, icon: "🎯", color: darkMode ? "bg-sage/15 text-sage" : "bg-sage-light text-sage-dark" },
            { label: "Time", value: `${mins}m ${secs}s`, icon: "⏱️", color: darkMode ? "bg-muted-blue/15 text-muted-blue" : "bg-muted-blue-light text-muted-blue" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${cardBg}`}>
              <p className="text-xl mb-1">{stat.icon}</p>
              <p className={`text-2xl font-extrabold font-heading ${stat.color.split(" ")[1]}`}>{stat.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <p className={`text-[10px] font-extrabold tracking-wider mb-3 ${textSecondary}`}>QUIZ DETAILS</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className={`text-sm font-extrabold capitalize ${textPrimary}`}>{quizType.replaceAll("-", " ")}</p><p className={`text-[9px] ${textSecondary}`}>Type</p></div>
            <div><p className={`text-sm font-extrabold capitalize ${difficulty === "easy" ? "text-success" : difficulty === "hard" ? "text-coral" : "text-mustard"}`}>{difficulty}</p><p className={`text-[9px] ${textSecondary}`}>Difficulty</p></div>
            <div><p className={`text-sm font-extrabold ${textPrimary}`}>{totalQuestions}</p><p className={`text-[9px] ${textSecondary}`}>Items</p></div>
          </div>
        </div>

        {/* Performance message */}
        <div className={`rounded-2xl p-4 ${score >= 80 ? (darkMode ? "bg-success/10 border border-success/20" : "bg-success-light border border-success/20") : score >= 60 ? (darkMode ? "bg-mustard/10 border border-mustard/20" : "bg-mustard-light border border-mustard/20") : (darkMode ? "bg-muted-blue/10 border border-muted-blue/20" : "bg-muted-blue-light border border-muted-blue/20")}`}>
          <p className={`text-sm font-bold ${score >= 80 ? "text-success" : score >= 60 ? "text-mustard" : "text-muted-blue"}`}>
            {score >= 90 ? "Excellent work! Outstanding performance! 🏆" :
             score >= 80 ? "Great job! Keep up the good work! 🌟" :
             score >= 70 ? "Good effort! Review the missed questions. ✅" :
             score >= 60 ? "Keep studying! Practice makes perfect. 💪" :
             "Don't give up! Review your materials and try again. 📚"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5 pb-4">
          <button
            onClick={() => setShowReview(true)}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 pressable bg-sage text-white shadow-lg shadow-sage/25`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            📋 Review Answers
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { setCurrentQuizAnswers({}); navigate("quiz"); }}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-sage text-sage bg-sage/10" : "border-sage text-sage hover:bg-sage-light"}`}
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={() => navigate("progress")}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
            >
              📊 My Progress
            </button>
          </div>
          <button onClick={saveCurrentQuiz} className={`w-full py-3.5 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-sage text-sage" : "border-sage text-sage"}`}>
            {currentQuiz && generatedQuizzes.some(q => q.id === currentQuiz.id && q.saved) ? "✓ Quiz Saved" : "💾 Save Quiz"}
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate("home")} className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}>⌂ Home</button>
            <button onClick={() => navigate("quiz-generation")} className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-sage text-white pressable">＋ Generate Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
}
