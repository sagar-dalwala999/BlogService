import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditIcon from "@/components/ui/icons/EditIcon";
import DeleteIcon from "@/components/ui/icons/DeleteIcon";
import { ArrowLeft, Plus, Globe, Database, Cloud, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const location = useLocation();
  const project = location.state?.project;

  // Mock services data
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Content Management",
      description: "Manage blog posts, categories, and content scheduling",
      type: "CMS",
      status: "active",
      icon: Database
    },
    {
      id: 2,
      name: "Email Newsletter",
      description: "Automated email campaigns and subscriber management",
      type: "Email",
      status: "active",
      icon: Mail
    },
    {
      id: 3,
      name: "CDN Service",
      description: "Content delivery network for faster image loading",
      type: "Storage",
      status: "inactive",
      icon: Cloud
    },
    {
      id: 4,
      name: "Analytics",
      description: "Track visitor behavior and content performance",
      type: "Analytics",
      status: "active",
      icon: Globe
    }
  ]);

  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Form states
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceType, setServiceType] = useState("");

  const handleEdit = (service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceDescription(service.description);
    setServiceType(service.type);
    setIsServiceModalOpen(true);
  };

  const handleDelete = (serviceId) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceName("");
    setServiceDescription("");
    setServiceType("");
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceName.trim()) return;

    if (editingService) {
      // Edit existing service
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...s, name: serviceName, description: serviceDescription, type: serviceType }
          : s
      ));
    } else {
      // Add new service
      const newService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        name: serviceName,
        description: serviceDescription,
        type: serviceType,
        status: "active",
        icon: Database
      };
      setServices([...services, newService]);
    }

    setIsServiceModalOpen(false);
    setEditingService(null);
    setServiceName("");
    setServiceDescription("");
    setServiceType("");
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Services - {project?.name || "Project"}
            </h1>
            <p className="text-gray-600">Manage services for this project.</p>
          </div>
        </div>
        <Button 
          onClick={handleAddService}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Services Yet</h3>
          <p className="text-gray-500 mb-4">Add your first service to get started.</p>
          <Button 
            onClick={handleAddService}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto w-auto p-0 hover:bg-transparent"
                              onClick={() => handleEdit(service)}
                            >
                              <EditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Service</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto w-auto p-0 hover:bg-transparent"
                              onClick={() => handleDelete(service.id)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Service</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{service.type}</Badge>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService 
                ? "Update your service details below."
                : "Create a new service for this project."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                placeholder="Enter service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Input
                id="service-type"
                placeholder="e.g., CMS, Email, Storage"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                placeholder="Enter service description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsServiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveService}
              disabled={!serviceName.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;