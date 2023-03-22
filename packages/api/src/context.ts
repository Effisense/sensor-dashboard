import { prisma } from "@acme/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { User } from "@clerk/nextjs/api";
import { getUser } from "./lib/clerk";

export type CustomClerkMetadata = Record<string, unknown> & {
  role?: "user" | "admin";
};

type UserProps = {
  user:
    | (User & {
        privateMetadata?: CustomClerkMetadata;
      })
    | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async ({ user }: UserProps) => {
  return {
    user,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (options: CreateNextContextOptions) => {
  const user = await getUser(options);
  return await createContextInner({ user });
};

export type Context = inferAsyncReturnType<typeof createContext>;
