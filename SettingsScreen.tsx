import { useApp } from "../context/AppContext";

function Toggle({ value, onToggle, disabled }: { value: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      className={`relative w-12 h-6.5 rounded-full transition-all duration-300 pressable ${value ? "bg-sage" : "bg-gray-300"} ${disabled ? "opacity-40" : ""}`}
      style={{ height: 26 }}
    >
      <div className={`absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow transition-all duration-300 ${value ? "translate-x-6" : "translate-x-0.5"}`}
        style={{ width: 22, height: 22 }} />
    </button>
  );
}

export default function SettingsScreen() {
  const { goBack, navigate, darkMode, toggleDarkMode, notificationsEnabled, toggleNotifications, autoSave, toggleAutoSave, offlineAccess, toggleOfflineAccess, offlineMode, toggleOfflineMode, showToast } = useApp();

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const SECTIONS = [
    {
      title: "Preferences",
      items: [
        {
          label: "Dark Mode",
          desc: "Switch to a dark color scheme",
          icon: "🌙",
          toggle: true,
          value: darkMode,
          onToggle: () => { toggleDarkMode(); showToast(darkMode ? "Light Mode enabled." : "Dark Mode enabled.", "info"); },
        },
        {
          label: "Notifications",
          desc: notificationsEnabled ? "Notifications are enabled" : "Notifications are turned off",
          icon: "🔔",
          toggle: true,
          value: notificationsEnabled,
          onToggle: () => { toggleNotifications(); showToast(notificationsEnabled ? "Notifications turned off." : "Notifications enabled.", "info"); },
        },
        {
          label: "Auto-Save",
          desc: autoSave ? "Changes will be saved automatically" : "Auto-save is turned off",
          icon: "💾",
          toggle: true,
          value: autoSave,
          onToggle: () => { toggleAutoSave(); showToast(autoSave ? "Auto-save turned off." : "Auto-save enabled.", "info"); },
        },
        {
          label: "Offline Access",
          desc: "Access saved content without internet",
          icon: "📡",
          toggle: true,
          value: offlineAccess,
          onToggle: () => { toggleOfflineAccess(); showToast(offlineAccess ? "Offline access disabled." : "Offline access enabled.", "info"); },
        },
      ],
    },
    {
      title: "Simulate Offline Mode",
      items: [
        {
          label: "Offline Mode (Demo)",
          desc: offlineMode ? "App is simulating offline state" : "Simulate being offline",
          icon: "🔌",
          toggle: true,
          value: offlineMode,
          onToggle: () => { toggleOfflineMode(); showToast(offlineMode ? "You're back online." : "Offline mode activated.", offlineMode ? "success" : "info"); },
        },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Edit Profile", desc: "Update your student information", icon: "✏️", action: () => navigate("edit-profile") },
        { label: "Change Password", desc: "Update your account password", icon: "🔑", action: () => {} },
      ],
    },
    {
      title: "App",
      items: [
        { label: "Privacy Notice", desc: "How we handle your data", icon: "🔒", action: () => {} },
        { label: "Terms of Use", desc: "App usage policies", icon: "📋", action: () => {} },
        { label: "About ISLearning", desc: "Version 1.0 · SDCC", icon: "ℹ️", action: () => {} },
        { label: "Help & Support", desc: "Get assistance with the app", icon: "❓", action: () => {} },
      ],
    },
  ];

  return (
    <div className={`flex-1 flex flex-col ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]"}`}>
        <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center pressable text-sage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={`text-xl font-extrabold font-heading ${textPrimary}`}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4 space-y-5">
        {SECTIONS.map(({ title, items }) => (
          <div key={title}>
            <p className={`text-xs font-extrabold tracking-wider mb-2 ${textSecondary}`}>{title.toUpperCase()}</p>
            <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
              {items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-4 border-b last:border-0 ${darkMode ? "border-[#263244]" : "border-[#F1F5F9]"}`}
                >
                  <span className="text-xl w-8 flex items-center justify-center">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${textPrimary}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 truncate ${textSecondary}`}>{item.desc}</p>
                  </div>
                  {(item as { toggle?: boolean; value?: boolean; onToggle?: () => void }).toggle ? (
                    <Toggle
                      value={(item as { value: boolean }).value}
                      onToggle={(item as { onToggle: () => void }).onToggle}
                    />
                  ) : (
                    <button
                      onClick={(item as { action?: () => void }).action}
                      className="pressable text-sage"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className={`text-center text-xs pb-4 ${textSecondary}`}>
          ISLearning v1.0 · SDCC · Academic Module
        </p>
        <div className="h-2" />
      </div>
    </div>
  );
}
