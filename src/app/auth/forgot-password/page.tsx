"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="If that account exists, a reset link is on its way">
        <Link href="/auth/sign-in" className="block text-center text-sm font-medium text-[#FF9300] hover:underline">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Forgot password" subtitle="We'll email you a link to reset it">
      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="Work email"
          htmlFor="email"
          type="email"
          autoComplete="email"
          register={register("email")}
          error={errors.email?.message}
        />
        <Button type="submit" disabled={loading} className="bg-[#FF9300] hover:bg-[#000F9A]">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <Link href="/auth/sign-in" className="mt-6 block text-center text-sm font-medium text-[#FF9300] hover:underline">
        Back to sign in
      </Link>
    </AuthShell>
  );
}
