import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ThemeProvider from "@/lib/contexts/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "../../components/navbar/Navbar";

const SidebarComponent = React.lazy(() => import("@/components/sidebar/Sidebar"));
// const Navbar = React.lazy(() => import("@/components/navbar/Navbar"));

function DefaultLayout() {
  const contentScrollRef = useRef(null);
  const [open, setOpen] = useState(true);
  const { pathname } = useLocation();

  // Create a function to expose the scroll control to child components
  const scrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="h-screen overflow-hidden p-2 md:p-5 bg-sidebar"
      >
        <SidebarComponent open={open}/>
        <SidebarInset className="flex flex-col h-full w-[calc(100%-16rem)]">
          <Navbar />
          <section
            className={`relative lg:ml-4 rounded-2xl mt-4 mb-4 scrollbar-hide`}
            style={{
              height: `calc(100vh - 4rem - 3.5rem)`,
            }}
          >
            <div
              className={`bg-background border rounded-2xl h-full overflow-x-auto overflow-y-auto ${pathname === "/docket-booking" ? "" : "px-4 py-5"}`}
              ref={contentScrollRef}
            >
              <Outlet context={{ scrollToTop,contentScrollRef }} />
            </div>
          </section>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;
