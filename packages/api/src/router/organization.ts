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

      const organizationExists = await ctx.prisma.organization
        .findUnique({
          where: {
            id: ctx.auth.organizationId,
          },
        })
        .then((org) => !!org);

      if (!organizationExists) {
        await ctx.prisma.organization.create({
          data: {
            id: ctx.auth.organizationId,
          },
        });
      }

      // Link user to organization if not already linked
      return await ctx.prisma.userInOrganization.upsert({
        where: {
          userId_organizationId: {
            userId,
            organizationId: ctx.auth.organizationId,
          },
        },
        update: {
          userId,
          organizationId: ctx.auth.organizationId,
        },
        create: {
          userId,
          organizationId: ctx.auth.organizationId,
        },
      });
    }),
});
