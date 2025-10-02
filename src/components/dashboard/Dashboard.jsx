import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Plus } from "lucide-react";

const Dashboard = () => {
  const [copiedToken, setCopiedToken] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock user data
  const user = {
    name: "Alexandria",
    email: "Alexandria@gmail.com",
  };

  // Mock projects data - this should come from your actual data source
  const userProjects = []; // Empty array simulates first-time user

  // Check if user is coming from signup or has no projects
  useEffect(() => {
    const fromSignup = location.state?.fromSignup;
    const hasNoProjects = userProjects.length === 0;
    setIsFirstTime(fromSignup || hasNoProjects);
  }, [location.state, userProjects.length]);

  const handleCreateFirstProject = () => {
    navigate("/projects", { state: { showCreateModal: true } });
  };

  // For demo purposes - show tokens section for clients
  const showTokensForDemo = true;

  // Mock tokens data
  const tokens = [
    "a71B0859-3c47-4d7E-B7bf-54091d489b3b",
    "a71B0859-3c47-4d7E-B7bf-54091d489b3b",
    "a71B0859-3c47-4d7E-B7bf-54091d489b3b",
    "a71B0859-3c47-4d7E-B7bf-54091d489b3b",
    "a71B0859-3c47-4d7E-B7bf-54091d489b3b"
  ];

  const handleCopyToken = (token, index) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(index);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full mx-auto">
      {/* Welcome Card */}
      <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
              <AvatarFallback className="bg-blue-500 text-white text-base sm:text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-1 sm:mb-2 truncate">
                Welcome, {user.name}
              </h2>
              <p className="text-blue-600 text-xs sm:text-sm break-all">
                Your registered email: {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First-time User Welcome Section */}
      {isFirstTime && (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Ready to start blogging?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 px-2">
              Create your first project to get started with BlogServices.
            </p>
            <Button 
              onClick={handleCreateFirstProject}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto px-6 sm:px-4"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Your First Project</span>
              <span className="sm:hidden">Create Project</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tokens Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-1">Your API Tokens:</h3>
        
        {/* Show both states for client demo */}
        {/* {isFirstTime && (
          <Card className="border border-gray-200 mb-4">
            <CardContent className="p-6 text-center">
              <h4 className="text-base font-medium text-gray-700 mb-2">First-time User View</h4>
              <p className="text-gray-500 text-sm">
                Your API tokens will appear here once you create your first project.
              </p>
            </CardContent>
          </Card>
        )} */}

        {/* Always show tokens section for demo purposes */}
        {showTokensForDemo && (
          <div>
            {/* {isFirstTime && (
              <h4 className="text-base font-medium text-gray-700 mb-3 mt-6">After Creating Projects:</h4>
            )} */}
            <div className="space-y-3 sm:space-y-4">
              {tokens.map((token, index) => (
                <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <code className="text-xs sm:text-sm font-mono text-gray-700 bg-gray-50 px-2 sm:px-3 py-2 rounded border break-all block w-full">
                          {token}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500 border-blue-200 hover:bg-blue-50 w-full sm:w-auto shrink-0 h-9 sm:h-8"
                        onClick={() => handleCopyToken(token, index)}
                      >
                        <Copy className="h-4 w-4 mr-1 sm:mr-1" />
                        <span className="text-sm">{copiedToken === index ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;