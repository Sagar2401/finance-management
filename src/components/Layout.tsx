
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup } from "@/components/ui/sidebar";
import { Home, CreditCard, PiggyBank, User, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation items
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CreditCard, label: "Transactions", path: "/transactions" },
    { icon: PiggyBank, label: "Goals", path: "/goals" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  // Check if a path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex items-center px-6 py-5">
        <Link to="/dashboard" className="flex items-center">
          <PiggyBank className="h-6 w-6 text-primary mr-2" />
          <span className="font-semibold text-lg">Finance</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md",
                      isActive(item.path) 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
