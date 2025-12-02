import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SuperAdminSmsConfig() {
  const { toast } = useToast();
  const [provider, setProvider] = useState<"twilio" | "firebase">("firebase");
  const [twilioData, setTwilioData] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    twilioWhatsappNumber: "",
  });
  const [firebaseData, setFirebaseData] = useState({
    firebaseProjectId: "",
    firebasePrivateKey: "",
    firebaseClientEmail: "",
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/superadmin/sms-config"],
  }) as { data?: any; isLoading: boolean };

  const handleSave = async () => {
    try {
      const payload =
        provider === "twilio"
          ? { provider, ...twilioData }
          : { provider, ...firebaseData };

      await apiRequest("POST", "/api/superadmin/sms-config", payload);
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/sms-config"] });
      toast({ title: "Saved", description: `${provider} configuration updated` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save configuration", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-sms-config">SMS Provider Configuration</h1>
        <p className="text-muted-foreground mt-2">Configure OTP delivery for phone authentication</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            SMS Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={provider} onValueChange={(v) => setProvider(v as any)} data-testid="tabs-providers">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="firebase" data-testid="tab-firebase">Firebase</TabsTrigger>
              <TabsTrigger value="twilio" data-testid="tab-twilio">Twilio</TabsTrigger>
            </TabsList>

            {/* Firebase Tab */}
            <TabsContent value="firebase" className="space-y-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-100">
                Firebase is the recommended provider for SMS delivery
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" data-testid="label-firebase-project">
                  Project ID
                </label>
                <Input
                  value={firebaseData.firebaseProjectId}
                  onChange={(e) => setFirebaseData({ ...firebaseData, firebaseProjectId: e.target.value })}
                  placeholder="your-project-id"
                  data-testid="input-firebase-project"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Client Email</label>
                <Input
                  value={firebaseData.firebaseClientEmail}
                  onChange={(e) => setFirebaseData({ ...firebaseData, firebaseClientEmail: e.target.value })}
                  placeholder="service-account@project.iam.gserviceaccount.com"
                  data-testid="input-firebase-email"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Private Key</label>
                <textarea
                  value={firebaseData.firebasePrivateKey}
                  onChange={(e) => setFirebaseData({ ...firebaseData, firebasePrivateKey: e.target.value })}
                  placeholder="-----BEGIN PRIVATE KEY-----..."
                  data-testid="textarea-firebase-key"
                  className="w-full h-32 p-2 border rounded-md text-sm font-mono bg-muted"
                />
              </div>
            </TabsContent>

            {/* Twilio Tab */}
            <TabsContent value="twilio" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground">Account SID</label>
                  <Input
                    value={twilioData.twilioAccountSid}
                    onChange={(e) => setTwilioData({ ...twilioData, twilioAccountSid: e.target.value })}
                    placeholder="AC..."
                    data-testid="input-twilio-sid"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Auth Token</label>
                  <Input
                    type="password"
                    value={twilioData.twilioAuthToken}
                    onChange={(e) => setTwilioData({ ...twilioData, twilioAuthToken: e.target.value })}
                    placeholder="••••••••"
                    data-testid="input-twilio-token"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">SMS Phone Number</label>
                  <Input
                    value={twilioData.twilioPhoneNumber}
                    onChange={(e) => setTwilioData({ ...twilioData, twilioPhoneNumber: e.target.value })}
                    placeholder="+1234567890"
                    data-testid="input-twilio-phone"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">WhatsApp Number</label>
                  <Input
                    value={twilioData.twilioWhatsappNumber}
                    onChange={(e) => setTwilioData({ ...twilioData, twilioWhatsappNumber: e.target.value })}
                    placeholder="+1234567890"
                    data-testid="input-twilio-whatsapp"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="gap-2 flex-1" data-testid="button-save-config">
              <Send className="h-4 w-4" />
              Save Configuration
            </Button>
            {config?.provider && (
              <Badge variant="secondary" data-testid="badge-active-provider">
                Active: {config.provider}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
