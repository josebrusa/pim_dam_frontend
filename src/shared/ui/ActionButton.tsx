import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { primaryButtonClass, secondaryButtonClass } from './buttonStyles';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: ReactNode;
  loadingLabel?: string;
};

export function ActionButton({
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  loadingLabel,
  ...props
}: ActionButtonProps) {
  const buttonClass = variant === 'primary' ? primaryButtonClass : secondaryButtonClass;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${buttonClass} inline-flex items-center gap-2 ${className}`.trim()}
      {...props}
    >
      {icon}
      {loading ? (loadingLabel ?? 'Cargando...') : children}
    </button>
  );
}
