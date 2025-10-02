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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleEdit = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setIsProjectModalOpen(true);
  };

  const handleDelete = (projectId) => {
    setDeleteProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProjects(projects.filter((p) => p.id !== deleteProjectId));
    setIsDeleteModalOpen(false);
    setDeleteProjectId(null);
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
                  onClick={() => handleDelete(row.id)}
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Manage your blog projects here.</p>
        </div>
        <Button
          onClick={handleAddProject}
          className="bg-blue-500 hover:bg-blue-600 text-white"
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
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone. All associated data and configurations will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
