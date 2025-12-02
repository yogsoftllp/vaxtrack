import { useEffect, useState } from "react";
import { SkeletonCard, SkeletonList } from "../components/skeleton";

export default function Dashboard({ user }: any) {
  const [stats, setStats] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/children").then((r) => r.json()),
      fetch("/api/vaccination-reminders").then((r) => r.json()),
    ]).then(([statsData, childrenData, remindersData]) => {
      setStats(statsData);
      setChildren(Array.isArray(childrenData) ? childrenData : []);
      setReminders(Array.isArray(remindersData) ? remindersData : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">VaxTrack Dashboard</h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonList count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">VaxTrack Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.firstName || "User"}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-children">
            <div className="text-gray-600 text-sm">Total Children</div>
            <div className="text-3xl font-bold">{stats?.totalChildren || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-completed">
            <div className="text-gray-600 text-sm">Completed Vaccines</div>
            <div className="text-3xl font-bold text-green-600">{stats?.completedVaccines || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-overdue">
            <div className="text-gray-600 text-sm">Overdue</div>
            <div className="text-3xl font-bold text-red-600">{stats?.overdueVaccines || 0}</div>
          </div>
        </div>

        {/* Actions Required */}
        {reminders.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8" data-testid="section-actions-required">
            <h2 className="text-xl font-bold mb-4">⚠️ Actions Required</h2>
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="p-3 bg-white rounded border-l-2 border-yellow-400" data-testid={`reminder-${reminder.id}`}>
                  <div className="font-semibold">{reminder.message}</div>
                  <div className="text-sm text-gray-600">{new Date(reminder.dueDate).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Children List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Your Children</h2>
          {children.length === 0 ? (
            <p className="text-gray-600">No children added yet</p>
          ) : (
            <ul className="space-y-2">
              {children.map((child) => (
                <li key={child.id} className="p-3 bg-gray-50 rounded" data-testid={`child-${child.id}`}>
                  {child.firstName} {child.lastName || ""}
                  <span className="text-gray-500 text-sm ml-2">({new Date(child.dateOfBirth).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
