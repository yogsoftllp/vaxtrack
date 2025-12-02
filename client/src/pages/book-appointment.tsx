import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react";
import type { AppointmentSlot, Child } from "@shared/schema";

export default function BookAppointment() {
  const [, params] = useRoute("/book-appointment/:clinicId");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const clinicId = params?.clinicId || "";

  const [selectedSlotId, setSelectedSlotId] = React.useState("");
  const [selectedChildId, setSelectedChildId] = React.useState("");

  // Fetch clinic details
  const { data: clinic, isLoading: clinicLoading } = useQuery({
    queryKey: ["/api/clinics", clinicId],
  });

  // Fetch available slots
  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/clinic", clinicId, "slots"],
  });

  // Fetch user's children
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
  }) as { data: Child[]; isLoading: boolean };

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: { slotId: string; childId: string }) => {
      return await apiRequest("POST", "/api/appointment/book", {
        slotId: data.slotId,
        childId: data.childId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clinic", clinicId, "slots"] });
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    },
  });

  const handleBookAppointment = () => {
    if (!selectedSlotId || !selectedChildId) {
      toast({
        title: "Error",
        description: "Please select both a slot and child",
        variant: "destructive",
      });
      return;
    }

    bookAppointmentMutation.mutate({ slotId: selectedSlotId, childId: selectedChildId });
  };

  if (clinicLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Clinic Info */}
      {clinic && (
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-clinic-name">{clinic.name}</CardTitle>
            {clinic.address && (
              <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span data-testid="text-clinic-address">{clinic.address}</span>
              </div>
            )}
            {clinic.phone && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${clinic.phone}`} className="hover:underline" data-testid="link-clinic-phone">
                  {clinic.phone}
                </a>
              </div>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Select Child */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Child</CardTitle>
          <CardDescription>Choose which child needs the vaccine</CardDescription>
        </CardHeader>
        <CardContent>
          {childrenLoading ? (
            <Skeleton className="h-10" />
          ) : (
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger data-testid="select-child">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id} data-testid={`option-child-${child.id}`}>
                    {child.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Select Time Slot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Slots</CardTitle>
          <CardDescription>Choose an available appointment time</CardDescription>
        </CardHeader>
        <CardContent>
          {slotsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No available slots at this clinic</p>
            </div>
          ) : (
            <div className="space-y-2">
              {slots.map((slot: AppointmentSlot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-4 border rounded-md cursor-pointer transition ${
                    selectedSlotId === slot.id
                      ? "bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700"
                      : "hover-elevate"
                  }`}
                  data-testid={`slot-${slot.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(slot.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {slot.capacity - slot.booked} of {slot.capacity} spots available
                      </div>
                    </div>
                    {selectedSlotId === slot.id && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" data-testid="icon-selected" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/clinics")} className="flex-1" data-testid="button-cancel">
          Cancel
        </Button>
        <Button
          onClick={handleBookAppointment}
          disabled={!selectedSlotId || !selectedChildId || bookAppointmentMutation.isPending}
          className="flex-1"
          data-testid="button-book-appointment"
        >
          {bookAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
}

import React from "react";
