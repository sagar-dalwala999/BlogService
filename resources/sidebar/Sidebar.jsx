import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { ReactSvgs } from "@/assets/svgs/ReactSvgs";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import useSidebarMenuService from "@/services/sidebarMenu";
import { setSelectedMenu, setSidebarChildMenu } from "@/redux/slices/supportSlice";

import { Breadcrumb, BreadcrumbList } from "../ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function SidebarComponent({ open }) {
  const dispatch = useDispatch();
  const { isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const company = useSelector((state) => state?.fields?.companyDetails);
  const [sidebarRoutes, setSidebarRoutes] = useState([]);
  const { fetchSidebarMenuList } = useSidebarMenuService();

  const getTokenData = () => {
    const tokenString = Cookies.get("logibrisk") || "";
    if (!tokenString) return null;

    return jwtDecode(tokenString);
  };
  
  const token = getTokenData();

  const { data: sidebarData } = useQuery({
    queryKey: ["sidebarMenu"],
    queryFn: fetchSidebarMenuList,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!token?.userId
  });

  useEffect(() => {
    if (sidebarData) {
      setSidebarRoutes(sidebarData?.erpMenuList);
      dispatch(setSidebarChildMenu(sidebarData?.erpChildMenuList));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setSidebarRoutes([]);
      dispatch(setSidebarChildMenu([]));
    }
  }, [sidebarData]);

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
      dispatch(setSelectedMenu({
        menuId: selectedMenuItem?.menuId,
        title: selectedMenuItem?.title,
        route: selectedMenuItem?.route,
      }));
    } else {
      dispatch(setSelectedMenu(null));
    }
  }, [pathname, sidebarRoutes, dispatch]);

  const handleMenuClick = (item) => {
    dispatch(setSelectedMenu({ menuId: item?.menuId, title: item?.title, route: item?.route }));
    // Close mobile sidebar when menu item is clicked
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const getLogoUrl = () => {
    if (company?.companyProfileUrl && company.companyProfileUrl.trim() !== '') {
      return company.companyProfileUrl;
    }
    return ReactSvgs.appLogo;
  };

  return (
    <Sidebar collapsible="icon" className={`rounded-2xl ml-5 bg-background`}>
      <SidebarHeader className="h-20">
        <div className="w-full flex h-full flex-grow items-center justify-between">
          <Link
            to={"/"}
            className={`${open ? "flex" : "hidden"} transition-all items-center justify-center h-16 lg:ml-2`}
          >
            <img
              src={getLogoUrl()}
              alt="logo"
              className="h-12 max-w-36 object-contain rounded-sm"
              onError={(e) => (e.target.src = ReactSvgs.appLogo)}
            />
          </Link>
          {!open && isMobile && (
            <Link to={"/"} className="flex items-center justify-center h-16">
              <img
                src={getLogoUrl()}
                alt="logo"
                className="h-12 w-auto max-w-full object-contain rounded-sm"
                onError={(e) => (e.target.src = ReactSvgs.appLogo)}
              />
            </Link>
          )}
          <SidebarTrigger
            className={`${!open && !isMobile ? "flex-grow transition-all" : ""
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
                        className="w-full flex justify-center items-center py-1"
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
                                className={`${item.route === pathname ||
                                  (item.route !== "/" &&
                                    pathname.includes(item.route))
                                  ? "text-main"
                                  : "text-sidebar-foreground"
                                  } pr-[5px] fill-current`}
                              />
                            )}
                          </div>
                          <span
                            className={`${item.route === pathname ||
                              (item.route !== "/" &&
                                pathname.includes(item.route))
                              ? "text-main"
                              : "text-sidebar-foreground"
                              }`}
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
                                className={`ml-auto size-4 ${pathname.includes(item.route)
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
                                        className={`${pathname === child.route
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
      <SidebarFooter className="items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <Breadcrumb className="lg:hidden flex items-center justify-between w-full p-2">
              <BreadcrumbList>
                <Avatar className="h-[40px] w-[40px] rounded-lg">
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={"CN"}
                    className="rounded-full"
                  />
                  <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                </Avatar>
                <p className="text-sm text-sidebar-foreground">John Doe</p>
              </BreadcrumbList>
            </Breadcrumb>
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