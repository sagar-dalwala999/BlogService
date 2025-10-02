import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderOpen } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Mock data structure matching the reference sidebar
const sidebarRoutes = [
  {
    title: "Main",
    navMain: [
      {
        title: "Dashboard",
        route: "/dashboard",
        icon: LayoutDashboard,
        menuId: 1,
        isShow: true,
        children: [],
      },
      {
        title: "Projects",
        route: "/projects",
        icon: FolderOpen,
        menuId: 2,
        isShow: true,
        children: [],
      },
    ],
  },
];

function SidebarComponent({ open }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const findMenuItemByPathname = (pathname, routes) => {
    if (!Array.isArray(routes)) {
      return null;
    }

    for (const group of routes) {
      if (!Array.isArray(group.navMain)) {
        continue;
      }
      for (const item of group.navMain) {
        if (item.route === pathname) {
          return item;
        }
        if (item.children) {
          const childItem = item.children.find(
            (child) => child.route === pathname
          );
          if (childItem) {
            return childItem;
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const selectedMenuItem = findMenuItemByPathname(pathname, sidebarRoutes);

    if (selectedMenuItem) {
      // You can add dispatch logic here when you integrate with Redux
      // setSelectedMenu(selectedMenuItem);
    }
  }, [pathname]);

  const handleMenuClick = (_item) => {
    // You can add dispatch logic here when you integrate with Redux
    // dispatch(setSelectedMenu({ menuId: item?.menuId, title: item?.title, route: item?.route }));
    // Close mobile sidebar when menu item is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="rounded-2xl ml-5 bg-background">
      <SidebarHeader className="h-20 pb-0 mt-[-8px]">
        <div className="w-full flex h-full flex-grow items-center justify-between">
          <Link
            to={"/"}
            className={`${
              open ? "flex" : "hidden"
            } transition-all items-center justify-center h-16 lg:ml-2`}
          >
            <span className="text-xl font-bold text-gray-800">
              MY<span className="text-blue-500">PORTAL</span>
            </span>
          </Link>
          {!open && isMobile && (
            <Link to={"/"} className="flex items-center justify-center h-16">
              <span className="text-lg font-bold text-blue-500">MP</span>
            </Link>
          )}
          <SidebarTrigger
            className={`${
              !open && !isMobile ? "flex-grow transition-all" : ""
            } dark:hover:bg-hoverColor text-sidebar-foreground px-5`}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        {sidebarRoutes?.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarMenu>
              {group.navMain
                .filter((item) => item.isShow)
                .map((item) => (
                  <React.Fragment key={item.title}>
                    <SidebarMenuItem
                      className={`${open ? "" : "justify-center h-12"}`}
                    >
                      <Link
                        to={item.children?.length === 0 && item.route}
                        className="w-full flex justify-center items-center py-1 font-semibold"
                        onClick={(e) => {
                          if (item?.children?.length > 0 && open) {
                            e.preventDefault();
                            toggleSubmenu(item.title);
                          } else if (item.children?.length === 0) {
                            // Close mobile sidebar when a direct link is clicked
                            handleMenuClick(item);
                          }
                        }}
                      >
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={
                            item.route === pathname ||
                            (item.route !== "/" &&
                              pathname.includes(item.route))
                          }
                          className="py-5 pr-2"
                        >
                          <div className="h-12 w-12 flex items-center justify-center">
                            {item.icon && (
                              <item.icon
                                className={`${
                                  item.route === pathname ||
                                  (item.route !== "/" &&
                                    pathname.includes(item.route))
                                    ? "text-main"
                                    : "text-sidebar-foreground"
                                } pr-[5px] fill-current h-6 w-6`}
                              />
                            )}
                          </div>
                          <span
                            className={`${
                              item.route === pathname ||
                              (item.route !== "/" &&
                                pathname.includes(item.route))
                                ? "text-main"
                                : "text-sidebar-foreground"
                            } text-[15px]`}
                          >
                            {item.title}
                          </span>
                          {item.children?.length > 0 && (
                            <motion.div
                              animate={{
                                rotate: openSubmenus[item.title] ? 90 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className="ml-auto h-4 w-4"
                            >
                              <ChevronRight
                                className={`ml-auto size-4 ${
                                  pathname.includes(item.route)
                                    ? "text-main"
                                    : "text-sidebar-foreground"
                                }`}
                              />
                            </motion.div>
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <AnimatePresence>
                      {item.children && openSubmenus[item.title] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SidebarMenuSub className="relative ms-5 pl-4">
                            {item.children
                              .filter((child) => child.isShow)
                              .map((child) => (
                                <SidebarMenuSubItem
                                  key={child.title}
                                  data-active={pathname === child.route}
                                >
                                  <Link
                                    to={child.route}
                                    className="w-full flex justify-center items-center"
                                    onClick={() => {
                                      handleMenuClick(child);
                                    }}
                                  >
                                    <SidebarMenuButton
                                      tooltip={child.title}
                                      isActive={pathname === child.route}
                                      className={`p-0 relative ${cn("py-5")}`}
                                    >
                                      <span
                                        className={`${
                                          pathname === child.route
                                            ? "text-main"
                                            : "text-sidebar-foreground"
                                        } text-xs pl-2`}
                                      >
                                        {child.title}
                                      </span>
                                    </SidebarMenuButton>
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                          </SidebarMenuSub>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="items-center lg:hidden block">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full md:p-1 p-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-[40px] w-[40px] rounded-lg">
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={"CN"}
                    className="rounded-full"
                  />
                  <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                </Avatar>
                {open && (
                  <p className="text-sm text-sidebar-foreground">John Doe</p>
                )}
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

SidebarComponent.propTypes = {
  open: PropTypes.bool,
};

export default SidebarComponent;
