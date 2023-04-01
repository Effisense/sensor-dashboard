import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { CustomClerkMetadata } from "../context";

export const getAuthentication = async (options: CreateNextContextOptions) => {
  const { userId, orgId: organizationId } = getAuth(options.req);
  const user = userId
    ? await clerkClient.users.getUser(userId).then((user) => ({
        ...user,
        // Clerk's privateMetadata is a `Record<string, unknown>`, so we need to parse it
        privateMetadata: user?.privateMetadata as CustomClerkMetadata,
      }))
    : null;

  return {
    user,
    organizationId,
  };
};

export const isAdmin = (
  user: inferAsyncReturnType<typeof getAuthentication>["user"],
) => {
  return user?.privateMetadata?.role === "admin";
};

export const userIsMemberOfOrganization = async (
  userId?: string | null,
  organizationId?: string | null,
) => {
  if (!userId || !organizationId) return false;

  return await clerkClient.users
    .getOrganizationMembershipList({
      userId,
    })
    .then((memberships) => {
      return memberships.some(
        (membership) => membership.organization.id === organizationId,
      );
    });
};

export const userIsMemberOfAnyOrganization = async (userId?: string | null) => {
  if (!userId) return false;

  return await clerkClient.users
    .getOrganizationMembershipList({
      userId,
    })
    .then((memberships) => {
      return memberships.length > 0;
    });
};
