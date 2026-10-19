import { useState } from "react";
import { useApp } from "../context/AppContext";

const SLIDES = [
  {
    title: "Organize Your Academic Materials",
    description: "Keep your PDFs, documents, presentations, images, and notes organized in one centralized mobile platform.",
    illustration: (
      <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stack of files */}
        <rect x="30" y="40" width="80" height="96" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="22" y="46" width="80" height="96" rx="6" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="14" y="52" width="80" height="96" rx="6" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.5" />
        {/* File icons */}
        <rect x="25" y="66" width="58" height="70" rx="4" fill="white" stroke="#2563EB" strokeWidth="1" />
        {/* PDF tag */}
        <rect x="25" y="66" width="58" height="18" rx="4" fill="#2563EB" />
        <text x="54" y="79" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Outfit,sans-serif">PDF</text>
        <line x1="33" y1="98" x2="75" y2="98" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="33" y1="108" x2="68" y2="108" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="33" y1="118" x2="72" y2="118" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        {/* Subject tags */}
        <rect x="105" y="55" width="60" height="24" rx="12" fill="#FEF3DC" />
        <text x="135" y="71" textAnchor="middle" fill="#D4930A" fontSize="9" fontWeight="bold" fontFamily="Outfit,sans-serif">IT 101</text>
        <rect x="110" y="88" width="55" height="24" rx="12" fill="#EBF2F9" />
        <text x="138" y="104" textAnchor="middle" fill="#5B87B5" fontSize="9" fontWeight="bold" fontFamily="Outfit,sans-serif">MATH</text>
        <rect x="108" y="122" width="58" height="24" rx="12" fill="#FDECEA" />
        <text x="137" y="138" textAnchor="middle" fill="#D45C4A" fontSize="9" fontWeight="bold" fontFamily="Outfit,sans-serif">SYSAD</text>
        {/* Connector lines */}
        <line x1="85" y1="75" x2="105" y2="67" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="85" y1="100" x2="110" y2="100" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,2" />
        <line x1="85" y1="125" x2="108" y2="134" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,2" />
      </svg>
    ),
    extra: null,
  },
  {
    title: "Smart Lesson Review",
    description: "Generate simplified reviewers from your learning materials to help you understand important topics and concepts.",
    illustration: (
      <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Document */}
        <rect x="20" y="20" width="85" height="110" rx="6" fill="white" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="20" y="20" width="85" height="24" rx="6" fill="#2563EB" />
        <text x="62" y="36" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Outfit,sans-serif">SOURCE</text>
        {[52, 64, 76, 88, 100].map(y => (
          <line key={y} x1="30" y1={y} x2="95" y2={y} stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {/* Arrow with AI sparkle */}
        <circle cx="122" cy="75" r="18" fill="#DBEAFE" />
        <text x="122" y="72" textAnchor="middle" fill="#2563EB" fontSize="18">✨</text>
        <text x="122" y="86" textAnchor="middle" fill="#2563EB" fontSize="7" fontWeight="bold" fontFamily="Outfit,sans-serif">AI</text>
        {/* Reviewer */}
        <rect x="140" y="30" width="32" height="90" rx="6" fill="#F8FAFC" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="140" y="30" width="32" height="18" rx="6" fill="#D4930A" />
        <text x="156" y="42" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Outfit,sans-serif">KEY</text>
        {[56, 64, 72, 80, 88, 96, 104].map(y => (
          <line key={y} x1="145" y1={y} x2="167" y2={y} stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
        ))}
        <line x1="105" y1="75" x2="140" y2="75" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4,2" />
        <polygon points="138,71 146,75 138,79" fill="#2563EB" />
      </svg>
    ),
    extra: (
      <div className="flex items-start gap-2.5 bg-mustard-light rounded-2xl p-3.5 mt-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4930A" strokeWidth="2.5" className="shrink-0 mt-0.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p className="text-xs text-mustard font-semibold leading-relaxed">
          AI-generated reviewers are supplementary. Always verify information using your original materials.
        </p>
      </div>
    ),
  },
  {
    title: "Automated Practice Quizzes",
    description: "Create Multiple Choice, True/False, Enumeration, Identification, Practical Coding, Coding Analysis, and Expected Output quizzes, then track your scores.",
    illustration: (
      <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Quiz card */}
        <rect x="20" y="15" width="140" height="95" rx="10" fill="white" stroke="#2563EB" strokeWidth="1.5" />
        <rect x="20" y="15" width="140" height="28" rx="10" fill="#2563EB" />
        <text x="90" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Outfit,sans-serif">Practice Quiz</text>
        <text x="30" y="60" fill="#111827" fontSize="8" fontFamily="Nunito,sans-serif">What is a Primary Key?</text>
        {/* Answer choices */}
        {[
          { y: 72, text: "A.  A unique record identifier", correct: true },
          { y: 84, text: "B.  A sorting mechanism", correct: false },
          { y: 96, text: "C.  A database query", correct: false },
        ].map(({ y, text, correct }) => (
          <g key={y}>
            <rect x="25" y={y - 8} width="130" height="14" rx="4" fill={correct ? "#DBEAFE" : "#F8FAFC"} stroke={correct ? "#2563EB" : "#CBD5E1"} strokeWidth="1" />
            <text x="32" y={y + 2} fill={correct ? "#1E40AF" : "#64748B"} fontSize="7" fontFamily="Nunito,sans-serif">{text}</text>
            {correct && <circle cx="148" cy={y - 1} r="4" fill="#2563EB" />}
            {correct && <path d="M145.5,-1 L147,1 L150.5,-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0,${y})`} />}
          </g>
        ))}
        {/* Score display */}
        <rect x="30" y="118" width="120" height="26" rx="8" fill="#DBEAFE" />
        <text x="90" y="135" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold" fontFamily="Outfit,sans-serif">Score: 8 / 10 — 80%</text>
        {/* Badges */}
        <rect x="55" y="8" width="40" height="14" rx="7" fill="#FEF3DC" />
        <text x="75" y="19" textAnchor="middle" fill="#D4930A" fontSize="7" fontWeight="bold" fontFamily="Outfit,sans-serif">MC & T/F</text>
      </svg>
    ),
    extra: (
      <div className="flex items-center gap-2.5 bg-sage-light rounded-2xl p-3.5 mt-2">
        <span className="text-sage text-lg">🎯</span>
        <p className="text-xs text-sage-dark font-semibold leading-relaxed">
          Supports <strong>Multiple Choice</strong> & <strong>True/False</strong> questions with automatic checking and scoring.
        </p>
      </div>
    ),
  },
];

export default function OnboardingScreen() {
  const { navigate } = useApp();
  const [slide, setSlide] = useState(0);

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide(s => s + 1);
    else navigate("login");
  };

  const back = () => {
    if (slide > 0) setSlide(s => s - 1);
  };

  const current = SLIDES[slide];

  return (
    <div className="flex-1 flex flex-col bg-sage-lighter">
      {/* Skip */}
      <div className="flex justify-end px-5 pt-2">
        <button
          onClick={() => navigate("login")}
          className="text-sm font-bold text-sage-dark px-3 py-1.5 pressable"
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <div className="w-64 h-44 flex items-center justify-center mb-2">
          {current.illustration}
        </div>

        {/* Slide indicators */}
        <div className="flex gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all pressable ${i === slide ? "w-8 h-2.5 bg-sage" : "w-2.5 h-2.5 bg-sage-100"}`}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center px-2 screen-enter" key={slide}>
          <h2 className="text-2xl font-extrabold text-[#111827] mb-3 leading-tight font-heading">
            {current.title}
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed font-medium">
            {current.description}
          </p>
          {current.extra && <div className="mt-3">{current.extra}</div>}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 flex items-center gap-3">
        {slide > 0 ? (
          <button
            onClick={back}
            className="w-12 h-12 rounded-2xl border-2 border-[#CBD5E1] flex items-center justify-center pressable"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : <div className="w-12" />}

        <button
          onClick={next}
          className="flex-1 py-4 rounded-2xl bg-sage text-white font-bold text-base shadow-lg shadow-sage/25 pressable hover:bg-sage-dark transition-all"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {slide < SLIDES.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
}
