import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  Landmark,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn, type Role } from '../lib/utils';
import { CariGaweLogo } from './CariGaweLogo';

export type AuthMode = 'login' | 'register';
type LoadingState = 'form' | 'sso' | null;
type Notice = { tone: 'info' | 'error' | 'success'; text: string };

type AuthPanelProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthenticated: (role: Role) => void;
};

const roleOptions: Array<{
  id: Role;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}> = [
  {
    id: 'youth',
    label: 'Pemuda',
    sublabel: 'SMA / SMK',
    icon: GraduationCap,
  },
  {
    id: 'company',
    label: 'Perusahaan',
    sublabel: 'Mitra industri',
    icon: Building2,
  },
  {
    id: 'admin',
    label: 'Admin Dinas',
    sublabel: 'Desk onboarding',
    icon: Landmark,
  },
];

const roleCopy: Record<
  Role,
  {
    formTitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    identifierHelper: string;
    nameLabel: string;
  }
> = {
  youth: {
    formTitle: 'perjalanan magangmu',
    identifierLabel: 'NIK / Email',
    identifierPlaceholder: '16 digit NIK atau email aktif',
    identifierHelper: 'NIK terintegrasi Data Dukcapil Sumatera Selatan.',
    nameLabel: 'Nama Lengkap',
  },
  company: {
    formTitle: 'kebutuhan talenta industri',
    identifierLabel: 'Email Perusahaan',
    identifierPlaceholder: 'nama@perusahaan.co.id',
    identifierHelper: 'Gunakan email resmi perusahaan mitra.',
    nameLabel: 'Nama Perusahaan',
  },
  admin: {
    formTitle: 'meja kerja Desk Onboarding',
    identifierLabel: 'Email Dinas / NIP',
    identifierPlaceholder: 'nama@disnakertrans.sumselprov.go.id',
    identifierHelper: 'Akses khusus pegawai Disnakertrans Sumsel.',
    nameLabel: 'Nama Pegawai',
  },
};

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Lowongan terverifikasi Dinas',
    detail: 'Setiap postingan melewati validasi Disnakertrans Sumsel.',
  },
  {
    icon: GraduationCap,
    title: 'Pelatihan vokasi & proyek nyata',
    detail: 'Kurikulum yang selaras dengan kebutuhan industri.',
  },
  {
    icon: ShieldCheck,
    title: 'Perlindungan BPJS Ketenagakerjaan',
    detail: 'Kepesertaan aktif selama masa program berjalan.',
  },
];

const stats = [
  { value: '128', label: 'lowongan aktif' },
  { value: '42', label: 'mitra industri' },
  { value: '1.246', label: 'talenta tersalurkan' },
];

export function AuthPanel({
  mode,
  onModeChange,
  onClose,
  onAuthenticated,
}: AuthPanelProps) {
  const [role, setRole] = useState<Role>('youth');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<LoadingState>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const timerRef = useRef<number | null>(null);
  const closeRef = useRef(onClose);

  closeRef.current = onClose;

  const copy = roleCopy[role];
  const isRegister = mode === 'register';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => {
      document.getElementById('auth-identifier')?.focus({ preventScroll: true });
    }, 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setNotice(null);
    onModeChange(nextMode);
  };

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setNotice(null);
  };

  const finishAuthentication = () => {
    setLoading(null);
    onAuthenticated(role);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!identifier.trim()) {
      setNotice({
        tone: 'error',
        text: `Isi ${copy.identifierLabel.toLowerCase()} terlebih dahulu.`,
      });
      return;
    }

    if (password.length < 6) {
      setNotice({
        tone: 'error',
        text: 'Kata sandi minimal 6 karakter untuk melanjutkan.',
      });
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setNotice({
          tone: 'error',
          text: `Isi ${copy.nameLabel.toLowerCase()} terlebih dahulu.`,
        });
        return;
      }
      if (password !== confirmPassword) {
        setNotice({
          tone: 'error',
          text: 'Konfirmasi kata sandi belum sama. Periksa kembali.',
        });
        return;
      }
      if (!agree) {
        setNotice({
          tone: 'error',
          text: 'Centang persetujuan data untuk membuat akun.',
        });
        return;
      }
    }

    setLoading('form');
    setNotice({
      tone: 'info',
      text: isRegister
        ? 'Membuat akun dan menyiapkan portal pilihanmu…'
        : 'Memverifikasi akun dan menyiapkan portal pilihanmu…',
    });
    timerRef.current = window.setTimeout(finishAuthentication, 1200);
  };

  const handleSso = () => {
    if (loading) return;
    setLoading('sso');
    setNotice({
      tone: 'info',
      text: 'Menghubungkan akun dengan SSO MagangHub Kemnaker…',
    });
    timerRef.current = window.setTimeout(finishAuthentication, 1200);
  };

  const handleForgot = () => {
    if (!identifier.trim()) {
      setNotice({
        tone: 'error',
        text: 'Masukkan NIK atau email terlebih dahulu, lalu coba lagi.',
      });
      return;
    }
    setNotice({
      tone: 'success',
      text: `Tautan pemulihan kata sandi dikirim ke ${identifier}.`,
    });
  };

  const noticeStyles = {
    info: 'border-navy-200 bg-navy-50 text-navy-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
  }[notice?.tone ?? 'info'];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-[4px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="relative flex h-[100dvh] max-h-[100dvh] w-full animate-scale-in flex-col overflow-hidden rounded-none border border-white/60 bg-white shadow-float sm:h-auto sm:max-h-[92dvh] sm:max-w-[980px] sm:rounded-3xl lg:grid lg:max-h-[90vh] lg:grid-cols-[0.84fr_1fr]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-panel-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panel masuk"
          className="absolute right-3 top-3 z-30 hidden h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/95 text-slate-400 shadow-sm backdrop-blur transition hover:bg-slate-50 hover:text-navy-800 lg:grid"
        >
          <X className="h-4 w-4" />
        </button>

        <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-9 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0 dotted-grid opacity-25" />
          <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-navy-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-16 h-32 w-32 rounded-full border border-amber-300/10" />

          <div className="relative">
            <CariGaweLogo variant="dark" size="md" />

            <h2 className="mt-9 max-w-[320px] text-balance text-[32px] font-extrabold leading-[1.05] tracking-[-0.05em]">
              Satu akun,
              <span className="block text-white/50">satu ekosistem karier.</span>
            </h2>
            <p className="mt-3 max-w-[310px] text-[12px] leading-relaxed text-white/55">
              Masuk sekali untuk mengakses lowongan terverifikasi, pelatihan
              vokasi, proyek nyata, sampai perlindungan BPJS Ketenagakerjaan.
            </p>

            <ul className="mt-7 space-y-2.5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.title}
                    className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/15">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-extrabold leading-tight text-white/90">
                        {benefit.title}
                      </span>
                      <span className="mt-0.5 block text-[9.5px] leading-relaxed text-white/40">
                        {benefit.detail}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <figure className="mt-6 hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 [@media(min-height:900px)]:block">
              <blockquote className="text-[11px] leading-relaxed text-white/70">
                “Sebelumnya saya harus bolak-balik ke dinas. Sekarang semua
                proses magang bisa dipantau dari satu akun.”
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-[9.5px] font-extrabold text-emerald-200 ring-1 ring-emerald-300/20">
                  NS
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-extrabold text-white/85">
                    Nadia Safitri
                  </span>
                  <span className="block text-[9.5px] text-white/40">
                    Peserta Magang · PT Semen Baturaja
                  </span>
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="relative mt-8 hidden [@media(min-height:820px)]:block">
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2.5"
                >
                  <p className="text-lg font-extrabold leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[9.5px] font-medium leading-tight text-white/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[9.5px] font-medium text-white/35">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300/70" />
              Prototipe kolaborasi Disnakertrans Sumsel &amp; MagangHub Nasional
            </p>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="relative flex items-center justify-between gap-3 bg-navy-950 px-5 py-3.5 lg:hidden">
            <CariGaweLogo variant="dark" size="sm" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel masuk"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-white/75 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-7 sm:pt-6 lg:px-9 lg:pb-8">
            <div className="pr-10 sm:pr-12">
              <span className="eyebrow text-emerald-brand">
                {isRegister ? 'Buat akun baru' : 'Akses portal'}
              </span>
              <h2
                id="auth-panel-title"
                className="mt-1.5 text-[23px] font-extrabold leading-tight tracking-[-0.04em] text-slate-950 sm:text-[26px]"
              >
                {isRegister ? 'Gabung ke CariGawe' : 'Masuk ke CariGawe'}
              </h2>
              <p className="mt-1.5 max-w-md text-[11.5px] leading-relaxed text-slate-500">
                {isRegister
                  ? 'Daftar gratis dan pilih portal yang ingin kamu akses.'
                  : 'Gunakan akun yang sama untuk portal pemuda, perusahaan, dan admin Dinas.'}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              {[
                { id: 'login' as const, label: 'Masuk' },
                { id: 'register' as const, label: 'Daftar Baru' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={mode === tab.id}
                  onClick={() => switchMode(tab.id)}
                  className={cn(
                    'rounded-lg py-2 text-[11.5px] font-extrabold transition',
                    mode === tab.id
                      ? 'bg-white text-navy-900 shadow-sm ring-1 ring-slate-200/70'
                      : 'text-slate-400 hover:text-slate-600',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                Pilih peran
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const active = role === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => switchRole(option.id)}
                      className={cn(
                        'relative flex flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-center transition',
                        active
                          ? 'bg-navy-900 text-white shadow-sm shadow-navy-900/20'
                          : 'text-slate-500 hover:bg-white/70 hover:text-navy-800',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5',
                          active ? 'text-emerald-300' : 'text-slate-400',
                        )}
                      />
                      <span className="text-[10.5px] font-extrabold leading-none">
                        {option.label}
                      </span>
                      <span
                        className={cn(
                          'text-[9.5px] font-semibold leading-none',
                          active ? 'text-white/45' : 'text-slate-400',
                        )}
                      >
                        {option.sublabel}
                      </span>
                      {active && (
                        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              {isRegister && (
                <AuthField
                  id="auth-name"
                  label={copy.nameLabel}
                  icon={UserRound}
                  value={name}
                  onChange={setName}
                  placeholder={
                    role === 'company'
                      ? 'Contoh: PT Semen Baturaja'
                      : role === 'admin'
                        ? 'Nama lengkap pegawai'
                        : 'Nama sesuai KTP'
                  }
                  autoComplete="name"
                />
              )}

              <AuthField
                id="auth-identifier"
                label={copy.identifierLabel}
                icon={role === 'youth' ? UserRound : Mail}
                value={identifier}
                onChange={setIdentifier}
                placeholder={copy.identifierPlaceholder}
                autoComplete={role === 'youth' ? 'username' : 'email'}
              />

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-bold text-slate-700"
                >
                  Kata Sandi
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={handleForgot}
                      className="text-[10px] font-bold text-navy-700 transition hover:text-navy-900"
                    >
                      Lupa Kata Sandi?
                    </button>
                  )}
                </label>
                <div className="group flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 transition focus-within:border-navy-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-navy-500/10">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-navy-600" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    className="h-full w-full bg-transparent text-[12px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-navy-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <AuthField
                  id="auth-confirm-password"
                  label="Konfirmasi Kata Sandi"
                  icon={LockKeyhole}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                />
              )}

              {isRegister ? (
                <label className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-[10px] leading-relaxed text-slate-500 ring-1 ring-slate-200/70">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(event) => setAgree(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                  />
                  <span>
                    Saya setuju data digunakan untuk verifikasi NIK, penyaluran
                    program, dan pelaporan BPJS Ketenagakerjaan.
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-[10.5px] font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    Ingat saya
                  </label>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    Data terenkripsi
                  </span>
                </div>
              )}

              {notice && (
                <div
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-[10.5px] font-medium leading-relaxed',
                    noticeStyles,
                  )}
                  role="status"
                  aria-live="polite"
                >
                  {notice.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading !== null}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-brand text-[12px] font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70"
              >
                {loading === 'form' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRegister ? 'Membuat akun…' : 'Memverifikasi…'}
                  </>
                ) : (
                  <>
                    {isRegister ? 'Buat Akun CariGawe' : 'Masuk ke CariGawe'}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="my-4 flex items-center gap-2.5">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                atau
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleSso}
              disabled={loading !== null}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[11px] font-extrabold text-slate-600 shadow-sm transition hover:border-navy-200 hover:bg-navy-50/50 hover:text-navy-800 disabled:opacity-60"
            >
              {loading === 'sso' ? (
                <Loader2 className="h-4 w-4 animate-spin text-navy-700" />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-md bg-navy-900 text-[11px] font-extrabold text-white">
                  M
                </span>
              )}
              {loading === 'sso'
                ? 'Menghubungkan SSO…'
                : 'Masuk dengan SSO MagangHub Kemnaker'}
            </button>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-3 py-2.5 text-[9.5px] leading-relaxed text-slate-500">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>
                Terkoneksi dengan data{' '}
                <span className="font-bold text-slate-700">
                  BPJS Ketenagakerjaan
                </span>{' '}
                &amp;{' '}
                <span className="font-bold text-slate-700">
                  Disnakertrans Prov. Sumsel
                </span>
                .
              </span>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowHelp((visible) => !visible)}
                className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10.5px] font-semibold text-slate-500 transition hover:text-navy-800"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Butuh bantuan kendala NIK/akun?
                <span className="font-extrabold text-navy-700">
                  Hubungi Desk Onboarding
                </span>
              </button>

              {showHelp && (
                <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-left text-[10px] leading-relaxed text-amber-900 shadow-sm">
                  <p className="font-extrabold text-amber-950">
                    Desk Onboarding Disnakertrans Sumsel
                  </p>
                  <div className="mt-1.5 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 shrink-0" />
                      (0711) 812-345
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 shrink-0" />
                      desk.onboarding@disnakertrans.sumselprov.go.id
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock3 className="h-3 w-3 shrink-0" />
                      Senin–Jumat, 08.00–15.30 WIB
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-3 flex items-center justify-center gap-1 text-[9.5px] font-medium text-slate-400">
                <Sparkles className="h-3 w-3 text-amber-400" />
                © 2026 CariGawe Sumsel. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AuthField({
  id,
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-bold text-slate-700"
      >
        {label}
      </label>
      <div className="group flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 transition focus-within:border-navy-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-navy-500/10">
        <Icon className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-navy-600" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full w-full bg-transparent text-[12px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
