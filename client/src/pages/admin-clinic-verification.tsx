import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminClinicVerification() {
  const { toast } = useToast();
  const { data: clinics, isLoading } = useQuery({
    queryKey: ["/api/admin/pending-clinic-verifications"],
  }) as { data?: any[]; isLoading: boolean };

  const handleVerify = async (clinicId: string, approved: boolean) => {
    try {
      await apiRequest("POST", "/api/admin/verify-clinic", {
        clinicId,
        approved,
        notes: approved ? "Approved" : "Not verified",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-clinic-verifications"] });
      toast({
        title: approved ? "Approved" : "Rejected",
        description: `Clinic has been ${approved ? "approved" : "rejected"}`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process verification", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-clinic-verification">Clinic Verification</h1>
        <p className="text-muted-foreground mt-2">Approve or reject pending clinic applications</p>
      </div>

      {clinics && clinics.length > 0 ? (
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <Card key={clinic.id} data-testid={`card-clinic-${clinic.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {clinic.firstName} {clinic.lastName}
                      <Badge variant="secondary" data-testid={`badge-status-${clinic.id}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </CardTitle>
                    <CardDescription>{clinic.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground" data-testid={`text-phone-${clinic.id}`}>Phone:</p>
                    <p className="text-muted-foreground">{clinic.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Auth Method:</p>
                    <p className="text-muted-foreground capitalize">{clinic.authProvider}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Country:</p>
                    <p className="text-muted-foreground">{clinic.country}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">City:</p>
                    <p className="text-muted-foreground">{clinic.city}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleVerify(clinic.id, true)}
                    className="gap-2 flex-1"
                    data-testid={`button-approve-${clinic.id}`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleVerify(clinic.id, false)}
                    className="gap-2 flex-1"
                    data-testid={`button-reject-${clinic.id}`}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-2">All Verified</p>
            <p className="text-muted-foreground">No pending clinic verifications</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
