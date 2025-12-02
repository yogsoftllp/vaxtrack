import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaccinationCard } from "@/components/vaccination-card";
import { VaccinationStatusBadge, getVaccinationStatus } from "@/components/vaccination-status-badge";
import { StatCard } from "@/components/stat-card";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Edit2, 
  Trash2, 
  Syringe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarCheck,
  Droplets,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Child, VaccinationRecord } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ChildWithRecords extends Child {
  vaccinationRecords: VaccinationRecord[];
}

function getAge(dateOfBirth: string): string {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''} old`;
  }
  return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`;
}

function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

const genderColors: Record<string, string> = {
  male: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  female: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  other: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
};

export default function ChildDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: child, isLoading, error } = useQuery<ChildWithRecords>({
    queryKey: ["/api/children", id],
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/children/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/children"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Child removed",
        description: "The child profile has been deleted",
      });
      navigate("/children");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete child",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Child not found</h3>
            <p className="text-muted-foreground mb-4">
              The child profile you're looking for doesn't exist or has been deleted
            </p>
            <Link href="/children">
              <Button>Go back to children</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const records = child.vaccinationRecords || [];
  const completedRecords = records.filter((r) => r.status === "completed");
  const upcomingRecords = records.filter((r) => {
    const status = getVaccinationStatus(r.scheduledDate, r.administeredDate);
    return status === "scheduled" || status === "due_soon";
  });
  const overdueRecords = records.filter((r) => {
    const status = getVaccinationStatus(r.scheduledDate, r.administeredDate);
    return status === "overdue";
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/children">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
            <AvatarFallback 
              className={cn(
                "text-xl font-semibold",
                genderColors[child.gender || "other"]
              )}
            >
              {getInitials(child.firstName, child.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-child-name">
              {child.firstName} {child.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {getAge(child.dateOfBirth)}
              </span>
              {child.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {child.city}, {child.country}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/children/${id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-edit-child">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive" data-testid="button-delete-child">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete child profile?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {child.firstName}'s profile and all their vaccination records. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vaccines"
          value={records.length}
          icon={Syringe}
          variant="info"
        />
        <StatCard
          title="Completed"
          value={completedRecords.length}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Upcoming"
          value={upcomingRecords.length}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Overdue"
          value={overdueRecords.length}
          icon={AlertTriangle}
          variant={overdueRecords.length > 0 ? "danger" : "default"}
        />
      </div>

      {/* Medical Info */}
      {(child.bloodType || child.allergies) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            {child.bloodType && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Blood Type:</span>
                <Badge variant="outline">{child.bloodType}</Badge>
              </div>
            )}
            {child.allergies && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <span className="text-sm text-muted-foreground">Allergies:</span>
                  <p className="text-sm text-foreground">{child.allergies}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vaccination Records */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({records.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcomingRecords.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" data-testid="tab-overdue">
            Overdue ({overdueRecords.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({completedRecords.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {records.length > 0 ? (
            records.map((record) => (
              <VaccinationCard key={record.id} record={record} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No vaccinations scheduled</h3>
                <p className="text-muted-foreground text-sm">
                  Vaccination schedule will be generated based on the country guidelines
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingRecords.length > 0 ? (
            upcomingRecords.map((record) => (
              <VaccinationCard key={record.id} record={record} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No upcoming vaccinations</h3>
                <p className="text-muted-foreground text-sm">
                  All scheduled vaccinations have been completed
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueRecords.length > 0 ? (
            overdueRecords.map((record) => (
              <VaccinationCard key={record.id} record={record} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No overdue vaccinations</h3>
                <p className="text-muted-foreground text-sm">
                  Great job keeping up with the vaccination schedule!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRecords.length > 0 ? (
            completedRecords.map((record) => (
              <VaccinationCard key={record.id} record={record} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No completed vaccinations yet</h3>
                <p className="text-muted-foreground text-sm">
                  Mark vaccinations as complete after each appointment
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
