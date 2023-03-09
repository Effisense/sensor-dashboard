import { OrganizationSwitcher as ClerkOrganizationSwitcher } from "@clerk/nextjs";

const OrganizationSwitcher = () => {
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
