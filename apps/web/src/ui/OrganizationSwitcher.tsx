import { trpc } from "@/utils/trpc";
import {
  OrganizationSwitcher as ClerkOrganizationSwitcher,
  useAuth,
} from "@clerk/nextjs";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const OrganizationSwitcher = () => {
  const { userId, orgId } = useAuth();
  const { mutateAsync, isLoading } =
    trpc.organization.addUserToOrganization.useMutation();

  useEffect(() => {
    const addUserToOrganization = async () => {
      if (!orgId) return;
      await mutateAsync({ userId });
    };

    addUserToOrganization();
  }, [mutateAsync, orgId, userId]);

  return (
    <div className="mx-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <ClerkOrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherPopoverActionButton__createOrganization: {
                display: "none",
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default OrganizationSwitcher;
