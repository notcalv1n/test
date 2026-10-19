import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginScreen() {
  const { navigate, profile, signIn, showToast } = useApp();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ studentId?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!studentId.trim()) e.studentId = "Please enter your Student ID or Email.";
    if (!password.trim()) e.password = "Please enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    try { const account = await signIn(studentId.trim(), password); showToast("Welcome back.", "success"); navigate(account.isSetupComplete ? "home" : "profile-setup"); }
    catch (error) { showToast(error instanceof Error ? error.message : "Sign in failed.", "error"); }
    finally { setLoading(false); }
  };


  return (
    <div className="flex-1 flex flex-col bg-sage-lighter overflow-y-auto scroll-y">
      {/* Header */}
      <div className="bg-gradient-to-b from-sage to-sage-dark pt-10 pb-10 px-6 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-30px] w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-white/5" />
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4">
          <svg width="46" height="46" viewBox="0 0 68 68" fill="none">
            <rect x="14" y="8" width="38" height="48" rx="4" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
            <rect x="14" y="8" width="7" height="48" rx="4" fill="#2563EB" />
            {[16, 24, 32, 40, 48].map(y => <circle key={y} cx="17.5" cy={y} r="2" fill="white" />)}
            {[22, 30, 38, 46].map(y => <line key={y} x1="26" y1={y} x2="46" y2={y} stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />)}
            <rect x="46" y="28" width="9" height="30" rx="2" fill="#1E40AF" transform="rotate(-20 46 28)" />
            <polygon points="46,55 55,55 50.5,64" fill="#D4930A" transform="rotate(-20 46 28)" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">ISLearning</h1>
        <p className="text-white/75 text-xs mt-1 font-medium tracking-wide">SDCC Student-Centered Learning App</p>
      </div>

      <div className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-extrabold text-[#111827] mb-1 font-heading">Welcome Back</h2>
        <p className="text-sm text-[#64748B] mb-7 font-medium">Sign in to continue learning.</p>

        {/* Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-[#64748B] tracking-wide mb-1.5 block">STUDENT ID / EMAIL</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                type="text"
                value={studentId}
                onChange={e => { setStudentId(e.target.value); setErrors(p => ({ ...p, studentId: undefined })); }}
                placeholder="Enter your student ID or email"
                className={`w-full pl-10 pr-4 py-4 rounded-2xl text-sm font-medium border outline-none transition-all bg-white text-[#111827] ${errors.studentId ? "border-coral" : "border-[#CBD5E1] focus:border-sage"}`}
              />
            </div>
            {errors.studentId && <p className="text-xs text-coral mt-1 ml-1">{errors.studentId}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-[#64748B] tracking-wide mb-1.5 block">PASSWORD</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-4 rounded-2xl text-sm font-medium border outline-none transition-all bg-white text-[#111827] ${errors.password ? "border-coral" : "border-[#CBD5E1] focus:border-sage"}`}
              />
              <button
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pressable"
              >
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="text-xs text-coral mt-1 ml-1">{errors.password}</p>}
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-sage text-white font-bold text-base shadow-lg shadow-sage/25 pressable hover:bg-sage-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2 mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {loading ? (
            <>
              <div className="spinner spinner-white" style={{ width: 18, height: 18 }} />
              Signing in...
            </>
          ) : "Sign In"}
        </button>

        <button
          onClick={() => navigate("create-account")}
          className="w-full py-4 mt-3 rounded-2xl border-2 border-sage text-sage font-bold text-sm pressable hover:bg-sage-light transition-all"
        >
          Create Account
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 flex items-center justify-center gap-4">
        <button className="text-xs text-sage font-semibold pressable">Privacy Notice</button>
        <div className="w-1 h-1 bg-[#CBD5E1] rounded-full" />
        <button className="text-xs text-sage font-semibold pressable">About ISLearning</button>
      </div>
    </div>
  );
}
