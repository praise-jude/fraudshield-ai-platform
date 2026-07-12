"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Sign in failed");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Access your organization's fraud monitoring dashboard">
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
        <FormField
          label="Password"
          htmlFor="password"
          type="password"
          autoComplete="current-password"
          register={register("password")}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#374151] dark:text-white/70">
            <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-gray-300" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="font-medium text-[#FF9300] hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#FF9300] hover:bg-[#000F9A]">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-white/60">
        Don&apos;t have an organization account?{" "}
        <Link href="/auth/sign-up" className="font-medium text-[#FF9300] hover:underline">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}
