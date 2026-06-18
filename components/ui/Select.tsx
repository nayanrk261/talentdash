import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-deep">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-deep',
          'focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral',
          'hover:border-muted',
          'cursor-pointer appearance-none',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20fill%3D%27%23717171%27%20d%3D%27M3%204.5l3%203%203-3%27/%3E%3C/svg%3E")]',
          'bg-no-repeat bg-[right_12px_center]',
          'pr-8',
          'transition-all duration-200',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function MultiSelect({ label, options, selected, onChange, className }: MultiSelectProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-sm font-medium text-deep">{label}</span>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleOption(opt.value)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                'border',
                isSelected
                  ? 'bg-coral text-white border-coral shadow-sm'
                  : 'bg-surface text-muted border-border hover:border-muted hover:text-body'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
