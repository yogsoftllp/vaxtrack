import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Payments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  }) as { data?: any[]; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return <Badge>Paid</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-payments">Payments</h1>
        <p className="text-muted-foreground mt-2">View and manage your vaccination appointment payments</p>
      </div>

      {payments && payments.length > 0 ? (
        <div className="grid gap-4">
          {payments.map((payment: any) => (
            <Card key={payment.id} data-testid={`card-payment-${payment.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h3 className="font-semibold text-lg mb-1 capitalize" data-testid={`text-payment-type-${payment.id}`}>
                        {payment.type}
                      </h3>
                      <p className="text-sm text-muted-foreground">{payment.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" data-testid={`text-amount-${payment.id}`}>
                      ${(payment.amount / 100).toFixed(2)}
                    </p>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payments yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
