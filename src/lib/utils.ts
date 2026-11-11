export type Role = 'company' | 'youth' | 'admin';

export type ToastTone = 'success' | 'info' | 'warning';

export type Notify = (message: string, tone?: ToastTone) => void;

export const rupiah = (value: number, compact = false) => {
  if (compact) {
    if (value >= 1_000_000) {
      const millions = value / 1_000_000;
      return `Rp${millions.toLocaleString('id-ID', {
        maximumFractionDigits: millions % 1 === 0 ? 0 : 2,
      })} jt`;
    }
    if (value >= 1_000) {
      return `Rp${Math.round(value / 1_000)} rb`;
    }
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const initials = (name: string) => {
  const clean = name
    .replace(/\bPT\b/gi, '')
    .replace(/\bTbk\b/gi, '')
    .replace(/\bPersero\b/gi, '')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'CG';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const avatarInitials = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase();
};

export const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export const roleMeta: Record<
  Role,
  {
    short: string;
    label: string;
    context: string;
    userName: string;
    userDetail: string;
    avatar: string;
  }
> = {
  company: {
    short: 'Perusahaan',
    label: 'Portal Perusahaan / Industri',
    context: 'Ruang mitra industri',
    userName: 'PT Semen Baturaja',
    userDetail: 'Perusahaan Mitra',
    avatar: 'SB',
  },
  youth: {
    short: 'Peserta',
    label: 'Portal Peserta / Pemuda',
    context: 'Ruang talenta muda',
    userName: 'Nadia Safitri',
    userDetail: 'Peserta Magang',
    avatar: 'NS',
  },
  admin: {
    short: 'Admin Dinas',
    label: 'Portal Admin Dinas Ketenagakerjaan',
    context: 'Desk Onboarding',
    userName: 'Desk Onboarding',
    userDetail: 'Disnakertrans Sumsel',
    avatar: 'DS',
  },
};
