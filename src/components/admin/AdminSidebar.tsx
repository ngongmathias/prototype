import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClerk } from "@clerk/clerk-react";
import { 
  LayoutDashboard, 
  MapPin, 
  Globe, 
  Building2, 
  MessageSquare, 
  Users, 
  Settings, 
  Menu, 
  X,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  Megaphone,
  FolderOpen,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    description: "Overview and analytics"
  },
  {
    title: "Cities",
    icon: MapPin,
    path: "/admin/cities",
    description: "Manage cities"
  },
  {
    title: "Countries",
    icon: Globe,
    path: "/admin/countries",
    description: "Manage countries"
  },
  {
    title: "Categories",
    icon: FolderOpen,
    path: "/admin/categories",
    description: "Manage business categories"
  },
  {
    title: "Businesses",
    icon: Building2,
    path: "/admin/businesses",
    description: "Manage business listings"
  },
  {
    title: "Sponsored Ads",
    icon: Megaphone,
    path: "/admin/sponsored-ads",
    description: "Manage advertising campaigns"
  },
  {
    title: "Reviews",
    icon: MessageSquare,
    path: "/admin/reviews",
    description: "View and moderate reviews"
  },
  {
    title: "Contact Messages",
    icon: Mail,
    path: "/admin/contact-messages",
    description: "Manage customer inquiries"
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
    description: "Manage user accounts"
  },
  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   path: "/admin/analytics",
  //   description: "Business insights and reports"
  // },
  // {
  //   title: "Reports",
  //   icon: FileText,
  //   path: "/admin/reports",
  //   description: "System reports and logs"
  // },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
    description: "Account settings and preferences"
  }
];

export const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      // Sign out from Clerk (this will clear the session)
      await signOut();
      
      // Clear any local storage or session data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.clear();
      
      // Clear any cookies if they exist
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Redirect to homepage
      navigate('/');
      
      // Force a page reload to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to sign out and redirect
      try {
        await signOut();
      } catch (signOutError) {
        console.error('Sign out error:', signOutError);
      }
      navigate('/');
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yp-blue to-yp-green rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-comfortaa font-bold text-lg text-yp-dark">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group",
                  isActive 
                    ? "bg-[#e64600] text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#4e3c28]"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-[#4e3c28]"
                )} />
                <div className="flex-1">
                  <div className="font-roboto font-medium">{item.title}</div>
                  <div className={cn(
                    "text-xs font-roboto transition-colors duration-200",
                    isActive ? "text-orange-100" : "text-gray-500 group-hover:text-[#4e3c28]"
                  )}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-roboto">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};