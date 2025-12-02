import { useEffect, useState } from "react";
import { SkeletonCard } from "../components/skeleton";

export default function ClinicAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clinic/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Clinic Analytics</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total-patients">
            <div className="text-gray-600 text-sm">Total Patients</div>
            <div className="text-3xl font-bold">{analytics?.totalPatients || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-completion-rate">
            <div className="text-gray-600 text-sm">Completion Rate</div>
            <div className="text-3xl font-bold text-green-600">{analytics?.completionRate || 0}%</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-overdue">
            <div className="text-gray-600 text-sm">Overdue Appointments</div>
            <div className="text-3xl font-bold text-red-600">{analytics?.overdueAppointments || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-this-week">
            <div className="text-gray-600 text-sm">Appointments This Week</div>
            <div className="text-3xl font-bold">{analytics?.appointmentsThisWeek || 0}</div>
          </div>
        </div>

        {/* Top Vaccines */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Most Administered Vaccines</h2>
          <ul className="space-y-3">
            {(analytics?.topVaccines || []).map((vaccine: any, i: number) => (
              <li key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded" data-testid={`vaccine-${i}`}>
                <span className="font-semibold">{vaccine.name}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">{vaccine.count} doses</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">7-Day Performance</h2>
          <div className="h-32 flex items-end justify-around gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t"
                style={{
                  height: `${Math.random() * 100}%`,
                  minHeight: "20px",
                }}
                data-testid={`chart-bar-${i}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
