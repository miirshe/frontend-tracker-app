import React, { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/api/userApi';
import CustomDataTable from '@/components/customTable';
import { createUserColumns } from './columns';
import UsersSummaryCards from './usersSummaryCards';
import UserFormModal from './userFormModal';
import { DeleteConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

const UsersView = () => {
  // State management for table
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Query parameters that match the backend getAlUsers function
  const { data: users, isLoading, isFetching, error, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: search,
    searchFields: "username,email,role",
    sort: "createdAt:desc"
  });

  // Delete user mutation
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Action handlers
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser({ id: userToDelete.id || userToDelete._id }).unwrap();
      
      toast.success(`User "${userToDelete.name || userToDelete.username}" deleted successfully!`);
      
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Refetch data to update the table
      refetch();
      
    } catch (error) {
      console.error('Delete user error:', error);
      const errorMessage = error?.data?.message || 'Failed to delete user. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleView = (user) => {
    // TODO: Implement user details view
    console.log('View user:', user);
  };

  const handleAddUser = () => {
    setSelectedUser(null); // null for creating new user
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    // Refetch users data to get updated list
    refetch();
  };

  // Create columns with action handlers
  const columns = createUserColumns(handleEdit, handleDelete, handleView);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading users: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage system users and view user statistics
        </p>
      </div>

      {/* Summary Cards */}
      <UsersSummaryCards />

      {/* Users Table */}
      <CustomDataTable
        title="All Projects"
        ButtonLabel="Add Project"
        columns={columns}
        data={users || {}}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        addButtonClick={handleAddUser}
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
        emptyMessage="No users found"
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={userToDelete?.name || userToDelete?.username || 'Unknown User'}
        itemType="user"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UsersView;