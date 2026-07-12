"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthShell from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        setServerError(error.message);
        return;
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password for your account">
      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="New password"
          htmlFor="password"
          type="password"
          autoComplete="new-password"
          register={register("password")}
          error={errors.password?.message}
        />
        <FormField
          label="Confirm new password"
          htmlFor="confirmPassword"
          type="password"
          autoComplete="new-password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" disabled={loading} className="bg-[#FF9300] hover:bg-[#000F9A]">
          {loading ? "Saving…" : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
