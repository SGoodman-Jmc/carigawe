import { useId } from 'react';
import { cn } from '../lib/utils';

type LogoVariant = 'light' | 'dark';
type LogoSize = 'sm' | 'md' | 'lg';

type CariGaweLogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
};

const markSizes: Record<LogoSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-[54px] w-[54px]',
};

const wordSizes: Record<LogoSize, string> = {
  sm: 'text-[19px]',
  md: 'text-[23px]',
  lg: 'text-[29px]',
};

const taglineSizes: Record<LogoSize, string> = {
  sm: 'text-[9.5px]',
  md: 'text-[10px]',
  lg: 'text-[11px]',
};

export function CariGaweMark({
  size = 'md',
  variant = 'light',
  className,
}: {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}) {
  const rawId = useId();
  const gradientId = `cg-mark-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('shrink-0', markSizes[size], className)}
      role="img"
      aria-label="Logo CariGawe"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="6"
          y1="4"
          x2="40"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2E4488" />
          <stop offset="0.55" stopColor="#20346F" />
          <stop offset="1" stopColor="#17265B" />
        </linearGradient>
      </defs>

      <rect
        x="1.25"
        y="1.25"
        width="45.5"
        height="45.5"
        rx="13.5"
        fill={`url(#${gradientId})`}
      />
      <rect
        x="1.25"
        y="1.25"
        width="45.5"
        height="45.5"
        rx="13.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={variant === 'dark' ? 0.22 : 0.14}
        strokeWidth="1.2"
      />

      <path
        d="M28.6 15H21a4.5 4.5 0 0 0 0 9h6a4.5 4.5 0 0 1 0 9h-7.4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="31.7"
        cy="15"
        r="3.1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.7"
      />
      <circle
        cx="16.3"
        cy="33"
        r="3.1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.7"
      />
      <circle cx="32.7" cy="32.7" r="2.6" fill="#10B981" />
    </svg>
  );
}

export function CariGaweLogo({
  variant = 'light',
  size = 'md',
  showTagline = true,
  tagline = 'Talent Hub Pemuda Sumsel',
  className,
}: CariGaweLogoProps) {
  const dark = variant === 'dark';

  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <CariGaweMark size={size} variant={variant} />
      <span className="min-w-0">
        <span
          className={cn(
            'block font-extrabold leading-none tracking-[-0.045em]',
            wordSizes[size],
          )}
        >
          <span className={dark ? 'text-white' : 'text-navy-950'}>Cari</span>
          <span className={dark ? 'text-emerald-300' : 'text-emerald-brand'}>
            Gawe
          </span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-1 flex items-center gap-1.5 font-bold leading-none tracking-[0.005em]',
              taglineSizes[size],
              dark ? 'text-white/55' : 'text-slate-500',
            )}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-brand" />
            <span className="truncate">{tagline}</span>
          </span>
        )}
      </span>
    </span>
  );
}
