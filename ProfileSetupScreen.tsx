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

export default function ProfileSetupScreen() {
  const { setProfile, saveStudentProfile, navigate, showToast, darkMode, profile } = useApp();
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [middleName, setMiddleName] = useState(profile.middleName || "");
  const [studentId, setStudentId] = useState(profile.studentId || "");
  const [course, setCourse] = useState(profile.course || "");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; studentId?: string; course?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!firstName.trim()) e.firstName = "Please enter your first name.";
    if (!lastName.trim()) e.lastName = "Please enter your last name.";
    if (!studentId.trim()) e.studentId = "Please enter your student ID number.";
    if (!course) e.course = "Please select your course or program.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await saveStudentProfile({ firstName:firstName.trim(), lastName:lastName.trim(), middleName:middleName.trim(), studentId:studentId.trim() || profile.studentId, course, isSetupComplete:true });
      setProfile({ firstName:firstName.trim(), lastName:lastName.trim(), middleName:middleName.trim(), studentId:studentId.trim() || profile.studentId, course, isSetupComplete:true });
      showToast("Profile saved successfully.", "success"); navigate("home");
    } catch (error) { showToast(error instanceof Error ? error.message : "Could not save profile.", "error"); }
    finally { setSaving(false); }
  };

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827]" : "bg-white";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const inputBg = darkMode ? "bg-[#0B1220] border-[#263244] text-sage-light focus:border-sage" : "bg-sage-lighter border-[#CBD5E1] text-[#111827] focus:border-sage";

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-y-auto scroll-y`}>
      {/* Header */}
      <div className="bg-gradient-to-b from-sage to-sage-dark px-6 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-20px] w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute bottom-[-15px] left-[-15px] w-24 h-24 rounded-full bg-white/5" />
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Complete Your Student Profile</h1>
        <p className="text-white/75 text-xs mt-2 font-medium leading-relaxed">
          Tell us a little about yourself so we can personalize your ISLearning experience.
        </p>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* Name */}
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>
            FIRST NAME <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: undefined })); }}
            placeholder="Enter your first name"
            className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all ${inputBg} ${errors.firstName ? "border-coral!" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-coral mt-1 ml-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className={`text-xs font-bold tracking-wide mb-1.5 block ${textSecondary}`}>LAST NAME <span className="text-coral">*</span></label>
          <input value={lastName} onChange={e => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: undefined })); }} placeholder="Enter your last name" className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none ${inputBg} ${errors.lastName ? "border-coral!" : ""}`} />
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
            type="text"
            value={studentId}
            onChange={e => { setStudentId(e.target.value); setErrors(p => ({ ...p, studentId: undefined })); }}
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
              className={`w-full px-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all text-left flex items-center justify-between ${
                course ? (darkMode ? "text-sage-light" : "text-[#111827]") : (darkMode ? "text-[#64748B]" : "text-[#94A3B8]")
              } ${darkMode ? "bg-[#0B1220] border-[#263244]" : "bg-sage-lighter border-[#CBD5E1]"} ${errors.course ? "border-coral!" : ""}`}
            >
              <span>{course || "Select your course or program"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showCourseMenu ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showCourseMenu && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-2xl shadow-xl border z-20 overflow-hidden pop-in ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#CBD5E1]"}`}>
                {COURSES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCourse(c); setShowCourseMenu(false); setErrors(p => ({ ...p, course: undefined })); }}
                    className={`w-full text-left px-4 py-3.5 text-sm font-medium transition-all border-b last:border-0 pressable ${
                      c === course
                        ? "bg-sage-light text-sage-dark font-bold"
                        : darkMode ? "border-[#263244] text-[#94A3B8] hover:bg-[#0B1220]" : "border-[#F1F5F9] text-[#111827] hover:bg-sage-lighter"
                    }`}
                  >
                    {c === course && <span className="text-sage mr-2">✓</span>}
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.course && <p className="text-xs text-coral mt-1 ml-1">{errors.course}</p>}
        </div>

        {/* Info box */}
        <div className={`rounded-2xl p-4 ${darkMode ? "bg-[#111827]" : "bg-sage-light"}`}>
          <div className="flex gap-3">
            <span className="text-sage shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            <p className={`text-xs leading-relaxed ${textSecondary}`}>
              Your profile information will be used to personalize your ISLearning experience. You can update it anytime in Profile settings.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-sage text-white font-bold text-base shadow-lg shadow-sage/25 pressable hover:bg-sage-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {saving ? (
            <><div className="spinner spinner-white" style={{ width: 18, height: 18 }} />Saving...</>
          ) : "Continue"}
        </button>
      </div>
    </div>
  );
}
