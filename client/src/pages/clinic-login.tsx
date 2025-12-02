import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";

interface ClinicData {
  id: string;
  name: string;
  city?: string;
  country?: string;
}

interface BrandingData {
  logoUrl?: string;
}

export default function ClinicLogin() {
  const [clinicName, setClinicName] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<ClinicData | null>(null);
  const [, navigate] = useLocation();

  const { data: clinic, isLoading, isError } = useQuery({
    queryKey: ["/api/clinics/search", clinicName],
    enabled: clinicName.length > 2,
  }) as { data?: ClinicData; isLoading: boolean; isError: boolean };

  const { data: branding } = useQuery({
    queryKey: ["/api/clinics/branding", clinic?.id],
    enabled: !!clinic?.id,
  }) as { data?: BrandingData };

  const handleSelect = async () => {
    if (clinic) {
      setSelectedClinic(clinic);
      // Store clinic context and redirect to parent login
      sessionStorage.setItem("selectedClinic", JSON.stringify(clinic));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Clinic Admin Login</CardTitle>
          <CardDescription>Find your clinic to access your personalized dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clinic name..."
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="pl-10"
              data-testid="input-clinic-search"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {isError && clinicName.length > 2 && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm" data-testid="error-clinic-not-found">
              Clinic not found. Please check the name and try again.
            </div>
          )}

          {clinic && (
            <div className="space-y-3">
              <div className="p-4 border rounded-lg space-y-2 bg-card">
                <div>
                  <p className="font-medium" data-testid="text-clinic-name">{clinic.name}</p>
                  {clinic.city && <p className="text-sm text-muted-foreground">{clinic.city}, {clinic.country}</p>}
                </div>
                {branding?.logoUrl && (
                  <img src={branding.logoUrl} alt="Clinic logo" className="h-10 object-contain" data-testid="img-clinic-logo" />
                )}
              </div>
              <Button onClick={handleSelect} className="w-full" data-testid="button-select-clinic">
                Select This Clinic
              </Button>
            </div>
          )}

          {!clinic && clinicName.length > 2 && !isLoading && !isError && (
            <p className="text-sm text-muted-foreground text-center">Searching clinics...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
