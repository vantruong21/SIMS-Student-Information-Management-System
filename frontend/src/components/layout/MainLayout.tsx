import React, { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';
import { TopHeader } from './TopHeader';

interface MainLayoutProps {
  userRole: 'Student' | 'Faculty' | 'Admin';
  userName: string;
  userAvatar?: string;
  sidebarItems: SidebarItem[];
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  userRole,
  userName,
  userAvatar,
  sidebarItems,
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  children
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-5 items-stretch relative w-full h-full">
      
      {/* Sidebar Navigation Drawer */}
      <Sidebar 
        items={sidebarItems}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Dashboard Workspace panel */}
      <div className="flex-1 flex flex-col gap-5 overflow-visible">
        
        {/* Header on top */}
        <TopHeader 
          userRole={userRole}
          userName={userName}
          userAvatar={userAvatar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onNavigateTab={setCurrentTab}
        />


        {/* Scrollable Tab Content Container */}
        <main id="main-content" className="flex-1 overflow-visible h-full flex flex-col" role="main" aria-label="Main content area">
          {children}
        </main>

      </div>
    </div>
  );
};
