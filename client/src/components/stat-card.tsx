import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive?: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
  },
  warning: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  danger: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
  },
  info: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <Card className={cn("", className)} data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-2" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
            {trend && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.positive ? "+" : ""}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
            styles.iconBg
          )}>
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
