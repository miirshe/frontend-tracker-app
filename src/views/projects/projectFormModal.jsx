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
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/redux/api/projectApi';
import { useGetUsersQuery } from '@/redux/api/userApi';
import { createProjectSchema, updateProjectSchema } from './schema';

const ProjectFormModal = ({ 
  isOpen, 
  onClose, 
  project = null, // Pass project data for editing, null for creating
  onSuccess = () => {} 
}) => {
  const isEditing = !!project;
  const schema = isEditing ? updateProjectSchema : createProjectSchema;

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
  
  // Fetch users for members selection
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
    limit: 100, // Get more users for selection
    sort: 'username:asc'
  });

  const selectedStatus = watch('status');
  const selectedMembers = watch('members');

  const users = usersData?.docs || [];

  useEffect(() => {
    if (isOpen) {
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
    onClose();
  };

  const handleMemberChange = (userId, checked) => {
    const currentMembers = selectedMembers || [];
    let newMembers;
    
    if (checked) {
      newMembers = [...currentMembers, userId];
    } else {
      newMembers = currentMembers.filter(id => id !== userId);
    }
    
    setValue('members', newMembers);
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
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
              {usersLoading ? (
                <div className="text-sm text-muted-foreground">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-sm text-muted-foreground">No users available</div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => {
                    const userId = user._id || user.id;
                    const isSelected = selectedMembers?.includes(userId) || false;
                    
                    return (
                      <div key={userId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`member-${userId}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleMemberChange(userId, checked)}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={`member-${userId}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.username || user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {errors.members && (
              <p className="text-sm text-red-500">{errors.members.message}</p>
            )}
            {selectedMembers?.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
            )}
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