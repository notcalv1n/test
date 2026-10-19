import { useApp } from "../context/AppContext";

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, goBack, navigate, darkMode } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const bg = darkMode ? "bg-[#0B1220]" : "bg-sage-lighter";
  const cardBg = darkMode ? "bg-[#111827] border-[#263244]" : "bg-white border-[#DBEAFE]";
  const textPrimary = darkMode ? "text-sage-light" : "text-[#111827]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  const typeColors = {
    success: darkMode ? "bg-success/15 text-success" : "bg-success-light text-success",
    info: darkMode ? "bg-muted-blue/15 text-muted-blue" : "bg-muted-blue-light text-muted-blue",
    warning: darkMode ? "bg-mustard/15 text-mustard" : "bg-mustard-light text-mustard",
  };
  const typeIcons = { success: "✅", info: "ℹ️", warning: "⚠️" };

  const markAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id));
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
        <div className="flex-1">
          <h1 className={`text-xl font-extrabold font-heading ${textPrimary}`}>Notifications</h1>
          {unreadCount > 0 && <p className={`text-xs ${textSecondary}`}>{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-bold text-sage pressable">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scroll-y px-5 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center text-3xl mb-4">🔔</div>
            <p className={`text-base font-bold mb-1 font-heading ${textPrimary}`}>No notifications</p>
            <p className={`text-xs ${textSecondary}`}>You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all pressable ${
                  n.read
                    ? cardBg
                    : darkMode ? "bg-sage/10 border-sage/30" : "bg-sage-light border-sage-100"
                }`}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${typeColors[n.type]}`}>
                  {typeIcons[n.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${n.read ? textSecondary : textPrimary}`}>
                    {n.message}
                  </p>
                  <p className={`text-xs mt-1 ${textSecondary}`}>{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-2.5 h-2.5 bg-sage rounded-full shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}
