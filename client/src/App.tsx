import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";

// Keep critical pages in main bundle
import NotFound from "@/pages/not-found";
import LandingMobile from "@/pages/landing-mobile";
import ClinicLogin from "@/pages/clinic-login";

// Lazy load secondary pages to reduce main bundle
const Landing = lazy(() => import("@/pages/landing"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Children = lazy(() => import("@/pages/children"));
const AddChild = lazy(() => import("@/pages/add-child"));
const ChildDetail = lazy(() => import("@/pages/child-detail"));
const Schedule = lazy(() => import("@/pages/schedule"));
const Notifications = lazy(() => import("@/pages/notifications"));
const Settings = lazy(() => import("@/pages/settings"));
const ClinicDashboard = lazy(() => import("@/pages/clinic-dashboard"));
const AdminSettings = lazy(() => import("@/pages/admin-settings"));
const ClinicBranding = lazy(() => import("@/pages/clinic-branding"));
const LandingCustomization = lazy(() => import("@/pages/landing-customization"));
const DomainClinicLogin = lazy(() => import("@/pages/domain-clinic-login"));
const AIDashboard = lazy(() => import("@/pages/ai-dashboard"));
const BookAppointment = lazy(() => import("@/pages/book-appointment"));
const ClinicAnalytics = lazy(() => import("@/pages/clinic-analytics"));
const AppointmentBooking = lazy(() => import("@/pages/appointment-booking"));
const PushNotificationsSetup = lazy(() => import("@/pages/push-notifications-setup"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

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
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={LandingMobile} />
            <Route path="/landing-desktop" component={Landing} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/clinic-login" component={ClinicLogin} />
            <Route path="/clinic/:domain" component={DomainClinicLogin} />
            <Route component={NotFound} />
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
          <Route path="/admin/settings">
            <AuthenticatedLayout>
              <AdminSettings />
            </AuthenticatedLayout>
          </Route>
          <Route path="/admin/clinic/:clinicId/branding">
            <AuthenticatedLayout>
              <ClinicBranding />
            </AuthenticatedLayout>
          </Route>
          <Route path="/admin/landing-customization">
            <AuthenticatedLayout>
              <LandingCustomization />
            </AuthenticatedLayout>
          </Route>
          <Route path="/clinics">
            <AuthenticatedLayout>
              <AIDashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/book-appointment/:clinicId">
            <AuthenticatedLayout>
              <BookAppointment />
            </AuthenticatedLayout>
          </Route>
          <Route path="/analytics">
            <AuthenticatedLayout>
              <ClinicAnalytics />
            </AuthenticatedLayout>
          </Route>
          <Route path="/appointment-booking">
            <AuthenticatedLayout>
              <AppointmentBooking />
            </AuthenticatedLayout>
          </Route>
          <Route path="/push-notifications">
            <AuthenticatedLayout>
              <PushNotificationsSetup />
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
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <Toaster />
            <Router />
            <PWAInstallPrompt />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
