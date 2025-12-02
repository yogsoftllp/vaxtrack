import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Pricing from "@/pages/pricing";
import Dashboard from "@/pages/dashboard";
import Children from "@/pages/children";
import AddChild from "@/pages/add-child";
import ChildDetail from "@/pages/child-detail";
import Schedule from "@/pages/schedule";
import Notifications from "@/pages/notifications";
import Settings from "@/pages/settings";
import ClinicDashboard from "@/pages/clinic-dashboard";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar 
          userRole={user?.role as "parent" | "clinic" || "parent"} 
          unreadNotifications={0}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route component={Landing} />
        </>
      ) : (
        <>
          <Route path="/">
            <AuthenticatedLayout>
              {user?.role === "clinic" ? <ClinicDashboard /> : <Dashboard />}
            </AuthenticatedLayout>
          </Route>
          <Route path="/children">
            <AuthenticatedLayout>
              <Children />
            </AuthenticatedLayout>
          </Route>
          <Route path="/children/add">
            <AuthenticatedLayout>
              <AddChild />
            </AuthenticatedLayout>
          </Route>
          <Route path="/children/:id">
            <AuthenticatedLayout>
              <ChildDetail />
            </AuthenticatedLayout>
          </Route>
          <Route path="/schedule">
            <AuthenticatedLayout>
              <Schedule />
            </AuthenticatedLayout>
          </Route>
          <Route path="/notifications">
            <AuthenticatedLayout>
              <Notifications />
            </AuthenticatedLayout>
          </Route>
          <Route path="/settings">
            <AuthenticatedLayout>
              <Settings />
            </AuthenticatedLayout>
          </Route>
          <Route path="/pricing" component={Pricing} />
          <Route path="/clinic">
            <AuthenticatedLayout>
              <ClinicDashboard />
            </AuthenticatedLayout>
          </Route>
          <Route>
            <AuthenticatedLayout>
              <NotFound />
            </AuthenticatedLayout>
          </Route>
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Router />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
