import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
}

export default function AppointmentBooking() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const { data: clinics, isLoading: clinicsLoading } = useQuery<Clinic[]>({
    queryKey: ["/api/clinics/nearby"],
  });

  const { data: slots, isLoading: slotsLoading } = useQuery<TimeSlot[]>(
    {
      queryKey: ["/api/clinic/slots", selectedDate],
      enabled: !!selectedDate,
    },
  );

  const bookMutation = useMutation({
    mutationFn: async (slotId: string) => {
      return await apiRequest("POST", "/api/appointments/book", { slotId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clinic/slots"] });
      toast({ title: "Appointment booked successfully!" });
      setSelectedDate("");
      setSelectedSlot("");
    },
    onError: () => {
      toast({ title: "Failed to book appointment", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Book Appointment</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Schedule a clinic visit</p>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {/* Nearby Clinics */}
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-900 dark:text-white px-1">Nearby Clinics</h2>
          {clinicsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : clinics?.length ? (
            <div className="space-y-3">
              {clinics.map((clinic) => (
                <Card key={clinic.id} className="border-0 shadow-sm" data-testid={`card-clinic-${clinic.id}`}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{clinic.name}</h3>
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {clinic.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {clinic.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {clinic.openHours}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
                No clinics found in your area
              </CardContent>
            </Card>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="font-semibold text-slate-900 dark:text-white text-sm px-1" htmlFor="appointment-date">
            Select Date
          </label>
          <input
            id="appointment-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-0 bg-slate-100 dark:bg-slate-800"
            data-testid="input-appointment-date"
            aria-label="Select appointment date"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white px-1">Available Times</h3>
            {slotsLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : slots?.length ? (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot === slot.id ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="text-xs"
                    data-testid={`button-slot-${slot.id}`}
                    aria-label={`Select time slot ${slot.time}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
                  No available slots for this date
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Book Button */}
        {selectedSlot && (
          <Button
            onClick={() => bookMutation.mutate(selectedSlot)}
            disabled={bookMutation.isPending}
            className="w-full"
            data-testid="button-confirm-booking"
          >
            {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        )}
      </div>
    </div>
  );
}
