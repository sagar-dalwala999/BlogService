import { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, ChevronDown, User } from "lucide-react";

const Navbar = () => {
  const { isMobile } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock user data - replace with actual user data from your auth context
  const user = {
    name: "Alexandria",
    email: "Alexandria@gmail.com",
    avatar: "https://github.com/shadcn.png"
  };

  // Simple function to get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/projects":
        return "Projects";
      case "/services":
        return "Services Portal";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");
    
    // Navigate to login page
    navigate("/login");
    setShowLogoutModal(false);
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
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 ml-1">
              {getPageTitle()}
            </h1>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10 px-2 sm:px-3 hover:bg-accent">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                      {user.name}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl p-0 overflow-hidden">
          <div className="relative">
            {/* Header with close button */}
            {/* <DialogHeader className="relative p-6 pb-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                
              </button>
            </DialogHeader> */}
            
            {/* Content */}
            <div className="px-6 pb-6 text-center">
              {/* Logout Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="/logout.png" 
                    alt="Logout" 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />
                </div>
              </div>
              
              {/* Title */}
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Logout!!!
              </DialogTitle>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                You're leaving.....Are You Sure ???
              </p>
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-semibold py-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Log Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Navbar;
