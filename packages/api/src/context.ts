import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getAuthentication } from "./lib/clerk";
import { db } from "@acme/db";

export type CustomClerkMetadata = Record<string, unknown> & {
  role?: "user" | "admin";
};

type ContextInnerProps = {
  auth: inferAsyncReturnType<typeof getAuthentication>;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async ({ auth }: ContextInnerProps) => {
  return {
    auth,
    db,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (options: CreateNextContextOptions) => {
  const auth = await getAuthentication(options);
  return await createContextInner({ auth });
};

export type Context = inferAsyncReturnType<typeof createContext>;
