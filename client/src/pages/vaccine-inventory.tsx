import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Droplet } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function VaccineInventory() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: "",
    batchNumber: "",
    manufacturer: "",
    expiryDate: "",
    quantity: 0,
    costPerDose: 0,
    receivedDate: "",
    storageLocation: "",
  });

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  }) as { data?: any[]; isLoading: boolean };

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/inventory", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setFormData({
        vaccineName: "",
        batchNumber: "",
        manufacturer: "",
        expiryDate: "",
        quantity: 0,
        costPerDose: 0,
        receivedDate: "",
        storageLocation: "",
      });
      setIsAdding(false);
      toast({ title: "Success", description: "Vaccine stock added" });
    },
  });

  const handleAdd = async () => {
    try {
      await addMutation.mutateAsync(formData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add stock", variant: "destructive" });
    }
  };

  const getLowStockBadge = (qty: number) => {
    if (qty < 10) return <Badge variant="destructive">Low Stock</Badge>;
    if (qty < 20) return <Badge variant="secondary">Medium Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  const isExpiringSoon = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 30;
  };

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
        <h1 className="text-3xl font-bold" data-testid="heading-inventory">Vaccine Inventory</h1>
        <p className="text-muted-foreground mt-2">Manage vaccine stock, expiry dates, and lot numbers</p>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add Vaccine Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Vaccine Name"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                data-testid="input-vaccine-name"
              />
              <Input
                placeholder="Batch Number"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                data-testid="input-batch-number"
              />
              <Input
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                data-testid="input-manufacturer"
              />
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                data-testid="input-expiry-date"
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                data-testid="input-quantity"
              />
              <Input
                type="number"
                placeholder="Cost per dose"
                value={formData.costPerDose}
                onChange={(e) => setFormData({ ...formData, costPerDose: parseInt(e.target.value) })}
                data-testid="input-cost-per-dose"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} data-testid="button-add-stock">
                Add Stock
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} data-testid="button-cancel-add">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setIsAdding(!isAdding)} data-testid="button-new-stock">
        <Plus className="h-4 w-4 mr-2" />
        Add Vaccine Stock
      </Button>

      {inventory && inventory.length > 0 ? (
        <div className="grid gap-4">
          {inventory.map((item: any) => (
            <Card key={item.id} data-testid={`card-inventory-${item.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg" data-testid={`text-vaccine-name-${item.id}`}>
                        {item.vaccineName}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Batch #{item.batchNumber}</p>
                        <p className="font-medium">{item.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expiry</p>
                        <p className={isExpiringSoon(item.expiryDate) ? "text-red-600 font-medium" : "font-medium"}>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {getLowStockBadge(item.quantity)}
                      {isExpiringSoon(item.expiryDate) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary" data-testid={`text-quantity-${item.id}`}>
                      {item.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">doses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isAdding && (
          <Card>
            <CardContent className="p-12 text-center">
              <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vaccines in inventory</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
