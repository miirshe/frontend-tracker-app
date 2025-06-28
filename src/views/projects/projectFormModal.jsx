import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/redux/api/projectApi';
import { useGetUsersQuery } from '@/redux/api/userApi';
import { createProjectSchema, updateProjectSchema } from './schema';
import { X, User, Plus } from 'lucide-react';

const ProjectFormModal = ({ 
  isOpen, 
  onClose, 
  project = null, // Pass project data for editing, null for creating
  onSuccess = () => {} 
}) => {
  const isEditing = !!project;
  const schema = isEditing ? updateProjectSchema : createProjectSchema;

  // State for member search
  const [memberSearch, setMemberSearch] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      members: [],
      status: 'active',
    }
  });

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  
  // Fetch users for members selection with search
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
    limit: 50, // Reasonable limit for selection
    search: memberSearch.trim().length >= 2 ? memberSearch : '', // Only search if 2+ characters
    searchFields: 'username,email',
    sort: 'username:asc'
  });

  // Also get selected users data (for when editing)
  const selectedMembers = watch('members');
  const { data: selectedUsersData } = useGetUsersQuery({
    limit: 100,
    sort: 'username:asc'
  }, {
    skip: !selectedMembers?.length // Only fetch if there are selected members
  });

  const users = usersData?.docs || [];
  const allUsers = selectedUsersData?.docs || [];

  useEffect(() => {
    if (isOpen) {
      // Reset search when modal opens
      setMemberSearch('');
      
      if (isEditing && project) {
        // Extract member IDs for form
        const memberIds = project.members?.map(member => 
          typeof member === 'object' ? member._id || member.id : member
        ) || [];
        
        reset({
          name: project.name || '',
          description: project.description || '',
          members: memberIds,
          status: project.status || 'active',
        });
      } else {
        reset({
          name: '',
          description: '',
          members: [],
          status: 'active',
        });
      }
    }
  }, [isOpen, isEditing, project, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateProject({ 
          id: project.id || project._id, 
          ...data 
        }).unwrap();
        
        toast.success('Project updated successfully!');
      } else {
        await createProject(data).unwrap();
        toast.success('Project created successfully!');
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error?.data?.message || 
        `Failed to ${isEditing ? 'update' : 'create'} project. Please try again.`;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset();
    setMemberSearch(''); // Reset search when closing
    onClose();
  };

  const handleMemberSelect = (userId) => {
    const currentMembers = selectedMembers || [];
    if (!currentMembers.includes(userId)) {
      setValue('members', [...currentMembers, userId]);
    }
    // Clear search after selection
    setMemberSearch('');
  };

  const handleMemberRemove = (userId) => {
    const currentMembers = selectedMembers || [];
    setValue('members', currentMembers.filter(id => id !== userId));
  };

  const getSelectedUsers = () => {
    // Get selected users from allUsers data (which has all users)
    return allUsers.filter(user => 
      selectedMembers?.includes(user._id || user.id)
    );
  };

  const getAvailableUsers = () => {
    // Return users from search results, filtered to exclude already selected
    return users.filter(user => 
      !selectedMembers?.includes(user._id || user.id)
    );
  };

  const handleSearchChange = (value) => {
    setMemberSearch(value);
  };

  const isLoading = isSubmitting || isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Project: ${project?.name || 'Unknown'}` : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the project information below.' 
              : 'Fill in the details to create a new project.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              disabled={isLoading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Enter project description"
              disabled={isLoading}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Members Selection */}
          <div className="space-y-2">
            <Label>Team Members</Label>
            
            {/* Selected Members Display */}
            {getSelectedUsers().length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                {getSelectedUsers().map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <Badge key={userId} variant="secondary" className="gap-1">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{user.username || user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleMemberRemove(userId)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Search and Add Members */}
            <Command className="border rounded-md">
              <CommandInput 
                placeholder="Search users to add..." 
                value={memberSearch}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                <CommandEmpty>
                  {usersLoading 
                    ? "Searching users..." 
                    : memberSearch.trim() 
                      ? "No users found matching your search." 
                      : "Start typing to search for users..."
                  }
                </CommandEmpty>
                {getAvailableUsers().length > 0 && (
                  <CommandGroup heading={`Available Users ${memberSearch ? `(${getAvailableUsers().length} found)` : ''}`}>
                    {getAvailableUsers().map((user) => {
                      const userId = user._id || user.id;
                      return (
                        <CommandItem
                          key={userId}
                          onSelect={() => handleMemberSelect(userId)}
                          className="cursor-pointer"
                          disabled={isLoading}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{user.username || user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>

            {errors.members && (
              <p className="text-sm text-red-500">{errors.members.message}</p>
            )}
            
            <p className="text-xs text-muted-foreground">
              {selectedMembers?.length || 0} member{selectedMembers?.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Project' : 'Create Project')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormModal; 