import { createNextMiddleware } from "gt-next/middleware";

export default createNextMiddleware();

export const config = {
  matcher: ["/((?!api|og|opengraph-image|static|.*\\..*|_next).*)"],
};
