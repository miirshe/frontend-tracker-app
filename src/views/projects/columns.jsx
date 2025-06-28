import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SquarePen, Trash2, Eye, FolderOpen, Users, User } from 'lucide-react';

export const createProjectColumns = (onEdit, onDelete, onView) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Project Info",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <div className="font-medium">{row.original.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
            {row.original.description || 'No description'}
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        archived: "bg-gray-100 text-gray-800",
      };
      const status = row.original.status || 'active';
      return (
        <Badge 
          variant="outline" 
          className={statusColors[status.toLowerCase()] || statusColors.active}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const creator = row.original.createdBy;
      if (!creator) {
        return <div className="text-sm text-gray-400">N/A</div>;
      }
      
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3 w-3" />
          </div>
          <div className="text-sm">
            <div className="font-medium">{creator.username || creator.name}</div>
            <div className="text-xs text-muted-foreground">{creator.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Team",
    cell: ({ row }) => {
      const members = row.original.members || [];
      const memberCount = row.original.memberCount || members.length || 0;
      
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">{memberCount}</span>
          <span className="text-xs text-muted-foreground">
            member{memberCount !== 1 ? 's' : ''}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return <div className="text-sm text-gray-400">N/A</div>;
      }
      
      const date = new Date(row.original.createdAt);
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{date.toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      if (!row.original.updatedAt) {
        return <div className="text-sm text-gray-400">N/A</div>;
      }
      
      const date = new Date(row.original.updatedAt);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        return <div className="text-sm text-green-600">{diffInHours}h ago</div>;
      } else {
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView && onView(row.original)}
          className="h-8 w-8 p-0"
          title="View Details"
        >
          <Eye className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit && onEdit(row.original)}
          className="h-8 w-8 p-0"
          title="Edit Project"
        >
          <SquarePen className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete && onDelete(row.original)}
          className="h-8 w-8 p-0"
          title="Delete Project"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
    enableHiding: false,
  },
];
