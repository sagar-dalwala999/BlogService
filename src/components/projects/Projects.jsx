import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTable from "@/components/data-table/DataTable";
import EditIcon from "@/components/ui/icons/EditIcon";
import DeleteIcon from "@/components/ui/icons/DeleteIcon";
import ServiceIcon from "@/components/ui/icons/ServiceIcon";
import { Plus } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();

  // Mock projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Personal Blog",
      description:
        "My personal thoughts and experiences about web development and technology.",
    },
    {
      id: 2,
      name: "Travel Journal",
      description:
        "Documenting adventures and travels around the world with photos and stories.",
    },
    {
      id: 3,
      name: "Tech Reviews",
      description:
        "In-depth reviews of latest gadgets, software, and development tools.",
    },
    {
      id: 4,
      name: "Cooking Recipes",
      description:
        "Collection of family recipes and cooking experiments with detailed instructions.",
    },
  ]);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleEdit = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setIsProjectModalOpen(true);
  };

  const handleDelete = (project) => {
    setDeleteProjectId(project.id);
    setDeleteProject(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProjects(projects.filter((p) => p.id !== deleteProjectId));
    setIsDeleteModalOpen(false);
    setDeleteProjectId(null);
    setDeleteProject(null);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectName("");
    setProjectDescription("");
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) return;

    if (editingProject) {
      // Edit existing project
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...p, name: projectName, description: projectDescription }
            : p
        )
      );
    } else {
      // Add new project
      const newProject = {
        id: Math.max(...projects.map((p) => p.id), 0) + 1,
        name: projectName,
        description: projectDescription,
      };
      setProjects([...projects, newProject]);
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
    setProjectName("");
    setProjectDescription("");
  };

  const handleManageServices = (project) => {
    navigate("/services", { state: { project } });
  };

  // Define columns for DataTable
  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => <div className="text-gray-600">{row.description}</div>,
    },
    {
      name: "Actions",
      width: "150px",
      center: true,
      cell: (row) => (
        <TooltipProvider>
          <div className="flex items-center justify-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-auto p-0 hover:bg-transparent"
                  onClick={() => handleManageServices(row)}
                >
                  <ServiceIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Services</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-auto p-0 hover:bg-transparent"
                  onClick={() => handleEdit(row)}
                >
                  <EditIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Project</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-auto p-0 hover:bg-transparent"
                  onClick={() => handleDelete(row)}
                >
                  <DeleteIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Project</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-600">Manage your blog projects here.</p>
          </div>
          <Button
            onClick={handleAddProject}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Table */}
      {/* <Card> */}
      {/* <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        </CardHeader> */}
      {/* <CardContent> */}
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first blog project to get started.
          </p>
          <Button
            onClick={handleAddProject}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <DataTable columns={columns} data={projects} />
      )}
      {/* </CardContent>
      </Card> */}

      {/* Add/Edit Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update your project details below."
                : "Create a new blog project. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProject}
              disabled={!projectName.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl p-0 overflow-hidden">
          <div className="relative p-4 mt-4">
            {/* Header with close button */}
            {/* <DialogHeader className="relative p-6 pb-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogHeader> */}
            
            {/* Content */}
            <div className="px-6 pb-6 text-center">
              {/* Delete Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="/delete.png" 
                    alt="Delete" 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />
                </div>
              </div>
              
              {/* Title */}
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Delete Project
              </DialogTitle>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Are you sure you want to delete <br />
                <span className="font-semibold text-gray-800">"{deleteProject?.name}"</span> ??
              </p>
              
              {/* Delete Button */}
              <Button 
                onClick={confirmDelete}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold py-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
