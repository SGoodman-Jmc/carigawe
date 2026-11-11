import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  CircleDollarSign,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Cpu,
  Download,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  Lightbulb,
  MapPin,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Pencil,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  X,
} from 'lucide-react';
import {
  cn,
  rupiah,
  type Notify,
} from '../lib/utils';
import {
  CheckItem,
  CompanyMark,
  Modal,
  PersonAvatar,
  ProgressBar,
  Toggle,
  VerifiedBadge,
} from '../components/ui';

type CompanyPortalProps = {
  notify: Notify;
};

type CompanyTab = 'post' | 'evaluate' | 'retention';

const tabs: Array<{
  id: CompanyTab;
  label: string;
  shortLabel: string;
  icon: typeof ClipboardList;
  hint: string;
}> = [
  {
    id: 'post',
    label: 'Form Input Lowongan & Kompetensi',
    shortLabel: 'Input Lowongan',
    icon: ClipboardList,
    hint: 'Buat & ajukan',
  },
  {
    id: 'evaluate',
    label: 'Evaluasi Peserta & Proyek Nyata',
    shortLabel: 'Evaluasi Peserta',
    icon: ClipboardCheck,
    hint: '4 perlu ditinjau',
  },
  {
    id: 'retention',
    label: 'Pelaporan Retensi Satu Pintu',
    shortLabel: 'Retensi',
    icon: BarChart3,
    hint: 'Kohort aktif',
  },
];

const syllabusModules = [
  {
    id: 'k3',
    title: 'Keselamatan & Budaya Kerja Industri',
    description: 'Induksi K3, APD, identifikasi risiko, dan prosedur kerja aman.',
    hours: 8,
    level: 'Wajib',
    tag: 'Rekomendasi',
    icon: ShieldCheck,
    tone: 'emerald',
  },
  {
    id: 'maintenance',
    title: 'Perawatan Mesin Industri Dasar',
    description: 'Preventive maintenance, checklist mesin, dan pelaporan temuan.',
    hours: 12,
    level: 'Inti kejuruan',
    tag: 'Sangat cocok',
    icon: Wrench,
    tone: 'navy',
  },
  {
    id: 'communication',
    title: 'Komunikasi Profesional & Etika Kerja',
    description: 'Komunikasi tim, etika industri, dan penyampaian laporan kerja.',
    hours: 6,
    level: 'Soft skill',
    tag: 'Pendukung',
    icon: MessageSquare,
    tone: 'amber',
  },
  {
    id: 'digital',
    title: 'Digitalisasi Proses Manufaktur',
    description: 'Pengenalan sensor, dashboard, dan pencatatan produksi digital.',
    hours: 10,
    level: 'Pengayaan',
    tag: 'Masa depan',
    icon: Cpu,
    tone: 'violet',
  },
];

type EvaluationParticipant = {
  id: string;
  name: string;
  school: string;
  city: string;
  position: string;
  period: string;
  tone: 'navy' | 'emerald' | 'amber' | 'violet' | 'rose';
  project: string;
  progress: number;
  deliverables: Array<{
    name: string;
    status: 'Terkirim' | 'Dalam review' | 'Disetujui';
  }>;
  rating: number;
  recommended: boolean;
};

const initialParticipants: EvaluationParticipant[] = [
  {
    id: 'nadia',
    name: 'Nadia Safitri',
    school: 'SMKN 1 Palembang',
    city: 'Palembang',
    position: 'Teknisi Pemeliharaan Mesin',
    period: 'Jul 2026 — sekarang',
    tone: 'emerald',
    project: 'Digitalisasi Checklist Perawatan Line 2',
    progress: 78,
    deliverables: [
      { name: 'Laporan analisis perawatan.pdf', status: 'Disetujui' },
      { name: 'Dashboard checklist Line 2.xlsx', status: 'Dalam review' },
    ],
    rating: 5,
    recommended: true,
  },
  {
    id: 'bima',
    name: 'Bima Pratama',
    school: 'SMKN 2 Muara Enim',
    city: 'Muara Enim',
    position: 'Operator Produksi',
    period: 'Agu 2026 — sekarang',
    tone: 'navy',
    project: 'Studi Efisiensi Packing Plant',
    progress: 62,
    deliverables: [
      { name: 'Draft observasi lapangan.docx', status: 'Terkirim' },
      { name: 'Rekap downtime packer.pdf', status: 'Dalam review' },
    ],
    rating: 4,
    recommended: false,
  },
  {
    id: 'siti',
    name: 'Siti Aisyah',
    school: 'SMAN 3 Palembang',
    city: 'Palembang',
    position: 'Analis Data & Administrasi',
    period: 'Jul 2026 — sekarang',
    tone: 'violet',
    project: 'Dashboard Stok Spare Part Gudang',
    progress: 91,
    deliverables: [
      { name: 'Dashboard stok gudang.xlsx', status: 'Disetujui' },
      { name: 'Panduan pengguna.pdf', status: 'Disetujui' },
    ],
    rating: 5,
    recommended: true,
  },
  {
    id: 'rizky',
    name: 'Rizky Maulana',
    school: 'SMKN 1 Prabumulih',
    city: 'Prabumulih',
    position: 'Quality Control',
    period: 'Sep 2026 — sekarang',
    tone: 'amber',
    project: 'Audit Visual Kualitas Kemasan',
    progress: 44,
    deliverables: [
      { name: 'Form audit kemasan.xlsx', status: 'Terkirim' },
      { name: 'Rencana perbaikan QC.docx', status: 'Dalam review' },
    ],
    rating: 3,
    recommended: false,
  },
];

type RetentionRow = {
  id: string;
  name: string;
  school: string;
  position: string;
  company: string;
  month3: { verified: boolean; date: string };
  month6: { verified: boolean; date: string };
  incentive: 'Tersalurkan' | 'Diproses' | 'Menunggu milestone';
  tone: 'navy' | 'emerald' | 'amber' | 'violet' | 'rose';
};

const retentionRows: RetentionRow[] = [
  {
    id: 'nadia',
    name: 'Nadia Safitri',
    school: 'SMKN 1 Palembang',
    position: 'Teknisi Pemeliharaan Mesin',
    company: 'PT Semen Baturaja',
    month3: { verified: true, date: '15 Okt 2026' },
    month6: { verified: false, date: '15 Jan 2027' },
    incentive: 'Menunggu milestone',
    tone: 'emerald',
  },
  {
    id: 'bima',
    name: 'Bima Pratama',
    school: 'SMKN 2 Muara Enim',
    position: 'Operator Produksi',
    company: 'PT Bukit Asam',
    month3: { verified: true, date: '12 Mei 2026' },
    month6: { verified: true, date: '12 Agu 2026' },
    incentive: 'Tersalurkan',
    tone: 'navy',
  },
  {
    id: 'siti',
    name: 'Siti Aisyah',
    school: 'SMAN 3 Palembang',
    position: 'Analis Data & Administrasi',
    company: 'PT Pupuk Sriwidjaja',
    month3: { verified: true, date: '8 Jun 2026' },
    month6: { verified: true, date: '8 Sep 2026' },
    incentive: 'Tersalurkan',
    tone: 'violet',
  },
  {
    id: 'rizky',
    name: 'Rizky Maulana',
    school: 'SMKN 1 Prabumulih',
    position: 'Customer Service',
    company: 'KAI Divre III Palembang',
    month3: { verified: true, date: '22 Jul 2026' },
    month6: { verified: true, date: '22 Okt 2026' },
    incentive: 'Diproses',
    tone: 'amber',
  },
  {
    id: 'anisa',
    name: 'Anisa Putri',
    school: 'SMKN 2 Palembang',
    position: 'Barista & Konten Kreatif',
    company: 'Kopi Kambang Iwak',
    month3: { verified: true, date: '3 Sep 2026' },
    month6: { verified: false, date: '3 Des 2026' },
    incentive: 'Menunggu milestone',
    tone: 'rose',
  },
];

const initialHardSkills = ['Perawatan Mesin', 'K3 Industri', 'Teknik Mesin'];
const initialSoftSkills = ['Disiplin', 'Kolaborasi Tim'];

const hardSuggestions = [
  'Gambar Teknik',
  'PLC Dasar',
  'Quality Control',
  'Keselamatan Kerja',
];
const softSuggestions = ['Problem Solving', 'Komunikasi', 'Adaptif'];

function TagField({
  label,
  description,
  tags,
  onChange,
  suggestions,
  accent,
}: {
  label: string;
  description: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  accent: 'navy' | 'emerald';
}) {
  const [draft, setDraft] = useState('');

  const addTags = (raw: string) => {
    const candidates = raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (!candidates.length) return;
    const next = [...tags];
    for (const candidate of candidates) {
      if (
        next.length < 6 &&
        !next.some(
          (tag) => tag.toLowerCase() === candidate.toLowerCase(),
        )
      ) {
        next.push(candidate);
      }
    }
    onChange(next);
    setDraft('');
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <span className="text-[10.5px] font-medium text-slate-400">
          {tags.length}/6 · Enter untuk tambah
        </span>
      </div>
      <div
        className={cn(
          'flex min-h-[48px] flex-wrap items-center gap-1.5 rounded-xl border bg-white p-2 transition focus-within:ring-4',
          accent === 'emerald'
            ? 'border-emerald-200 focus-within:border-emerald-500 focus-within:ring-emerald-500/10'
            : 'border-slate-200 focus-within:border-navy-500 focus-within:ring-navy-500/10',
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg py-1 pl-2 pr-1.5 text-[11px] font-semibold ring-1',
              accent === 'emerald'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                : 'bg-navy-50 text-navy-800 ring-navy-700/10',
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((item) => item !== tag))}
              className="grid h-3.5 w-3.5 place-items-center rounded hover:bg-white/70"
              aria-label={`Hapus ${tag}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              addTags(draft);
            }
            if (event.key === 'Backspace' && !draft && tags.length > 0) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => addTags(draft)}
          placeholder={tags.length > 0 ? 'Tambah skill…' : 'Tulis keterampilan…'}
          className="min-w-[110px] flex-1 border-0 bg-transparent px-1 py-1 text-xs text-slate-700 outline-none placeholder:text-slate-400"
          aria-label={label}
        />
      </div>
      <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-400">
        {description}
      </p>
      {tags.length < 6 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions
            .filter(
              (suggestion) =>
                !tags.some(
                  (tag) =>
                    tag.toLowerCase() === suggestion.toLowerCase(),
                ),
            )
            .slice(0, 3)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTags(suggestion)}
                className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-200 bg-slate-50/60 px-2 py-1 text-[10.5px] font-semibold text-slate-500 transition hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
              >
                <Plus className="h-2.5 w-2.5" />
                {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating mentor ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={cn(
            'grid h-7 w-7 place-items-center rounded-lg transition hover:bg-amber-50',
            star <= value ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300',
          )}
          aria-label={`Beri ${star} bintang`}
        >
          <Star
            className="h-[17px] w-[17px]"
            fill={star <= value ? 'currentColor' : 'none'}
            strokeWidth={1.9}
          />
        </button>
      ))}
    </div>
  );
}

function BpjsStatus({
  verified,
  date,
  muted = false,
}: {
  verified: boolean;
  date: string;
  muted?: boolean;
}) {
  if (!verified) {
    return (
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-500">
          <Clock3 className="h-3 w-3" />
        </span>
        <div>
          <p className={cn('text-[11px] font-bold', muted ? 'text-slate-400' : 'text-amber-700')}>
            Menunggu milestone
          </p>
          <p className="mt-0.5 text-[10.5px] text-slate-400">{date}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <BadgeCheck className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-[10.5px] font-bold leading-snug text-emerald-700">
          Verifikasi BPJS Aktif
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-400">{date}</p>
      </div>
    </div>
  );
}

function EvaluationCard({
  participant,
  onRating,
  onRecommend,
  notify,
}: {
  participant: EvaluationParticipant;
  onRating: (id: string, rating: number) => void;
  onRecommend: (id: string) => void;
  notify: Notify;
}) {
  const deliverableStyles: Record<
    EvaluationParticipant['deliverables'][number]['status'],
    string
  > = {
    Terkirim: 'bg-navy-50 text-navy-700 ring-navy-700/10',
    'Dalam review': 'bg-amber-50 text-amber-700 ring-amber-600/10',
    Disetujui: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  };

  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-float sm:p-5',
        participant.recommended
          ? 'border-emerald-200/80'
          : 'border-slate-200/80',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PersonAvatar name={participant.name} tone={participant.tone} size="lg" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold tracking-tight text-slate-900">
              {participant.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500">
              <GraduationCap className="h-3 w-3 shrink-0 text-slate-400" />
              {participant.school}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
              <MapPin className="h-2.5 w-2.5" />
              {participant.city}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Aktif
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-y border-slate-100 py-2.5">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
            Posisi magang
          </p>
          <p className="mt-0.5 text-xs font-bold text-slate-700">
            {participant.position}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
          <CalendarDays className="h-3 w-3" />
          {participant.period}
        </span>
      </div>

      <div className="mt-3.5 rounded-xl border border-slate-100 bg-[#f8fafd] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-navy-600">
              <Target className="h-3 w-3" /> Proyek nyata
            </p>
            <h4 className="mt-1 text-xs font-bold leading-snug text-slate-800">
              {participant.project}
            </h4>
          </div>
          <span className="text-xs font-extrabold tabular-nums text-navy-800">
            {participant.progress}%
          </span>
        </div>
        <ProgressBar
          value={participant.progress}
          tone={participant.progress > 80 ? 'emerald' : 'navy'}
          className="mt-2.5"
        />
        <div className="mt-3 space-y-1.5">
          {participant.deliverables.map((deliverable) => (
            <div
              key={deliverable.name}
              className="flex items-center justify-between gap-2.5 rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-100"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                <FileText className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{deliverable.name}</span>
              </span>
              <span
                className={cn(
                  'shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold ring-1',
                  deliverableStyles[deliverable.status],
                )}
              >
                {deliverable.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
            Rating mentor
          </p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating
              value={participant.rating}
              onChange={(rating) => onRating(participant.id, rating)}
            />
            <span className="text-[10.5px] font-bold tabular-nums text-slate-500">
              {participant.rating}/5
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            notify(
              `Membuka portofolio proyek ${participant.name.split(' ')[0]}.`,
              'info',
            )
          }
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10.5px] font-bold text-navy-700 transition hover:bg-navy-50"
        >
          Portofolio
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            className={cn(
              'text-[11px] font-bold leading-snug',
              participant.recommended ? 'text-emerald-700' : 'text-slate-600',
            )}
          >
            Rekomendasikan Rekrutmen Formal
          </p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-400">
            {participant.recommended
              ? 'Kandidat prioritas masuk pipeline rekrutmen.'
              : 'Loloskan peserta ke kandidat prioritas perusahaan.'}
          </p>
        </div>
        <Toggle
          checked={participant.recommended}
          onChange={() => onRecommend(participant.id)}
          label={`Rekomendasikan ${participant.name}`}
        />
      </div>
    </article>
  );
}

function RetentionDetailModal({
  row,
  open,
  onClose,
  notify,
}: {
  row: RetentionRow | null;
  open: boolean;
  onClose: () => void;
  notify: Notify;
}) {
  return (
    <Modal
      open={open && Boolean(row)}
      onClose={onClose}
      title={row?.name ?? 'Detail peserta'}
      eyebrow="Pelaporan retensi"
      description="Riwayat kepesertaan dan status insentif peserta magang."
      width="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              notify('Laporan retensi peserta berhasil diunduh.', 'success');
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-800"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh laporan PDF
          </button>
        </>
      }
    >
      {row && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <PersonAvatar name={row.name} tone={row.tone} size="lg" />
            <div>
              <p className="text-sm font-extrabold text-slate-900">{row.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {row.position} · {row.company}
              </p>
              <p className="mt-0.5 text-[10.5px] text-slate-400">{row.school}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3.5">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Milestone bulan ke-3
              </p>
              <div className="mt-2">
                <BpjsStatus verified={row.month3.verified} date={row.month3.date} />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3.5">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Milestone bulan ke-6
              </p>
              <div className="mt-2">
                <BpjsStatus verified={row.month6.verified} date={row.month6.date} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50/70 p-3.5 ring-1 ring-emerald-600/10">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700/70">
                Status insentif retensi
              </p>
              <p className="mt-1 text-sm font-extrabold text-emerald-800">
                {row.incentive}
              </p>
            </div>
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      )}
    </Modal>
  );
}

export function CompanyPortal({ notify }: CompanyPortalProps) {
  const [activeTab, setActiveTab] = useState<CompanyTab>('post');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedRetention, setSelectedRetention] = useState<RetentionRow | null>(
    null,
  );
  const [participants, setParticipants] =
    useState<EvaluationParticipant[]>(initialParticipants);

  const [position, setPosition] = useState('Teknisi Pemeliharaan Mesin');
  const [location, setLocation] = useState('Baturaja, Ogan Komering Ulu');
  const [targetEducation, setTargetEducation] = useState<string[]>(['SMK']);
  const [quota, setQuota] = useState(4);
  const [deadline, setDeadline] = useState('2026-11-30');
  const [description, setDescription] = useState(
    'Bergabung dalam tim pemeliharaan pabrik untuk memastikan mesin produksi beroperasi aman dan andal. Kamu akan didampingi mentor industri dan mengerjakan proyek nyata di lini produksi.',
  );
  const [hardSkills, setHardSkills] = useState<string[]>(initialHardSkills);
  const [softSkills, setSoftSkills] = useState<string[]>(initialSoftSkills);
  const [stipend, setStipend] = useState(3_150_000);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'k3',
    'maintenance',
  ]);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const umpHtml = 3_940_000;
  const stipendPercent = Math.round((stipend / umpHtml) * 100);
  const modules = syllabusModules.filter((module) =>
    selectedModules.includes(module.id),
  );
  const moduleHours = modules.reduce((total, module) => total + module.hours, 0);

  const readiness = useMemo(
    () => [
      {
        label: 'Informasi posisi & penempatan',
        done:
          position.trim().length > 2 &&
          location.trim().length > 2 &&
          Boolean(deadline),
      },
      {
        label: 'Kualifikasi kompetensi',
        done: hardSkills.length >= 2 && softSkills.length >= 1,
      },
      {
        label: 'Target & uang saku',
        done: targetEducation.length > 0 && quota > 0 && stipend > 0,
      },
      {
        label: 'Silabus pelatihan dipilih',
        done: selectedModules.length > 0,
      },
    ],
    [
      deadline,
      hardSkills.length,
      location,
      position,
      quota,
      selectedModules.length,
      softSkills.length,
      stipend,
      targetEducation.length,
    ],
  );

  const readyCount = readiness.filter((item) => item.done).length;
  const completion = Math.round((readyCount / readiness.length) * 100);
  const canSubmit = readyCount === readiness.length;

  const updateParticipantRating = (id: string, rating: number) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, rating } : participant,
      ),
    );
    const participant = participants.find((item) => item.id === id);
    if (participant && rating !== participant.rating) {
      notify(`Rating mentor ${participant.name} diperbarui menjadi ${rating}/5.`, 'success');
    }
  };

  const toggleRecommendation = (id: string) => {
    const participant = participants.find((item) => item.id === id);
    if (!participant) return;
    const nextRecommended = !participant.recommended;
    setParticipants((current) =>
      current.map((item) =>
        item.id === id ? { ...item, recommended: nextRecommended } : item,
      ),
    );
    notify(
      nextRecommended
        ? `${participant.name} direkomendasikan untuk rekrutmen formal.`
        : `Rekomendasi rekrutmen ${participant.name} dibatalkan.`,
      nextRecommended ? 'success' : 'info',
    );
  };

  const handleNewVacancy = () => {
    const wasSubmitted = submitted;
    setActiveTab('post');
    if (wasSubmitted) {
      setSubmitted(false);
      setPosition('');
      setDescription('');
      setHardSkills([]);
      setSoftSkills([]);
      setSelectedModules([]);
      setQuota(2);
      setStipend(2_500_000);
    }
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    notify(
      wasSubmitted
        ? 'Form lowongan baru siap diisi.'
        : 'Form draf lowongan aktif — lengkapi detail posisi.',
      'info',
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      notify('Lengkapi komponen lowongan sebelum diajukan.', 'warning');
      return;
    }
    setSubmitted(true);
    notify(
      'Lowongan diajukan ke Desk Onboarding Dinas. Estimasi verifikasi 1×24 jam.',
      'success',
    );
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const toggleStipendAnchor = () => {
    setStipend(umpHtml);
    notify('Uang saku disamakan dengan acuan UMP Sumsel.', 'info');
  };

  const addMonths = (query: string) => {
    setSelectedModules((current) =>
      current.includes(query)
        ? current.filter((item) => item !== query)
        : [...current, query],
    );
  };

  const selectedIncentiveCount = retentionRows.filter(
    (row) => row.incentive === 'Tersalurkan',
  ).length;

  return (
    <div className="pb-14 pt-5 sm:pt-7">
      <div className="page-shell">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-400">
            <Building2 className="h-3.5 w-3.5 text-navy-500" />
            <span className="hidden sm:inline">Portal Perusahaan / Industri</span>
            <span className="sm:hidden">Portal Perusahaan</span>
            <span className="text-slate-300">/</span>
            <span>Mitra PT Semen Baturaja</span>
          </div>
          <p className="hidden items-center gap-1.5 text-[10.5px] font-medium text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Data diperbarui hari ini, 09.42 WIB
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[26px] bg-navy-950 text-white shadow-float sm:rounded-[30px]">
          <div className="pointer-events-none absolute inset-0 dotted-grid opacity-50" />
          <div className="pointer-events-none absolute -right-32 -top-44 h-[430px] w-[430px] rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-500/20 blur-3xl" />
          <svg
            className="pointer-events-none absolute -right-8 top-1/2 hidden h-[260px] w-[440px] -translate-y-1/2 text-white/10 lg:block"
            viewBox="0 0 440 260"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M-20 200C82 201 76 80 170 88C257 95 265 220 480 94"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="5 8"
            />
            <path
              d="M-40 235C92 227 110 126 202 134C305 143 305 188 500 50"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.65"
            />
            <circle cx="170" cy="88" r="5" fill="#34D399" />
            <circle cx="170" cy="88" r="13" stroke="#34D399" opacity="0.3" />
            <circle cx="308" cy="132" r="4" fill="currentColor" />
            <circle cx="385" cy="97" r="3" fill="currentColor" />
            <path
              d="M83 33 135 33 135 67 83 67Z"
              stroke="currentColor"
              opacity="0.35"
            />
          </svg>

          <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:p-9">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-200">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Mitra industri terverifikasi
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10.5px] font-semibold text-white/60">
                  <MapPin className="h-3 w-3" />
                  Palembang · Sumatera Selatan
                </span>
              </div>
              <h1 className="mt-4 max-w-2xl text-balance text-[27px] font-extrabold leading-[1.12] tracking-[-0.045em] sm:text-[35px] lg:text-[39px]">
                Halo, PT Semen Baturaja.
                <span className="mt-1 block text-white/65">
                  Talenta muda Sumsel siap bertumbuh bersama Anda.
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-white/60 sm:text-[13px]">
                Rancang pemagangan berbasis proyek nyata, dampingi peserta bersama
                mentor industri, dan pantau retensi kerja dalam satu ekosistem.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col lg:items-stretch">
              <button
                type="button"
                onClick={handleNewVacancy}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-extrabold text-navy-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4 text-emerald-brand" strokeWidth={2.6} />
                Buat Lowongan Baru
              </button>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-xs font-bold text-white/80 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Panduan Mitra
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-white/[0.025] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              {
                label: 'Lowongan aktif',
                value: '3',
                suffix: 'posisi',
                icon: ClipboardList,
                note: '1 menunggu verifikasi',
              },
              {
                label: 'Peserta magang',
                value: '18',
                suffix: 'talenta',
                icon: Users,
                note: '4 perlu evaluasi',
              },
              {
                label: 'Retensi 6 bulan',
                value: '84',
                suffix: '%',
                icon: TrendingUp,
                note: '+6% dari kohort sebelumnya',
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6 lg:px-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white/[0.07] text-white/60 ring-1 ring-white/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/40">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-medium text-white/55">
                        {stat.note}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-2xl font-extrabold leading-none tracking-tight text-white">
                    {stat.value}
                    <span className="ml-1 text-[10.5px] font-bold text-white/45">
                      {stat.suffix}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div
          id="company-tabs"
          className="sticky top-[114px] z-30 -mx-1 mt-5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-card backdrop-blur lg:top-[72px]"
        >
          <div className="flex min-w-[620px] gap-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'group flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all',
                    active
                      ? 'bg-navy-900 text-white shadow-md shadow-navy-900/15'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-navy-800',
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-[9px] transition',
                      active
                        ? 'bg-white/10 text-emerald-300'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-navy-700',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'text-[10.5px] font-extrabold uppercase tracking-[0.12em]',
                          active ? 'text-white/45' : 'text-slate-400',
                        )}
                      >
                        0{index + 1}
                      </span>
                      <span className="truncate text-[11px] font-bold sm:text-xs">
                        {tab.label}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block text-[10.5px] font-medium',
                        active ? 'text-white/45' : 'text-slate-400',
                      )}
                    >
                      {tab.hint}
                    </span>
                  </span>
                  {active && (
                    <ChevronDown className="hidden h-3.5 w-3.5 shrink-0 text-white/35 sm:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'post' && (
          <div
            id="company-form"
            ref={formRef}
            className="mt-5 scroll-mt-[180px] animate-fade-in lg:scroll-mt-[150px]"
          >
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_374px]">
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
                        Form Input Lowongan & Kompetensi
                      </h2>
                      <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-extrabold text-slate-500 sm:inline-flex">
                        DRAF
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Susun lowongan berbasis kebutuhan nyata industri.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      notify('Draf lowongan tersimpan otomatis di akun perusahaan.', 'success')
                    }
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10.5px] font-bold text-slate-500 transition hover:bg-slate-50 hover:text-navy-800 sm:self-auto"
                  >
                    <Pencil className="h-3 w-3" />
                    Simpan draf
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-[10.5px] font-extrabold text-navy-700 ring-1 ring-navy-100">
                        01
                      </span>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-800">
                          Informasi posisi
                        </h3>
                        <p className="mt-0.5 text-[10.5px] text-slate-400">
                          Detail dasar yang akan dilihat calon peserta.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4 sm:pl-10">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label
                            htmlFor="position-title"
                            className="text-xs font-bold text-slate-700"
                          >
                            Judul posisi <span className="text-emerald-600">*</span>
                          </label>
                          <span className="text-[10.5px] tabular-nums text-slate-400">
                            {position.length}/80
                          </span>
                        </div>
                        <div className="relative">
                          <ClipboardList className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            id="position-title"
                            value={position}
                            onChange={(event) =>
                              setPosition(event.target.value.slice(0, 80))
                            }
                            placeholder="Contoh: Teknisi Pemeliharaan Mesin"
                            className="field pl-10"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="location"
                            className="mb-1.5 block text-xs font-bold text-slate-700"
                          >
                            Lokasi penempatan
                          </label>
                          <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                              id="location"
                              value={location}
                              onChange={(event) => setLocation(event.target.value)}
                              className="field appearance-none pl-10 pr-9"
                            >
                              <option>Baturaja, Ogan Komering Ulu</option>
                              <option>Palembang</option>
                              <option>Muara Enim</option>
                              <option>Prabumulih</option>
                              <option>Lahat</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="deadline"
                            className="mb-1.5 block text-xs font-bold text-slate-700"
                          >
                            Batas pendaftaran
                          </label>
                          <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              id="deadline"
                              type="date"
                              value={deadline}
                              onChange={(event) => setDeadline(event.target.value)}
                              className="field pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700">
                          Target sasaran
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'SMA', label: 'Lulusan SMA', icon: GraduationCap },
                            { id: 'SMK', label: 'Lulusan SMK', icon: Wrench },
                            { id: 'S1', label: 'Lulusan S1', icon: BookOpen },
                          ].map((target) => {
                            const Icon = target.icon;
                            const active = targetEducation.includes(target.id);
                            return (
                              <button
                                key={target.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setTargetEducation((current) =>
                                    current.includes(target.id)
                                      ? current.filter((item) => item !== target.id)
                                      : [...current, target.id],
                                  );
                                }}
                                className={cn(
                                  'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-bold transition',
                                  active
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                                )}
                              >
                                <span
                                  className={cn(
                                    'grid h-4 w-4 place-items-center rounded-[5px]',
                                    active
                                      ? 'bg-emerald-600 text-white'
                                      : 'border border-slate-300 bg-white text-transparent',
                                  )}
                                >
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                </span>
                                {target.label}
                              </button>
                            );
                          })}
                          <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-1.5">
                            <span className="text-[10.5px] font-bold text-slate-500">
                              Kuota
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuota((current) => Math.max(1, current - 1))
                              }
                              className="grid h-6 w-6 place-items-center rounded-md bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-navy-800"
                              aria-label="Kurangi kuota"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              value={quota}
                              onChange={(event) => {
                                const value = Number(
                                  event.target.value.replace(/\D/g, ''),
                                );
                                setQuota(Math.min(50, Math.max(1, value || 1)));
                              }}
                              className="w-7 border-0 bg-transparent text-center text-xs font-extrabold text-navy-900 outline-none"
                              aria-label="Jumlah kuota"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setQuota((current) => Math.min(50, current + 1))
                              }
                              className="grid h-6 w-6 place-items-center rounded-md bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-navy-800"
                              aria-label="Tambah kuota"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1.5 text-[10.5px] text-slate-400">
                          Pilih satu atau beberapa jenjang. Kuota magang dapat diubah
                          selama belum diverifikasi.
                        </p>
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label
                            htmlFor="description"
                            className="text-xs font-bold text-slate-700"
                          >
                            Deskripsi peran
                          </label>
                          <span className="text-[10.5px] tabular-nums text-slate-400">
                            {description.length}/400
                          </span>
                        </div>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value.slice(0, 400))
                          }
                          rows={3}
                          className="field resize-none leading-relaxed"
                          placeholder="Jelaskan aktivitas utama, tim, dan dampak proyek..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-[10.5px] font-extrabold text-navy-700 ring-1 ring-navy-100">
                        02
                      </span>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-800">
                          Kualifikasi & kompetensi
                        </h3>
                        <p className="mt-0.5 text-[10.5px] text-slate-400">
                          Gunakan kata kunci singkat agar mudah dicocokkan dengan
                          talenta.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:pl-10">
                      <TagField
                        label="Hard skills"
                        description="Kompetensi teknis atau alat kerja yang dikuasai."
                        tags={hardSkills}
                        onChange={setHardSkills}
                        suggestions={hardSuggestions}
                        accent="navy"
                      />
                      <TagField
                        label="Soft skills"
                        description="Cara kerja dan sikap yang dibutuhkan di tim."
                        tags={softSkills}
                        onChange={setSoftSkills}
                        suggestions={softSuggestions}
                        accent="emerald"
                      />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-[10.5px] font-extrabold text-navy-700 ring-1 ring-navy-100">
                        03
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs font-extrabold text-slate-800">
                            Uang saku bulanan
                          </h3>
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                            Transparan
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10.5px] text-slate-400">
                          Acuan UMP Sumatera Selatan tahun berjalan:{' '}
                          <span className="font-bold text-slate-500">
                            {rupiah(umpHtml)}
                          </span>
                          /bulan.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4 sm:pl-10">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                          <label
                            htmlFor="stipend"
                            className="mb-1.5 block text-[11px] font-bold text-slate-600"
                          >
                            Nominal uang saku
                          </label>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                              Rp
                            </span>
                            <input
                              id="stipend"
                              inputMode="numeric"
                              value={stipend.toLocaleString('id-ID')}
                              onChange={(event) => {
                                const digits = Number(
                                  event.target.value.replace(/\D/g, ''),
                                );
                                setStipend(Math.min(15_000_000, digits));
                              }}
                              className="field pl-10 pr-3 font-bold tabular-nums text-navy-900"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={toggleStipendAnchor}
                          className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-xl border border-navy-100 bg-navy-50 px-3 text-[10.5px] font-bold text-navy-700 transition hover:bg-navy-100"
                        >
                          <CircleDollarSign className="h-3.5 w-3.5" />
                          Setara UMP
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-400">
                          <span>Rp500 rb</span>
                          <span className="text-navy-700">
                            {stipendPercent}% dari UMP Sumsel
                          </span>
                          <span>Rp6 jt</span>
                        </div>
                        <input
                          type="range"
                          min={500_000}
                          max={6_000_000}
                          step={50_000}
                          value={Math.min(6_000_000, stipend)}
                          onChange={(event) => setStipend(Number(event.target.value))}
                          className="range-input mt-1.5"
                          aria-label="Geser nominal uang saku"
                        />
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-navy-700 to-emerald-brand transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(0, (stipend / 6_000_000) * 100))}%`,
                            }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="flex items-center gap-1.5 text-[10.5px] leading-relaxed text-slate-400">
                            <Info className="h-3 w-3 shrink-0" />
                            Uang saku bukan pengganti upah minimum.
                          </p>
                          {stipendPercent >= 100 ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                              <CircleCheck className="h-2.5 w-2.5" /> Di atas UMP
                            </span>
                          ) : (
                            <span className="text-[10.5px] font-semibold text-slate-400">
                              {rupiah(umpHtml - stipend, true)} di bawah UMP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-[10.5px] font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                          04
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xs font-extrabold text-slate-800">
                              Syllabus Matcher
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                              <Sparkles className="h-2.5 w-2.5" /> 2 rekomendasi
                            </span>
                          </div>
                          <p className="mt-0.5 text-[10.5px] text-slate-400">
                            Pilih modul terstruktur yang disusun Desk Onboarding
                            Dinas.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedModules(
                            selectedModules.length === syllabusModules.length
                              ? []
                              : syllabusModules.map((module) => module.id),
                          )
                        }
                        className="self-start text-[10.5px] font-bold text-navy-700 hover:text-navy-900"
                      >
                        {selectedModules.length === syllabusModules.length
                          ? 'Kosongkan pilihan'
                          : 'Pilih semua'}
                      </button>
                    </div>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2 sm:pl-10">
                      {syllabusModules.map((module) => {
                        const Icon = module.icon;
                        const selected = selectedModules.includes(module.id);
                        return (
                          <button
                            key={module.id}
                            type="button"
                            onClick={() => addMonths(module.id)}
                            aria-pressed={selected}
                            className={cn(
                              'relative rounded-xl border p-3.5 text-left transition group',
                              selected
                                ? 'border-emerald-300 bg-emerald-50/35 shadow-[0_0_0_3px_rgba(5,150,105,0.04)]'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50',
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={cn(
                                  'grid h-8 w-8 place-items-center rounded-[9px] ring-1',
                                  module.tone === 'emerald'
                                    ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                                    : module.tone === 'navy'
                                      ? 'bg-navy-50 text-navy-700 ring-navy-100'
                                      : module.tone === 'amber'
                                        ? 'bg-amber-50 text-amber-600 ring-amber-100'
                                        : 'bg-violet-50 text-violet-600 ring-violet-100',
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span
                                className={cn(
                                  'grid h-5 w-5 place-items-center rounded-md border transition',
                                  selected
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400',
                                )}
                              >
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </span>
                            </div>
                            <div className="mt-2.5 flex items-start gap-1.5">
                              <h4 className="text-[11px] font-extrabold leading-snug text-slate-800">
                                {module.title}
                              </h4>
                            </div>
                            <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">
                              {module.description}
                            </p>
                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              <span
                                className={cn(
                                  'rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide ring-1',
                                  selected
                                    ? 'bg-white text-emerald-700 ring-emerald-600/15'
                                    : 'bg-slate-50 text-slate-500 ring-slate-200/70',
                                )}
                              >
                                {module.tag}
                              </span>
                              <span className="text-[10.5px] font-semibold text-slate-400">
                                {module.hours} jam · {module.level}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 sm:ml-10">
                      <div className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-500">
                        <BookOpen className="h-3.5 w-3.5 text-navy-600" />
                        {selectedModules.length > 0 ? (
                          <>
                            <strong className="font-extrabold text-slate-700">
                              {selectedModules.length} modul
                            </strong>
                            dipilih · <strong className="font-extrabold text-slate-700">{moduleHours} jam</strong>{' '}
                            pelatihan terstruktur
                          </>
                        ) : (
                          'Belum ada modul pelatihan dipilih'
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-3 w-3" />
                        Kurikulum tervalidasi Dinas
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-4 xl:sticky xl:top-[150px] xl:self-start">
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                      <Eye className="h-3.5 w-3.5 text-navy-600" />
                      Pratinjau lowongan
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-extrabold text-slate-500">
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      Draf
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2.5">
                      <CompanyMark name="PT Semen Baturaja" size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-extrabold text-slate-800">
                          PT Semen Baturaja
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
                          <MapPin className="h-2.5 w-2.5" />
                          Baturaja, OKU
                        </p>
                      </div>
                      <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                    <h3 className="mt-3.5 text-balance text-[17px] font-extrabold leading-snug tracking-tight text-slate-900">
                      {position || 'Judul posisi akan tampil di sini'}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {targetEducation.length > 0 ? (
                        targetEducation.map((target) => (
                          <span
                            key={target}
                            className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-0.5 text-[10.5px] font-bold text-navy-700 ring-1 ring-navy-700/10"
                          >
                            <GraduationCap className="h-2.5 w-2.5" />
                            {target}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-bold text-amber-700">
                          Target belum dipilih
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">
                        <Users className="h-2.5 w-2.5" />
                        {quota} kuota
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">
                        <Clock3 className="h-2.5 w-2.5" />
                        ±6 bulan
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-slate-500">
                      {description || 'Deskripsi peran akan tampil di sini.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {[...hardSkills, ...softSkills].slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-500"
                        >
                          {skill}
                        </span>
                      ))}
                      {[...hardSkills, ...softSkills].length > 4 && (
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-400">
                          +{[...hardSkills, ...softSkills].length - 4}
                        </span>
                      )}
                    </div>
                    <div className="mt-3.5 rounded-xl bg-navy-950 p-3 text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-semibold text-white/50">
                          Uang saku bulanan
                        </span>
                        <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-200">
                          {stipendPercent}% UMP
                        </span>
                      </div>
                      <p className="mt-1 text-lg font-extrabold tracking-tight text-white">
                        {rupiah(stipend)}
                        <span className="text-[10.5px] font-medium text-white/40">
                          {' '}
                          /bulan
                        </span>
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-2.5">
                      <span className="flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
                        <BookOpen className="h-2.5 w-2.5" />
                        {selectedModules.length} modul · {moduleHours} jam
                      </span>
                      <span className="text-[10.5px] font-semibold text-slate-400">
                        Batas {deadline ? new Date(deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-extrabold text-slate-800">
                        Kesiapan tayang
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                        {readyCount} dari {readiness.length} komponen lengkap
                      </p>
                    </div>
                    <span
                      className={cn(
                        'grid h-9 w-9 place-items-center rounded-full text-[10.5px] font-extrabold ring-4',
                        canSubmit
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-50'
                          : 'bg-amber-50 text-amber-700 ring-amber-50',
                      )}
                    >
                      {completion}%
                    </span>
                  </div>
                  <ProgressBar
                    value={completion}
                    tone={canSubmit ? 'emerald' : 'amber'}
                    className="mt-3"
                  />
                  <div className="mt-3 space-y-2">
                    {readiness.map((item) => (
                      <CheckItem key={item.label} checked={item.done}>
                        {item.label}
                      </CheckItem>
                    ))}
                  </div>

                  {submitted ? (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <div className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-[10.5px] font-extrabold text-emerald-800">
                            Lowongan sedang diverifikasi
                          </p>
                          <p className="mt-0.5 text-[10.5px] leading-relaxed text-emerald-700/70">
                            Desk Onboarding Dinas akan meninjau lowongan dan
                            silabus dalam 1×24 jam.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl bg-slate-50 p-2.5">
                      <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-slate-500">
                        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                        Lowongan akan diverifikasi Dinas sebelum tayang di portal
                        peserta.
                      </p>
                    </div>
                  )}

                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitted || !canSubmit}
                      className={cn(
                        'inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-extrabold transition',
                        submitted
                          ? 'bg-emerald-100 text-emerald-700'
                          : canSubmit
                            ? 'bg-emerald-brand text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-400',
                      )}
                    >
                      {submitted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Menunggu Verifikasi Dinas
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Ajukan Verifikasi ke Dinas
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        notify('Draf lowongan tersimpan di akun perusahaan.', 'success')
                      }
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[10.5px] font-bold text-slate-500 transition hover:bg-slate-50 hover:text-navy-800"
                    >
                      Simpan sebagai draf
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/70 p-3.5 text-left transition hover:border-navy-200 hover:bg-navy-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-navy-700 shadow-sm ring-1 ring-navy-100">
                    <CircleHelp className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[10.5px] font-extrabold text-navy-900">
                      Butuh pendampingan lowongan?
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-relaxed text-slate-500">
                      Tim Desk Onboarding siap membantu.
                    </span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-navy-500 transition group-hover:translate-x-0.5" />
                </button>
              </aside>
            </div>
          </div>
        )}

        {activeTab === 'evaluate' && (
          <div id="company-evaluate" className="mt-5 animate-fade-in">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                    Evaluasi Peserta & Proyek Nyata
                  </h2>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700 ring-1 ring-amber-600/10">
                    4 perlu ditinjau
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Nilai hasil proyek, beri rating, dan buka jalur rekrutmen formal
                  untuk talenta terbaik.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  notify('Rekap evaluasi peserta berhasil disiapkan.', 'success')
                }
                className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10.5px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-navy-800"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh rekap evaluasi
              </button>
            </div>

            <div className="mb-4 grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  label: 'Peserta magang aktif',
                  value: '18',
                  note: 'dari 4 unit penempatan',
                  tone: 'navy',
                },
                {
                  icon: Target,
                  label: 'Proyek nyata berjalan',
                  value: '6',
                  note: '2 menunggu review akhir',
                  tone: 'amber',
                },
                {
                  icon: BadgeCheck,
                  label: 'Direkomendasikan formal',
                  value: String(
                    participants.filter((item) => item.recommended).length,
                  ),
                  note: 'kandidat prioritas rekrutmen',
                  tone: 'emerald',
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-card"
                  >
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-[10px]',
                        stat.tone === 'emerald'
                          ? 'bg-emerald-50 text-emerald-600'
                          : stat.tone === 'amber'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-navy-50 text-navy-700',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold text-slate-400">
                        {stat.label}
                      </p>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <p className="text-xl font-extrabold tracking-tight text-slate-900">
                          {stat.value}
                        </p>
                        <p className="truncate text-[10.5px] text-slate-400">
                          {stat.note}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {participants.map((participant) => (
                <EvaluationCard
                  key={participant.id}
                  participant={participant}
                  onRating={updateParticipantRating}
                  onRecommend={toggleRecommendation}
                  notify={notify}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 sm:flex-row sm:items-center">
              <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-slate-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-500" />
                Rekomendasi formal akan diteruskan ke pipeline rekrutmen dan
                terhubung dengan status insentif retensi pada tab pelaporan.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('retention')}
                className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-navy-700 hover:text-navy-900"
              >
                Buka pelaporan retensi
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'retention' && (
          <div id="company-retention" className="mt-5 animate-fade-in">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                    Pelaporan Retensi Satu Pintu
                  </h2>
                  <VerifiedBadge label="Tersinkron BPJS" compact />
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Lacak kelangsungan kerja lulusan magang pada bulan ke-3 dan ke-6.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  notify('Laporan retensi satu pintu berhasil diunduh.', 'success')
                }
                className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-navy-900 px-3.5 py-2 text-[10.5px] font-bold text-white shadow-md shadow-navy-900/15 transition hover:bg-navy-800"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh laporan retensi
              </button>
            </div>

            <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
              <div className="grid lg:grid-cols-[1.2fr_.8fr]">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                      Retensi kohort aktif
                    </p>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
                      +6% vs kohort lalu
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <p className="text-[44px] font-extrabold leading-none tracking-[-0.06em] text-navy-950">
                      84<span className="text-2xl text-slate-400">%</span>
                    </p>
                    <p className="max-w-[240px] pb-1 text-[10.5px] leading-relaxed text-slate-400">
                      15 dari 18 peserta masih aktif bekerja dan terdaftar BPJS
                      pada bulan ke-6.
                    </p>
                  </div>
                  <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[83%] rounded-l-full bg-emerald-brand" />
                    <div className="h-full w-[11%] bg-navy-700" />
                    <div className="h-full flex-1 rounded-r-full bg-amber-300" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-brand" />
                      Bertahan 15
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-navy-700" />
                      Rekrutmen formal 2
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-300" />
                      Menunggu milestone 1
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-[#f9fbfe] lg:border-l lg:border-t-0">
                  {[
                    { label: 'Bulan ke-1', value: '100%', note: '18/18' },
                    { label: 'Bulan ke-3', value: '94%', note: '17/18' },
                    { label: 'Bulan ke-6', value: '84%', note: '15/18' },
                  ].map((point, index) => (
                    <div
                      key={point.label}
                      className={cn(
                        'flex flex-col justify-center px-3 py-5',
                        index === 2 && 'bg-emerald-50/35',
                      )}
                    >
                      <p className="text-[10.5px] font-bold text-slate-400">
                        {point.label}
                      </p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-800">
                        {point.value}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                        {point.note} peserta
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Tabel Retensi & Insentif
                  </h3>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    Validasi otomatis melalui BPJS Ketenagakerjaan ·{' '}
                    {selectedIncentiveCount} insentif telah tersalurkan
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10.5px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Data BPJS tersinkron
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      notify('Data retensi terbaru berhasil disinkronkan.', 'success')
                    }
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-navy-700"
                    aria-label="Sinkronkan data retensi"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div id="company-retention-table-scroll" className="overflow-x-auto">
                <table className="w-full min-w-[940px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-extrabold uppercase tracking-[0.11em] text-slate-400">
                      <th className="px-5 py-3">Peserta</th>
                      <th className="px-4 py-3">Penempatan</th>
                      <th className="px-4 py-3">Bulan ke-3</th>
                      <th className="px-4 py-3">Bulan ke-6</th>
                      <th className="px-4 py-3">Status Insentif Retensi</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {retentionRows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <PersonAvatar name={row.name} tone={row.tone} size="sm" />
                            <div>
                              <p className="text-[11px] font-extrabold text-slate-800">
                                {row.name}
                              </p>
                              <p className="mt-0.5 text-[10.5px] text-slate-400">
                                {row.school}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-[10.5px] font-bold text-slate-700">
                            {row.company}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400">
                            {row.position}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <BpjsStatus
                            verified={row.month3.verified}
                            date={row.month3.date}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <BpjsStatus
                            verified={row.month6.verified}
                            date={row.month6.date}
                            muted
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-extrabold ring-1',
                              row.incentive === 'Tersalurkan'
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                                : row.incentive === 'Diproses'
                                  ? 'bg-navy-50 text-navy-700 ring-navy-700/10'
                                  : 'bg-slate-50 text-slate-500 ring-slate-200',
                            )}
                          >
                            {row.incentive === 'Tersalurkan' ? (
                              <BadgeCheck className="h-3 w-3" />
                            ) : row.incentive === 'Diproses' ? (
                              <Clock3 className="h-3 w-3" />
                            ) : (
                              <CalendarDays className="h-3 w-3" />
                            )}
                            {row.incentive}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRetention(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10.5px] font-bold text-slate-500 transition hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
                          >
                            <Eye className="h-3 w-3" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10.5px] font-medium text-slate-400">
                  Data diperbarui otomatis dari API MagangHub Nasional · 4 Nov
                  2026, 09.42 WIB
                </p>
                <div className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verifikasi berlapis: Dinas + BPJS Ketenagakerjaan
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showGuide}
        onClose={() => setShowGuide(false)}
        title="Panduan pemagangan mitra"
        eyebrow="Desk Onboarding"
        description="Alur singkat menyiapkan lowongan yang siap diverifikasi Dinas."
        footer={
          <button
            type="button"
            onClick={() => {
              setShowGuide(false);
              setActiveTab('post');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-800"
          >
            Mulai susun lowongan
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="space-y-3">
          {[
            {
              step: '01',
              title: 'Rancang lowongan berbasis kebutuhan',
              text: 'Tentukan posisi, lokasi, target jenjang, kuota, dan uang saku yang transparan.',
            },
            {
              step: '02',
              title: 'Pilih silabus terstruktur',
              text: 'Gunakan modul Desk Onboarding Dinas agar peserta memiliki bekal kompetensi sebelum masuk proyek.',
            },
            {
              step: '03',
              title: 'Verifikasi & mulai rekrutmen',
              text: 'Dinas memvalidasi lowongan dan kurikulum. Setelah tayang, peserta dapat mendaftar melalui portal CariGawe.',
            },
            {
              step: '04',
              title: 'Pantau retensi satu pintu',
              text: 'Evaluasi proyek, buka rekomendasi rekrutmen formal, dan pantau status BPJS pada bulan ke-3 dan ke-6.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-white text-[10.5px] font-extrabold text-navy-700 shadow-sm ring-1 ring-slate-200">
                {item.step}
              </span>
              <div>
                <p className="text-[11px] font-extrabold text-slate-800">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-[10.5px] leading-relaxed text-emerald-800 ring-1 ring-emerald-600/10">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Butuh asistensi teknis? Hubungi Desk Onboarding Disnakertrans Sumsel
            di (0711) 812-345 pada hari kerja, 08.00–15.30 WIB.
          </div>
        </div>
      </Modal>

      <RetentionDetailModal
        row={selectedRetention}
        open={Boolean(selectedRetention)}
        onClose={() => setSelectedRetention(null)}
        notify={notify}
      />
    </div>
  );
}
