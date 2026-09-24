import { NextRequest } from "next/server";
import { proxyAuthRequest } from "@/lib/auth-proxy";

export async function POST(request: NextRequest) {
  return proxyAuthRequest(request, "/auth/signup-with-token");
}
