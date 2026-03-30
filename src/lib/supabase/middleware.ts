import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Unauthenticated users cannot access dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Clear cached role when logged out
  if (!user && request.cookies.get("df-role")) {
    supabaseResponse.cookies.set("df-role", "", { path: "/", maxAge: 0 });
  }

  if (user) {
    // Read cached role from cookie; only hit DB if missing
    const cachedRole = request.cookies.get("df-role")?.value;
    let role: string;
    if (cachedRole) {
      role = cachedRole;
    } else {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role || "buyer";
      supabaseResponse.cookies.set("df-role", role, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
      });
    }

    const dashboardPath = role === "seller" ? "/dashboard/seller" : "/dashboard/buyer";

    // Redirect logged-in users away from auth pages to their dashboard
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }

    // Prevent buyers from accessing seller dashboard and vice versa
    if (pathname.startsWith("/dashboard/seller") && role !== "seller" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/buyer";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/dashboard/buyer") && role !== "buyer" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/seller";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
