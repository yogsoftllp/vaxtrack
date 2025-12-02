import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Palette } from "lucide-react";

export default function ClinicBranding() {
  const { clinicId } = useParams();
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1f2937");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
  const [loginPageText, setLoginPageText] = useState("");
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [reportFooterText, setReportFooterText] = useState("");
  const [features, setFeatures] = useState({
    smsNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    payments: false,
    bulkVaccinationUpdate: true,
  });

  const { data: branding, isLoading } = useQuery({
    queryKey: [`/api/admin/clinic/${clinicId}/branding`],
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/admin/clinic/${clinicId}/branding`, {
        logoUrl,
        primaryColor,
        secondaryColor,
        loginPageText,
        dashboardTitle,
        reportFooterText,
        featuresEnabled: features,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinic/${clinicId}/branding`] });
      toast({ title: "Branding updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update branding", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Clinic Branding & Customization</h1>
      </div>

      {/* Logo Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Images</CardTitle>
          <CardDescription>Upload clinic logo and customize appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              data-testid="input-logo-url"
            />
          </div>

          {logoUrl && (
            <div className="p-4 bg-muted rounded-lg">
              <img src={logoUrl} alt="Logo preview" className="h-20 object-contain" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize primary and secondary colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer border"
                  data-testid="input-primary-color"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#1f2937"
                  data-testid="input-primary-color-text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer border"
                  data-testid="input-secondary-color"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#3b82f6"
                  data-testid="input-secondary-color-text"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Text & Labels</CardTitle>
          <CardDescription>Customize text displayed throughout the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-text">Login Page Text</Label>
            <Textarea
              id="login-text"
              placeholder="Custom welcome message for login page"
              value={loginPageText}
              onChange={(e) => setLoginPageText(e.target.value)}
              rows={3}
              data-testid="textarea-login-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dashboard-title">Dashboard Title</Label>
            <Input
              id="dashboard-title"
              placeholder="e.g., Clinic Name Dashboard"
              value={dashboardTitle}
              onChange={(e) => setDashboardTitle(e.target.value)}
              data-testid="input-dashboard-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-footer">Report Footer Text</Label>
            <Textarea
              id="report-footer"
              placeholder="Custom footer text for vaccination reports"
              value={reportFooterText}
              onChange={(e) => setReportFooterText(e.target.value)}
              rows={3}
              data-testid="textarea-report-footer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Clinic-Specific Features</CardTitle>
          <CardDescription>Enable or disable features for this clinic</CardDescription>
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
                  data-testid={`toggle-clinic-${key}`}
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
        data-testid="button-save-branding"
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Branding
          </>
        )}
      </Button>
    </div>
  );
}
