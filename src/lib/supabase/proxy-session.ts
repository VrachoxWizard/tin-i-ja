import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { getDashboardPathForRole } from "@/lib/contracts";

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

  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    "https://vercel.live",
  ];
  if (process.env.NODE_ENV !== "production") {
    scriptSources.push("'unsafe-eval'");
  }

  const csp = [
    `default-src 'self'`,
    // Scripts: self + Vercel analytics/insights
    `script-src ${scriptSources.join(" ")}`,
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
    `frame-ancestors 'none'`,
    // No plugins
    `object-src 'none'`,
    // Restrict base URI
    `base-uri 'self'`,
    // Only HTTPS form submissions
    `form-action 'self'`,
    // Upgrade all HTTP requests to HTTPS
    `upgrade-insecure-requests`,
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

  if (user) {
    const { data: profileData } = await supabase
      .from("users")
      .select("role, suspended_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileData?.suspended_at) {
      await supabase.auth.signOut();

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "account_suspended");
      return buildSecurityHeaders(NextResponse.redirect(url));
    }

    const role = profileData?.role ?? "buyer";
    const dashboardPath = getDashboardPathForRole(role);

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
      url.pathname = dashboardPath;
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
