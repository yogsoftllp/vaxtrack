import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VaccinationStatusBadge, getVaccinationStatus } from "./vaccination-status-badge";
import { Calendar, Building2, ChevronRight, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VaccinationRecord } from "@shared/schema";

interface VaccinationCardProps {
  record: VaccinationRecord & {
    childName?: string;
  };
  onClick?: () => void;
  showChild?: boolean;
  className?: string;
}

const statusBorderColors: Record<string, string> = {
  scheduled: "border-l-blue-500",
  due_soon: "border-l-orange-500",
  completed: "border-l-green-500",
  overdue: "border-l-red-500",
  skipped: "border-l-muted",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysUntil(date: string): string {
  const today = new Date();
  const target = new Date(date);
  const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `In ${days} days`;
}

export function VaccinationCard({ record, onClick, showChild, className }: VaccinationCardProps) {
  const status = getVaccinationStatus(record.scheduledDate, record.administeredDate);
  
  return (
    <Card 
      className={cn(
        "border-l-4 hover-elevate cursor-pointer transition-all duration-200",
        statusBorderColors[status],
        className
      )}
      onClick={onClick}
      data-testid={`card-vaccination-${record.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Syringe className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground" data-testid={`text-vaccine-name-${record.id}`}>
                {record.vaccineName}
              </h3>
              {record.doseNumber > 0 && (
                <span className="text-xs text-muted-foreground">
                  Dose {record.doseNumber}
                </span>
              )}
            </div>
            
            {showChild && record.childName && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {record.childName}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(record.scheduledDate)}
                {status !== "completed" && (
                  <span className={cn(
                    "text-xs",
                    status === "overdue" ? "text-red-600 dark:text-red-400 font-medium" : ""
                  )}>
                    ({getDaysUntil(record.scheduledDate)})
                  </span>
                )}
              </span>
              {record.administeredBy && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {record.administeredBy}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <VaccinationStatusBadge status={status} />
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-view-vaccination-${record.id}`}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
