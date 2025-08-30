import React from "react";
import AppHeader from "./_components/AppHeader";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <AppHeader />
      {children}
    </div>
  );
}

export default DashboardLayout;
