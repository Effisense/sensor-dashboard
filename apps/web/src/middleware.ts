import {
  clerkClient,
  getAuth,
  withClerkMiddleware,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@acme/api/src/lib/clerk";

/**
 * Get the authentication state from Clerk.
 *
 * @param req is the Next.js request object
 * @returns the authentication state, including the user and organization.
 */
const getAuthentication = async (req: NextRequest) => {
  const { userId, orgId: organizationId } = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const organization = organizationId
    ? await clerkClient.organizations.getOrganization({ organizationId })
    : null;

  return {
    user,
    organization,
  };
};

const publicPaths = ["/sign-in*", "/sign-up*", "/scan"];

const adminPaths = ["/admin*"];

const isPublicPath = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))),
  );
};

const isAdminPath = (path: string) => {
  return adminPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))),
  );
};

const isActivateOrganizationPath = (path: string) => {
  return path === "/organizations/activate";
};

export default withClerkMiddleware(async (req) => {
  if (isPublicPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { user, organization } = await getAuthentication(req);

  if (!user) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminPath(req.nextUrl.pathname) && !isAdmin(user)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (!organization && isActivateOrganizationPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (organization && isActivateOrganizationPath(req.nextUrl.pathname)) {
    const dashboardUrl = new URL("/", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!organization) {
    const activateOrganizationUrl = new URL("/organizations/activate", req.url);
    return NextResponse.redirect(activateOrganizationUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * Match request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     *
     * This includes images, and requests from TRPC.
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};
