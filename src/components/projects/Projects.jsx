import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable from "@/components/data-table/DataTable";
import { 
  Edit, 
  Trash2, 
  Plus,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Projects = () => {
  // Mock projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Personal Blog",
      description: "My personal thoughts and experiences about web development and technology."
    },
    {
      id: 2,
      name: "Travel Journal",
      description: "Documenting adventures and travels around the world with photos and stories."
    },
    {
      id: 3,
      name: "Tech Reviews",
      description: "In-depth reviews of latest gadgets, software, and development tools."
    },
    {
      id: 4,
      name: "Cooking Recipes",
      description: "Collection of family recipes and cooking experiments with detailed instructions."
    }
  ]);

  const handleEdit = (_project) => {
    // TODO: Implement edit functionality
  };

  const handleDelete = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleAddProject = () => {
    // TODO: Implement add project functionality
  };

  // Define columns for DataTable
  const columns = [
    {
      name: "Project Name",
      selector: row => row.name,
      sortable: true,
      width: "200px",
      cell: row => (
        <div className="font-medium text-gray-900">
          {row.name}
        </div>
      )
    },
    {
      name: "Description",
      selector: row => row.description,
      sortable: true,
      cell: row => (
        <div className="text-gray-600">
          {row.description}
        </div>
      )
    },
    {
      name: "Actions",
      width: "100px",
      center: true,
      cell: row => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => handleEdit(row)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(row.id)}
              className="cursor-pointer text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
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
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Projects Yet</h3>
              <p className="text-gray-500 mb-4">Create your first blog project to get started.</p>
              <Button 
                onClick={handleAddProject}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={projects}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;