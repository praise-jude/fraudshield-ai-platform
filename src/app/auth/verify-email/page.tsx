import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Check your email" subtitle="We sent a confirmation link to your work email">
      <p className="text-sm text-[#374151] dark:text-white/70">
        Click the link in that email to verify your address and activate your organization. If you
        don&apos;t see it, check spam.
      </p>
      <Link
        href="/auth/sign-in"
        className="mt-6 block text-center text-sm font-medium text-[#FF9300] hover:underline"
      >
        Back to sign in
      </Link>
    </AuthShell>
  );
}
