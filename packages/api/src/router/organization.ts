import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userIsMemberOfOrganization } from "../lib/clerk";
import { protectedProcedure, router } from "../trpc";

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

      // Ensure organization exists
      await ctx.prisma.organization.upsert({
        where: {
          id: ctx.auth.organizationId,
        },
        update: {
          id: ctx.auth.organizationId,
        },
        create: {
          id: ctx.auth.organizationId,
        },
      });

      // Link user to organization
      return await ctx.prisma.userInOrganization.create({
        data: {
          userId,
          organizationId: ctx.auth.organizationId,
        },
      });
    }),
});
