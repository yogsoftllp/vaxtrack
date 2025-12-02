import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Child } from "@shared/schema";

interface ChildCardProps {
  child: Child;
  stats?: {
    total: number;
    completed: number;
    upcoming: number;
    overdue: number;
  };
  onClick?: () => void;
  className?: string;
}

function getAge(dateOfBirth: string): string {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years}y ${remainingMonths}m`;
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

export function ChildCard({ child, stats, onClick, className }: ChildCardProps) {
  return (
    <Card 
      className={cn(
        "hover-elevate cursor-pointer transition-all duration-200",
        className
      )}
      onClick={onClick}
      data-testid={`card-child-${child.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
            <AvatarFallback 
              className={cn(
                "text-lg font-semibold",
                genderColors[child.gender || "other"]
              )}
            >
              {getInitials(child.firstName, child.lastName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate" data-testid={`text-child-name-${child.id}`}>
                {child.firstName} {child.lastName}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {getAge(child.dateOfBirth)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(child.dateOfBirth).toLocaleDateString()}
              </span>
              {child.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {child.city}, {child.country}
                </span>
              )}
            </div>
            
            {stats && (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground" data-testid={`text-completed-${child.id}`}>
                    {stats.completed} done
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground" data-testid={`text-upcoming-${child.id}`}>
                    {stats.upcoming} upcoming
                  </span>
                </div>
                {stats.overdue > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium" data-testid={`text-overdue-${child.id}`}>
                      {stats.overdue} overdue
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid={`button-view-child-${child.id}`}>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
