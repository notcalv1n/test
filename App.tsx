import { useApp } from "./context/AppContext";
import StatusBar from "./components/StatusBar";
import Toast from "./components/Toast";
import AIConsentOverlay from "./components/overlays/AIConsentOverlay";
import DeleteConfirmOverlay from "./components/overlays/DeleteConfirmOverlay";
import RenameOverlay from "./components/overlays/RenameOverlay";

import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import HomeScreen from "./screens/HomeScreen";
import MaterialsScreen from "./screens/MaterialsScreen";
import FileDetailScreen from "./screens/FileDetailScreen";
import DocumentViewerScreen from "./screens/DocumentViewerScreen";
import GeneratingScreen from "./screens/GeneratingScreen";
import ReviewerScreen from "./screens/ReviewerScreen";
import ReviewerLibraryScreen from "./screens/ReviewerLibraryScreen";
import QuizGenerationScreen from "./screens/QuizGenerationScreen";
import ReviewerGenerationScreen from "./screens/ReviewerGenerationScreen";
import QuizScreen from "./screens/QuizScreen";
import QuizResultsScreen from "./screens/QuizResultsScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SearchScreen from "./screens/SearchScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import UploadScreen from "./screens/UploadScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import SavedQuizzesScreen from "./screens/SavedQuizzesScreen";

const SCREENS_WITH_STATUS_BAR = [
  "splash", "onboarding", "login", "create-account", "profile-setup",
  "home", "materials", "file-detail", "document-viewer", "reviewer-generation",
  "reviewer", "reviewer-library", "quiz-generation", "quiz", "saved-quizzes",
  "quiz-results", "progress", "profile", "settings",
  "search", "notifications", "upload", "edit-profile",
  "generating-reviewer", "generating-quiz",
];

function ScreenContent() {
  const { screen } = useApp();
  switch (screen) {
    case "splash": return <SplashScreen />;
    case "onboarding": return <OnboardingScreen />;
    case "login": return <LoginScreen />;
    case "create-account": return <CreateAccountScreen />;
    case "profile-setup": return <ProfileSetupScreen />;
    case "home": return <HomeScreen />;
    case "materials": return <MaterialsScreen />;
    case "file-detail": return <FileDetailScreen />;
    case "document-viewer": return <DocumentViewerScreen />;
    case "reviewer-generation": return <ReviewerGenerationScreen />;
    case "generating-reviewer": return <GeneratingScreen mode="reviewer" />;
    case "generating-quiz": return <GeneratingScreen mode="quiz" />;
    case "reviewer": return <ReviewerScreen />;
    case "reviewer-library": return <ReviewerLibraryScreen />;
    case "quiz-generation": return <QuizGenerationScreen />;
    case "saved-quizzes": return <SavedQuizzesScreen />;
    case "quiz": return <QuizScreen />;
    case "quiz-results": return <QuizResultsScreen />;
    case "progress": return <ProgressScreen />;
    case "profile": return <ProfileScreen />;
    case "settings": return <SettingsScreen />;
    case "search": return <SearchScreen />;
    case "notifications": return <NotificationsScreen />;
    case "upload": return <UploadScreen />;
    case "edit-profile": return <EditProfileScreen />;
    default: return <HomeScreen />;
  }
}

function App() {
  const { screen, overlay, darkMode, offlineMode } = useApp();
  const showStatus = SCREENS_WITH_STATUS_BAR.includes(screen);

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";

  return (
    <div className={`w-full h-full flex items-center justify-center ${darkMode ? "bg-[#050914]" : "bg-[#DBEAFE]"}`}>
      {/* Phone frame */}
      <div
        className={`relative flex flex-col overflow-hidden shadow-2xl ${darkMode ? "dark-mode" : ""}`}
        style={{
          width: 390,
          height: 844,
          maxWidth: "100vw",
          maxHeight: "100vh",
          borderRadius: 44,
          border: `2px solid ${darkMode ? "#1E293B" : "#BFDBFE"}`,
          boxShadow: `0 32px 80px rgba(0,0,0,${darkMode ? 0.7 : 0.3}), 0 0 0 1px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Status bar */}
        {showStatus && <StatusBar />}

        {/* Screen */}
        <div className={`flex-1 flex flex-col overflow-hidden ${bg}`}>
          <ScreenContent />
        </div>

        {/* Offline banner — sits below status bar inside screen content area */}
        {offlineMode && !["splash", "onboarding", "login"].includes(screen) && (
          <div className={`absolute top-[44px] left-3 right-3 z-50 flex items-center justify-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-bold shadow-lg fade-in ${darkMode ? "bg-[#2A1A10] text-coral border border-coral/20" : "bg-coral-light text-coral border border-coral/20"}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
            </svg>
            You're Offline · Saved content available
          </div>
        )}

        {/* Overlays */}
        {overlay === "ai-consent" && <AIConsentOverlay />}
        {overlay === "delete-confirm" && <DeleteConfirmOverlay />}
        {overlay === "rename" && <RenameOverlay />}

        {/* Toast */}
        <Toast />
      </div>
    </div>
  );
}

export default App;
