import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home,
  Plus,
  ChevronRight,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Zap,
  Users,
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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-greeting">
              {greeting()}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{user?.firstName || "there"}</p>
          </div>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <div className="relative">
                <Home className="h-5 w-5" />
                {stats?.overdueVaccines ? (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {stats.overdueVaccines}
                  </Badge>
                ) : null}
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {/* Stats Cards - Native Style */}
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Children</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalChildren || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.upcomingVaccines || 0}</p>
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.completedVaccines || 0}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions Required - Overdue Alert */}
        {stats?.overdueVaccines ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white px-1 text-sm">Actions Required</h3>
            <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {stats.overdueVaccines} overdue vaccine{stats.overdueVaccines > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Schedule them ASAP</p>
                </div>
                <Link href="/schedule">
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link href="/children/add" className="flex-1">
            <Button size="sm" className="w-full gap-2" data-testid="button-add-child">
              <Plus className="h-4 w-4" />
              Add Child
            </Button>
          </Link>
          <Link href="/schedule" className="flex-1">
            <Button size="sm" variant="outline" className="w-full gap-2" data-testid="button-view-schedule">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          </Link>
        </div>

        {/* Children Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Your Children</h2>
            <Link href="/children">
              <Button variant="ghost" size="sm" data-testid="button-view-all-children">
                View all
              </Button>
            </Link>
          </div>
          
          {childrenLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" aria-label="Loading children" />
              ))}
            </div>
          ) : children && children.length > 0 ? (
            <div className="space-y-3">
              {children.slice(0, 2).map((child) => (
                <Link key={child.id} href={`/children/${child.id}`}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all" data-testid={`card-child-${child.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{child.firstName}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {child.stats.completed}/{child.stats.total} vaccines
                          </p>
                        </div>
                        <div className="text-right">
                          {child.stats.overdue > 0 && (
                            <Badge variant="destructive" className="text-xs">{child.stats.overdue} overdue</Badge>
                          )}
                          {child.stats.overdue === 0 && child.stats.upcoming > 0 && (
                            <Badge className="text-xs">{child.stats.upcoming} upcoming</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${(child.stats.completed / child.stats.total) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">No children added yet</p>
                <Link href="/children/add">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Child
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Vaccines */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Next Vaccines</h2>
            <Link href="/schedule">
              <Button variant="ghost" size="sm" data-testid="button-view-all-vaccines">
                View all
              </Button>
            </Link>
          </div>
          
          {vaccinesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : upcomingVaccines && upcomingVaccines.length > 0 ? (
            <div className="space-y-3">
              {upcomingVaccines.slice(0, 3).map((vaccine) => (
                <Card key={vaccine.id} className="border-0 shadow-sm" data-testid={`card-vaccine-${vaccine.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{vaccine.vaccineName}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{vaccine.childName}</p>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 text-right">
                        {Math.ceil((new Date(vaccine.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">All caught up!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
