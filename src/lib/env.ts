/**
 * Validates that all required environment variables are set.
 * Call this at build/startup time to fail fast with clear messages.
 */
export function validateEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
  ];

  const recommended = [
    "NEXT_PUBLIC_SITE_URL",
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
