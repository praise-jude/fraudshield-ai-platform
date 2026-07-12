export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-6 dark:bg-[#0B0F1A]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF9300]">
            <i className="fa-solid fa-shield-halved text-white" />
          </div>
          <span className="text-lg font-extrabold text-[#1F2937] dark:text-white">
            FraudShield <span className="text-[#FF9300]">AI</span>
          </span>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <h1 className="text-xl font-bold text-[#1F2937] dark:text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6B7280] dark:text-white/60">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
