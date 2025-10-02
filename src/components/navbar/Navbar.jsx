import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const Navbar = () => {
  const { isMobile } = useSidebar();
  const { pathname } = useLocation();

  // Simple function to get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/projects":
        return "Projects";
      case "/services":
        return "Services";
      default:
        return "BlogServices Portal";
    }
  };

  return (
    <Fragment>
      <header className="sticky z-40 top-0 shrink-0 lg:pl-4">
        <div className="bg-background w-full flex items-center justify-between gap-2 border h-16 rounded-2xl ps-2 pr-4 text-sidebar-foreground">
          <div className="flex items-center gap-2 overflow-hidden">
            {isMobile && (
              <div>
                <SidebarTrigger className="w-full p-1 sm:p-2 text-sidebar-foreground" />
              </div>
            )}
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
