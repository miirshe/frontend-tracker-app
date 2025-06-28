import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Continue",
  cancelText = "Cancel",
  variant = "destructive", // destructive, default, info, success
  isLoading = false,
  icon: CustomIcon = null
}) => {
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;
    
    switch (variant) {
      case 'destructive':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'destructive':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'default';
    }
  };

  const Icon = getIcon();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${
              variant === 'destructive' ? 'bg-red-100' :
              variant === 'info' ? 'bg-blue-100' :
              variant === 'success' ? 'bg-green-100' :
              'bg-gray-100'
            }`}>
              <Icon className={`h-5 w-5 ${getIconColor()}`} />
            </div>
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Specialized delete confirmation dialog
export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "item",
  itemType = "item",
  isLoading = false
}) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove all associated data.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      icon={Trash2}
      isLoading={isLoading}
    />
  );
};

export default ConfirmationDialog; 