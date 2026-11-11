import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  LogIn,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn, roleMeta, type Role } from '../lib/utils';
import { CariGaweLogo } from './CariGaweLogo';

type HeaderProps = {
  role: Role;
  onRoleChange: (role: Role) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
};

const roleOptions: Array<{
  id: Role;
  icon: LucideIcon;
  label: string;
  desktopLabel: string;
  sublabel: string;
  emoji: string;
}> = [
  {
    id: 'company',
    icon: Building2,
    label: 'Perusahaan',
    desktopLabel: 'Portal Perusahaan',
    sublabel: 'Mitra industri',
    emoji: '🏢',
  },
  {
    id: 'youth',
    icon: GraduationCap,
    label: 'Peserta',
    desktopLabel: 'Portal Peserta',
    sublabel: 'Talenta muda',
    emoji: '🎓',
  },
  {
    id: 'admin',
    icon: Landmark,
    label: 'Admin Dinas',
    desktopLabel: 'Portal Admin',
    sublabel: 'Desk onboarding',
    emoji: '🏛️',
  },
];

type Notification = {
  icon: LucideIcon;
  title: string;
  detail: string;
  time: string;
  unread?: boolean;
  tone: string;
};

const notifications: Record<Role, Notification[]> = {
  company: [
    {
      icon: ClipboardCheck,
      title: '3 peserta mengumpulkan proyek',
      detail: 'Proyek Line 2 menunggu evaluasi mentor.',
      time: '10 mnt',
      unread: true,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: ShieldCheck,
      title: 'Lowongan disetujui Dinas',
      detail: 'Operator Produksi kini tayang di portal peserta.',
      time: '1 jam',
      tone: 'bg-navy-50 text-navy-700',
    },
    {
      icon: Users,
      title: '8 pelamar baru',
      detail: 'Teknisi Pemeliharaan Mesin · Baturaja.',
      time: '3 jam',
      tone: 'bg-amber-50 text-amber-600',
    },
  ],
  youth: [
    {
      icon: MessageCircle,
      title: 'Mentor membalas pesanmu',
      detail: 'Rangga Wirawan · Engineering Supervisor.',
      time: '5 mnt',
      unread: true,
      tone: 'bg-navy-50 text-navy-700',
    },
    {
      icon: ShieldCheck,
      title: 'BPJS bulan ke-3 aktif',
      detail: 'Kepesertaanmu telah diverifikasi sistem.',
      time: '2 jam',
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Sparkles,
      title: '2 lowongan cocok baru',
      detail: 'Dari PT Pupuk Sriwidjaja dan KAI Divre III.',
      time: '1 hari',
      tone: 'bg-amber-50 text-amber-600',
    },
  ],
  admin: [
    {
      icon: ShieldCheck,
      title: '2 antrean verifikasi baru',
      detail: '1 lowongan dan 1 revisi silabus.',
      time: '4 mnt',
      unread: true,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: ClipboardCheck,
      title: '5 insentif siap dicairkan',
      detail: 'Milestone bulan ke-6 telah terverifikasi.',
      time: '28 mnt',
      tone: 'bg-navy-50 text-navy-700',
    },
    {
      icon: GraduationCap,
      title: 'Sinkronisasi MagangHub selesai',
      detail: '1.284 rekaman tersinkron tanpa kendala.',
      time: '1 jam',
      tone: 'bg-amber-50 text-amber-600',
    },
  ],
};

function RoleSwitcher({
  role,
  onRoleChange,
  mobile = false,
}: HeaderProps & { mobile?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center rounded-2xl border border-slate-200/90 bg-slate-100/80 p-1',
        mobile ? 'w-full' : '',
      )}
      aria-label="Pilih portal pengguna"
      role="group"
    >
      {roleOptions.map((option) => {
        const active = option.id === role;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onRoleChange(option.id)}
            aria-pressed={active}
            aria-label={option.emoji + ' ' + roleMeta[option.id].label}
            title={roleMeta[option.id].label}
            className={cn(
              'group relative flex min-w-0 items-center gap-2 rounded-xl text-left transition-all duration-200',
              mobile ? 'flex-1 justify-center px-1.5 py-2' : 'px-3 py-2',
              active
                ? 'bg-navy-900 text-white shadow-md shadow-navy-900/20'
                : 'text-slate-500 hover:bg-white hover:text-navy-900',
            )}
          >
            <Icon
              className={cn(
                'shrink-0 transition-colors',
                mobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                active ? 'text-emerald-300' : 'text-slate-400',
              )}
            />
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate font-bold leading-tight',
                  mobile ? 'text-[10px]' : 'text-[11px]',
                )}
              >
                <span className="lg:hidden">{option.label}</span>
                <span className="hidden lg:inline">{option.desktopLabel}</span>
              </span>
              {!mobile && (
                <span
                  className={cn(
                    'mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.11em]',
                    active ? 'text-white/55' : 'text-slate-400',
                  )}
                >
                  {option.sublabel}
                </span>
              )}
            </span>
            {active && !mobile && (
              <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Header({ role, onRoleChange, onOpenAuth }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readByRole, setReadByRole] = useState<Record<Role, boolean>>({
    company: false,
    youth: false,
    admin: false,
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const user = roleMeta[role];
  const items = notifications[role];
  const hasUnread = !readByRole[role];

  useEffect(() => {
    setNotificationsOpen(false);
  }, [role]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [notificationsOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="page-shell flex h-[68px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center rounded-xl text-left">
          <CariGaweLogo size="md" />
        </div>

        <div className="hidden lg:block">
          <RoleSwitcher role={role} onRoleChange={onRoleChange} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {onOpenAuth && (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-navy-800 transition hover:border-navy-200 hover:bg-navy-50 sm:flex"
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="hidden h-9 items-center rounded-xl bg-emerald-brand px-3 text-[11px] font-extrabold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 lg:flex"
              >
                Daftar
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                aria-label="Masuk ke CariGawe"
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-navy-800 transition hover:bg-navy-50 sm:hidden"
              >
                <LogIn className="h-4 w-4" />
              </button>
            </>
          )}

          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Buka notifikasi"
              aria-expanded={notificationsOpen}
              className={cn(
                'relative grid h-9 w-9 place-items-center rounded-xl border text-slate-500 transition sm:h-10 sm:w-10',
                notificationsOpen
                  ? 'border-navy-200 bg-navy-50 text-navy-800'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <Bell className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
              {hasUnread && (
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(340px,calc(100vw-2rem))] animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-float">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Notifikasi</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {user.context}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setReadByRole((current) => ({ ...current, [role]: true }))
                    }
                    disabled={!hasUnread}
                    className="text-[11px] font-bold text-navy-700 transition hover:text-navy-900 disabled:text-slate-300"
                  >
                    {hasUnread ? 'Tandai dibaca' : 'Sudah dibaca'}
                  </button>
                </div>
                <div className="max-h-[330px] overflow-y-auto">
                  {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.title}
                        className={cn(
                          'flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50',
                          index !== items.length - 1 && 'border-b border-slate-100',
                        )}
                        onClick={() =>
                          setNotificationsOpen(false)
                        }
                      >
                        <span
                          className={cn(
                            'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px]',
                            item.tone,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start gap-2">
                            <span className="flex-1 text-xs font-bold leading-snug text-slate-800">
                              {item.title}
                            </span>
                            {item.unread && hasUnread && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-brand" />
                            )}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                            {item.detail}
                          </span>
                          <span className="mt-1 block text-[10px] font-semibold text-slate-400">
                            {item.time} lalu
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-[11px] font-bold text-navy-800 transition hover:bg-slate-100"
                >
                  Lihat semua aktivitas
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-2">
            <div className="hidden text-right xl:block">
              <p className="max-w-[160px] truncate text-[11px] font-extrabold leading-tight text-slate-800">
                {user.userName}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-400">
                {user.userDetail}
              </p>
            </div>
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-950 text-[10px] font-extrabold text-white ring-2 ring-white shadow-sm sm:h-10 sm:w-10 sm:rounded-[13px] sm:text-[11px]">
              {user.avatar}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell pb-2.5 lg:hidden">
        <RoleSwitcher role={role} onRoleChange={onRoleChange} mobile />
      </div>
    </header>
  );
}
