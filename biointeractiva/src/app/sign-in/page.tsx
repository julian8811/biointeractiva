import { redirect } from "next/navigation";

export default function SignInPage() {
  // Redirect to Clerk hosted sign-in page - use the new Clerk app URL
  const clerkSignInUrl = "https://biointeractiva.clerk.app/sign-in";
  
  redirect(clerkSignInUrl);
}
