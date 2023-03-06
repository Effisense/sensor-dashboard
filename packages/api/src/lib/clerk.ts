import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { CustomClerkMetadata } from "../context";

export const getUser = async (options: CreateNextContextOptions) => {
  const { userId } = getAuth(options.req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  return user
    ? {
        ...user,
        // Clerk's privateMetadata is a `Record<string, unknown>`, so we need to parse it
        privateMetadata: user?.privateMetadata as CustomClerkMetadata,
      }
    : null;
};

export const isAdmin = (user: inferAsyncReturnType<typeof getUser>) => {
  return user?.privateMetadata?.role === "admin";
};
