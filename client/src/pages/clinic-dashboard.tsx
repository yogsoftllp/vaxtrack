import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClinicStats {
  totalPatients: number;
  todayAppointments: number;
  overdueVaccines: number;
  completionRate: number;
}

interface Patient {
  id: string;
  childName: string;
  parentName: string;
  lastVisit: string;
  nextVaccine: string;
  nextVaccineDate: string;
  status: "up_to_date" | "due_soon" | "overdue";
}

interface Appointment {
  id: string;
  time: string;
  childName: string;
  parentName: string;
  vaccine: string;
  status: "scheduled" | "confirmed" | "completed";
}

export default function ClinicDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<ClinicStats>({
    queryKey: ["/api/clinic/stats"],
  });

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/clinic/patients"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/clinic/appointments/today"],
  });

  const statusColors = {
    up_to_date: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    due_soon: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    overdue: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const appointmentStatusColors = {
    scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    confirmed: "bg-green-500/10 text-green-600 dark:text-green-400",
    completed: "bg-muted text-muted-foreground",
  };

  const filteredPatients = patients?.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.childName.toLowerCase().includes(searchLower) ||
      patient.parentName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-clinic-greeting">
            Clinic Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage patients and vaccination records
          </p>
        </div>
        <Button className="gap-2" data-testid="button-add-patient">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Patients"
              value={stats?.totalPatients || 0}
              icon={Users}
              variant="info"
            />
            <StatCard
              title="Today's Appointments"
              value={stats?.todayAppointments || 0}
              icon={Calendar}
              variant="default"
            />
            <StatCard
              title="Overdue Vaccines"
              value={stats?.overdueVaccines || 0}
              icon={AlertTriangle}
              variant={stats?.overdueVaccines ? "danger" : "default"}
            />
            <StatCard
              title="Completion Rate"
              value={`${stats?.completionRate || 0}%`}
              icon={TrendingUp}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Today's Appointments</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {appointmentsLoading ? (
                <div className="divide-y divide-border">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                      <Skeleton className="h-10 w-16 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="divide-y divide-border">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 flex items-center gap-4 hover-elevate cursor-pointer">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-lg font-semibold text-foreground">{apt.time}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">{apt.childName}</p>
                          <Badge variant="outline" className={cn("text-xs", appointmentStatusColors[apt.status])}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {apt.vaccine} • Parent: {apt.parentName}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Check In
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No appointments today</h3>
                  <p className="text-muted-foreground text-sm">
                    Schedule appointments for your patients
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Vaccination Status</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-foreground">Up to date</span>
                </div>
                <span className="font-semibold text-foreground">
                  {patients?.filter((p) => p.status === "up_to_date").length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-foreground">Due soon</span>
                </div>
                <span className="font-semibold text-foreground">
                  {patients?.filter((p) => p.status === "due_soon").length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-foreground">Overdue</span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {patients?.filter((p) => p.status === "overdue").length || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-semibold mb-1">Need help?</h3>
              <p className="text-sm opacity-90 mb-4">
                Contact our support team for assistance with the platform
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Get Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Patients</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-patients"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {patientsLoading ? (
              <div className="divide-y divide-border">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="p-4 flex items-center gap-4 hover-elevate cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.childName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{patient.childName}</p>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", statusColors[patient.status])}
                        >
                          {patient.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Parent: {patient.parentName} • Last visit: {patient.lastVisit}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-foreground">
                        Next: {patient.nextVaccine}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.nextVaccineDate}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {searchQuery ? "No patients found" : "No patients yet"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery 
                    ? "Try a different search term" 
                    : "Add your first patient to get started"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
