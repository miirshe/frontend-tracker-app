import { z } from "zod";

// Create project schema
export const createProjectSchema = z.object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters'),
    members: z
      .array(z.string())
      .min(1, 'At least one member is required'),
    status: z.enum(['active', 'completed', 'archived'], {
      required_error: 'Please select a status',
    }),
  });

// Update project schema (same fields as create)
export const updateProjectSchema = z.object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters'),
    members: z
      .array(z.string())
      .min(1, 'At least one member is required'),
    status: z.enum(['active', 'completed', 'archived'], {
      required_error: 'Please select a status',
    }),
  }); 