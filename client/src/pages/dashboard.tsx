import { useEffect, useState } from "react";

export default function Dashboard({ user }: any) {
  const [stats, setStats] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/children").then((r) => r.json()),
    ]).then(([statsData, childrenData]) => {
      setStats(statsData);
      setChildren(Array.isArray(childrenData) ? childrenData : []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">VaxTrack Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.firstName || "User"}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Children</div>
            <div className="text-3xl font-bold">{stats?.totalChildren || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Completed Vaccines</div>
            <div className="text-3xl font-bold text-green-600">{stats?.completedVaccines || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Overdue</div>
            <div className="text-3xl font-bold text-red-600">{stats?.overdueVaccines || 0}</div>
          </div>
        </div>

        {/* Children List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Your Children</h2>
          {children.length === 0 ? (
            <p className="text-gray-600">No children added yet</p>
          ) : (
            <ul className="space-y-2">
              {children.map((child) => (
                <li key={child.id} className="p-3 bg-gray-50 rounded">
                  {child.firstName} {child.lastName || ""}
                  <span className="text-gray-500 text-sm ml-2">
                    ({new Date(child.dateOfBirth).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
