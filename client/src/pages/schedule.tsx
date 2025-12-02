import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaccinationStatusBadge, getVaccinationStatus } from "@/components/vaccination-status-badge";
import { 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Syringe,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import type { VaccinationRecord } from "@shared/schema";

interface VaccineWithChild extends VaccinationRecord {
  childName: string;
  childId: string;
}

export default function Schedule() {
  const [view, setView] = useState<"upcoming" | "all">("upcoming");

  const { data: vaccinations, isLoading } = useQuery<VaccineWithChild[]>({
    queryKey: ["/api/vaccinations/all"],
  });

  const overdueVaccinations = vaccinations?.filter((v) => {
    const status = getVaccinationStatus(v.scheduledDate, v.administeredDate);
    return status === "overdue";
  }) || [];

  const upcomingVaccinations = vaccinations?.filter((v) => {
    const status = getVaccinationStatus(v.scheduledDate, v.administeredDate);
    return status === "scheduled" || status === "due_soon";
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-schedule-title">
              Schedule
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">View all vaccines</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {/* Overdue Alert */}
        {overdueVaccinations.length > 0 && (
          <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {overdueVaccinations.length} overdue
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Schedule ASAP</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="upcoming" data-testid="tab-upcoming" className="rounded-lg">
            Upcoming ({upcomingVaccinations.length})
          </TabsTrigger>
          <TabsTrigger value="all" data-testid="tab-all" className="rounded-lg">
            All ({vaccinations?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3" role="status" aria-label="Loading vaccines">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : upcomingVaccinations.length > 0 ? (
            <div className="space-y-3">
              {upcomingVaccinations.map((vaccine) => {
                const status = getVaccinationStatus(vaccine.scheduledDate, vaccine.administeredDate);
                const daysUntil = Math.ceil((new Date(vaccine.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={vaccine.id} className="border-0 shadow-sm" data-testid={`card-vaccine-${vaccine.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          status === "due_soon" ? "bg-orange-100 dark:bg-orange-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                        }`}>
                          <Syringe className={`h-5 w-5 ${
                            status === "due_soon" ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {vaccine.vaccineName}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {vaccine.childName} • {new Date(vaccine.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <Badge className="text-xs" variant={status === "due_soon" ? "secondary" : "default"}>
                            {daysUntil > 0 ? `In ${daysUntil}d` : "Today"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">All caught up!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all" className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : vaccinations && vaccinations.length > 0 ? (
            <div className="space-y-3">
              {vaccinations.map((vaccine) => {
                const status = getVaccinationStatus(vaccine.scheduledDate, vaccine.administeredDate);
                
                return (
                  <Card key={vaccine.id} className="border-0 shadow-sm" data-testid={`card-vaccine-all-${vaccine.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          status === "overdue" ? "bg-red-100 dark:bg-red-900/30" :
                          status === "due_soon" ? "bg-orange-100 dark:bg-orange-900/30" :
                          status === "completed" ? "bg-green-100 dark:bg-green-900/30" :
                          "bg-blue-100 dark:bg-blue-900/30"
                        }`}>
                          <Syringe className={`h-5 w-5 ${
                            status === "overdue" ? "text-red-600 dark:text-red-400" :
                            status === "due_soon" ? "text-orange-600 dark:text-orange-400" :
                            status === "completed" ? "text-green-600 dark:text-green-400" :
                            "text-blue-600 dark:text-blue-400"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {vaccine.vaccineName}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {vaccine.childName} • {new Date(vaccine.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <VaccinationStatusBadge status={status} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <Syringe className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No vaccinations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </div>
    </div>
  );
}
