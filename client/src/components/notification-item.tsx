import { cn } from "@/lib/utils";
import { Bell, Calendar, AlertTriangle, Settings, Syringe } from "lucide-react";
import type { Notification } from "@shared/schema";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  className?: string;
}

const typeConfig = {
  reminder: {
    icon: Syringe,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  appointment: {
    icon: Calendar,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
  },
  overdue: {
    icon: AlertTriangle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
  },
  system: {
    icon: Settings,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationItem({ notification, onClick, className }: NotificationItemProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        notification.read 
          ? "bg-transparent hover:bg-muted/50" 
          : "bg-primary/5 hover:bg-primary/10",
        className
      )}
      onClick={onClick}
      data-testid={`notification-item-${notification.id}`}
    >
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
        config.iconBg
      )}>
        <Icon className={cn("h-4 w-4", config.iconColor)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm truncate",
            notification.read ? "text-foreground" : "text-foreground font-medium"
          )} data-testid={`notification-title-${notification.id}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {notification.createdAt && formatRelativeTime(new Date(notification.createdAt))}
        </p>
      </div>
    </div>
  );
}
