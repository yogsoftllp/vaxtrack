import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type VaccinationStatus = "scheduled" | "completed" | "overdue" | "skipped" | "due_soon";

interface VaccinationStatusBadgeProps {
  status: VaccinationStatus;
  className?: string;
}

const statusConfig = {
  scheduled: {
    label: "Upcoming",
    icon: Calendar,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  due_soon: {
    label: "Due Soon",
    icon: Clock,
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  completed: {
    label: "Completed",
    icon: Check,
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  skipped: {
    label: "Skipped",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function VaccinationStatusBadge({ status, className }: VaccinationStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium border",
        config.className,
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function getVaccinationStatus(scheduledDate: string, administeredDate: string | null): VaccinationStatus {
  if (administeredDate) return "completed";
  
  const today = new Date();
  const scheduled = new Date(scheduledDate);
  const daysUntil = Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 14) return "due_soon";
  return "scheduled";
}
