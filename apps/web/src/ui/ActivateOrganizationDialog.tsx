import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./AlertDialog";

type ActivateOrganizationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  open: boolean;
  onOpenChange: () => void;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  body?: ReactNode;
};

const ActivateOrganizationDialog = ({
  title,
  description,
  onConfirm,
  open,
  onOpenChange,
  body,
  showCancelButton = true,
  showConfirmButton = true,
}: ActivateOrganizationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {body}
        <AlertDialogFooter>
          {showCancelButton && <AlertDialogCancel>Cancel</AlertDialogCancel>}
          {showConfirmButton && (
            <AlertDialogAction
              onClick={onConfirm}
              className="border border-mint-8 bg-mint-7 hover:bg-mint-8"
            >
              Got it!
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActivateOrganizationDialog;
