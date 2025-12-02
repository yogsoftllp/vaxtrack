import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Calendar, TrendingUp, MousePointer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ClinicReports() {
  const { user } = useAuth();
  const clinicId = user?.id;

  const { data: report, isLoading } = useQuery({
    queryKey: [`/api/clinic/reports/${clinicId}`],
  }) as { data?: any; isLoading: boolean };

  if (!clinicId) {
    return <div className="p-6 text-center text-muted-foreground">Not authorized</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const appointmentStatus = [
    { name: "Completed", value: report?.completedAppointments || 0, fill: "#10b981" },
    { name: "Cancelled", value: report?.cancelledAppointments || 0, fill: "#ef4444" },
  ];

  const statCards = [
    {
      title: "Total Patients",
      value: report?.totalPatients || 0,
      subtitle: `${report?.newPatients || 0} new`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Appointments",
      value: report?.completedAppointments || 0,
      subtitle: `${report?.totalAppointments || 0} total`,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Vaccinations",
      value: report?.totalVaccinations || 0,
      subtitle: "Total administered",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Ad Performance",
      value: report?.adClicks || 0,
      subtitle: `${report?.ctaRate}% CTR`,
      icon: MousePointer,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-reports">Clinic Reports</h1>
        <p className="text-muted-foreground mt-2">{report?.period || "Performance metrics"}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground" data-testid={`label-${card.title.toLowerCase()}`}>
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold mt-1" data-testid={`value-${card.title.toLowerCase()}`}>
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${card.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="heading-appointment-breakdown">Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={appointmentStatus} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {appointmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="heading-conversion">Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Appointment Conversion</span>
                <Badge variant="secondary">{report?.conversionRate}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${report?.conversionRate || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Ad Click Rate</span>
                <Badge variant="secondary">{report?.ctaRate}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${report?.ctaRate || 0}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ad Impressions</span>
                <span className="font-semibold">{report?.adImpressions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ad Clicks</span>
                <span className="font-semibold">{report?.adClicks || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      {report?.trend && report.trend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle data-testid="heading-trend">Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalAppointments" stroke="#3b82f6" name="Total Appointments" />
                <Line type="monotone" dataKey="totalVaccinations" stroke="#10b981" name="Vaccinations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" data-testid="button-export-pdf">
          Export PDF
        </Button>
        <Button data-testid="button-export-csv">
          Export CSV
        </Button>
      </div>
    </div>
  );
}
