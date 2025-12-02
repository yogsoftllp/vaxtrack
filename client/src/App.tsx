import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import VaccinationRecords from "./pages/vaccination-records";
import ReferralRewards from "./pages/referral-rewards";
import ClinicAnalytics from "./pages/clinic-analytics";
import AppointmentBooking from "./pages/appointment-booking";
import Login from "./pages/login";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setUser(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user?.id) {
    return <Login onLoginSuccess={() => setUser({ id: "loading" })} />;
  }

  // Route rendering
  const renderPage = () => {
    switch (location) {
      case "/settings":
        return <Settings user={user} />;
      case "/vaccination-records":
        return <VaccinationRecords />;
      case "/referral-rewards":
        return <ReferralRewards />;
      case "/clinic-analytics":
        return <ClinicAnalytics />;
      case "/appointment-booking":
        return <AppointmentBooking />;
      default:
        return <Dashboard user={user} />;
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/", testid: "link-dashboard" },
    { label: "Records", path: "/vaccination-records", testid: "link-records" },
    { label: "Rewards", path: "/referral-rewards", testid: "link-rewards" },
    { label: "Booking", path: "/appointment-booking", testid: "link-booking" },
    { label: "Analytics", path: "/clinic-analytics", testid: "link-analytics" },
    { label: "Settings", path: "/settings", testid: "link-settings" },
  ];

  return (
    <div>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-blue-600">VaxTrack</h1>
            <a href="/auth/logout" className="px-3 py-2 rounded text-gray-600 hover:bg-gray-100" data-testid="link-logout">
              Logout
            </a>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`px-3 py-2 rounded whitespace-nowrap text-sm ${location === item.path ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                data-testid={item.testid}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {renderPage()}
    </div>
  );
}
