import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { ChildCard } from "@/components/child-card";
import { VaccinationCard } from "@/components/vaccination-card";
import { ClinicAds } from "@/components/clinic-ads";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  ChevronRight,
  Calendar,
  Bell,
  Syringe
} from "lucide-react";
import type { Child, VaccinationRecord } from "@shared/schema";

interface DashboardStats {
  totalChildren: number;
  upcomingVaccines: number;
  overdueVaccines: number;
  completedVaccines: number;
}

interface ChildWithStats extends Child {
  stats: {
    total: number;
    completed: number;
    upcoming: number;
    overdue: number;
  };
}

interface UpcomingVaccine extends VaccinationRecord {
  childName: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: children, isLoading: childrenLoading } = useQuery<ChildWithStats[]>({
    queryKey: ["/api/children"],
  });

  const { data: upcomingVaccines, isLoading: vaccinesLoading } = useQuery<UpcomingVaccine[]>({
    queryKey: ["/api/vaccinations/upcoming"],
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-greeting">
            {greeting()}, {user?.firstName || "there"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your family's vaccination overview
          </p>
        </div>
        <Link href="/children/add">
          <Button className="gap-2" data-testid="button-add-child">
            <Plus className="h-4 w-4" />
            Add Child
          </Button>
        </Link>
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
              title="Children"
              value={stats?.totalChildren || 0}
              icon={Users}
              variant="info"
            />
            <StatCard
              title="Upcoming"
              value={stats?.upcomingVaccines || 0}
              subtitle="Next 30 days"
              icon={Calendar}
              variant="default"
            />
            <StatCard
              title="Overdue"
              value={stats?.overdueVaccines || 0}
              icon={AlertTriangle}
              variant={stats?.overdueVaccines ? "danger" : "default"}
            />
            <StatCard
              title="Completed"
              value={stats?.completedVaccines || 0}
              icon={CalendarCheck}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Promoted Clinics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4" data-testid="heading-promoted-clinics">
          Featured Clinics in Your Area
        </h2>
        <ClinicAds />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Children Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Children</h2>
            <Link href="/children">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-children">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {childrenLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : children && children.length > 0 ? (
            <div className="space-y-4">
              {children.slice(0, 3).map((child) => (
                <Link key={child.id} href={`/children/${child.id}`}>
                  <ChildCard 
                    child={child} 
                    stats={child.stats}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No children added yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Add your first child to start tracking their vaccinations
                </p>
                <Link href="/children/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Child
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Vaccinations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Vaccines</h2>
            <Link href="/schedule">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-schedule">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {vaccinesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingVaccines && upcomingVaccines.length > 0 ? (
            <div className="space-y-4">
              {upcomingVaccines.slice(0, 5).map((vaccine) => (
                <VaccinationCard
                  key={vaccine.id}
                  record={vaccine}
                  showChild
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
                <p className="text-muted-foreground text-sm">
                  No upcoming vaccines in the next 30 days
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your family's vaccinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/children/add">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Add Child</span>
              </Button>
            </Link>
            <Link href="/schedule">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">View Schedule</span>
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Bell className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Syringe className="h-5 w-5" />
                <span className="text-sm">Log Vaccine</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
