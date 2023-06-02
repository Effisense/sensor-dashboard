import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userIsMemberOfOrganization } from "../lib/clerk";
import { protectedProcedure, router } from "../trpc";
import { Organization, UserInOrganization } from "@acme/db/src/schema";

export const organizationRouter = router({
  addUserToOrganization: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      const isMemberOfOrganization = await userIsMemberOfOrganization(
        ctx.auth.user?.id,
        ctx.auth.organizationId,
      );
      if (!isMemberOfOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not part of this organization",
        });
      }

      const organizationExists = await ctx.db.query.Organization.findFirst({
        where: (Organization, { eq }) =>
          eq(Organization.id, ctx.auth.organizationId as string),
      })
        .execute()
        .then((org) => !!org);

      if (!organizationExists) {
        await ctx.db
          .insert(Organization)
          .values({
            id: ctx.auth.organizationId,
          })
          .execute();
      }

      // Link user to organization if not already linked
      return ctx.db
        .insert(UserInOrganization)
        .values({
          userId,
          organizationId: ctx.auth.organizationId,
        })
        .onDuplicateKeyUpdate({
          set: {
            userId,
            organizationId: ctx.auth.organizationId,
          },
        }).execute;
    }),
});
