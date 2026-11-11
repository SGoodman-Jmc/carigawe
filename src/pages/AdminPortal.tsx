import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  Landmark,
  Loader2,
  MapPin,
  MessageSquareWarning,
  RefreshCw,
  RotateCcw,
  Send,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { cn, rupiah, type Notify } from '../lib/utils';
import {
  CompanyMark,
  Modal,
  PersonAvatar,
  ProgressBar,
  Sparkline,
  VerifiedBadge,
} from '../components/ui';

type AdminPortalProps = {
  notify: Notify;
};

type QueueStatus = 'pending' | 'approved' | 'revision';

type QueueItem = {
  id: string;
  company: string;
  position: string;
  location: string;
  field: string;
  target: string;
  quota: number;
  stipend: number;
  modules: string[];
  moduleHours: number;
  submittedAt: string;
  isUmkm?: boolean;
  status: QueueStatus;
  revisionNote?: string;
};

const initialQueue: QueueItem[] = [
  {
    id: 'semen-baturaja',
    company: 'PT Semen Baturaja Tbk',
    position: 'Teknisi Pemeliharaan Mesin',
    location: 'Baturaja, Ogan Komering Ulu',
    field: 'Teknik Mesin',
    target: 'SMK',
    quota: 4,
    stipend: 3_150_000,
    modules: ['K3 & Budaya Kerja Industri', 'Perawatan Mesin Dasar'],
    moduleHours: 20,
    submittedAt: 'Hari ini, 08.14',
    status: 'pending',
  },
  {
    id: 'bukit-asam',
    company: 'PT Bukit Asam Tbk',
    position: 'Operator Alat Berat',
    location: 'Tanjung Enim, Muara Enim',
    field: 'Teknik Mesin',
    target: 'SMK',
    quota: 6,
    stipend: 3_450_000,
    modules: ['K3 Pertambangan', 'Operasional Alat Berat', 'Disiplin Operasional'],
    moduleHours: 28,
    submittedAt: 'Hari ini, 07.50',
    status: 'pending',
  },
  {
    id: 'kopi-kambang-iwak',
    company: 'Kopi Kambang Iwak',
    position: 'Barista & Content Creator',
    location: 'Palembang',
    field: 'Bisnis & Kreatif',
    target: 'SMA/SMK',
    quota: 2,
    stipend: 1_900_000,
    modules: ['Digital Marketing UMKM', 'Pelayanan Pelanggan'],
    moduleHours: 14,
    submittedAt: 'Kemarin, 16.28',
    isUmkm: true,
    status: 'pending',
  },
];

type BpjsStatus = 'Siap dicairkan' | 'Tersalurkan' | 'Menunggu milestone';

type BpjsRow = {
  id: string;
  name: string;
  school: string;
  nik: string;
  companyId: string;
  company: string;
  bpjsActive: boolean;
  month3: { date: string; active: boolean };
  month6: { date: string; active: boolean };
  incentive: BpjsStatus;
  amount: number;
  tone: 'navy' | 'emerald' | 'amber' | 'violet' | 'rose';
};

const initialBpjsRows: BpjsRow[] = [
  {
    id: 'nadia',
    name: 'Nadia Safitri',
    school: 'SMKN 1 Palembang',
    nik: '1671 •••• •••• 4821',
    companyId: 'ID-PER-0291',
    company: 'PT Semen Baturaja',
    bpjsActive: true,
    month3: { date: '15 Okt 2026', active: true },
    month6: { date: '15 Jan 2027', active: false },
    incentive: 'Menunggu milestone',
    amount: 1_500_000,
    tone: 'emerald',
  },
  {
    id: 'bima',
    name: 'Bima Pratama',
    school: 'SMKN 2 Muara Enim',
    nik: '1603 •••• •••• 7714',
    companyId: 'ID-PER-0118',
    company: 'PT Bukit Asam',
    bpjsActive: true,
    month3: { date: '12 Mei 2026', active: true },
    month6: { date: '12 Agu 2026', active: true },
    incentive: 'Siap dicairkan',
    amount: 1_500_000,
    tone: 'navy',
  },
  {
    id: 'siti',
    name: 'Siti Aisyah',
    school: 'SMAN 3 Palembang',
    nik: '1671 •••• •••• 2039',
    companyId: 'ID-PER-0042',
    company: 'PT Pupuk Sriwidjaja',
    bpjsActive: true,
    month3: { date: '8 Jun 2026', active: true },
    month6: { date: '8 Sep 2026', active: true },
    incentive: 'Tersalurkan',
    amount: 1_500_000,
    tone: 'violet',
  },
  {
    id: 'rizky',
    name: 'Rizky Maulana',
    school: 'SMKN 1 Prabumulih',
    nik: '1674 •••• •••• 5510',
    companyId: 'ID-PER-0227',
    company: 'KAI Divre III Palembang',
    bpjsActive: true,
    month3: { date: '22 Jul 2026', active: true },
    month6: { date: '22 Okt 2026', active: true },
    incentive: 'Siap dicairkan',
    amount: 1_500_000,
    tone: 'amber',
  },
  {
    id: 'anisa',
    name: 'Anisa Putri',
    school: 'SMKN 2 Palembang',
    nik: '1671 •••• •••• 8462',
    companyId: 'ID-UMK-0064',
    company: 'Kopi Kambang Iwak',
    bpjsActive: true,
    month3: { date: '3 Sep 2026', active: true },
    month6: { date: '3 Des 2026', active: false },
    incentive: 'Menunggu milestone',
    amount: 1_000_000,
    tone: 'rose',
  },
];

const apiLogsInitial = [
  {
    id: 1,
    title: 'Sinkronisasi data lowongan',
    detail: '128 lowongan · 128 valid',
    time: '09.42',
    status: 'Berhasil',
  },
  {
    id: 2,
    title: 'Verifikasi BPJS Ketenagakerjaan',
    detail: '24 rekaman diperiksa',
    time: '09.30',
    status: 'Berhasil',
  },
  {
    id: 3,
    title: 'Push status penempatan',
    detail: '12 peserta diperbarui',
    time: '08.55',
    status: 'Berhasil',
  },
];

function QueueCard({
  item,
  onApprove,
  onRevision,
}: {
  item: QueueItem;
  onApprove: (id: string) => void;
  onRevision: (item: QueueItem) => void;
}) {
  const resolved = item.status !== 'pending';
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition',
        item.status === 'approved'
          ? 'border-emerald-200'
          : item.status === 'revision'
            ? 'border-amber-200'
            : 'border-slate-200/80 hover:border-navy-200',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-b px-4 py-2',
          item.status === 'approved'
            ? 'border-emerald-100 bg-emerald-50/70'
            : item.status === 'revision'
              ? 'border-amber-100 bg-amber-50/60'
              : 'border-slate-100 bg-slate-50/80',
        )}
      >
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em]',
            item.status === 'approved'
              ? 'text-emerald-700'
              : item.status === 'revision'
                ? 'text-amber-700'
                : 'text-amber-600',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              item.status === 'approved'
                ? 'bg-emerald-500'
                : item.status === 'revision'
                  ? 'bg-amber-500'
                  : 'bg-amber-400',
            )}
          />
          {item.status === 'approved'
            ? 'Disetujui · Siap tayang'
            : item.status === 'revision'
              ? 'Revisi diminta'
              : 'Menunggu validasi'}
        </span>
        <span className="text-[10.5px] font-semibold text-slate-400">
          {item.submittedAt}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <CompanyMark name={item.company} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-extrabold text-slate-800">
                {item.company}
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold text-slate-400">
                {item.isUmkm ? 'UMKM binaan Dinas' : 'Perusahaan mitra'}
              </p>
            </div>
          </div>
          <VerifiedBadge label="Legal" compact />
        </div>

        <h3 className="mt-3 text-[14px] font-extrabold leading-snug text-slate-900">
          {item.position}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
          <MapPin className="h-3 w-3 shrink-0" />
          {item.location}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-slate-100 bg-[#f8fafd] p-2.5">
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400">Kuota</p>
            <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">
              {item.quota} orang
            </p>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400">Target</p>
            <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">
              {item.target}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400">Uang saku</p>
            <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">
              {rupiah(item.stipend, true)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-100 bg-white p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
              <FileSpreadsheet className="h-3 w-3 text-navy-600" />
              Silabus & kurikulum
            </p>
            <span className="text-[10.5px] font-bold text-navy-700">
              {item.moduleHours} jam
            </span>
          </div>
          <div className="mt-1.5 space-y-1">
            {item.modules.slice(0, 2).map((module) => (
              <p
                key={module}
                className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500"
              >
                <Check className="h-2.5 w-2.5 shrink-0 text-emerald-600" strokeWidth={3} />
                {module}
              </p>
            ))}
            {item.modules.length > 2 && (
              <p className="pl-4 text-[10.5px] font-semibold text-slate-400">
                +{item.modules.length - 2} modul lainnya
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-dashed border-slate-100 pt-2 text-[10.5px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
              NIB & legalitas
            </span>
            <span className="flex items-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
              Kompensasi
            </span>
          </div>
        </div>

        {item.status === 'revision' && item.revisionNote && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-700">
              Catatan revisi
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-amber-800/80">
              {item.revisionNote}
            </p>
          </div>
        )}

        {item.status === 'approved' && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800">
              <BadgeCheck className="h-3.5 w-3.5" />
              Lowongan sudah tayang di portal peserta.
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-1.5 pt-3">
          {item.status === 'pending' ? (
            <>
              <button
                type="button"
                onClick={() => onApprove(item.id)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-brand px-3 py-2 text-[10.5px] font-extrabold text-white shadow-sm shadow-emerald-600/15 transition hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Setujui Lowongan
              </button>
              <button
                type="button"
                onClick={() => onRevision(item)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10.5px] font-bold text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              >
                <RotateCcw className="h-3 w-3" />
                Minta Revisi Silabus
              </button>
            </>
          ) : (
            <div
              className={cn(
                'flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10.5px] font-bold',
                item.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700',
              )}
            >
              {item.status === 'approved' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Validasi selesai
                </>
              ) : (
                <>
                  <Clock3 className="h-3.5 w-3.5" />
                  Menunggu revisi perusahaan
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function BpjsBadge({
  active,
  date,
  labelActive = 'Aktif',
}: {
  active: boolean;
  date: string;
  labelActive?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-full',
          active
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-amber-50 text-amber-500',
        )}
      >
        {active ? (
          <BadgeCheck className="h-3 w-3" />
        ) : (
          <Clock3 className="h-3 w-3" />
        )}
      </span>
      <div>
        <p
          className={cn(
            'text-[10.5px] font-bold',
            active ? 'text-emerald-700' : 'text-amber-700',
          )}
        >
          {active ? labelActive : 'Belum jatuh tempo'}
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-400">{date}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
  badge,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-navy-50 text-navy-700 ring-1 ring-navy-100">
          {icon}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
              {title}
            </h2>
            {badge}
          </div>
          <p className="mt-1 max-w-2xl text-[10.5px] leading-relaxed text-slate-400">
            {description}
          </p>
        </div>
      </div>
      {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
    </div>
  );
}

export function AdminPortal({ notify }: AdminPortalProps) {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [revisionTarget, setRevisionTarget] = useState<QueueItem | null>(null);
  const [revisionNote, setRevisionNote] = useState(
    'Mohon lengkapi matriks kompetensi dan tambahkan minimal satu modul keselamatan kerja yang relevan dengan posisi.',
  );
  const [bpjsRows, setBpjsRows] = useState<BpjsRow[]>(initialBpjsRows);
  const [disburseTarget, setDisburseTarget] = useState<BpjsRow | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Hari ini, 09.42 WIB');
  const [apiLogs, setApiLogs] = useState(apiLogsInitial);
  const [syncJustCompleted, setSyncJustCompleted] = useState(false);

  const approvedCount = queue.filter((item) => item.status === 'approved').length;
  const pendingCount = queue.filter((item) => item.status === 'pending').length;
  const verifiedVacancies = 128 + approvedCount;
  const readyIncentives = bpjsRows.filter(
    (row) => row.incentive === 'Siap dicairkan',
  );
  const readyIncentiveTotal = readyIncentives.reduce(
    (sum, row) => sum + row.amount,
    0,
  );
  const disbursedCount = bpjsRows.filter(
    (row) => row.incentive === 'Tersalurkan',
  ).length;

  const handleApprove = (id: string) => {
    const item = queue.find((entry) => entry.id === id);
    if (!item) return;
    setQueue((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: 'approved' } : entry,
      ),
    );
    notify(
      `${item.position} disetujui dan langsung tayang di portal peserta.`,
      'success',
    );
  };

  const handleRevision = (item: QueueItem) => {
    setRevisionTarget(item);
    setRevisionNote(
      'Mohon lengkapi matriks kompetensi dan tambahkan minimal satu modul keselamatan kerja yang relevan dengan posisi.',
    );
  };

  const submitRevision = () => {
    if (!revisionTarget) return;
    setQueue((current) =>
      current.map((item) =>
        item.id === revisionTarget.id
          ? { ...item, status: 'revision', revisionNote }
          : item,
      ),
    );
    setRevisionTarget(null);
    notify(
      `Permintaan revisi silabus ${revisionTarget.company} terkirim.`,
      'success',
    );
  };

  const handleDisburse = () => {
    if (!disburseTarget) return;
    setBpjsRows((current) =>
      current.map((row) =>
        row.id === disburseTarget.id
          ? { ...row, incentive: 'Tersalurkan' }
          : row,
      ),
    );
    notify(
      `Insentif retensi ${rupiah(disburseTarget.amount)} untuk ${disburseTarget.name} berhasil dicairkan dari APBD.`,
      'success',
    );
    setDisburseTarget(null);
  };

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setSyncJustCompleted(false);
    window.setTimeout(() => {
      const now = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
      })
        .format(new Date())
        .replace('.', ':');
      setLastSync(`Hari ini, ${now} WIB`);
      setSyncing(false);
      setSyncJustCompleted(true);
      setApiLogs((current) => [
        {
          id: Date.now(),
          title: 'Sinkronisasi manual MagangHub',
          detail: 'Semua endpoint tersinkron',
          time: now,
          status: 'Berhasil',
        },
        ...current,
      ]);
      notify('Sinkronisasi API MagangHub selesai — 1.284 data tersinkron.', 'success');
    }, 1300);
  };

  const kpiCards = useMemo(
    () => [
      {
        id: 'applicants',
        label: 'Total Pendaftar SMA/SMK',
        value: '3.482',
        icon: Users,
        iconClass: 'bg-navy-50 text-navy-700 ring-navy-100',
        detail: '2.196 lulusan SMK · 1.286 lulusan SMA',
        trend: '+12,4%',
        trendNote: 'bulan ini',
        data: [14, 20, 18, 27, 24, 35, 32, 42],
        color: '#1E3A8A',
      },
      {
        id: 'vacancies',
        label: 'Lowongan Perusahaan Terverifikasi',
        value: String(verifiedVacancies),
        icon: Building2,
        iconClass: 'bg-sky-50 text-sky-700 ring-sky-100',
        detail: '42 perusahaan mitra · 8 sektor industri',
        trend: '+8',
        trendNote: 'bulan ini',
        data: [21, 25, 24, 30, 33, 36, 39, 43],
        color: '#0284C7',
      },
      {
        id: 'placement',
        label: 'Tingkat Penempatan Formal',
        value: '78%',
        icon: TrendingUp,
        iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        detail: '2.714 dari 3.482 pendaftar',
        trend: '+6,2 pp',
        trendNote: 'vs tahun lalu',
        data: [53, 57, 59, 64, 68, 71, 74, 78],
        color: '#059669',
      },
      {
        id: 'retention',
        label: 'Peserta Bertahan 6 Bulan',
        value: '1.246',
        icon: ShieldCheck,
        iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        detail: '88,4% terverifikasi aktif BPJS',
        trend: '+4,1%',
        trendNote: 'pertumbuhan',
        data: [37, 41, 42, 45, 47, 48, 54, 58],
        color: '#059669',
        highlight: true,
      },
    ],
    [verifiedVacancies],
  );

  return (
    <div className="pb-14 pt-5 sm:pt-7">
      <div className="page-shell">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-md shadow-navy-900/15">
              <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-emerald-400/20 blur-md" />
              <Landmark className="relative h-5 w-5" />
              <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-navy-900" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow text-slate-400">
                  Disnakertrans Sumsel
                  <span className="hidden sm:inline"> · Desk Onboarding</span>
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-extrabold text-emerald-700 ring-1 ring-emerald-600/10">
                  <span className="relative flex h-1 w-1">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                  </span>
                  LIVE
                </span>
              </div>
              <h1 className="mt-1 text-[22px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[26px]">
                Selamat pagi, Admin Dinas.
              </h1>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                Pantau verifikasi lowongan, validasi BPJS, dan insentif retensi
                talenta muda Sumatera Selatan dalam satu meja kerja.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pl-0 lg:justify-end lg:pl-4">
            <div className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[10.5px] font-bold text-slate-500">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              Rabu, 4 Nov 2026
            </div>
            <button
              type="button"
              onClick={() =>
                notify('Laporan ringkasan Desk Onboarding berhasil diunduh.', 'success')
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-bold text-slate-600 shadow-sm transition hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
            >
              <Download className="h-3.5 w-3.5" />
              Ekspor laporan
            </button>
          </div>
        </div>

        <section
          id="admin-kpi"
          aria-label="Ringkasan KPI utama"
          className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-float',
                  card.highlight
                    ? 'border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 via-white to-white'
                    : 'border-slate-200/80 bg-white',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'grid h-8 w-8 place-items-center rounded-[10px] ring-1',
                      card.iconClass,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-1 text-[10.5px] font-extrabold text-emerald-700">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {card.trend}
                  </span>
                </div>
                <p className="mt-3 min-h-[24px] text-[10.5px] font-bold uppercase leading-[1.4] tracking-[0.09em] text-slate-400">
                  {card.label}
                </p>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="text-[29px] font-extrabold leading-none tracking-[-0.055em] text-slate-950">
                    {card.value}
                  </p>
                  <Sparkline values={card.data} color={card.color} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                  <p className="truncate text-[10.5px] font-medium text-slate-400">
                    {card.detail}
                  </p>
                  <p className="shrink-0 text-[10.5px] font-semibold text-slate-400">
                    {card.trendNote}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section
          id="admin-queue"
          className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card"
        >
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <SectionHeading
              icon={<FileCheck2 className="h-4 w-4" />}
              title="Antrean Verifikasi Lowongan & Kurikulum"
              description="Tinjau usulan perusahaan mitra sebelum lowongan tayang di portal peserta."
              badge={
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700 ring-1 ring-amber-600/10">
                  <Clock3 className="h-2.5 w-2.5" />
                  {pendingCount} menunggu
                </span>
              }
              action={
                <button
                  type="button"
                  onClick={() =>
                    notify('Menampilkan riwayat validasi 30 hari terakhir.', 'info')
                  }
                  className="inline-flex items-center gap-1 text-[10.5px] font-bold text-navy-700 transition hover:text-navy-900"
                >
                  Riwayat validasi
                  <ChevronRight className="h-3 w-3" />
                </button>
              }
            />
          </div>
          <div className="grid gap-3 p-4 lg:grid-cols-3 sm:p-5">
            {queue.map((item) => (
              <QueueCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onRevision={handleRevision}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-400">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Setiap persetujuan otomatis menerbitkan badge verifikasi Dinas.
            </p>
            <p className="text-[10.5px] font-semibold text-slate-400">
              SLA verifikasi: 1×24 jam kerja
            </p>
          </div>
        </section>

        <section
          id="admin-incentives"
          className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card"
        >
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <SectionHeading
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Engine Verifikasi Otomatis BPJS & Insentif Retensi"
              description="Validasi kepesertaan BPJS pada milestone bulan ke-3 dan ke-6, lalu salurkan insentif retensi dari APBD."
              badge={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-extrabold text-emerald-700 ring-1 ring-emerald-600/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verifikasi otomatis
                </span>
              }
              action={
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10.5px] font-bold text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-navy-700 disabled:opacity-60"
                >
                  <RefreshCw className={cn('h-3 w-3', syncing && 'animate-spin')} />
                  Perbarui verifikasi
                </button>
              }
            />
          </div>

          <div className="grid gap-2.5 border-b border-slate-100 bg-slate-50/40 px-4 py-3 sm:grid-cols-3 sm:px-5">
            {[
              {
                label: 'Siap dicairkan',
                value: `${readyIncentives.length} peserta`,
                note: `${rupiah(readyIncentiveTotal)} · APBD Sumsel`,
                tone: 'emerald',
                icon: Wallet,
              },
              {
                label: 'Terverifikasi BPJS aktif',
                value: '17 / 18 peserta',
                note: '1 menunggu sinkronisasi',
                tone: 'navy',
                icon: ShieldCheck,
              },
              {
                label: 'Insentif tersalurkan',
                value: `${disbursedCount} peserta`,
                note: 'kohort 2026 berjalan',
                tone: 'amber',
                icon: BadgeCheck,
              },
            ].map((summary) => {
              const Icon = summary.icon;
              return (
                <div
                  key={summary.label}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2"
                >
                  <span
                    className={cn(
                      'grid h-7 w-7 shrink-0 place-items-center rounded-lg',
                      summary.tone === 'emerald'
                        ? 'bg-emerald-50 text-emerald-600'
                        : summary.tone === 'navy'
                          ? 'bg-navy-50 text-navy-700'
                          : 'bg-amber-50 text-amber-600',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold text-slate-400">{summary.label}</p>
                    <p className="truncate text-[10.5px] font-extrabold text-slate-800">
                      {summary.value}
                      <span className="ml-1 text-[10.5px] font-medium text-slate-400">
                        · {summary.note}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div id="admin-incentive-table-scroll" className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                  <th className="px-5 py-3">Peserta / NIK</th>
                  <th className="px-4 py-3">ID Perusahaan</th>
                  <th className="px-4 py-3">Status BPJS Aktif</th>
                  <th className="px-4 py-3">Milestone Bulan ke-3</th>
                  <th className="px-4 py-3">Milestone Bulan ke-6</th>
                  <th className="px-4 py-3">Status Insentif Retensi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bpjsRows.map((row) => (
                  <tr
                    key={row.id}
                    className="group transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar name={row.name} tone={row.tone} size="sm" />
                        <div>
                          <p className="text-[10.5px] font-extrabold text-slate-800">
                            {row.name}
                          </p>
                          <p className="mt-0.5 font-mono text-[10.5px] tracking-[0.02em] text-slate-400">
                            NIK {row.nik}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400">{row.school}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-mono text-[10.5px] font-bold text-navy-700">
                        {row.companyId}
                      </p>
                      <p className="mt-0.5 max-w-[130px] truncate text-[10.5px] text-slate-400">
                        {row.company}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      {row.bpjsActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10.5px] font-extrabold text-emerald-700 ring-1 ring-emerald-600/10">
                          <BadgeCheck className="h-3 w-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10.5px] font-extrabold text-amber-700 ring-1 ring-amber-600/10">
                          <Clock3 className="h-3 w-3" />
                          Menunggu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <BpjsBadge
                        active={row.month3.active}
                        date={row.month3.date}
                        labelActive="Terverifikasi"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <BpjsBadge
                        active={row.month6.active}
                        date={row.month6.date}
                        labelActive="Terverifikasi"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-extrabold ring-1',
                          row.incentive === 'Tersalurkan'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                            : row.incentive === 'Siap dicairkan'
                              ? 'bg-navy-50 text-navy-700 ring-navy-700/10'
                              : 'bg-slate-50 text-slate-500 ring-slate-200',
                        )}
                      >
                        {row.incentive === 'Tersalurkan' ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : row.incentive === 'Siap dicairkan' ? (
                          <CircleDollarSign className="h-2.5 w-2.5" />
                        ) : (
                          <Clock3 className="h-2.5 w-2.5" />
                        )}
                        {row.incentive}
                      </span>
                      {row.incentive !== 'Menunggu milestone' && (
                        <p className="mt-1 text-[10.5px] font-semibold text-slate-400">
                          {rupiah(row.amount)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {row.incentive === 'Siap dicairkan' ? (
                        <button
                          type="button"
                          onClick={() => setDisburseTarget(row)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-brand px-2.5 py-2 text-[10.5px] font-extrabold text-white shadow-sm shadow-emerald-600/15 transition hover:bg-emerald-700"
                        >
                          <Banknote className="h-3 w-3" />
                          Cairkan Insentif Retensi APBD
                        </button>
                      ) : row.incentive === 'Tersalurkan' ? (
                        <span className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-2 text-[10.5px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Insentif Tersalurkan
                        </span>
                      ) : (
                        <span
                          className="inline-flex cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-slate-100 px-2.5 py-2 text-[10.5px] font-bold text-slate-400"
                          title="Insentif dapat dicairkan setelah milestone bulan ke-6 terverifikasi"
                        >
                          <Clock3 className="h-3 w-3" />
                          Menunggu Milestone
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/40 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-400">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Sumber dana: APBD Provinsi Sumatera Selatan · Pencairan tercatat pada
              audit trail.
            </p>
            <p className="text-[10.5px] font-semibold text-slate-400">
              Data per 4 Nov 2026, 09.42 WIB
            </p>
          </div>
        </section>

        <section
          id="admin-api"
          className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card"
        >
          <div className="grid lg:grid-cols-[1.2fr_.8fr]">
            <div className="p-4 sm:p-5">
              <SectionHeading
                icon={<Wifi className="h-4 w-4" />}
                title="Monitor Sinkronisasi API MagangHub"
                description="Koneksi data nasional untuk lowongan, peserta, penempatan, dan retensi."
                badge={
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-slate-500">
                    v2.4
                  </span>
                }
                action={
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-navy-900 px-2.5 text-[10.5px] font-bold text-white shadow-sm transition hover:bg-navy-800 disabled:bg-navy-700"
                  >
                    <RefreshCw className={cn('h-3 w-3', syncing && 'animate-spin')} />
                    {syncing ? 'Menyinkronkan…' : 'Sinkronkan sekarang'}
                  </button>
                }
              />

              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 text-[10.5px] font-extrabold text-emerald-800">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    API MagangHub Nasional: Terhubung &amp; Tersinkronisasi
                  </span>
                  <span className="text-[10.5px] font-semibold text-emerald-700/70">
                    {syncing
                      ? 'Menghubungi server…'
                      : syncJustCompleted
                        ? 'Sinkronisasi baru saja selesai'
                        : `Sinkron terakhir ${lastSync}`}
                  </span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className={cn(
                      'h-full rounded-full bg-emerald-500 transition-all duration-1000',
                      syncing ? 'w-1/3 animate-pulse' : 'w-full',
                    )}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Latensi', value: syncing ? '—' : '118 ms' },
                  { label: 'Data tersinkron', value: syncing ? '…' : '1.284' },
                  { label: 'Uptime 30 hari', value: '99,98%' },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-slate-100 bg-[#f8fafd] px-2.5 py-2"
                  >
                    <p className="text-[10.5px] font-semibold text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-0.5 text-[11px] font-extrabold text-slate-800">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Lowongan', value: '128' },
                  { label: 'Peserta', value: '3.482' },
                  { label: 'Penempatan', value: '2.714' },
                  { label: 'Retensi', value: '1.246' },
                ].map((endpoint) => (
                  <div
                    key={endpoint.label}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-sm"
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        syncing ? 'bg-amber-400' : 'bg-emerald-500',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[10.5px] font-semibold text-slate-500">
                        {endpoint.label}
                      </p>
                      <p className="text-[10.5px] font-extrabold text-slate-800">
                        {endpoint.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-[#f9fbfe] p-4 sm:p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-navy-700" />
                  <h3 className="text-[11px] font-extrabold text-slate-800">
                    Log sinkronisasi
                  </h3>
                </div>
                <span className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {apiLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[10.5px] font-bold leading-snug text-slate-700">
                          {log.title}
                        </p>
                        <span className="shrink-0 font-mono text-[10.5px] text-slate-400">
                          {log.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] text-slate-400">{log.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-navy-50 text-navy-700">
                  <Database className="h-3 w-3" />
                </span>
                <p className="text-[10.5px] leading-relaxed text-slate-400">
                  <span className="font-bold text-slate-600">Webhook aktif.</span>{' '}
                  0 error dalam 30 hari terakhir.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={Boolean(revisionTarget)}
        onClose={() => setRevisionTarget(null)}
        title="Minta revisi silabus"
        eyebrow="Antrean verifikasi"
        description={
          revisionTarget
            ? `${revisionTarget.position} · ${revisionTarget.company}`
            : undefined
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setRevisionTarget(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={submitRevision}
              disabled={!revisionNote.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Kirim Permintaan Revisi
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <div className="flex items-start gap-2">
              <MessageSquareWarning className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[10.5px] leading-relaxed text-amber-800">
                Perusahaan akan menerima catatan ini dan dapat mengajukan ulang
                silabus untuk diverifikasi kembali.
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="revision-note"
              className="mb-1.5 block text-[11px] font-bold text-slate-700"
            >
              Catatan revisi untuk perusahaan
            </label>
            <textarea
              id="revision-note"
              value={revisionNote}
              onChange={(event) => setRevisionNote(event.target.value)}
              rows={4}
              className="field resize-none leading-relaxed"
              placeholder="Jelaskan bagian kurikulum yang perlu diperbaiki…"
            />
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-slate-500">
              <FileCheck2 className="mt-0.5 h-3 w-3 shrink-0 text-navy-500" />
              Rekomendasi Dinas: minimal 1 modul K3 dan total pelatihan 16 jam
              untuk pemagangan teknis.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(disburseTarget)}
        onClose={() => setDisburseTarget(null)}
        title="Cairkan insentif retensi?"
        eyebrow="Pencairan APBD"
        description="Pastikan milestone bulan ke-6 telah terverifikasi sebelum melanjutkan."
        footer={
          <>
            <button
              type="button"
              onClick={() => setDisburseTarget(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDisburse}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-brand px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-700"
            >
              <Banknote className="h-3.5 w-3.5" />
              Konfirmasi Pencairan
            </button>
          </>
        }
      >
        {disburseTarget && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <PersonAvatar
                name={disburseTarget.name}
                tone={disburseTarget.tone}
                size="lg"
              />
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  {disburseTarget.name}
                </p>
                <p className="mt-0.5 text-[10.5px] text-slate-500">
                  {disburseTarget.company} · {disburseTarget.companyId}
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] text-slate-400">
                  NIK {disburseTarget.nik}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold text-emerald-800">
                  Nominal insentif retensi
                </span>
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-emerald-900">
                {rupiah(disburseTarget.amount)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10.5px] text-emerald-700/70">
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> BPJS aktif
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Bulan ke-6 terverifikasi
                </span>
              </div>
            </div>
            <div className="space-y-1.5 rounded-xl border border-slate-200 p-3">
              {[
                ['Sumber dana', 'APBD Provinsi Sumatera Selatan'],
                [
                  'Milestone',
                  `Bulan ke-6 · ${disburseTarget.month6.date}`,
                ],
                ['Metode', 'Transfer ke rekening peserta terdaftar'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-[10.5px] text-slate-400">{label}</span>
                  <span className="text-right text-[10.5px] font-bold text-slate-600">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-slate-400">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
              Tindakan ini akan tercatat pada audit trail dan tidak dapat
              dibatalkan.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

