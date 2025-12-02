import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notification-item";
import { Bell, CheckCheck, Trash2, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Notification } from "@shared/schema";

export default function Notifications() {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "All notifications marked as read",
      });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-notifications-title">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-notification-settings">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => {
                    if (!notification.read) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No notifications yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                You'll receive notifications about upcoming vaccinations, appointment reminders, and important updates here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
