import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ClinicData {
  id: string;
  name: string;
  city?: string;
  country?: string;
  customDomain?: string;
}

interface BrandingData {
  logoUrl?: string;
  primaryColor?: string;
  loginPageText?: string;
  dashboardTitle?: string;
}

export default function DomainClinicLogin() {
  const [match, params] = useRoute("/clinic/:domain");
  const domain = params?.domain as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: clinic, isLoading, isError } = useQuery({
    queryKey: ["/api/clinics/domain", domain],
    enabled: !!domain && mounted,
  }) as { data?: ClinicData; isLoading: boolean; isError: boolean };

  const { data: branding } = useQuery({
    queryKey: ["/api/clinics/branding", clinic?.id],
    enabled: !!clinic?.id,
  }) as { data?: BrandingData };

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Clinic Not Found</CardTitle>
            <CardDescription>This clinic domain is not registered in our system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Please contact your administrator or use the clinic search.</p>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full" data-testid="button-go-back">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${branding?.primaryColor || "#3b82f6"}15 0%, ${branding?.primaryColor || "#3b82f6"}05 100%)`
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          {branding?.logoUrl && (
            <img 
              src={branding.logoUrl} 
              alt={clinic.name} 
              className="h-12 w-auto mx-auto"
              data-testid="img-clinic-domain-logo"
            />
          )}
          <div>
            <CardTitle className="text-2xl" data-testid="text-clinic-domain-name">{clinic.name}</CardTitle>
            {branding?.loginPageText && (
              <CardDescription className="mt-2" data-testid="text-clinic-login-description">
                {branding.loginPageText}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {clinic.city && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Location:</span> {clinic.city}
              {clinic.country && `, ${clinic.country}`}
            </div>
          )}
          <Button 
            className="w-full" 
            onClick={() => {
              sessionStorage.setItem("selectedClinic", JSON.stringify(clinic));
              window.location.href = "/";
            }}
            data-testid="button-continue-clinic-domain"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
