import { api, getUserId, setUserId } from "../lib/api";
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type ScreenName =
  | "splash" | "onboarding" | "login" | "create-account" | "profile-setup"
  | "home" | "materials" | "file-detail" | "document-viewer" | "reviewer-generation"
  | "reviewer" | "reviewer-library" | "quiz-generation" | "quiz" | "saved-quizzes"
  | "quiz-results" | "progress" | "profile" | "settings"
  | "search" | "notifications" | "upload" | "edit-profile"
  | "generating-reviewer" | "generating-quiz" | "review-answers";

export interface Material {
  id: string;
  filename: string;
  type: "PDF" | "DOCX" | "PPTX" | "TXT" | "IMAGE";
  subject: string;
  topic: string;
  uploadedAt: string;
  size: string;
  canGenerateAI: boolean;
  folderId?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Reviewer {
  id: string;
  title: string;
  sourceFile: string;
  sourceMaterialId: string;
  generatedAt: string;
  subject: string;
  mainTopics: string[];
  keyConcepts: string[];
  importantTerms: { term: string; definition: string }[];
  summary: string;
  detailedContent?: {
    overview?: string;
    learningObjectives?: string[];
    sections?: Array<{
      heading: string;
      explanation?: string;
      points?: string[];
      subsections?: Array<{ heading: string; explanation?: string; points?: string[]; examples?: string[] }>;
      examples?: string[];
      importantNotes?: string[];
    }>;
    comparisons?: Array<{ title: string; columns: string[]; rows: string[][] }>;
    keyTakeaways?: string[];
    practiceQuestions?: Array<{ type: string; question: string; answer: string }>;
  };
  isRead: boolean;
  isBookmarked: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuizType;
  choices?: string[];
  correctAnswer: string;
}

export type QuizType =
  | "multiple-choice"
  | "true-false"
  | "enumeration"
  | "identification"
  | "practical-coding"
  | "coding-analysis"
  | "expected-output";

export type QuizDifficulty = "easy" | "normal" | "hard";

export interface QuizDocument {
  id: string;
  title: string;
  sourceTitle: string;
  questions: Question[];
  quizType: QuizType;
  difficulty: QuizDifficulty;
  createdAt: string;
  saved: boolean;
}

export interface QuizResult {
  id: string;
  title: string;
  sourceType: "material" | "reviewer";
  sourceTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
  timeSpent: number;
  questions: Question[];
  answers: Record<string, string>;
  quizType: QuizType;
  difficulty: QuizDifficulty;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  time: string;
  read: boolean;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  email?: string;
  studentId: string;
  course: string;
  isSetupComplete: boolean;
}

interface AppState {
  screen: ScreenName;
  screenStack: ScreenName[];
  profile: StudentProfile;
  darkMode: boolean;
  offlineMode: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  offlineAccess: boolean;
  materials: Material[];
  folders: Folder[];
  reviewers: Reviewer[];
  quizHistory: QuizResult[];
  generatedQuizzes: QuizDocument[];
  notifications: NotificationItem[];
  currentMaterialId: string | null;
  currentReviewerId: string | null;
  currentQuiz: { id?: string; questions: Question[]; title: string; sourceTitle: string; quizType: QuizType; difficulty: QuizDifficulty } | null;
  currentQuizAnswers: Record<string, string>;
  pendingQuizResult: QuizResult | null;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  overlay: "ai-consent" | "delete-confirm" | "rename" | "more-menu" | null;
  overlayData: Record<string, unknown>;
  aiConsentCallback: (() => void) | null;
  quizGenerationSource: { type: "material" | "reviewer"; id: string; title: string } | null;
  quizGenerationRequest: { materialIds: string[]; count: number; questionTypes: QuizType[]; difficulty: QuizDifficulty } | null;
  reviewerGenerationRequest: { materialIds: string[] } | null;
}

interface AppContextType extends AppState {
  navigate: (screen: ScreenName) => void;
  signIn: (identifier: string, password: string) => Promise<StudentProfile>;
  signUp: (data: { firstName:string; lastName:string; middleName:string; studentId:string; course:string; email:string; password:string }) => Promise<StudentProfile>;
  saveStudentProfile: (profile: Partial<StudentProfile>) => Promise<void>;
  userId: string | null;
  goBack: () => void;
  setProfile: (p: Partial<StudentProfile>) => void;
  toggleDarkMode: () => void;
  toggleOfflineMode: () => void;
  toggleNotifications: () => void;
  toggleAutoSave: () => void;
  toggleOfflineAccess: () => void;
  addMaterial: (m: Material) => void;
  deleteMaterial: (id: string) => void;
  renameMaterial: (id: string, name: string) => void;
  folders: Folder[];
  addFolder: (name: string) => void;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  moveMaterial: (materialId: string, folderId: string | null) => void;
  addReviewer: (r: Reviewer) => void;
  deleteReviewer: (id: string) => void;
  toggleBookmarkReviewer: (id: string) => void;
  addQuizResult: (r: QuizResult) => void;
  saveCurrentQuiz: () => void;
  toggleSavedQuiz: (id: string) => void;
  deleteGeneratedQuiz: (id: string) => void;
  openGeneratedQuiz: (id: string) => void;
  setCurrentMaterial: (id: string | null) => void;
  setCurrentReviewer: (id: string | null) => void;
  setCurrentQuiz: (q: AppState["currentQuiz"]) => void;
  setCurrentQuizAnswers: (a: Record<string, string>) => void;
  setPendingQuizResult: (r: QuizResult | null) => void;
  setQuizGenerationSource: (s: AppState["quizGenerationSource"]) => void;
  setQuizGenerationRequest: (r: AppState["quizGenerationRequest"]) => void;
  setReviewerGenerationRequest: (r: AppState["reviewerGenerationRequest"]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  showOverlay: (o: AppState["overlay"], data?: Record<string, unknown>) => void;
  hideOverlay: () => void;
  showAIConsent: (cb: () => void) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<NotificationItem, "id" | "read">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(() => getUserId());
  const [state, setState] = useState<AppState>({
    screen: "splash",
    screenStack: [],
    profile: { firstName: "", lastName: "", middleName: "", studentId: "", course: "", isSetupComplete: false },
    darkMode: false,
    offlineMode: false,
    notificationsEnabled: true,
    autoSave: true,
    offlineAccess: true,
    materials: [],
    folders: [],
    reviewers: [],
    quizHistory: [],
    generatedQuizzes: [],
    notifications: [],
    currentMaterialId: null,
    currentReviewerId: null,
    currentQuiz: null,
    currentQuizAnswers: {},
    pendingQuizResult: null,
    toast: null,
    overlay: null,
    overlayData: {},
    aiConsentCallback: null,
    quizGenerationSource: null,
    quizGenerationRequest: null,
    reviewerGenerationRequest: null,
  });

  useEffect(() => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`islearning-offline-${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(prev => ({ ...prev,
          generatedQuizzes: Array.isArray(parsed.generatedQuizzes) ? parsed.generatedQuizzes : prev.generatedQuizzes,
          reviewers: Array.isArray(parsed.reviewers) ? mergeReviewers(prev.reviewers, parsed.reviewers) : prev.reviewers,
        }));
      }
    } catch {}
  }, [userId]);

  const persistOffline = useCallback((patch: { generatedQuizzes?: QuizDocument[]; reviewers?: Reviewer[] }) => {
    if (!userId) return;
    try {
      const key = `islearning-offline-${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      localStorage.setItem(key, JSON.stringify({ ...existing, ...patch }));
    } catch {}
  }, [userId]);

  function mergeReviewers(primary: Reviewer[], secondary: Reviewer[]) {
    const map = new Map<string, Reviewer>();
    [...primary, ...secondary].forEach(r => map.set(r.id, r));
    return Array.from(map.values());
  }

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const data: any = await api("/api/state");
        if (!active) return;
        const profile = { firstName: data.profile?.firstName || "", middleName: data.profile?.middleName || "", lastName: data.profile?.lastName || "", email: data.profile?.email || "", studentId: data.profile?.studentId || "", course: data.profile?.course || "", isSetupComplete: !!data.profile?.isSetupComplete };
        setState(prev => ({ ...prev, screen: profile.isSetupComplete ? "home" : "profile-setup", screenStack: [], profile, materials: (data.materials || []).map((m: any) => ({ ...m, type: (m.type || "PDF").toUpperCase(), uploadedAt: m.uploadedAt || "", canGenerateAI: m.canGenerateAI !== false })), folders: data.folders || [], reviewers: mergeReviewers(data.reviewers || [], prev.reviewers), quizHistory: data.quizHistory || [], notifications: data.notifications || [], darkMode: !!data.settings?.darkMode, offlineMode: !!data.settings?.offlineMode, notificationsEnabled: data.settings?.notificationsEnabled !== false, autoSave: data.settings?.autoSave !== false, offlineAccess: data.settings?.offlineAccess !== false }));
      } catch {
        if (active) { setState(prev => ({ ...prev, screen: "home", screenStack: [] })); }
      }
    })();
    return () => { active = false; };
  }, [userId]);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await api<{userId:string; profile:any}>("/api/auth/login", { method:"POST", body: JSON.stringify({identifier, password}) });
    setUserId(result.userId); setUserIdState(result.userId);
    const profile: StudentProfile = { firstName: result.profile.firstName || "", middleName: result.profile.middleName || "", lastName: result.profile.lastName || "", studentId: result.profile.studentId || "", email: result.profile.email || identifier, course: result.profile.course || "", isSetupComplete: !!result.profile.isSetupComplete };
    setState(prev => ({...prev, profile, materials:[], folders:[], reviewers:[], quizHistory:[], generatedQuizzes:[], notifications:[], screenStack:[]}));
    try { const data:any = await api("/api/state"); setState(prev => ({...prev, materials:(data.materials||[]).map((m:any)=>({...m, type:(m.type||"PDF").toUpperCase(), uploadedAt:m.uploadedAt||"", canGenerateAI:m.canGenerateAI!==false})), folders:data.folders||[], reviewers:mergeReviewers(data.reviewers||[], prev.reviewers), quizHistory:data.quizHistory||[], notifications:data.notifications||[], profile:{...profile,...data.profile}, darkMode:!!data.settings?.darkMode, offlineMode:!!data.settings?.offlineMode, notificationsEnabled:data.settings?.notificationsEnabled!==false, autoSave:data.settings?.autoSave!==false, offlineAccess:data.settings?.offlineAccess!==false})); } catch {}
    return profile;
  }, []);
  const signUp = useCallback(async (data: { firstName:string; lastName:string; middleName:string; studentId:string; course:string; email:string; password:string }) => {
    const result = await api<{userId:string; profile:any}>("/api/auth/register", { method:"POST", body:JSON.stringify(data) });
    setUserId(result.userId); setUserIdState(result.userId);
    const profile: StudentProfile = {firstName:result.profile.firstName||data.firstName, middleName:result.profile.middleName||data.middleName, lastName:result.profile.lastName||data.lastName, studentId:result.profile.studentId||data.studentId, email:result.profile.email||data.email, course:result.profile.course||data.course, isSetupComplete:!!result.profile.isSetupComplete};
    setState(prev=>({...prev, profile, materials:[], folders:[], reviewers:[], quizHistory:[], generatedQuizzes:[], notifications:[], screenStack:[]})); return profile;
  }, []);
  const saveStudentProfile = useCallback(async (patch: Partial<StudentProfile>) => {
    const result:any = await api("/api/profile", {method:"PUT", body:JSON.stringify(patch)});
    setState(prev=>({...prev, profile:{...prev.profile,...result,...patch}}));
  }, []);

  const navigate = useCallback((screen: ScreenName) => {
    setState(prev => {
      const isGenerating = screen === "generating-reviewer" || screen === "generating-quiz";
      const fromGenerating = prev.screen === "generating-reviewer" || prev.screen === "generating-quiz";
      // Loading screens are transient: never put them in Back history.
      let stack = prev.screenStack;
      if (!isGenerating && fromGenerating) {
        stack = stack.filter(item => item !== "generating-reviewer" && item !== "generating-quiz");
        if (stack[stack.length - 1] === "quiz-generation" || stack[stack.length - 1] === "reviewer-generation") stack = stack.slice(0, -1);
      } else if (!isGenerating) {
        stack = [...stack, prev.screen];
      }
      return { ...prev, screen, screenStack: stack };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const stack = [...prev.screenStack];
      const prevScreen = stack.pop() || "home";
      return { ...prev, screen: prevScreen, screenStack: stack };
    });
  }, []);

  const setProfile = useCallback((p: Partial<StudentProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...p } }));
  }, []);

  const toggleDarkMode = useCallback(() => setState(prev => ({ ...prev, darkMode: !prev.darkMode })), []);
  const toggleOfflineMode = useCallback(() => setState(prev => ({ ...prev, offlineMode: !prev.offlineMode })), []);
  const toggleNotifications = useCallback(() => setState(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled })), []);
  const toggleAutoSave = useCallback(() => setState(prev => ({ ...prev, autoSave: !prev.autoSave })), []);
  const toggleOfflineAccess = useCallback(() => setState(prev => ({ ...prev, offlineAccess: !prev.offlineAccess })), []);

  const addMaterial = useCallback((m: Material) => setState(prev => ({ ...prev, materials: [m, ...prev.materials] })), []);
  const deleteMaterial = useCallback((id: string) => setState(prev => ({ ...prev, materials: prev.materials.filter(m => m.id !== id) })), []);
  const renameMaterial = useCallback((id: string, name: string) => setState(prev => ({ ...prev, materials: prev.materials.map(m => m.id === id ? { ...m, filename: name } : m) })), []);
  const addFolder = useCallback((name: string) => { if (userId) { void api<any>("/api/folders", {method:"POST", body:JSON.stringify({name})}).then(f=>setState(prev=>({...prev,folders:[{id:f.id,name:f.name,createdAt:f.createdAt||"Just now"},...prev.folders]}))).catch(e=>setState(prev=>({...prev,toast:{message:e.message||"Could not create folder",type:"error"}}))); return; } setState(prev=>({...prev,folders:[{id:`f${Date.now()}`,name,createdAt:"Just now"},...prev.folders]})); }, [userId]);
  const renameFolder = useCallback((id: string, name: string) => { if(userId) void api(`/api/folders/${encodeURIComponent(id)}`,{method:"PATCH",body:JSON.stringify({name})}).catch(e=>setState(prev=>({...prev,toast:{message:e.message,type:"error"}}))); setState(prev=>({...prev,folders:prev.folders.map(f=>f.id===id?{...f,name}:f)})); },[userId]);
  const deleteFolder = useCallback((id: string) => { if(userId) void api(`/api/folders/${encodeURIComponent(id)}`,{method:"DELETE"}).catch(e=>setState(prev=>({...prev,toast:{message:e.message,type:"error"}}))); setState(prev=>({...prev,folders:prev.folders.filter(f=>f.id!==id),materials:prev.materials.map(m=>m.folderId===id?{...m,folderId:null}:m)})); },[userId]);
  const moveMaterial = useCallback((materialId: string, folderId: string | null) => { if(userId) void api(`/api/materials/${encodeURIComponent(materialId)}/folder`,{method:"PATCH",body:JSON.stringify({folderId})}).catch(e=>setState(prev=>({...prev,toast:{message:e.message,type:"error"}}))); setState(prev=>({...prev,materials:prev.materials.map(m=>m.id===materialId?{...m,folderId}:m)})); },[userId]);
  const addReviewer = useCallback((r: Reviewer) => setState(prev => {
    const reviewers = [r, ...prev.reviewers.filter(existing => existing.sourceMaterialId !== r.sourceMaterialId)];
    persistOffline({ reviewers });
    return { ...prev, reviewers };
  }), [persistOffline]);
  const deleteReviewer = useCallback((id: string) => setState(prev => {
    const reviewers = prev.reviewers.filter(r => r.id !== id); persistOffline({ reviewers });
    return { ...prev, reviewers };
  }), [persistOffline]);
  const toggleBookmarkReviewer = useCallback((id: string) => setState(prev => {
    const reviewers = prev.reviewers.map(r => r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r); persistOffline({ reviewers });
    return { ...prev, reviewers };
  }), [persistOffline]);
  const addQuizResult = useCallback((r: QuizResult) => setState(prev => ({ ...prev, quizHistory: [r, ...prev.quizHistory] })), []);
  const saveCurrentQuiz = useCallback(() => setState(prev => {
    if (!prev.currentQuiz) return prev;
    const id = prev.currentQuiz.id || `quiz-${Date.now()}`;
    const prior = prev.generatedQuizzes.find(q => q.id === id);
    const doc: QuizDocument = { ...prev.currentQuiz, id, createdAt: prior?.createdAt || new Date().toISOString(), saved: true };
    const generatedQuizzes = [doc, ...prev.generatedQuizzes.filter(q => q.id !== id)];
    persistOffline({ generatedQuizzes });
    return { ...prev, currentQuiz: { ...prev.currentQuiz, id }, generatedQuizzes, toast: { message: "Quiz saved for offline access.", type: "success" } };
  }), [persistOffline]);
  const toggleSavedQuiz = useCallback((id: string) => setState(prev => {
    const generatedQuizzes = prev.generatedQuizzes.map(q => q.id === id ? { ...q, saved: !q.saved } : q); persistOffline({ generatedQuizzes });
    return { ...prev, generatedQuizzes, toast: { message: generatedQuizzes.find(q => q.id === id)?.saved ? "Quiz saved." : "Quiz removed from saved quizzes.", type: "success" } };
  }), [persistOffline]);
  const deleteGeneratedQuiz = useCallback((id: string) => setState(prev => {
    const generatedQuizzes = prev.generatedQuizzes.filter(q => q.id !== id); persistOffline({ generatedQuizzes });
    return { ...prev, generatedQuizzes, currentQuiz: prev.currentQuiz?.id === id ? null : prev.currentQuiz };
  }), [persistOffline]);
  const openGeneratedQuiz = useCallback((id: string) => setState(prev => {
    const quiz = prev.generatedQuizzes.find(q => q.id === id); if (!quiz) return prev;
    return { ...prev, currentQuiz: { id: quiz.id, title: quiz.title, sourceTitle: quiz.sourceTitle, questions: quiz.questions, quizType: quiz.quizType, difficulty: quiz.difficulty }, currentQuizAnswers: {}, screen: "quiz", screenStack: [...prev.screenStack, prev.screen] };
  }), []);

  const setCurrentMaterial = useCallback((id: string | null) => setState(prev => ({ ...prev, currentMaterialId: id })), []);
  const setCurrentReviewer = useCallback((id: string | null) => setState(prev => ({ ...prev, currentReviewerId: id })), []);
  const setCurrentQuiz = useCallback((q: AppState["currentQuiz"]) => setState(prev => {
    if (!q) return { ...prev, currentQuiz: null };
    const id = q.id || `quiz-${Date.now()}`;
    const existing = prev.generatedQuizzes.find(item => item.id === id);
    const doc: QuizDocument = { ...q, id, createdAt: existing?.createdAt || new Date().toISOString(), saved: existing?.saved || false };
    const generatedQuizzes = [doc, ...prev.generatedQuizzes.filter(item => item.id !== id)];
    persistOffline({ generatedQuizzes });
    return { ...prev, currentQuiz: { ...q, id }, generatedQuizzes };
  }), [persistOffline]);
  const setCurrentQuizAnswers = useCallback((a: Record<string, string>) => setState(prev => ({ ...prev, currentQuizAnswers: a })), []);
  const setPendingQuizResult = useCallback((r: QuizResult | null) => setState(prev => ({ ...prev, pendingQuizResult: r })), []);
  const setQuizGenerationSource = useCallback((s: AppState["quizGenerationSource"]) => setState(prev => ({ ...prev, quizGenerationSource: s })), []);
  const setQuizGenerationRequest = useCallback((r: AppState["quizGenerationRequest"]) => setState(prev => ({ ...prev, quizGenerationRequest: r })), []);
  const setReviewerGenerationRequest = useCallback((r: AppState["reviewerGenerationRequest"]) => setState(prev => ({ ...prev, reviewerGenerationRequest: r })), []);

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => {
    setState(prev => ({ ...prev, toast: { message: msg, type } }));
    setTimeout(() => setState(prev => ({ ...prev, toast: null })), 3200);
  }, []);

  const showOverlay = useCallback((o: AppState["overlay"], data: Record<string, unknown> = {}) => {
    setState(prev => ({ ...prev, overlay: o, overlayData: data }));
  }, []);

  const hideOverlay = useCallback(() => setState(prev => ({ ...prev, overlay: null, overlayData: {} })), []);

  const showAIConsent = useCallback((cb: () => void) => {
    setState(prev => ({ ...prev, aiConsentCallback: cb, overlay: "ai-consent" }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  }, []);

  const addNotification = useCallback((n: Omit<NotificationItem, "id" | "read">) => {
    setState(prev => ({ ...prev, notifications: [{ ...n, id: `n${Date.now()}`, read: false }, ...prev.notifications] }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, userId, signIn, signUp, saveStudentProfile, navigate, goBack, setProfile, toggleDarkMode, toggleOfflineMode, toggleNotifications, toggleAutoSave, toggleOfflineAccess, addMaterial, deleteMaterial, renameMaterial, addFolder, renameFolder, deleteFolder, moveMaterial, addReviewer, deleteReviewer, toggleBookmarkReviewer, addQuizResult, saveCurrentQuiz, toggleSavedQuiz, deleteGeneratedQuiz, openGeneratedQuiz, setCurrentMaterial, setCurrentReviewer, setCurrentQuiz, setCurrentQuizAnswers, setPendingQuizResult, setQuizGenerationSource, setQuizGenerationRequest, setReviewerGenerationRequest, showToast, showOverlay, hideOverlay, showAIConsent, markNotificationRead, addNotification }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
