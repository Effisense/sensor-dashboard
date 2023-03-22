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
  auth: inferAsyncReturnType<typeof getAuthentication>,
) => {
  return auth?.user?.privateMetadata?.role === "admin";
};
