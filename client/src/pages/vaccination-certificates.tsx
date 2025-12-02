import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Eye, Share2, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function VaccinationCertificates() {
  const { user } = useAuth();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
  }) as { data?: any[]; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-certificates">Vaccination Certificates</h1>
        <p className="text-muted-foreground mt-2">Download and share your child's vaccination records</p>
      </div>

      {certificates && certificates.length > 0 ? (
        <div className="grid gap-4">
          {certificates.map((cert: any) => (
            <Card key={cert.id} data-testid={`card-certificate-${cert.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-lg" data-testid={`text-certificate-number-${cert.id}`}>
                        Certificate #{cert.certificateNumber}
                      </h3>
                      <Badge variant="default" data-testid={`badge-status-${cert.id}`}>
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Valid from {new Date(cert.validFrom).toLocaleDateString()}
                      {cert.validUntil && ` to ${new Date(cert.validUntil).toLocaleDateString()}`}
                    </p>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Vaccines Included:</p>
                      <div className="flex gap-2 flex-wrap">
                        {cert.vaccinesIncluded.map((vaccine: string) => (
                          <Badge key={vaccine} variant="secondary">
                            {vaccine}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" data-testid={`button-view-${cert.id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-download-${cert.id}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-share-${cert.id}`}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No vaccination certificates yet</p>
            <p className="text-sm text-muted-foreground">Certificates will appear here once vaccinations are completed</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
