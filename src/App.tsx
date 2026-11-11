import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { AuthPanel, type AuthMode } from './components/AuthPanel';
import { CariGaweMark } from './components/CariGaweLogo';
import { Header } from './components/Header';
import { Toast, type ToastState } from './components/ui';
import { AdminPortal } from './pages/AdminPortal';
import { CompanyPortal } from './pages/CompanyPortal';
import { YouthPortal } from './pages/YouthPortal';
import type { Role, ToastTone } from './lib/utils';

const roles: Role[] = ['company', 'youth', 'admin'];

function hashValue() {
  return window.location.hash.replace('#', '').replace('/', '');
}

function roleFromHash(): Role {
  const hash = hashValue();
  return roles.includes(hash as Role) ? (hash as Role) : 'company';
}

function authFromHash() {
  return hashValue() === 'login' || hashValue() === 'daftar';
}

function authModeFromHash(): AuthMode {
  return hashValue() === 'daftar' ? 'register' : 'login';
}

function hashForAuthMode(mode: AuthMode) {
  return mode === 'register' ? '#daftar' : '#login';
}

const welcomeMessages: Record<Role, string> = {
  company: 'Selamat datang di Portal Perusahaan. Kelola talenta muda Sumsel.',
  youth: 'Selamat datang, Nadia! Mulai jelajahi lowongan terverifikasi.',
  admin: 'Selamat datang di Desk Onboarding Disnakertrans Sumsel.',
};

export default function App() {
  const [role, setRole] = useState<Role>(roleFromHash);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [authOpen, setAuthOpen] = useState(authFromHash);
  const [authMode, setAuthMode] = useState<AuthMode>(authModeFromHash);

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  // Selalu mulai dari atas saat portal berganti, termasuk saat konten baru
  // lebih pendek dari posisi scroll sebelumnya.
  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [role]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
    setToast(null);
    window.history.replaceState(null, '', hashForAuthMode(mode));
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    window.history.replaceState(null, '', `#${role}`);
  }, [role]);

  const changeAuthMode = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    window.history.replaceState(null, '', hashForAuthMode(mode));
  }, []);

  const changeRole = (nextRole: Role) => {
    if (nextRole === role) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setRole(nextRole);
    setToast(null);
    setAuthOpen(false);
    window.history.replaceState(null, '', `#${nextRole}`);
  };

  const enterPlatform = (nextRole: Role) => {
    setAuthOpen(false);
    setRole(nextRole);
    setToast(null);
    window.history.replaceState(null, '', `#${nextRole}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setToast({
      id: Date.now(),
      message: welcomeMessages[nextRole],
      tone: 'success',
    });
  };

  useEffect(() => {
    const onHashChange = () => {
      if (authFromHash()) {
        setAuthOpen(true);
        setAuthMode(authModeFromHash());
        return;
      }
      setAuthOpen(false);
      setRole(roleFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const titles: Record<Role, string> = {
      company: 'Portal Perusahaan — CariGawe',
      youth: 'Portal Peserta — CariGawe',
      admin: 'Desk Onboarding Dinas — CariGawe',
    };
    document.title = authOpen ? 'Masuk / Daftar — CariGawe' : titles[role];
  }, [role, authOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-slate-900">
      <Header role={role} onRoleChange={changeRole} onOpenAuth={openAuth} />

      <main key={role} className="flex-1 animate-fade-in">
        {role === 'company' && <CompanyPortal notify={notify} />}
        {role === 'youth' && <YouthPortal notify={notify} />}
        {role === 'admin' && <AdminPortal notify={notify} />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="page-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <CariGaweMark size="sm" />
            <div>
              <p className="text-[11px] font-extrabold text-slate-700">
                CariGawe · Talent Hub Pemuda Sumsel
              </p>
              <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                Prototipe kolaborasi Disnakertrans Sumsel &amp; MagangHub Nasional
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9.5px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Data terverifikasi
            </span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="h-3 w-3 text-emerald-500" />
              BPJS Ketenagakerjaan
            </span>
            <span>© 2026 Pemerintah Provinsi Sumatera Selatan</span>
          </div>
        </div>
      </footer>

      {authOpen && (
        <AuthPanel
          mode={authMode}
          onModeChange={changeAuthMode}
          onClose={closeAuth}
          onAuthenticated={enterPlatform}
        />
      )}

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
