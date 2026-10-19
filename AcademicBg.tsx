import React from "react";

export default function AcademicBg({ dark }: { dark?: boolean }) {
  const opacity = dark ? 0.04 : 0.055;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Notebook lines */}
      {[80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720].map(y => (
        <line key={y} x1="16" y1={y} x2="374" y2={y} stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.8" />
      ))}
      {/* Vertical margin line */}
      <line x1="52" y1="60" x2="52" y2="800" stroke={dark ? "#d48b8b" : "#c04040"} strokeWidth="0.9" opacity="0.5" />
      {/* Open book - bottom right corner */}
      <g transform="translate(300, 700) rotate(-10)">
        <rect x="0" y="0" width="50" height="60" rx="3" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.5" />
        <rect x="50" y="0" width="50" height="60" rx="3" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.5" />
        <line x1="50" y1="0" x2="50" y2="60" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="2" />
        {[12, 22, 32, 42].map(ly => (
          <React.Fragment key={ly}>
            <line x1="8" y1={ly} x2="42" y2={ly} stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.7" />
            <line x1="58" y1={ly} x2="92" y2={ly} stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.7" />
          </React.Fragment>
        ))}
      </g>
      {/* Pen - top right */}
      <g transform="translate(330, 30) rotate(35)">
        <rect x="0" y="0" width="10" height="55" rx="2" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.2" />
        <polygon points="0,55 10,55 5,72" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.2" />
        <rect x="1" y="2" width="8" height="12" rx="1" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.8" />
      </g>
      {/* Small star/sparkle */}
      <g transform="translate(70, 90)" opacity="0.6">
        <line x1="5" y1="0" x2="5" y2="10" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1" />
        <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.8" />
        <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="0.8" />
      </g>
      {/* Graduation cap hint */}
      <g transform="translate(20, 680)" opacity="0.7">
        <polygon points="20,0 40,10 20,20 0,10" fill="none" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.2" />
        <line x1="40" y1="10" x2="40" y2="25" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.2" />
        <circle cx="40" cy="27" r="2" fill={dark ? "#a8d5b0" : "#2d6e42"} />
        <line x1="20" y1="20" x2="20" y2="32" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.2" />
        <line x1="12" y1="32" x2="28" y2="32" stroke={dark ? "#a8d5b0" : "#2d6e42"} strokeWidth="1.8" />
      </g>
    </svg>
  );
}
