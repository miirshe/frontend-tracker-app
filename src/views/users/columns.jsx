import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SquarePen, Trash2, Eye, Mail, User } from 'lucide-react';

export const createUserColumns = (onEdit, onDelete, onView) => [
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
    header: "User Info",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <span className="text-sm font-medium">
            {row.original.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </span>
        </div>
        <div className="space-y-1">
          <div className="font-medium">{row.original.name || 'N/A'}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{row.original.email || 'No email'}</span>
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Mail className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.original.email || 'No email'}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Role",
    cell: ({ row }) => {
      const roleColors = {
        admin: "bg-red-100 text-red-800",
        user: "bg-blue-100 text-blue-800",
        moderator: "bg-green-100 text-green-800",
        manager: "bg-purple-100 text-purple-800",
      };
      const role = row.original.type || 'user';
      return (
        <Badge 
          variant="outline" 
          className={roleColors[role.toLowerCase()] || roleColors.user}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
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
          title="Edit User"
        >
          <SquarePen className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete && onDelete(row.original)}
          className="h-8 w-8 p-0"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
    enableHiding: false,
  },
];
