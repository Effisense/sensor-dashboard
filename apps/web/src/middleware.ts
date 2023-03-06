import {
  clerkClient,
  getAuth,
  withClerkMiddleware,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@acme/api/src/lib/clerk";

const publicPaths = ["/", "/sign-in*", "/sign-up*"];

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

export default withClerkMiddleware(async (req) => {
  if (isPublicPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { userId } = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  if (!user) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminPath(req.nextUrl.pathname) && !isAdmin(user)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
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
