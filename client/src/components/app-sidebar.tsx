import { 
  Home, 
  Calendar, 
  Users, 
  Bell, 
  Settings, 
  Building2,
  ClipboardList,
  BarChart3,
  LogOut,
  Syringe
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const parentMenuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Children", url: "/children", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

const clinicMenuItems = [
  { title: "Dashboard", url: "/clinic", icon: Home },
  { title: "Patients", url: "/clinic/patients", icon: Users },
  { title: "Appointments", url: "/clinic/appointments", icon: Calendar },
  { title: "Records", url: "/clinic/records", icon: ClipboardList },
  { title: "Analytics", url: "/clinic/analytics", icon: BarChart3 },
  { title: "Settings", url: "/clinic/settings", icon: Settings },
];

interface AppSidebarProps {
  userRole?: "parent" | "clinic" | "admin";
  unreadNotifications?: number;
}

export function AppSidebar({ userRole = "parent", unreadNotifications = 0 }: AppSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const menuItems = userRole === "clinic" ? clinicMenuItems : parentMenuItems;
  
  const isActive = (url: string) => {
    if (url === "/" || url === "/clinic") {
      return location === url;
    }
    return location.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Syringe className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground" data-testid="text-sidebar-logo">VaxTrack</span>
              <span className="text-xs text-muted-foreground capitalize">{userRole} Portal</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <div className="flex items-center gap-3 w-full" data-testid={`link-${item.title.toLowerCase()}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === "Notifications" && unreadNotifications > 0 && (
                          <Badge 
                            variant="default" 
                            className="ml-auto h-5 min-w-5 flex items-center justify-center"
                            data-testid="badge-notification-count"
                          >
                            {unreadNotifications > 99 ? "99+" : unreadNotifications}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {userRole === "parent" && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/pricing">
                      <Building2 className="h-4 w-4" />
                      <span>Upgrade Plan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={user?.profileImageUrl || undefined} 
              alt={user?.firstName || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <a href="/api/logout">
            <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
