import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, ChevronRight, LogOut, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    children: []
  },
  {
    title: "Projects",
    route: "/projects",
    icon: FolderOpen,
    children: []
  }
];

function SidebarComponent({ open = true }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (route) => {
    return pathname === route || (route !== "/" && pathname.includes(route));
  };

  return (
    <div className={`${open ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col h-full border rounded-2xl`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className={`${open ? 'flex' : 'hidden'} items-center space-x-2`}>
          <span className="text-xl font-bold text-gray-800">
            MY<span className="text-blue-500">PORTAL</span>
          </span>
        </Link>
        {!open && (
          <div className="flex justify-center">
            <span className="text-lg font-bold text-blue-500">MP</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            <Link
              to={item.children?.length === 0 ? item.route : "#"}
              onClick={(e) => {
                if (item.children?.length > 0 && open) {
                  e.preventDefault();
                  toggleSubmenu(item.title);
                }
              }}
              className="block"
            >
              <Button
                variant={isActive(item.route) ? "default" : "ghost"}
                className={`w-full justify-start ${!open ? 'px-2' : 'px-4'} py-3 ${
                  isActive(item.route) 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 ${!open ? '' : 'mr-3'}`} />
                {open && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.children?.length > 0 && (
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${
                          openSubmenus[item.title] ? 'rotate-90' : ''
                        }`} 
                      />
                    )}
                  </>
                )}
              </Button>
            </Link>

            {/* Submenu */}
            {item.children?.length > 0 && openSubmenus[item.title] && open && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link key={child.title} to={child.route}>
                    <Button
                      variant={isActive(child.route) ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-xs ${
                        isActive(child.route)
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {child.title}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      {open && (
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-2 h-auto justify-start hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="bg-blue-500 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

SidebarComponent.propTypes = {
  open: PropTypes.bool,
};

export default SidebarComponent;