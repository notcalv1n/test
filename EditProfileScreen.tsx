import { useState } from "react";
import { useApp } from "../context/AppContext";

const COURSES = [
  "Bachelor of Science in Information Systems",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Accountancy",
  "Bachelor of Science in Education",
  "Bachelor of Science in Computer Science",
  "Other",
];

export default function EditProfileScreen() {
  const { profile, setProfile, goBack, showToast, darkMode } = useApp();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [middleName, setMiddleName] = useState(profile.middleName);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [course, setCourse] = useState(profile.course);
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#0B1220] border-[#263244] text-sage-light focus:border-sage" : "bg-sage-lighter border-[#CBD5E1] text-[#111827] focus:border-sage";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Please enter your first name.";
    if (!lastName.trim()) e.lastName = "Please enter your last name.";
    if (!studentId.trim()) e.studentId = "Please enter your student ID number.";
    if (!course) e.course = "Please select your course or program.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setProfile({ firstName: firstName.trim(), lastName: lastName.trim(), middleName: middleName.trim(), studentId: studentId.trim(), course });
      showToast("Profile updated successfully.", "success");
      setSaving(false);
      goBack();
    }, 800);
  };

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={`text-xl font-extrabold font-heading ${textPrimary}`}>Edit Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-sage flex items-center justify-center text-white text-2xl font-extrabold font-heading mb-2">
            {([firstName, lastName].filter(Boolean).join(" ") || "IS").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <p className={`text-xs ${textSecondary}`}>Profile information</p>
        </div>

        {/* Name */}
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
            FIRST NAME <span className="text-coral">*</span>
          </label>
          <input
            value={firstName}
            onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: undefined! })); }}
            placeholder="Enter your first name"
            className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all ${inputBg} ${errors.firstName ? "border-coral!" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-coral mt-1 ml-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>LAST NAME <span className="text-coral">*</span></label>
          <input value={lastName} onChange={e => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: undefined! })); }} placeholder="Enter your last name" className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none ${inputBg} ${errors.lastName ? "border-coral!" : ""}`} />
          {errors.lastName && <p className="text-xs text-coral mt-1 ml-1">{errors.lastName}</p>}
        </div>
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>MIDDLE NAME · OPTIONAL</label>
          <input value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Enter your middle name (optional)" className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none ${inputBg}`} />
        </div>

        {/* Student ID */}
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
            STUDENT ID NUMBER <span className="text-coral">*</span>
          </label>
          <input
            value={studentId}
            onChange={e => { setStudentId(e.target.value); setErrors(p => ({ ...p, studentId: undefined! })); }}
            placeholder="e.g. SDCC-2026-0142"
            className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all ${inputBg} ${errors.studentId ? "border-coral!" : ""}`}
          />
          {errors.studentId && <p className="text-xs text-coral mt-1 ml-1">{errors.studentId}</p>}
        </div>

        {/* Course */}
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
            COURSE / PROGRAM <span className="text-coral">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCourseMenu(s => !s)}
              className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none text-left flex items-center justify-between ${
                course ? textPrimary : textSecondary
              } ${inputBg} ${errors.course ? "border-coral!" : ""}`}
            >
              <span className="truncate">{course || "Select your course or program"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform shrink-0 ${showCourseMenu ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showCourseMenu && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-2xl shadow-xl border z-20 overflow-hidden pop-in ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#CBD5E1]"}`}>
                {COURSES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCourse(c); setShowCourseMenu(false); setErrors(p => ({ ...p, course: undefined! })); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium border-b last:border-0 pressable ${c === course ? "bg-sage-light text-sage-dark font-bold" : darkMode ? "border-[#263244] text-[#94A3B8]" : "border-[#F1F5F9] text-[#111827]"}`}
                  >
                    {c === course && <span className="text-sage mr-2">✓</span>}{c}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.course && <p className="text-xs text-coral mt-1 ml-1">{errors.course}</p>}
        </div>

        <div className="flex gap-3 pb-4">
          <button
            onClick={goBack}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm border pressable ${darkMode ? "border-[#475569] text-[#94A3B8]" : "border-[#CBD5E1] text-[#64748B]"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-2xl font-bold text-sm bg-sage text-white pressable shadow-lg shadow-sage/25 flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {saving ? <><div className="spinner spinner-white" style={{ width: 16, height: 16 }} />Saving...</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
