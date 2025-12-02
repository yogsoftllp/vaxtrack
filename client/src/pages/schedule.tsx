import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaccinationCard } from "@/components/vaccination-card";
import { VaccinationStatusBadge, getVaccinationStatus } from "@/components/vaccination-status-badge";
import { 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  CalendarCheck,
  Syringe
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VaccinationRecord } from "@shared/schema";

interface VaccineWithChild extends VaccinationRecord {
  childName: string;
  childId: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"calendar" | "list">("list");

  const { data: vaccinations, isLoading } = useQuery<VaccineWithChild[]>({
    queryKey: ["/api/vaccinations/all"],
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getVaccinationsForMonth = () => {
    if (!vaccinations) return [];
    return vaccinations.filter((v) => {
      const date = new Date(v.scheduledDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  };

  const getVaccinationsForDate = (date: Date) => {
    if (!vaccinations) return [];
    return vaccinations.filter((v) => {
      const vDate = new Date(v.scheduledDate);
      return vDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  };

  const monthVaccinations = getVaccinationsForMonth();
  const overdueVaccinations = vaccinations?.filter((v) => {
    const status = getVaccinationStatus(v.scheduledDate, v.administeredDate);
    return status === "overdue";
  }) || [];

  const upcomingVaccinations = vaccinations?.filter((v) => {
    const status = getVaccinationStatus(v.scheduledDate, v.administeredDate);
    return status === "scheduled" || status === "due_soon";
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-schedule-title">
            Vaccination Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all vaccination appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            data-testid="button-list-view"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
            data-testid="button-calendar-view"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueVaccinations.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {overdueVaccinations.length} Overdue Vaccination{overdueVaccinations.length > 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-muted-foreground">
                Please schedule these vaccinations as soon as possible
              </p>
            </div>
            <Button variant="destructive" size="sm">
              View All
            </Button>
          </CardContent>
        </Card>
      )}

      {view === "list" ? (
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              Upcoming ({upcomingVaccinations.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" data-testid="tab-overdue">
              Overdue ({overdueVaccinations.length})
            </TabsTrigger>
            <TabsTrigger value="all" data-testid="tab-all">
              All ({vaccinations?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingVaccinations.length > 0 ? (
              <div className="space-y-4">
                {upcomingVaccinations.map((vaccine) => (
                  <VaccinationCard
                    key={vaccine.id}
                    record={vaccine}
                    showChild
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-muted-foreground text-sm">
                    No upcoming vaccinations scheduled
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            {overdueVaccinations.length > 0 ? (
              <div className="space-y-4">
                {overdueVaccinations.map((vaccine) => (
                  <VaccinationCard
                    key={vaccine.id}
                    record={vaccine}
                    showChild
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No overdue vaccinations</h3>
                  <p className="text-muted-foreground text-sm">
                    Great job keeping up with the schedule!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : vaccinations && vaccinations.length > 0 ? (
              <div className="space-y-4">
                {vaccinations.map((vaccine) => (
                  <VaccinationCard
                    key={vaccine.id}
                    record={vaccine}
                    showChild
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No vaccinations yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Add a child to generate their vaccination schedule
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <CardTitle className="text-lg">
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <Button variant="link" size="sm" onClick={goToToday} className="text-xs">
                  Today
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }
                
                const dayVaccinations = getVaccinationsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const hasOverdue = dayVaccinations.some((v) => 
                  getVaccinationStatus(v.scheduledDate, v.administeredDate) === "overdue"
                );
                const hasDueSoon = dayVaccinations.some((v) => 
                  getVaccinationStatus(v.scheduledDate, v.administeredDate) === "due_soon"
                );
                
                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "aspect-square p-1 rounded-lg border border-transparent",
                      isToday && "border-primary bg-primary/5",
                      dayVaccinations.length > 0 && "hover-elevate cursor-pointer"
                    )}
                  >
                    <div className="h-full flex flex-col">
                      <span className={cn(
                        "text-sm",
                        isToday && "font-bold text-primary"
                      )}>
                        {date.getDate()}
                      </span>
                      {dayVaccinations.length > 0 && (
                        <div className="flex-1 flex items-end justify-center gap-1 pb-1">
                          {dayVaccinations.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                hasOverdue ? "bg-red-500" :
                                hasDueSoon ? "bg-orange-500" : "bg-blue-500"
                              )}
                            />
                          ))}
                          {dayVaccinations.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{dayVaccinations.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
