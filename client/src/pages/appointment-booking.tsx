import { useEffect, useState } from "react";

export default function AppointmentBooking() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((data) => {
        setClinics(Array.isArray(data) ? data : []);
        if (data.length > 0) setSelectedClinic(data[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    if (!selectedClinic || !selectedDate || !selectedTime) {
      setMessage("❌ Please fill all fields");
      return;
    }

    setBooking(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId: selectedClinic, dateTime: `${selectedDate}T${selectedTime}` }),
      });
      if (res.ok) {
        setMessage("✅ Appointment booked successfully!");
        setTimeout(() => {
          setSelectedDate("");
          setSelectedTime("");
          setMessage("");
        }, 2000);
      } else {
        setMessage("❌ Failed to book appointment");
      }
    } catch (error) {
      setMessage("❌ Error booking appointment");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p>Loading clinics...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Clinic Selection */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="clinic-select" data-testid="label-clinic">
              Select Clinic
            </label>
            <select
              id="clinic-select"
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="w-full p-3 border rounded-lg"
              data-testid="select-clinic"
            >
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} - {clinic.city}
                </option>
              ))}
            </select>
            {clinics.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  <div>📍 {clinics.find((c) => c.id === selectedClinic)?.city}</div>
                  <div>⏰ {clinics.find((c) => c.id === selectedClinic)?.operatingHours}</div>
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="date-input" data-testid="label-date">
              Select Date
            </label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border rounded-lg"
              data-testid="input-date"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="time-input" data-testid="label-time">
              Select Time
            </label>
            <input
              id="time-input"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border rounded-lg"
              data-testid="input-time"
            />
          </div>

          {/* Book Button */}
          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            data-testid="button-confirm-booking"
          >
            {booking ? "Booking..." : "📅 Confirm Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
