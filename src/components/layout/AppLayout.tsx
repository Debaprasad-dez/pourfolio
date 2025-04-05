
import React, { useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Wine,
  BarChart3,
  CalendarClock,
  Bookmark,
  CheckSquare,
  Settings,
  Menu,
  Home,
  Book
} from "lucide-react";
import { ThemeToggle } from '../theme/ThemeToggle';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

import pourfolioLogo from "../../assets/pourfolio-logo-new.png";
import pourfolioGlass from "../../assets/pourfolio-glass.png";

export function AppLayout({ children, activeTab = "journal" }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex w-full bg-background text-foreground p-4">
        <div className="flex-1 flex items-center justify-center">
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar 
        expanded={sidebarOpen} 
        setExpanded={setSidebarOpen} 
        activeTab={activeTab}
        onChangeTab={(tabId) => {
          if (tabId === 'journal') {
            navigate('/');
          } else {
            navigate(`/${tabId}`);
          }
          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
      />
      <main className={cn(
        "flex-1 p-4 md:p-6 transition-all duration-300 text-foreground bg-background",
        sidebarOpen && !isMobile && "ml-64",
      )}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-primary rounded-md hover:bg-primary/10 transition-all hover:scale-105"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            )}
            <img src={pourfolioGlass} style={{width:'24px'}} alt="" />
            <h4 className="text-sm md:text-lg font-bold golden-shine">Drink Responsibly</h4>
            
          </div>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}

interface AppSidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  activeTab: string;
  onChangeTab: (tabId: string) => void;
}

function AppSidebarItem({ 
  icon: Icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ComponentType<any>; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-md transition-all duration-300",
        active 
          ? "bg-primary text-primary-foreground scale-105" 
          : "hover:bg-primary/10 text-foreground hover:scale-105"
      )}
    >
      <Icon size={20} className={active ? "animate-pulse" : ""} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function AppSidebar({ expanded, setExpanded, activeTab, onChangeTab }: AppSidebarProps) {
  const isMobile = useIsMobile();
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "journal", label: "Tasting Journal", icon: Wine },
    { id: "profile", label: "Flavor Profile", icon: BarChart3 },
    { id: "wishlist", label: "Wishlist", icon: Bookmark },
    { id: "planner", label: "Party Planner", icon: CalendarClock },
    { id: "events", label: "Tasting Events", icon: CheckSquare },
    { id: "guide", label: "Alcohol Guide", icon: Book },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r",
        "transition-all duration-300 transform",
        expanded ? "translate-x-0 w-64" : "-translate-x-full w-64",
        isMobile ? "shadow-lg bg-background/90 dark:bg-background/95 backdrop-blur-sm" : "glassmorphism"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {/* <h2 className="text-2xl font-bold gold-accent">Pourfolio</h2> */}
        <img src={pourfolioLogo} style={{width: '180px'}} alt="" />
        {isMobile && (
          <button
            onClick={() => setExpanded(false)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            &times;
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        {tabs.map((tab) => (
          <AppSidebarItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onChangeTab(tab.id)}
          />
        ))}
      </div>
      
      <div className="p-4 border-t mt-auto">
        <p className="text-xs font-bold mb-2 text-muted-foreground text-center">
          Data stored locally
        </p>
        <p className="text-xs text-muted-foreground text-center">
        © 2024 Debaprasad.
        </p>
      </div>
    </div>
  );
}
