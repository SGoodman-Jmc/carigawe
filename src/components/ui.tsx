import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Info,
  ShieldCheck,
  X,
} from 'lucide-react';
import { avatarInitials, cn, initials, type ToastTone } from '../lib/utils';

export type ToastState = {
  id: number;
  message: string;
  tone: ToastTone;
};

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconBox: 'bg-emerald-50 text-emerald-600',
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      iconBox: 'bg-navy-50 text-navy-700',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5" />,
      iconBox: 'bg-amber-50 text-amber-600',
    },
  }[toast.tone];

  return createPortal(
    <div
      className="fixed bottom-5 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-toast-in sm:bottom-7"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 pr-3 shadow-float">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            styles.iconBox,
          )}
        >
          {styles.icon}
        </span>
        <p className="flex-1 text-[13px] font-semibold leading-snug text-slate-700">
          {toast.message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Tutup notifikasi"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className={cn(
          'max-h-[92dvh] w-full overflow-y-auto rounded-t-[26px] border border-white/60 bg-white shadow-float animate-scale-in sm:rounded-3xl',
          width,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            {eyebrow && (
              <p className="eyebrow mb-1.5 text-emerald-brand">{eyebrow}</p>
            )}
            <h2
              id="modal-title"
              className="text-lg font-extrabold tracking-tight text-slate-900"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Tutup dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children && (
          <div className="px-5 py-5 sm:px-6">{children}</div>
        )}
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function CompanyMark({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const name_lower = name.toLowerCase();

  const palette = name_lower.includes('semen')
    ? 'bg-sky-50 text-sky-800 ring-sky-100'
    : name_lower.includes('bukit')
      ? 'bg-amber-50 text-amber-800 ring-amber-100'
      : name_lower.includes('pupuk') || name_lower.includes('pupuk sriwidjaja')
        ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
        : name_lower.includes('kereta') || name_lower.includes('kai')
          ? 'bg-orange-50 text-orange-700 ring-orange-100'
          : name_lower.includes('kopi') || name_lower.includes('kambang')
            ? 'bg-[#f7efe5] text-[#7c4a20] ring-[#eedfcc]'
            : name_lower.includes('aryaduta')
              ? 'bg-violet-50 text-violet-700 ring-violet-100'
              : name_lower.includes('hijau')
                ? 'bg-lime-50 text-lime-800 ring-lime-100'
                : name_lower.includes('disnaker') ||
                    name_lower.includes('dinas')
                  ? 'bg-navy-50 text-navy-900 ring-navy-100'
                  : 'bg-slate-100 text-slate-700 ring-slate-200';

  const sizeClass = {
    sm: 'h-9 w-9 rounded-[10px] text-[11px]',
    md: 'h-11 w-11 rounded-xl text-xs',
    lg: 'h-14 w-14 rounded-2xl text-sm',
  }[size];

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center font-extrabold tracking-tight ring-1',
        sizeClass,
        palette,
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

export function PersonAvatar({
  name,
  tone = 'navy',
  size = 'md',
  className,
}: {
  name: string;
  tone?: 'navy' | 'emerald' | 'amber' | 'violet' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const tones = {
    navy: 'bg-gradient-to-br from-navy-700 to-navy-900 text-white',
    emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white',
    amber: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
    violet: 'bg-gradient-to-br from-violet-500 to-violet-700 text-white',
    rose: 'bg-gradient-to-br from-rose-400 to-rose-600 text-white',
  };

  const sizes = {
    sm: 'h-8 w-8 text-[10px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-bold ring-2 ring-white',
        tones[tone],
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {avatarInitials(name)}
    </div>
  );
}

export function VerifiedBadge({
  label = 'Terverifikasi Dinas',
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 font-bold text-emerald-700 ring-1 ring-emerald-600/15',
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]',
      )}
    >
      <ShieldCheck className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {label}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = 'navy',
  className,
}: {
  value: number;
  tone?: 'navy' | 'emerald' | 'amber';
  className?: string;
}) {
  const tones = {
    navy: 'bg-navy-700',
    emerald: 'bg-emerald-brand',
    amber: 'bg-amber-500',
  };

  return (
    <div
      className={cn('h-1.5 overflow-hidden rounded-full bg-slate-100', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div
        className={cn('h-full rounded-full transition-all', tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-emerald-brand focus-visible:ring-offset-2 disabled:opacity-50',
        checked ? 'bg-emerald-brand' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export function CheckItem({
  checked,
  children,
}: {
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={cn(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
          checked
            ? 'bg-emerald-100 text-emerald-700'
            : 'border border-slate-200 bg-slate-50 text-slate-300',
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span
        className={cn(
          'text-xs leading-relaxed',
          checked ? 'font-medium text-slate-600' : 'text-slate-400',
        )}
      >
        {children}
      </span>
    </div>
  );
}

export function Sparkline({
  values,
  color = '#059669',
  className,
}: {
  values: number[];
  color?: string;
  className?: string;
}) {
  const width = 100;
  const height = 32;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 5) - 2.5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-8 w-24 overflow-visible', className)}
      fill="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={Number(points.split(' ').at(-1)?.split(',')[1] ?? height)}
        r="2.8"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
