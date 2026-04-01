import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const proto = request.headers.get("x-forwarded-proto"); // same
      const host = forwardedHost || request.headers.get("host");
      const origin = proto ? `${proto}://${host}` : "";
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/login?error=invalid_code", request.url));
}
