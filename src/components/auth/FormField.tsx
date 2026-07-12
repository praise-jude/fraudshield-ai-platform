"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  htmlFor: string;
  error?: string;
  register: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export default function FormField({
  label,
  htmlFor,
  error,
  register,
  type = "text",
  placeholder,
  autoComplete,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Input
        id={htmlFor}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        {...register}
      />
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
