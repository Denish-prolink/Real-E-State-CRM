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
import { Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  title = "Delete Confirmation",
  description,
  itemName,
}: DeleteConfirmDialogProps) {
  const finalDescription =
    description ??
    (itemName
      ? `Are you sure you want to permanently delete "${itemName}"? This action cannot be undone and the record will be removed from the database.`
      : "Are you sure you want to permanently delete this record? This action cannot be undone.");

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && !isPending && onOpenChange(false)}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {finalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
      <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
  <AlertDialogCancel
    disabled={isPending}
    className="w-full sm:flex-1"
  >
    Cancel
  </AlertDialogCancel>

  <AlertDialogAction
    onClick={onConfirm}
    disabled={isPending}
    className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
  >
    {isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Deleting...
      </>
    ) : (
      <>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </>
    )}
  </AlertDialogAction>
</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
