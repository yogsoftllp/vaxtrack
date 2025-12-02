import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PushNotificationsSetup() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnablePushNotifications = async () => {
    setIsLoading(true);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        toast({
          title: "Not supported",
          description: "Push notifications are not supported in your browser",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
        });

        await fetch("/api/push-subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        setIsEnabled(true);
        toast({ title: "Push notifications enabled!" });
      } else {
        toast({
          title: "Permission denied",
          description: "Enable notifications in your browser settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to enable push notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="max-w-md mx-auto w-full sm:max-w-2xl">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Push Notifications</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Get instant alerts on your device</p>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-900 dark:text-white">Never Miss a Vaccine</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get instant notifications for upcoming vaccinations, appointment reminders, and important health updates.
              </p>
            </div>
            <Button
              onClick={handleEnablePushNotifications}
              disabled={isLoading || isEnabled}
              className="w-full gap-2"
              data-testid="button-enable-push"
              aria-label="Enable push notifications"
            >
              {isEnabled ? (
                <>
                  <Check className="h-4 w-4" />
                  Enabled
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  {isLoading ? "Enabling..." : "Enable Now"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {!isEnabled && (
          <Card className="border-0 shadow-sm bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-200">
                <p className="font-semibold mb-1">Browser notification permission required</p>
                <p>You'll be asked to allow notifications from VaxTrack.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">What you'll get notified about:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              Upcoming vaccine reminders
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              Appointment confirmations & reminders
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              Overdue vaccine alerts
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              Important system updates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
