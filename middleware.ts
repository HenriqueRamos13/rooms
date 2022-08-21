import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Sanitize } from "./src/utils/middlewares/sanitize";

export async function middleware(request: NextRequest) {
  try {
    await Sanitize(request);
  } catch (error) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
