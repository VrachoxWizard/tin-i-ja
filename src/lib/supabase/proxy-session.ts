import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!user && request.cookies.get("df-role")) {
    supabaseResponse.cookies.set("df-role", "", { path: "/", maxAge: 0 });
    supabaseResponse.cookies.set("df-role-ts", "", { path: "/", maxAge: 0 });
  }

  if (user) {
    const cachedRole = request.cookies.get("df-role")?.value;
    let role: string;

    const roleCookieAge = request.cookies.get("df-role-ts")?.value;
    const isFresh = roleCookieAge && Date.now() - Number(roleCookieAge) < 5 * 60 * 1000;

    if (cachedRole && isFresh) {
      role = cachedRole;
    } else {
      const { data: profileData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      role = profileData?.role || "buyer";
      const cookieOpts = {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 5 * 60,
      };
      supabaseResponse.cookies.set("df-role", role, cookieOpts);
      supabaseResponse.cookies.set("df-role-ts", String(Date.now()), cookieOpts);
    }

    const dashboardPath =
      role === "admin"
        ? "/dashboard/admin"
        : role === "broker"
          ? "/dashboard/broker"
          : role === "seller"
            ? "/dashboard/seller"
            : "/dashboard/buyer";

    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/dashboard/seller") &&
      role !== "seller" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/buyer";
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/dashboard/buyer") &&
      role !== "buyer" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/seller";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/dashboard/broker") &&
      role !== "broker" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
