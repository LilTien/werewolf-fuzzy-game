import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
}) {
  const variants = {
    primary:
      "bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-200",
    danger:
      "bg-red-500 hover:bg-red-400 text-white border-red-300",
    success:
      "bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-300",
    ghost:
      "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm",
  };

  // Updated RegEx: Now matches standard sizes AND arbitrary bracket values (e.g., text-[11px])
  // It also ensures it doesn't accidentally match hover:text-xl by checking for spaces/string start
  const hasTextSizeOverride = /(?:^|\s)text-(?:xs|sm|base|lg|xl|[2-9]xl|\[.*?\])(?:\s|$)/.test(className);

  // Apply default text size ONLY if an override wasn't passed in
  const sizes = {
    sm: `px-3 py-2 ${hasTextSizeOverride ? "" : "text-sm"}`,
    md: `px-5 py-3 ${hasTextSizeOverride ? "" : "text-base"}`,
    lg: `px-7 py-4 ${hasTextSizeOverride ? "" : "text-lg"}`,
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        flex items-center justify-center gap-2
        rounded-2xl
        border-2
        font-bold
        transition-all duration-300
        active:scale-95
        hover:scale-105
        shadow-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {/* Shine Effect */}
      <span
        className="
          absolute
          top-1
          left-2
          h-2
          w-8
          rounded-full
          bg-white/40
          blur-sm
        "
      />

      {icon}
      <span>{children}</span>
    </button>
  )}