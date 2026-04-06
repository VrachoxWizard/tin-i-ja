/**
 * Validates that all required environment variables are set.
 * Call this at build/startup time to fail fast with clear messages.
 */
export function validateEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY", // Required for AI teaser generation & valuation
    "RESEND_API_KEY",               // Required for transactional emails
  ];

  const recommended = [
    "NEXT_PUBLIC_SITE_URL",
    "RESEND_FROM_EMAIL",   // Override once custom domain is verified in Resend
    "RESEND_ADMIN_EMAIL",  // Admin inbox for contact form submissions
  ];

  const missingRecommended = recommended.filter((key) => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn(
      `Warning: Missing recommended environment variables:\n${missingRecommended.map((k) => `  - ${k}`).join("\n")}`
    );
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nPlease check your .env.local file.`
    );
  }
}

