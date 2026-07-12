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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORG_TYPES, signUpSchema, type SignUpInput } from "@/lib/validation/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { acceptTerms: false },
  });

  async function onSubmit(values: SignUpInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(typeof data.error === "string" ? data.error : "Please check the form for errors.");
        return;
      }
      router.push(data.needsEmailConfirmation ? "/auth/verify-email" : "/");
    } catch {
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Register your organization" subtitle="The first account becomes the Organization Owner">
      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Organization</h2>
          <FormField label="Organization name" htmlFor="orgName" register={register("orgName")} error={errors.orgName?.message} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgType">Organization type</Label>
            <Select onValueChange={(v) => setValue("orgType", v as SignUpInput["orgType"], { shouldValidate: true })}>
              <SelectTrigger id="orgType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ORG_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.orgType && <p className="text-xs text-red-600">{errors.orgType.message}</p>}
          </div>

          <FormField
            label="Business registration number (optional)"
            htmlFor="businessRegistrationNumber"
            register={register("businessRegistrationNumber")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Country" htmlFor="country" register={register("country")} error={errors.country?.message} />
            <FormField label="State (optional)" htmlFor="state" register={register("state")} />
          </div>
          <FormField label="Organization address (optional)" htmlFor="address" register={register("address")} />
          <FormField
            label="Official email"
            htmlFor="officialEmail"
            type="email"
            register={register("officialEmail")}
            error={errors.officialEmail?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone (optional)" htmlFor="phone" register={register("phone")} />
            <FormField
              label="Website (optional)"
              htmlFor="website"
              register={register("website")}
              error={errors.website?.message}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] pt-5 dark:border-white/10">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Administrator</h2>
          <FormField label="Full name" htmlFor="fullName" register={register("fullName")} error={errors.fullName?.message} />
          <FormField
            label="Work email"
            htmlFor="workEmail"
            type="email"
            autoComplete="email"
            register={register("workEmail")}
            error={errors.workEmail?.message}
          />
          <FormField label="Job title" htmlFor="jobTitle" register={register("jobTitle")} error={errors.jobTitle?.message} />
          <FormField
            label="Password"
            htmlFor="password"
            type="password"
            autoComplete="new-password"
            register={register("password")}
            error={errors.password?.message}
          />
          <FormField
            label="Confirm password"
            htmlFor="confirmPassword"
            type="password"
            autoComplete="new-password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-[#374151] dark:text-white/70">
            <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 h-4 w-4 rounded border-gray-300" />
            <span>
              I accept the{" "}
              <a href="#" className="font-medium text-[#FF9300] hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-[#FF9300] hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1 text-xs text-red-600">{errors.acceptTerms.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="bg-[#FF9300] hover:bg-[#000F9A]">
          {loading ? "Creating account…" : "Create organization account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-white/60">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-[#FF9300] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
