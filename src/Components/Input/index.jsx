import React from "react";

export function Input({
  value,
  onChange,
  placeholder,
  className = "",
  name="",
  disabled = false,
  ...props
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      className={`
        w-full
        rounded-2xl
        border-2 border-amber-200
        bg-white/10
        backdrop-blur-sm
        px-4 py-3
        text-white
        placeholder:text-white/50
        outline-none
        transition-all duration-300
        focus:border-amber-400
        focus:ring-4 focus:ring-amber-400/20
        disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1,
  className = "",
  name = "",
}) {
  const clamp = (num) => {
    return Math.min(max, Math.max(min, num));
  };

  const handleInputChange = (e) => {
    const num = clamp(Number(e.target.value));
        onChange({
            target: {
            name,
            value: num
            }
        });
    };

  const handleIncrease = () => {
        onChange({
            target: {
            name,
            value: clamp(Number(value) + step)
            }
        });
    };
  const handleDecrease = () => {
        onChange({
            target: {
            name,
            value: clamp(Number(value) - step)
            }
        });
    };

  return (
    <div
      className={`
        flex items-center
        gap-2
        rounded-2xl
        border-2 border-amber-200
        bg-white/10
        backdrop-blur-sm
        p-2
        ${className}
      `}
    >
      <button
        type="button"
        onClick={handleDecrease}
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl
          bg-amber-400
          font-bold
          text-slate-900
          hover:scale-105
          transition
        "
      >
        −
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="
          flex-1
          bg-transparent
          text-center
          text-white
          outline-none
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
      />

      <button
        type="button"
        onClick={handleIncrease}
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl
          bg-amber-400
          font-bold
          text-slate-900
          hover:scale-105
          transition
        "
      >
        +
      </button>
    </div>
  );
}