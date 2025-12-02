import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [smsProvider, setSmsProvider] = useState("twilio");
  const [pushProvider, setPushProvider] = useState("firebase");
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [smsApiKey, setSmsApiKey] = useState("");
  const [smsApiSecret, setSmsApiSecret] = useState("");
  const [pushApiKey, setPushApiKey] = useState("");
  const [paymentApiKey, setPaymentApiKey] = useState("");
  const [paymentApiSecret, setPaymentApiSecret] = useState("");
  const [features, setFeatures] = useState({
    smsNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    payments: false,
    vaccinationCertificates: false,
    multiChild: true,
    clinicDashboard: true,
    analytics: true,
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/admin/configuration"],
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/configuration", {
        smsProvider,
        smsApiKey,
        smsApiSecret,
        pushProvider,
        pushApiKey,
        paymentProvider,
        paymentApiKey,
        paymentApiSecret,
        featuresEnabled: features,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/configuration"] });
      toast({ title: "Configuration updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update configuration", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">System Configuration</h1>
      </div>

      {/* SMS Provider Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Provider</CardTitle>
          <CardDescription>Configure SMS notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sms-provider">Provider</Label>
            <Select value={smsProvider} onValueChange={setSmsProvider}>
              <SelectTrigger data-testid="select-sms-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sms-key">API Key</Label>
            <Input
              id="sms-key"
              type="password"
              placeholder="Enter API key"
              value={smsApiKey}
              onChange={(e) => setSmsApiKey(e.target.value)}
              data-testid="input-sms-api-key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sms-secret">API Secret</Label>
            <Input
              id="sms-secret"
              type="password"
              placeholder="Enter API secret"
              value={smsApiSecret}
              onChange={(e) => setSmsApiSecret(e.target.value)}
              data-testid="input-sms-api-secret"
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Provider Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notification Provider</CardTitle>
          <CardDescription>Configure web push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="push-provider">Provider</Label>
            <Select value={pushProvider} onValueChange={setPushProvider}>
              <SelectTrigger data-testid="select-push-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firebase">Firebase</SelectItem>
                <SelectItem value="onesignal">OneSignal</SelectItem>
                <SelectItem value="web">Web (Browser Native)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="push-key">API Key</Label>
            <Input
              id="push-key"
              type="password"
              placeholder="Enter API key"
              value={pushApiKey}
              onChange={(e) => setPushApiKey(e.target.value)}
              data-testid="input-push-api-key"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Provider Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Provider</CardTitle>
          <CardDescription>Configure payment processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-provider">Provider</Label>
            <Select value={paymentProvider} onValueChange={setPaymentProvider}>
              <SelectTrigger data-testid="select-payment-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-key">API Key</Label>
            <Input
              id="payment-key"
              type="password"
              placeholder="Enter API key"
              value={paymentApiKey}
              onChange={(e) => setPaymentApiKey(e.target.value)}
              data-testid="input-payment-api-key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-secret">API Secret</Label>
            <Input
              id="payment-secret"
              type="password"
              placeholder="Enter API secret"
              value={paymentApiSecret}
              onChange={(e) => setPaymentApiSecret(e.target.value)}
              data-testid="input-payment-api-secret"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable features globally</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, [key]: checked })
                  }
                  data-testid={`toggle-${key}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={() => updateMutation.mutate()}
        disabled={updateMutation.isPending}
        className="gap-2"
        data-testid="button-save-config"
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Configuration
          </>
        )}
      </Button>
    </div>
  );
}
