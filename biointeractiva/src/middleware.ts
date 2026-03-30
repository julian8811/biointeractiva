import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-in/**",
  "/sign-up",
  "/sign-up/**",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are not public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
