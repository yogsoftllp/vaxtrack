import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Phone, DollarSign, FileText, Star, Loader2 } from "lucide-react";

interface ClinicWithPricing {
  id: string;
  name: string;
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  branding?: {
    logoUrl?: string;
    dashboardTitle?: string;
  };
  vaccinePricing?: Array<{
    vaccineName: string;
    vaccineCode: string;
    price: number;
    currency: string;
  }>;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export default function AIDashboard() {
  const { user } = useAuth();

  const { data: nearbyClinics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/nearby-clinics"],
  }) as { data?: ClinicWithPricing[] | { message: string; clinics: any[] }; isLoading: boolean };

  const clinicsData = Array.isArray(nearbyClinics) ? nearbyClinics : nearbyClinics?.clinics || [];
  const hasLocation = user?.city && user?.country;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground" data-testid="heading-ai-dashboard">
          Clinic Finder & Vaccine Pricing
        </h1>
        <p className="text-muted-foreground">
          Discover nearby clinics and compare vaccine prices in {user?.city}, {user?.country}
        </p>
      </div>

      {!hasLocation && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Please update your location in settings to see nearby clinics
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clinicsData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No clinics found in your area</p>
            <p className="text-sm text-muted-foreground">Clinics will appear here once they register in your city</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinicsData.map((clinic) => (
            <Card key={clinic.id} className="hover-elevate" data-testid={`card-clinic-${clinic.id}`}>
              <CardHeader className="pb-3">
                <div className="flex gap-3 items-start">
                  {clinic.branding?.logoUrl && (
                    <img
                      src={clinic.branding.logoUrl}
                      alt={clinic.name}
                      className="h-10 w-10 rounded object-contain"
                      data-testid={`img-clinic-logo-${clinic.id}`}
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`text-clinic-name-${clinic.id}`}>
                      {clinic.name}
                    </CardTitle>
                    {clinic.branding?.dashboardTitle && (
                      <CardDescription className="text-xs mt-1">
                        {clinic.branding.dashboardTitle}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Location */}
                {clinic.address && (
                  <div className="flex gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground" data-testid={`text-clinic-address-${clinic.id}`}>
                      {clinic.address}
                    </span>
                  </div>
                )}

                {/* Contact */}
                <div className="flex gap-2">
                  {clinic.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.location.href = `tel:${clinic.phone}`}
                      data-testid={`button-call-${clinic.id}`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  )}
                  {clinic.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.location.href = `mailto:${clinic.email}`}
                      data-testid={`button-email-${clinic.id}`}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  )}
                </div>

                {/* Pricing */}
                {clinic.priceRange ? (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-900 dark:text-blue-100" data-testid={`text-price-range-${clinic.id}`}>
                        {clinic.priceRange.currency} {clinic.priceRange.min.toFixed(2)} - {clinic.priceRange.max.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {clinic.vaccinePricing?.length || 0} vaccines with pricing
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-muted-foreground">No pricing information available</p>
                  </div>
                )}

                {/* Vaccine List */}
                {clinic.vaccinePricing && clinic.vaccinePricing.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Available Vaccines</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {clinic.vaccinePricing.slice(0, 5).map((vaccine) => (
                        <div key={vaccine.vaccineCode} className="flex justify-between items-center text-xs" data-testid={`item-vaccine-${vaccine.vaccineCode}`}>
                          <span className="text-muted-foreground">{vaccine.vaccineName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {vaccine.currency} {(vaccine.price / 100).toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                      {clinic.vaccinePricing.length > 5 && (
                        <p className="text-xs text-muted-foreground pt-2">
                          +{clinic.vaccinePricing.length - 5} more vaccines
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Website Link */}
                {clinic.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(clinic.website, "_blank")}
                    data-testid={`button-visit-website-${clinic.id}`}
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
