import { useEffect, useState } from "react";

export default function Settings({ user }: any) {
  const [preferences, setPreferences] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.notificationPreferences) {
          setPreferences(data.notificationPreferences);
        } else {
          setPreferences({ sms: true, push: true, email: true, reminderDays: [7, 3, 1] });
        }
      })
      .catch(() => setPreferences({ sms: true, push: true, email: true, reminderDays: [7, 3, 1] }));
  }, []);

  const handleToggle = (key: string) => {
    setPreferences((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReminderDayToggle = (day: number) => {
    setPreferences((prev: any) => {
      const days = prev.reminderDays || [];
      return {
        ...prev,
        reminderDays: days.includes(day) ? days.filter((d: number) => d !== day) : [...days, day].sort((a, b) => b - a),
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (res.ok) {
        setMessage("✅ Preferences saved successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to save preferences");
      }
    } catch (error) {
      setMessage("❌ Error saving preferences");
    } finally {
      setSaving(false);
    }
  };

  if (!preferences) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your notification preferences</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Notification Channels */}
          <div>
            <h2 className="text-lg font-bold mb-4">Notification Channels</h2>
            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-testid="toggle-sms">
                <input
                  type="checkbox"
                  checked={preferences.sms || false}
                  onChange={() => handleToggle("sms")}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3">
                  <div className="font-semibold">SMS Notifications</div>
                  <div className="text-sm text-gray-600">Receive vaccine reminders via SMS</div>
                </span>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-testid="toggle-push">
                <input
                  type="checkbox"
                  checked={preferences.push || false}
                  onChange={() => handleToggle("push")}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3">
                  <div className="font-semibold">Push Notifications</div>
                  <div className="text-sm text-gray-600">Receive browser notifications</div>
                </span>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-testid="toggle-email">
                <input
                  type="checkbox"
                  checked={preferences.email || false}
                  onChange={() => handleToggle("email")}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3">
                  <div className="font-semibold">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive vaccine reminders via email</div>
                </span>
              </label>
            </div>
          </div>

          {/* Reminder Days */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-bold mb-4">Reminder Days Before Vaccination</h2>
            <div className="space-y-3">
              {[7, 3, 1].map((day) => (
                <label key={day} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-testid={`toggle-reminder-${day}`}>
                  <input
                    type="checkbox"
                    checked={(preferences.reminderDays || []).includes(day)}
                    onChange={() => handleReminderDayToggle(day)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-3 font-semibold">
                    {day} day{day > 1 ? "s" : ""} before
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              data-testid="button-save-preferences"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
