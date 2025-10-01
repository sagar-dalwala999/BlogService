import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy } from "lucide-react";

const Dashboard = () => {
  const [copiedToken, setCopiedToken] = useState(null);

  // Mock user data
  const user = {
    name: "Alexandria",
    email: "Alexandria@gmail.com",
  };

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
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Welcome, {user.name}
              </h2>
              <p className="text-blue-600 text-sm">
                Your registered email: {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tokens Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tokens:</h3>
        <div className="space-y-3">
          {tokens.map((token, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <code className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded border break-all">
                      {token}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 text-blue-500 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleCopyToken(token, index)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedToken === index ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;