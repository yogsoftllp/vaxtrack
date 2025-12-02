import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

  const filteredPatients = patients?.filter((p) => {
    const search = searchQuery.toLowerCase();
    return p.childName.toLowerCase().includes(search) || p.parentName.toLowerCase().includes(search);
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "up_to_date": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "due_soon": return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "overdue": return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default: return "bg-slate-100 dark:bg-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-clinic-greeting">
              Clinic Dashboard
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{user?.firstName}</p>
          </div>
          <Button size="icon" data-testid="button-add-patient">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Patients</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalPatients || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Today</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.todayAppointments || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Overdue</p>
                <p className={`text-3xl font-bold ${stats?.overdueVaccines ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {stats?.overdueVaccines || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Rate</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.completionRate || 0}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Appointments */}
        <div className="space-y-3 pt-2">
          <h2 className="font-semibold text-slate-900 dark:text-white px-1">Today's Appointments</h2>
          
          {appointmentsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((apt) => (
                <Card key={apt.id} className="border-0 shadow-sm" data-testid={`card-appointment-${apt.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{apt.time}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{apt.childName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{apt.vaccine}</p>
                      </div>
                      <Badge className="text-xs" variant={apt.status === "confirmed" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">No appointments</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Patients Search */}
        <div className="space-y-3 pt-2">
          <h2 className="font-semibold text-slate-900 dark:text-white px-1">Patients</h2>
          
          {patients && patients.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-0 bg-slate-100 dark:bg-slate-800 text-sm"
                data-testid="input-search-patients"
              />
            </div>
          )}

          {patientsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : filteredPatients && filteredPatients.length > 0 ? (
            <div className="space-y-3">
              {filteredPatients.slice(0, 5).map((patient) => (
                <Card key={patient.id} className="border-0 shadow-sm" data-testid={`card-patient-${patient.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{patient.childName}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{patient.parentName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{patient.nextVaccine}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                        {patient.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">No patients</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
