"use client";

export function validateEnv() {
  // Support both prefixed and non-prefixed Clerk keys
  const hasClerkPublishableKey = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_biointeractiva_CLERK_PUBLISHABLE_KEY;
  const hasClerkSecretKey = 
    process.env.CLERK_SECRET_KEY || 
    process.env.biointeractiva_CLERK_SECRET_KEY;

  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (!hasClerkPublishableKey || !hasClerkSecretKey) {
    console.error("Missing Clerk environment variables");
    return false;
  }

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    return false;
  }

  return true;
}
