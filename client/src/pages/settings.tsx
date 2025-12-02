import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  User, 
  Shield, 
  CreditCard,
  LogOut,
  Loader2,
  Check
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { User as UserType } from "@shared/schema";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [preferences, setPreferences] = useState({
    sms: user?.notificationPreferences?.sms ?? true,
    push: user?.notificationPreferences?.push ?? true,
    email: user?.notificationPreferences?.email ?? true,
    reminderDays: user?.notificationPreferences?.reminderDays ?? [7, 3, 1],
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: typeof preferences) => {
      await apiRequest("PATCH", "/api/user/preferences", { notificationPreferences: prefs });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    },
  });

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-settings-title">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and notification preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
          <CardDescription>
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={user?.profileImageUrl || undefined} 
                alt={user?.firstName || "User"} 
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground" data-testid="text-profile-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user?.subscriptionTier || 'Free'} Plan
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Country</Label>
                <p className="font-medium">{user?.country || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">City</Label>
                <p className="font-medium">{user?.city || "Not set"}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">{user?.phone || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to be reminded about vaccinations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive text message reminders
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.sms}
              onCheckedChange={(checked) => setPreferences({ ...preferences, sms: checked })}
              data-testid="switch-sms"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified on your device
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.push}
              onCheckedChange={(checked) => setPreferences({ ...preferences, push: checked })}
              data-testid="switch-push"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
              data-testid="switch-email"
            />
          </div>

          <Separator />

          {/* Reminder Timing */}
          <div>
            <Label className="mb-2 block">Reminder Timing</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Get reminders before scheduled vaccinations
            </p>
            <div className="flex flex-wrap gap-2">
              {[14, 7, 3, 1].map((days) => (
                <Badge
                  key={days}
                  variant={preferences.reminderDays.includes(days) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (preferences.reminderDays.includes(days)) {
                      setPreferences({
                        ...preferences,
                        reminderDays: preferences.reminderDays.filter((d) => d !== days),
                      });
                    } else {
                      setPreferences({
                        ...preferences,
                        reminderDays: [...preferences.reminderDays, days].sort((a, b) => b - a),
                      });
                    }
                  }}
                  data-testid={`badge-reminder-${days}`}
                >
                  {days === 1 ? "1 day before" : `${days} days before`}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSavePreferences}
            disabled={updatePreferencesMutation.isPending}
            className="w-full"
            data-testid="button-save-preferences"
          >
            {updatePreferencesMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Subscription</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Current Plan</p>
              <p className="text-sm text-muted-foreground capitalize">
                {user?.subscriptionTier || "Free"} Plan
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="outline" data-testid="button-upgrade">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <a href="/api/logout">
            <Button variant="outline" className="gap-2 text-destructive" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
