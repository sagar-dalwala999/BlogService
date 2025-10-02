import { Fragment, useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  Bell,
  CalendarIcon,
  ChevronDown,
  Landmark,
  LogOutIcon,
  MapPin,
} from "lucide-react";
// import ReactIcons from "@/assets/icons/icons";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUserProfileMaster } from "@/services/fetchUserProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import defaultImg from "../../assets/images/default.svg";
import { useTheme } from "@/lib/contexts/theme-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import Tooltip from "../tooltip/Tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useDashboardService } from "@/services/dashboard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setBranch,
  setCompanyDetails,
  setFieldsData,
  setFinancialYear,
  setSelectedMenu,
  setSidebarChildMenu,
  setTimeZoneId,
  setTimeZoneName,
  setUserDetails,
} from "@/redux/slices/supportSlice";
import { useCompanyGSTMasterService } from "@/services/companyGstMaster";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { toast } from "sonner";

const Navbar = () => {
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getTokenData = () => {
    const tokenString = Cookies.get("logibrisk") || "";
    if (!tokenString) return null;

    return jwtDecode(tokenString);
  };

  const token = getTokenData();
  const branch = useSelector((state) => state.fields.branch);
  const financialYear = useSelector((state) => state.fields.financialYear);
  const user = useSelector((state) => state?.fields?.userDetails);
  const company = useSelector((state) => state?.fields?.companyDetails);

  const [profileImg, setProfileImg] = useState("");
  const [userName, setUserName] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState();

  const [selectedBranch, setSelectedBranch] = useState(branch);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");

  const [isInitialBranchSet, setIsInitialBranchSet] = useState(true);
  const [isInitialYearSet, setIsInitialYearSet] = useState(true);
  const [branchTooltipDisabled, setBranchTooltipDisabled] = useState(false);
  const [yearTooltipDisabled, setYearTooltipDisabled] = useState(false);

  const { loadFinancialYearList, loadLocationList, refreshJwtToken } =
    useDashboardService();
  const { fetchUserProfileDetails } = useUserProfileMaster();
  const { getCompanyDetails } = useCompanyGSTMasterService();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", token?.userId],
    queryFn: () =>
      fetchUserProfileDetails(token?.userId).then((res) => res.data),
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    enabled: token?.userId ? true : false,
  });

  const { data: locationLists } = useQuery({
    queryKey: ["loadLocationList", token?.userId],
    queryFn: loadLocationList,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!token?.userId
  });

  const { data: financialYearList } = useQuery({
    queryKey: ["loadFinancialYearList", token?.userId],
    queryFn: loadFinancialYearList,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!token?.userId
  });

  const { data: companyDetails } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: getCompanyDetails,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    enabled: !!token?.userId
    // enabled: !company
  });

  useEffect(() => {
    if (user) {
      setProfileImg(user?.profilePictureURL);
      setUserName(user?.userName);
    }
  }, [user]);

  useEffect(() => {
    setSelectedBranch(branch);
  }, [branch]);

  useEffect(() => {
    setSelectedFinancialYear(financialYear);
  }, [financialYear]);

  useEffect(() => {
    if (userProfile) {
      dispatch(setUserDetails(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (companyDetails?.data) {
      dispatch(setCompanyDetails(companyDetails?.data));
    }
  }, [companyDetails, dispatch]);

  useDocumentMeta({
    title: user?.userName ? `${user?.userName}` : "LogiVite",
    faviconUrl: company?.companyProfileUrl || "/logo.svg",
  });

  const handleTokenRefresh = async (branchId, yearId) => {
    if (!branchId || !yearId) return;

    try {
      const token = Cookies.get("logibrisk");
      const response = await refreshJwtToken({
        token: token,
        BranchId: branchId,
        FinancialYear: yearId,
      });

      if (response?.data) {
        Cookies.set("logibrisk", response?.data);
      }
    } catch (error) {
      throw new Error(`Token refresh failed: ${error}`);
    }
  };

  const handleBranchSave = async () => {
    if (selectedBranch) {
      dispatch(setBranch(selectedBranch));
      setisOpen(false);

      if (!isInitialBranchSet && financialYear) {
        await handleTokenRefresh(selectedBranch, financialYear);
      }
      setIsInitialBranchSet(false);

      // Disable tooltip temporarily
      setBranchTooltipDisabled(true);
      setTimeout(() => {
        setBranchTooltipDisabled(false);
      }, 500);

      // Blur any focused element
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleFinancialYearSave = async () => {
    if (selectedFinancialYear) {
      dispatch(setFinancialYear(selectedFinancialYear));
      dispatch(
        setTimeZoneId(
          financialYearList?.data?.find(
            (item) => item.yearId === selectedFinancialYear
          )?.timeZoneId
        )
      );
      dispatch(
        setTimeZoneName(
          financialYearList?.data?.find(
            (item) => item.yearId === selectedFinancialYear
          )?.displayName
        )
      );
      setIsVisible(false);

      if (!isInitialYearSet && branch) {
        await handleTokenRefresh(branch, selectedFinancialYear);
      }
      setIsInitialYearSet(false);

      // Disable tooltip temporarily
      setYearTooltipDisabled(true);
      setTimeout(() => {
        setYearTooltipDisabled(false);
      }, 500);

      // Blur any focused element
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  };

  useEffect(() => {
    if (locationLists?.data && locationLists.data.length > 0 && !branch) {
      const defaultBranch =
        locationLists.data.find((item) => item.isActive)?.locationId ||
        locationLists.data[0].locationId;
      dispatch(setBranch(defaultBranch));
      setSelectedBranch(defaultBranch);
      setIsInitialBranchSet(true);
    }
  }, [locationLists, branch, dispatch]);

  useEffect(() => {
    if (financialYear && financialYearList?.data) {
      const selectedYearObj = financialYearList.data.find(
        (data) => data.yearId === financialYear
      );
      if (selectedYearObj) {
        setDate({
          from: new Date(selectedYearObj.fromDate),
          to: new Date(selectedYearObj.toDate),
        });
      }
    }
  }, [financialYear, financialYearList]);

  useEffect(() => {
    if (financialYearList?.data && financialYearList.data.length > 0) {
      // Only set default if financialYear is not already set
      if (!financialYear) {
        const defaultYear = financialYearList.data[0].yearId;
        const defaultTimeZoneId = financialYearList.data[0].timeZoneId;
        const defaultTimeZoneName = financialYearList.data[0].displayName;
        if (defaultYear) {
          dispatch(setFinancialYear(defaultYear));
          dispatch(setTimeZoneId(defaultTimeZoneId));
          dispatch(setTimeZoneName(defaultTimeZoneName));
          setSelectedFinancialYear(defaultYear);
          setIsInitialYearSet(true);
        }
      }

      // Update date based on current financialYear or the first item if not set
      const currentYearId = financialYear || financialYearList.data[0].yearId;
      const currentYear = financialYearList.data.find(
        (data) => data.yearId === currentYearId
      );
      if (currentYear) {
        setDate({
          from: new Date(currentYear.fromDate),
          to: new Date(currentYear.toDate),
        });
      }
    }
  }, [financialYearList, financialYear, dispatch]);

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
    setIsInitialBranchSet(false);
  };

  const handleFinancialYearChange = (value) => {
    setSelectedFinancialYear(value);
    setIsInitialYearSet(false);
    const selectedYearObj = financialYearList?.data?.find(
      (data) => data.yearId === value
    );
    if (selectedYearObj) {
      setDate({
        from: new Date(selectedYearObj.fromDate),
        to: new Date(selectedYearObj.toDate),
      });
    }
  };

  useEffect(() => {
    if (userProfile) {
      setTheme(userProfile.darkMode ? "dark" : "light");
      setProfileImg(userProfile?.profilePictureURL);
      setUserName(userProfile?.userName);
    }
  }, [userProfile, setTheme]);

  const handleLogout = () => {
    // Invalidate and remove all queries from the cache
    queryClient.removeQueries();

    localStorage.removeItem("persist:fields");
    const allCookies = Cookies.get(); // Get all cookies
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName); // Remove each cookie
    });

    dispatch(setFieldsData(null));
    dispatch(setSelectedMenu(null));
    dispatch(setSidebarChildMenu(null));
    dispatch(setBranch(null));
    dispatch(setFinancialYear(null));
    dispatch(setTimeZoneId(null));
    dispatch(setTimeZoneName(null));
    dispatch(setUserDetails(null));
    dispatch(setCompanyDetails(null));
    setSelectedFinancialYear("");
    setSelectedBranch("");

    navigate("/login");
  };

  const renderBranchDialog = () => (
    <Dialog open={isOpen} onOpenChange={setisOpen}>
      <Tooltip content="Branch" disabled={branchTooltipDisabled}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-none text-main hover:text-main bg-transparent px-1 sm:px-2 h-9 sm:h-10"
            size={isMobile ? "sm" : "default"}
          >
            <Landmark className="h-4 w-4 sm:h-5 sm:w-5 mr-1 md:block hidden" />
            <span className="truncate max-w-[80px] sm:max-w-[120px]">
              {locationLists?.data?.find(
                ({ locationId }) => locationId === branch
              )?.locationName || "Branch"}
            </span>
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="sm:max-w-xl fixed top-56">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-primary">
            Branch
          </DialogTitle>
          <DialogDescription className="text-input">
            Select your working branch
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-1 mt-2">
          <Select value={selectedBranch || ""} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-full border">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {locationLists?.data?.filter((item) => item.isActive)?.length > 0 ? (
                  locationLists.data
                    .filter((item) => item.isActive)
                    .map(({ locationName, locationId }) => (
                      <SelectItem
                        key={locationId}
                        value={locationId}
                        className="cursor-pointer !text-sidebar-foreground focus:!bg-dropdown-hover hover:!bg-dropdown-hover transform transition-all duration-200 ease-in-out"
                      >
                        {locationName}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem
                    value="no-data"
                    disabled
                    className="text-muted-foreground cursor-not-allowed"
                  >
                    No Branch Available
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 px-1 w-full hidden sm:block">
          <ul className="list-disc pl-5">
            <li className="space-y-1 border-b last:border-b-0 pb-2">
              <h4 className="text-sm font-medium leading-none">Information</h4>
              <p className="text-sm text-muted-foreground">
                {`Select the branch you're currently working in.`}
              </p>
            </li>
          </ul>
        </div>
        <DialogFooter className="justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="text-main border border-main hover:text-main/80 w-auto sm:w-28"
              onClick={() => setisOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="main"
            onClick={handleBranchSave}
            className="w-auto sm:w-28 bg-main hover:bg-main/90 text-white"
            disabled={!selectedBranch}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderFinancialYearDialog = () => (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <Tooltip content="Financial Year" disabled={yearTooltipDisabled}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-none text-main hover:text-main bg-transparent px-1 sm:px-2 h-9 sm:h-10"
            size={isMobile ? "sm" : "default"}
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1 md:block hidden" />
            {financialYearList?.data?.find(
              ({ yearId }) => yearId === financialYear
            )?.yearCode || "Financial Year"}
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="sm:max-w-3xl fixed top-44">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-primary">
            Financial Year
          </DialogTitle>
          <DialogDescription className="text-input">
            Select the financial year
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 justify-between mt-2">
          <div className="flex-grow">
            <Select
              value={selectedFinancialYear || ""}
              onValueChange={handleFinancialYearChange}
            >
              <SelectTrigger className="w-full border">
                <SelectValue>
                  {financialYearList?.data?.find(
                    (year) => year.yearId === selectedFinancialYear
                  )?.yearCode || "Select Financial Year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {financialYearList?.data?.length > 0 ? (
                    financialYearList.data.map(({ yearId, yearCode }) => (
                      <SelectItem
                        key={yearId}
                        value={yearId}
                        className="cursor-pointer !text-sidebar-foreground focus:!bg-dropdown-hover hover:!bg-dropdown-hover transform transition-all duration-200 ease-in-out"
                      >
                        {yearCode}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      value="no-data"
                      disabled
                      className="text-muted-foreground cursor-not-allowed"
                    >
                      No Financial Year Available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Date display section */}
          <div className={cn("grid gap-2")}>
            <Button
              id="date"
              variant="outline"
              className="w-full sm:w-[280px] justify-start text-left font-normal"
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from && date?.to ? (
                <span className="hidden sm:inline">
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </span>
              ) : (
                <span>Pick a date</span>
              )}
              {date?.from && date?.to && (
                <span className="sm:hidden">
                  {format(date.from, "MM/dd/yy")} -{" "}
                  {format(date.to, "MM/dd/yy")}
                </span>
              )}
            </Button>
          </div>
        </div>
        <DialogFooter className="justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="text-main border border-main hover:text-main/80 w-auto sm:w-28"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            variant="main"
            onClick={handleFinancialYearSave}
            disabled={!selectedFinancialYear}
            className="w-auto sm:w-28"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  useEffect(() => {
    if (financialYearList?.data) {
      if (!financialYearList.data.length) {
        toast.warning("Please create a financial year from the Master module", {
          closeButton: false,
        })
        return;
      }
    }
  }, [financialYearList?.data]);

  return (
    <Fragment>
      <header className="sticky z-40 top-0 shrink-0 lg:pl-4">
        <div className="bg-background w-full flex items-center justify-between gap-2 border h-16 rounded-2xl ps-2 pr-4 text-sidebar-foreground">
          <div className="flex items-center gap-1 overflow-hidden">
            {isMobile && (
              <div>
                <SidebarTrigger
                  className={`w-full p-1 sm:p-2 text-sidebar-foreground`}
                />
              </div>
            )}
            {renderBranchDialog()}
            {/* Changed the separator div to have vertical styling */}
            <div className="h-6 w-[1px] bg-main" />{" "}
            {/* This is the vertical separator */}
            {renderFinancialYearDialog()}
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              className="border-none hover:bg-secondary rounded-xl text-sidebar-foreground hover:scale-110 transform transition-transform duration-300 h-8 w-8 sm:h-10 sm:w-10"
            >
              {/* {ReactIcons?.notification ? (
                <ReactIcons.notification className="fill-current h-3 w-3 sm:h-5 sm:w-5" />
              ) : ( */}
              {/* <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-main/20" /> */}
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-main animate-pulse"></span>
              {/* )} */}
            </Button>
            <Breadcrumb className="hidden sm:flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbList className="cursor-pointer">
                    <Tooltip content="My Account">
                      <div className="flex items-center gap-2 hover:bg-accent rounded-xl ps-2 py-1">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border border-input">
                          <AvatarImage
                            src={profileImg}
                            alt={"logo"}
                            className="object-cover w-full h-full"
                          />
                          <AvatarFallback>
                            <img
                              src={defaultImg}
                              alt="fallback"
                              className="w-full h-full object-cover"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <p className="hidden sm:block text-sm text-sidebar-foreground max-w-[100px] truncate">
                          {userName || userProfile?.firstName || "User"}
                        </p>
                        <ChevronDown className="h-4 w-4 text-muted-foreground mr-1" />
                      </div>
                    </Tooltip>
                  </BreadcrumbList>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-36">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-input hover:text-primary transition-all duration-500"
                      onClick={handleLogout}
                    >
                      <LogOutIcon /> <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Breadcrumb>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
