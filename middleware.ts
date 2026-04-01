import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "./src/lib/database.types";

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ["/account", "/admin"];
  const adminRoutes = ["/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    requestUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    requestUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminRoute && user) {
    // Check if user has admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as { data: { role: string } | null };

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|apple-touch-icon.png|public/).*)",
  ],
};
