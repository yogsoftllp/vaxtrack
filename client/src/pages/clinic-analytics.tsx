import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, CalendarCheck, AlertTriangle } from "lucide-react";

interface AnalyticsData {
  totalPatients: number;
  completionRate: number;
  overdueCount: number;
  appointmentsThisMonth: number;
  topVaccines: Array<{ name: string; count: number }>;
  monthlyTrend: Array<{ month: string; completed: number; scheduled: number }>;
}

export default function ClinicAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/clinic/analytics"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Clinic performance metrics</p>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics?.totalPatients || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics?.completionRate || 0}%</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Overdue</p>
                  <p className={`text-3xl font-bold ${analytics?.overdueCount ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {analytics?.overdueCount || 0}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics?.appointmentsThisMonth || 0}</p>
                </CardContent>
              </Card>
            </div>

            {analytics?.topVaccines && analytics.topVaccines.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Top Vaccines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.topVaccines.slice(0, 5).map((vaccine, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{vaccine.name}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{vaccine.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
