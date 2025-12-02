import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <a href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </a>
      </div>
    );
  }

  // Simple routing
  const showSettings = location === "/settings";

  return (
    <div>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">VaxTrack</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setLocation("/")}
              className={`px-3 py-2 rounded ${!showSettings ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
              data-testid="link-dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={() => setLocation("/settings")}
              className={`px-3 py-2 rounded ${showSettings ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
              data-testid="link-settings"
            >
              Settings
            </button>
            <a
              href="/auth/logout"
              className="px-3 py-2 rounded text-gray-600 hover:bg-gray-100"
              data-testid="link-logout"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>

      {showSettings ? <Settings user={user} /> : <Dashboard user={user} />}
    </div>
  );
}
