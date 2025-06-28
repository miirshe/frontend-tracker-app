import React, { useState } from 'react';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../../redux/api/projectApi';
import CustomDataTable from '@/components/customTable';
import { createProjectColumns } from './columns';
import ProjectsSummaryCards from './projectsSummaryCards';
import ProjectFormModal from './projectFormModal';
import { DeleteConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

const ProjectsView = () => {
  // State management for table
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Query parameters that match the backend getProjects function
  const { data: projects, isLoading, isFetching, error, refetch } = useGetProjectsQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: search,
    searchFields: "name,description,status",
    sort: "createdAt:desc"
  });

  // Delete project mutation
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Action handlers
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject({ id: projectToDelete.id || projectToDelete._id }).unwrap();
      
      toast.success(`Project "${projectToDelete.name}" deleted successfully!`);
      
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      
      // Refetch data to update the table
      refetch();
      
    } catch (error) {
      console.error('Delete project error:', error);
      const errorMessage = error?.data?.message || 'Failed to delete project. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleView = (project) => {
    // TODO: Implement project details view
    console.log('View project:', project);
  };

  const handleAddProject = () => {
    setSelectedProject(null); // null for creating new project
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleModalSuccess = () => {
    // Refetch projects data to get updated list
    refetch();
  };

  // Create columns with action handlers
  const columns = createProjectColumns(handleEdit, handleDelete, handleView);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading projects: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects Management</h1>
        <p className="text-muted-foreground">
          Manage your projects and track their progress
        </p>
      </div>

      {/* Summary Cards */}
      <ProjectsSummaryCards />

      {/* Projects Table */}
      <CustomDataTable
        title="All Projects"
        ButtonLabel="Add Project"
        columns={columns}
        data={projects || {}}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        addButtonClick={handleAddProject}
        showButton={true}
        searchable={true}
        sortable={true}
        showRefresh={true}
        onRefresh={() => {
          // Reset search and refresh
          setSearch("");
          setCurrentPage(1);
          refetch();
        }}
        emptyMessage="No projects found"
      />

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        project={selectedProject}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={projectToDelete?.name || 'Unknown Project'}
        itemType="project"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjectsView;
