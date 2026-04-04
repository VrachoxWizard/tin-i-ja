import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

// ── Security headers applied to every response ─────────────────────────────
function buildSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Stop MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Minimal referrer info on cross-origin requests
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // HSTS: force HTTPS for 1 year, include subdomains, allow preload
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  // Disable unnecessary browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  // Remove server fingerprint header (also set in next.config.ts)
  response.headers.delete("X-Powered-By");

  // Content-Security-Policy — tuned for Next.js + Supabase + Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dealflow.hr";

  const csp = [
    `default-src 'self'`,
    // Scripts: self + Vercel analytics/insights (inline hashes managed by Next.js)
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live`,
    // Styles: self + inline (required for Tailwind CSS-in-JS)
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    // Fonts
    `font-src 'self' https://fonts.gstatic.com`,
    // Images: self + Supabase storage + Unsplash + data URIs
    `img-src 'self' data: blob: ${supabaseUrl} https://images.unsplash.com`,
    // API connections: self + Supabase + Vercel analytics
    `connect-src 'self' ${supabaseUrl} https://va.vercel-scripts.com https://vitals.vercel-insights.com wss://${new URL(supabaseUrl || "https://placeholder.supabase.co").host}`,
    // No iframes from external sources
    `frame-src 'none'`,
    // No plugins
    `object-src 'none'`,
    // Restrict base URI
    `base-uri 'self'`,
    // Only HTTPS form submissions
    `form-action 'self'`,
    // Upgrade all HTTP requests to HTTPS
    `upgrade-insecure-requests`,
    // Report violations
    `report-uri ${siteUrl}/api/csp-report`,
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

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
    return buildSecurityHeaders(NextResponse.redirect(url));
  }

  if (!user && request.cookies.get("df-role")) {
    supabaseResponse.cookies.set("df-role", "", { path: "/", maxAge: 0 });
    supabaseResponse.cookies.set("df-role-ts", "", { path: "/", maxAge: 0 });
  }

  if (user) {
    const cachedRole = request.cookies.get("df-role")?.value;
    let role: string;

    const roleCookieAge = request.cookies.get("df-role-ts")?.value;
    const isFresh =
      roleCookieAge && Date.now() - Number(roleCookieAge) < 5 * 60 * 1000;

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
      return buildSecurityHeaders(NextResponse.redirect(url));
    }

    if (
      pathname.startsWith("/dashboard/seller") &&
      role !== "seller" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/buyer";
      return buildSecurityHeaders(NextResponse.redirect(url));
    }

    if (
      pathname.startsWith("/dashboard/buyer") &&
      role !== "buyer" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/seller";
      return buildSecurityHeaders(NextResponse.redirect(url));
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return buildSecurityHeaders(NextResponse.redirect(url));
    }

    if (
      pathname.startsWith("/dashboard/broker") &&
      role !== "broker" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPath;
      return buildSecurityHeaders(NextResponse.redirect(url));
    }
  }

  // Apply security headers to all passing responses
  return buildSecurityHeaders(supabaseResponse);
}
