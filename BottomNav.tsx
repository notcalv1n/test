import React from "react";
import { useApp } from "../context/AppContext";
import type { ScreenName } from "../context/AppContext";

const NAV_ITEMS: { label: string; screen: ScreenName; icon: (active: boolean) => React.ReactElement }[] = [
  {
    label: "Home",
    screen: "home",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={a ? "currentColor" : "none"} fillOpacity={a ? 0.15 : 0} />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    label: "Materials",
    screen: "materials",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill={a ? "currentColor" : "none"} fillOpacity={a ? 0.15 : 0} />
      </svg>
    ),
  },
  {
    label: "Reviewers",
    screen: "reviewer-library",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" fill={a ? "currentColor" : "none"} fillOpacity={a ? 0.15 : 0} />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Quizzes",
    screen: "progress",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" fill={a ? "currentColor" : "none"} fillOpacity={a ? 0.12 : 0} />
      </svg>
    ),
  },
  {
    label: "Profile",
    screen: "profile",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" fill={a ? "currentColor" : "none"} fillOpacity={a ? 0.15 : 0} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { screen, navigate, darkMode } = useApp();

  const activeScreen = NAV_ITEMS.find(i =>
    screen === i.screen ||
    (i.screen === "materials" && ["materials", "file-detail", "document-viewer", "upload"].includes(screen)) ||
    (i.screen === "reviewer-library" && ["reviewer-library", "reviewer", "generating-reviewer"].includes(screen)) ||
    (i.screen === "progress" && ["progress", "quiz", "quiz-results", "quiz-generation", "generating-quiz", "review-answers"].includes(screen))
  )?.screen;

  return (
    <div className={`shrink-0 border-t pb-2 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#CBD5E1]"}`}
      style={{ boxShadow: darkMode ? "0 -1px 0 rgba(0,0,0,0.3)" : "0 -1px 0 rgba(0,0,0,0.06)" }}>
      <div className="flex justify-around items-start pt-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 min-w-[52px] transition-all pressable ${isActive ? "text-sage" : darkMode ? "text-[#94A3B8]" : "text-[#94A3B8]"}`}
            >
              {item.icon(isActive)}
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-sage" : ""}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                {item.label}
              </span>
              {isActive && <div className="w-4 h-0.5 bg-sage rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
