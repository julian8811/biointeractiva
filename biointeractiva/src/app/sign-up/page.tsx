import { redirect } from "next/navigation";

export default function SignUpPage() {
  // Redirect to Clerk hosted sign-up page - use the new Clerk app URL
  const clerkSignUpUrl = "https://biointeractiva.clerk.app/sign-up";
  
  redirect(clerkSignUpUrl);
}
