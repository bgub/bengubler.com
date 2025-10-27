import { createNextMiddleware } from "gt-next/middleware";

export default createNextMiddleware();

export const config = {
  // Match all paths except API routes, static files, and Next.js internals
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
