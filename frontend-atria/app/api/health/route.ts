import { NextResponse } from "next/server";
import { resolveApiBaseUrl } from "@/lib/api-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ServiceStatus = "up" | "down" | "skipped";

interface HealthPayload {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  supabase: {
    configured: boolean;
    status: ServiceStatus;
  };
  api: {
    status: ServiceStatus;
    url: string | null;
  };
}

export async function GET() {
  const timestamp = new Date().toISOString();
  const apiUrl = resolveApiBaseUrl();

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  let supabaseStatus: ServiceStatus = "skipped";
  if (supabaseConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.getSession();
      supabaseStatus = error ? "down" : "up";
    } catch {
      supabaseStatus = "down";
    }
  }

  let apiStatus: ServiceStatus = "skipped";
  try {
    const response = await fetch(`${apiUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    apiStatus = response.ok ? "up" : "down";
  } catch {
    apiStatus = "down";
  }

  let status: HealthPayload["status"] = "ok";
  if (supabaseStatus === "down" || apiStatus === "down") {
    status = supabaseStatus === "down" && apiStatus === "down" ? "error" : "degraded";
  }
  if (!supabaseConfigured && apiStatus === "down") {
    status = "error";
  }

  const payload: HealthPayload = {
    status,
    timestamp,
    supabase: {
      configured: supabaseConfigured,
      status: supabaseStatus,
    },
    api: {
      status: apiStatus,
      url: apiUrl,
    },
  };

  return NextResponse.json(payload, {
    status: status === "error" ? 503 : 200,
  });
}
