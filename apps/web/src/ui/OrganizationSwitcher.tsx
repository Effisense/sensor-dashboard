import { useToast } from "@/hooks/toast/useToast";
import { trpc } from "@/utils/trpc";
import {
  OrganizationSwitcher as ClerkOrganizationSwitcher,
  useAuth,
} from "@clerk/nextjs";
import { useEffect } from "react";

const OrganizationSwitcher = () => {
  const { userId, orgId } = useAuth();
  const { toast } = useToast();
  const { mutateAsync, isLoading } =
    trpc.organization.addUserToOrganization.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully set active organization",
          severity: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "An error occurred when setting the active organization",
          severity: "error",
        });
      },
    });

  useEffect(() => {
    const addUserToOrganization = async () => {
      if (!orgId) return;
      await mutateAsync({ userId });
    };

    addUserToOrganization();
  }, [mutateAsync, orgId, userId]);

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Loading...",
        description: "Setting active organization",
        severity: "neutral",
      });
    }
  }, [isLoading, toast]);

  return (
    <ClerkOrganizationSwitcher
      appearance={{
        elements: {
          organizationSwitcherPopoverActionButton__createOrganization: {
            display: "none",
          },
        },
      }}
    />
  );
};

export default OrganizationSwitcher;
