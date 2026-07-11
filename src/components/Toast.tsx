"use client";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="animate-rm-fadein fixed bottom-7 right-7 rounded-lg bg-[#000F9A] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]">
      <i className="fa-solid fa-circle-check mr-2 text-[#FF9300]" />
      {message}
    </div>
  );
}
