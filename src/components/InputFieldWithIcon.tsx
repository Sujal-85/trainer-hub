import { forwardRef, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  helperText?: string;
}

const InputFieldWithIcon = forwardRef<HTMLInputElement, InputFieldWithIconProps>(
  ({ icon: Icon, label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="w-5 h-5" />
          </div>
          <input
            ref={ref}
            className={`input-field pl-12 ${error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

InputFieldWithIcon.displayName = 'InputFieldWithIcon';

export default InputFieldWithIcon;
