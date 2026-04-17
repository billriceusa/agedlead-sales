"use client";

interface HoneypotInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function HoneypotInput({ value, onChange }: HoneypotInputProps) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        width: "1px",
        height: "1px",
        opacity: 0,
      }}
    />
  );
}
