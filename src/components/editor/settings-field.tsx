"use client";

interface SettingFieldProps {
  children: React.ReactNode;
  label: string;
}

export function SettingField({ label, children }: SettingFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

interface SettingInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

export function SettingInput({
  onChange,
  placeholder,
  value,
}: SettingInputProps) {
  return (
    <input
      className="w-full rounded border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}

interface SettingSelectProps {
  onChange: (value: string) => void;
  options: string[];
  value: string;
}

export function SettingSelect({
  onChange,
  options,
  value,
}: SettingSelectProps) {
  return (
    <select
      className="w-full rounded border bg-background px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
