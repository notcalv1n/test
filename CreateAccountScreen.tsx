import { useState } from "react";
import { useApp } from "../context/AppContext";

const COURSES = [
  "Bachelor of Science in Information Systems",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration",
  "Other",
];

export default function CreateAccountScreen() {
  const { goBack, navigate, signUp, showToast, darkMode } = useApp();
  const [form, setForm] = useState({
    firstName: "", lastName: "", middleName: "", studentId: "", course: "",
    email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!form.studentId.trim()) next.studentId = "Please enter your student ID number.";
    if (!form.course) next.course = "Please select your course or program.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.password || form.password.length < 6) next.password = "Password must contain at least 6 characters.";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      const account = await signUp({ firstName:form.firstName.trim(), lastName:form.lastName.trim(), middleName:form.middleName.trim(), studentId:form.studentId.trim(), course:form.course, email:form.email.trim(), password:form.password });
      showToast("Account created successfully.", "success");
      navigate(account.isSetupComplete ? "home" : "profile-setup");
    } catch (error) { showToast(error instanceof Error ? error.message : "Could not create account.", "error"); }
    finally { setSaving(false); }
  };

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const text = darkMode ? "text-white" : "text-slate-900";
  const input = darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <div className={`flex-1 overflow-y-auto scroll-y ${bg}`}>
      <div className="bg-gradient-to-br from-sage to-sage-dark px-6 pt-7 pb-8">
        <button onClick={goBack} className="text-white/80 text-sm font-bold mb-5 pressable">← Back to Sign In</button>
        <h1 className="text-2xl text-white font-extrabold font-heading">Create Your Account</h1>
        <p className="text-xs text-white/75 mt-2 leading-relaxed">Organize materials, generate reviewers, and practice with connected quizzes.</p>
      </div>
      <div className="px-6 py-6 space-y-4">
        {([
          ["firstName", "FIRST NAME", "Enter your first name"],
          ["lastName", "LAST NAME", "Enter your last name"],
          ["middleName", "MIDDLE NAME · OPTIONAL", "Enter your middle name"],
          ["studentId", "STUDENT ID", "e.g. SDCC-2026-0142"],
          ["email", "EMAIL", "student@sdcc.edu.ph"],
          ["password", "PASSWORD", "Create a password"],
          ["confirmPassword", "CONFIRM PASSWORD", "Re-enter your password"],
        ] as const).map(([key, label, placeholder]) => (
          <label key={key} className="block">
            <span className={`block text-[10px] font-extrabold tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
            <input
              type={key.includes("assword") ? "password" : "text"}
              value={form[key]}
              onChange={event => update(key, event.target.value)}
              placeholder={placeholder}
              className={`w-full px-4 py-3.5 rounded-2xl border outline-none text-sm font-medium focus:border-sage ${input} ${errors[key] ? "border-coral!" : ""}`}
            />
            {errors[key] && <span className="block text-xs text-coral mt-1">{errors[key]}</span>}
          </label>
        ))}
        <label className="block">
          <span className={`block text-[10px] font-extrabold tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>COURSE / PROGRAM</span>
          <select value={form.course} onChange={event => update("course", event.target.value)} className={`w-full px-4 py-3.5 rounded-2xl border outline-none text-sm font-medium focus:border-sage ${input} ${errors.course ? "border-coral!" : ""}`}>
            <option value="">Select your course or program</option>
            {COURSES.map(course => <option key={course}>{course}</option>)}
          </select>
          {errors.course && <span className="block text-xs text-coral mt-1">{errors.course}</span>}
        </label>
        <button onClick={submit} disabled={saving} className="w-full py-4 rounded-2xl bg-sage text-white font-extrabold shadow-lg shadow-sage/25 pressable disabled:opacity-60">
          {saving ? "Creating account..." : "Create Account"}
        </button>
        <button onClick={goBack} className={`w-full py-3 text-sm font-bold pressable ${text}`}>Back to Sign In</button>
      </div>
    </div>
  );
}
