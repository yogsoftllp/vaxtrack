import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return <Dashboard user={user} />;
}
