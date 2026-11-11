import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  CloudUpload,
  FileCheck2,
  FileText,
  FolderKanban,
  GraduationCap,
  HardHat,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  cn,
  rupiah,
  type Notify,
} from '../lib/utils';
import {
  CompanyMark,
  Modal,
  PersonAvatar,
  ProgressBar,
  VerifiedBadge,
} from '../components/ui';

type YouthPortalProps = {
  notify: Notify;
};

type Job = {
  id: string;
  company: string;
  position: string;
  city: string;
  region: string;
  field: string;
  stipend: number;
  education: string;
  skills: string[];
  quota: number;
  duration: string;
  deadline: string;
  posted: string;
  summary: string;
  modules: string[];
  isUmkm?: boolean;
  highlight?: string;
};

const jobs: Job[] = [
  {
    id: 'semen-baturaja',
    company: 'PT Semen Baturaja Tbk',
    position: 'Teknisi Pemeliharaan Mesin',
    city: 'Baturaja',
    region: 'Ogan Komering Ulu',
    field: 'Teknik Mesin',
    stipend: 3_150_000,
    education: 'SMK',
    skills: ['Teknik Mesin', 'K3 Industri', 'Perawatan Preventif'],
    quota: 4,
    duration: '6 bulan',
    deadline: '30 Nov 2026',
    posted: 'Dibuka 2 hari lalu',
    summary:
      'Rawat mesin produksi bersama tim maintenance dan kerjakan proyek digitalisasi checklist lini 2.',
    modules: ['K3 & Budaya Kerja Industri', 'Perawatan Mesin Dasar'],
    highlight: 'Proyek nyata',
  },
  {
    id: 'bukit-asam',
    company: 'PT Bukit Asam Tbk',
    position: 'Operator Alat Berat',
    city: 'Tanjung Enim',
    region: 'Muara Enim',
    field: 'Teknik Mesin',
    stipend: 3_450_000,
    education: 'SMK',
    skills: ['Alat Berat', 'Keselamatan Tambang', 'Disiplin Operasional'],
    quota: 6,
    duration: '6 bulan',
    deadline: '15 Des 2026',
    posted: 'Dibuka 4 hari lalu',
    summary:
      'Belajar operasional alat berat secara aman dan terlibat dalam proyek efisiensi material handling.',
    modules: ['K3 & Budaya Kerja Industri', 'Operasional Alat Berat'],
    highlight: 'Uang saku tertinggi',
  },
  {
    id: 'pusri',
    company: 'PT Pupuk Sriwidjaja Palembang',
    position: 'Analis Laboratorium',
    city: 'Palembang',
    region: 'Palembang',
    field: 'Kesehatan & Laboratorium',
    stipend: 3_200_000,
    education: 'SMA/SMK',
    skills: ['Kimia Dasar', 'Pengujian Sampel', 'Ketelitian'],
    quota: 3,
    duration: '6 bulan',
    deadline: '8 Des 2026',
    posted: 'Dibuka 5 hari lalu',
    summary:
      'Lakukan pengujian kualitas pupuk dan dokumentasikan hasil analisis di laboratorium produksi.',
    modules: ['K3 & Budaya Kerja Industri', 'Pengujian Laboratorium Dasar'],
  },
  {
    id: 'kai-divre3',
    company: 'KAI Divre III Palembang',
    position: 'Customer Service',
    city: 'Palembang',
    region: 'Palembang',
    field: 'Administrasi',
    stipend: 2_800_000,
    education: 'SMA/SMK',
    skills: ['Pelayanan Pelanggan', 'Komunikasi', 'Administrasi'],
    quota: 8,
    duration: '4 bulan',
    deadline: '28 Nov 2026',
    posted: 'Dibuka 1 minggu lalu',
    summary:
      'Tangani kebutuhan penumpang di stasiun dan ikuti proyek peningkatan pengalaman layanan publik.',
    modules: ['Komunikasi Profesional', 'Pelayanan Prima'],
  },
  {
    id: 'kopi-kambang-iwak',
    company: 'Kopi Kambang Iwak',
    position: 'Barista & Content Creator',
    city: 'Palembang',
    region: 'Palembang',
    field: 'Bisnis & Kreatif',
    stipend: 1_900_000,
    education: 'SMA/SMK',
    skills: ['Barista', 'Konten Sosial Media', 'Kerja Tim'],
    quota: 2,
    duration: '4 bulan',
    deadline: '20 Nov 2026',
    posted: 'Dibuka 2 hari lalu',
    summary:
      'Kembangkan menu minuman baru dan kelola konten media sosial kedai bersama tim UMKM lokal.',
    modules: ['Digital Marketing UMKM', 'Pelayanan Pelanggan'],
    isUmkm: true,
    highlight: 'UMKM binaan Dinas',
  },
  {
    id: 'aryaduta',
    company: 'Hotel Aryaduta Palembang',
    position: 'Front Office Trainee',
    city: 'Palembang',
    region: 'Palembang',
    field: 'Hospitaliti & Kuliner',
    stipend: 2_400_000,
    education: 'SMA/SMK',
    skills: ['Hospitaliti', 'Bahasa Inggris', 'Komunikasi'],
    quota: 3,
    duration: '6 bulan',
    deadline: '12 Des 2026',
    posted: 'Dibuka 6 hari lalu',
    summary:
      'Layani tamu hotel dari check-in hingga check-out dan ikuti proyek peningkatan standar guest experience.',
    modules: ['Komunikasi Profesional', 'Hospitaliti Dasar'],
  },
];

const regionOptions = [
  'Semua lokasi',
  'Palembang',
  'Muara Enim',
  'Ogan Komering Ulu',
  'Prabumulih',
  'Lahat',
  'Lubuklinggau',
  'Ogan Ilir',
];

const fieldOptions = [
  'Semua bidang',
  'Teknik Mesin',
  'Kesehatan & Laboratorium',
  'Administrasi',
  'Bisnis & Kreatif',
  'Hospitaliti & Kuliner',
];

const journeyStages = [
  {
    id: 1,
    title: 'Pelatihan Mikro Spesifik',
    caption: 'Selesai · 3 modul · 26 jam',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Proyek Nyata & Mentor Industri',
    caption: 'Berlangsung · sisa 12 hari',
    icon: FolderKanban,
  },
  {
    id: 3,
    title: 'Penempatan Formal & Pelacakan Retensi',
    caption: 'Terbuka setelah evaluasi proyek',
    icon: BriefcaseBusiness,
  },
];

function JobCard({
  job,
  saved,
  applied,
  onSave,
  onOpen,
  onApply,
}: {
  job: Job;
  saved: boolean;
  applied: boolean;
  onSave: () => void;
  onOpen: () => void;
  onApply: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-navy-200 hover:shadow-float">
      <div className="flex items-center justify-between gap-2 border-b border-emerald-100 bg-emerald-50/55 px-4 py-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[10.5px] font-extrabold leading-tight text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Lowongan Riil &amp; Jalur Rekrutmen Formal</span>
        </span>
        {job.highlight && (
          <span className="hidden shrink-0 rounded-full bg-white/80 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700 ring-1 ring-emerald-600/10 sm:inline-flex">
            {job.highlight}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-[18px]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <CompanyMark name={job.company} size="md" />
            <div className="min-w-0 pt-0.5">
              <p className="truncate text-[11px] font-extrabold text-slate-800">
                {job.company}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                {job.city}, {job.region}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition',
              saved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                : 'border-slate-200 bg-white text-slate-400 hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700',
            )}
            aria-label={saved ? 'Hapus dari simpanan' : 'Simpan lowongan'}
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>

        <h3 className="mt-3 text-balance text-[16px] font-extrabold leading-snug tracking-[-0.02em] text-slate-900">
          {job.position}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-navy-700 ring-1 ring-navy-700/10">
            <GraduationCap className="h-2.5 w-2.5" />
            {job.education}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500 ring-1 ring-slate-200">
            {job.field}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500 ring-1 ring-slate-200">
            <Clock3 className="h-2.5 w-2.5" />
            {job.duration}
          </span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
          {job.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {job.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-500"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 2 && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-400">
              +{job.skills.length - 2}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 rounded-xl bg-[#f7f9fd] px-3 py-2.5">
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Uang saku / bulan
            </p>
            <p className="mt-0.5 text-base font-extrabold tracking-tight text-navy-900">
              {rupiah(job.stipend, true)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9.5px] font-semibold text-slate-400">
              Batas daftar
            </p>
            <p className="mt-0.5 text-[10.5px] font-bold text-slate-600">
              {job.deadline}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
              <Users className="h-3 w-3" />
              {job.quota} kuota · {job.posted}
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="mt-1 inline-flex items-center gap-1 text-[10.5px] font-bold text-navy-700 transition hover:text-navy-900"
            >
              Lihat detail
              <ArrowUpRight className="h-2.5 w-2.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={applied ? onOpen : onApply}
            className={cn(
              'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold transition',
              applied
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-navy-900 text-white shadow-sm shadow-navy-900/15 hover:bg-navy-800',
            )}
          >
            {applied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={3} />
                Pendaftaran Terkirim
              </>
            ) : (
              <>
                Daftar Magang &amp; Pelatihan
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

type ChatMessage = {
  id: number;
  author: 'mentor' | 'me';
  text: string;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    author: 'mentor',
    text: 'Halo Nadia! Template checklist-nya sudah rapi. Tambahkan kolom catatan temuan, lalu kirim ulang ya.',
    time: '09.12',
  },
  {
    id: 2,
    author: 'me',
    text: 'Baik Pak, saya sedang melengkapi bagian inspeksi Line 2.',
    time: '09.18',
  },
  {
    id: 3,
    author: 'mentor',
    text: 'Siap. Targetkan sebelum Jumat, nanti kita review bersama di lantai produksi.',
    time: '09.21',
  },
];

export function YouthPortal({ notify }: YouthPortalProps) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('Semua lokasi');
  const [field, setField] = useState('Semua bidang');
  const [sortBy, setSortBy] = useState('recommended');
  const [savedJobs, setSavedJobs] = useState<string[]>(['aryaduta']);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [lastUploadName, setLastUploadName] = useState('');
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [messageDraft, setMessageDraft] = useState('');
  const [isMentorTyping, setIsMentorTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const visibleJobs = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const matchQuery =
        !search ||
        job.position.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.skills.some((skill) => skill.toLowerCase().includes(search)) ||
        job.city.toLowerCase().includes(search);
      const matchRegion = region === 'Semua lokasi' || job.region === region;
      const matchField = field === 'Semua bidang' || job.field === field;
      return matchQuery && matchRegion && matchField;
    });

    return filtered.sort((a, b) =>
      sortBy === 'stipend' ? b.stipend - a.stipend : 0,
    );
  }, [field, query, region, sortBy]);

  const activeFilters =
    (region !== 'Semua lokasi' ? 1 : 0) + (field !== 'Semua bidang' ? 1 : 0) +
    (query.trim() ? 1 : 0);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isMentorTyping]);

  const scrollToCatalog = () => {
    document.getElementById('katalog-lowongan')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const resetFilters = () => {
    setQuery('');
    setRegion('Semua lokasi');
    setField('Semua bidang');
    setSortBy('recommended');
  };

  const toggleSaved = (job: Job) => {
    setSavedJobs((current) =>
      current.includes(job.id)
        ? current.filter((id) => id !== job.id)
        : [...current, job.id],
    );
    notify(
      savedJobs.includes(job.id)
        ? `Lowongan ${job.position} dihapus dari simpanan.`
        : `Lowongan ${job.position} disimpan ke daftar favorit.`,
      'info',
    );
  };

  const applyToJob = (job: Job) => {
    setAppliedJobs((current) =>
      current.includes(job.id) ? current : [...current, job.id],
    );
    setSelectedJob(null);
    notify(
      `Pendaftaran ${job.position} terkirim. Pantau prosesnya di Hub Pelatihan.`,
      'success',
    );
  };

  const attachFile = (file?: File) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      notify('Ukuran berkas melebihi 20 MB. Kompres berkas terlebih dahulu.', 'warning');
      return;
    }
    setProjectFile(file);
    setProjectSubmitted(false);
    notify(`${file.name} siap dikumpulkan.`, 'info');
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    attachFile(event.dataTransfer.files?.[0]);
  };

  const submitProject = () => {
    if (!projectFile) {
      notify('Pilih berkas proyek terlebih dahulu.', 'warning');
      return;
    }
    setLastUploadName(projectFile.name);
    setProjectFile(null);
    setProjectSubmitted(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    notify('Berkas proyek berhasil dikirim ke mentor industri.', 'success');
  };

  const sendMessage = () => {
    const text = messageDraft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setMessages((current) => [
      ...current,
      { id: Date.now(), author: 'me', text, time },
    ]);
    setMessageDraft('');
    setIsMentorTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: 'mentor',
          text: 'Siap, saya catat. Nanti saya beri umpan balik langsung di workspace proyek, ya.',
          time: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setIsMentorTyping(false);
    }, 1250);
  };

  return (
    <div className="pb-14 pt-5 sm:pt-7">
      <div className="page-shell">
        <section className="relative overflow-hidden rounded-[26px] bg-navy-950 text-white shadow-float sm:rounded-[30px]">
          <div className="pointer-events-none absolute inset-0 dotted-grid opacity-50" />
          <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-navy-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px] rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.2),transparent_65%)]" />

          <svg
            className="pointer-events-none absolute right-0 top-0 h-full w-[50%] text-white/8"
            viewBox="0 0 500 420"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M90 360C130 280 218 331 236 244C254 158 183 139 227 71C248 37 284 20 344 18"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 8"
            />
            <path
              d="M13 315C110 260 152 342 274 282C372 234 388 140 493 152"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="236" cy="244" r="4" fill="#34D399" />
            <circle cx="236" cy="244" r="14" stroke="#34D399" opacity="0.28" />
            <circle cx="344" cy="18" r="3" fill="currentColor" />
            <circle cx="274" cy="282" r="3" fill="currentColor" />
            <circle cx="438" cy="358" r="3" fill="currentColor" />
            <path d="M300 350 380 350 380 380 300 380Z" stroke="currentColor" />
            <path d="M74 98 110 98 110 128 74 128Z" stroke="currentColor" />
          </svg>

          <div className="relative grid gap-7 px-5 pb-24 pt-7 sm:px-7 sm:pb-28 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-9 lg:pb-28">
            <div className="max-w-[670px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.13em] text-emerald-200 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Program unggulan Disnakertrans Sumsel
              </span>
              <h1 className="mt-4 text-balance text-[33px] font-extrabold leading-[1.06] tracking-[-0.05em] sm:text-[44px] lg:text-[52px]">
                Karier nyata,
                <span className="block text-white/60">dimulai dari Sumsel.</span>
              </h1>
              <p className="mt-3.5 max-w-[490px] text-[12px] leading-relaxed text-white/60 sm:text-[13px]">
                Temukan pemagangan terverifikasi, ikuti pelatihan bersama mentor
                industri, dan raih jalur rekrutmen formal — semua dari satu
                platform.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/10 bg-white/[0.06]">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold leading-none text-white">128</p>
                    <p className="mt-1 text-[10.5px] font-medium text-white/45">
                      lowongan terverifikasi
                    </p>
                  </div>
                </div>
                <span className="hidden h-7 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/10 bg-white/[0.06]">
                    <BriefcaseBusiness className="h-4 w-4 text-sky-300" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold leading-none text-white">42</p>
                    <p className="mt-1 text-[10.5px] font-medium text-white/45">
                      perusahaan mitra
                    </p>
                  </div>
                </div>
                <span className="hidden h-7 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/10 bg-white/[0.06]">
                    <Users className="h-4 w-4 text-amber-300" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold leading-none text-white">1.246</p>
                    <p className="mt-1 text-[10.5px] font-medium text-white/45">
                      talenta bertahan kerja
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/12 bg-white/[0.065] p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/45">
                    <Sparkles className="h-3 w-3 text-emerald-300" />
                    Perjalanan talenta
                  </span>
                  <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-200">
                    Tahap 2 dari 3
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-white/8 bg-black/10 p-2.5">
                  <PersonAvatar name="Nadia Safitri" tone="emerald" size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-white">
                      Nadia Safitri
                    </p>
                    <p className="mt-0.5 truncate text-[10.5px] text-white/45">
                      SMKN 1 Palembang · Teknisi Mesin
                    </p>
                  </div>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  {journeyStages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-1 items-center gap-1.5 last:flex-none">
                      <div
                        className={cn(
                          'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9.5px] font-extrabold ring-1',
                          stage.id === 1
                            ? 'bg-emerald-400/20 text-emerald-200 ring-emerald-300/20'
                            : stage.id === 2
                              ? 'bg-white text-navy-900 ring-white'
                              : 'bg-white/5 text-white/40 ring-white/15',
                        )}
                      >
                        {stage.id === 1 ? <Check className="h-3 w-3" strokeWidth={3} /> : stage.id}
                      </div>
                      {index < journeyStages.length - 1 && (
                        <div className="h-px flex-1 bg-white/10">
                          <div className={cn('h-full', stage.id === 1 ? 'w-full bg-emerald-300/50' : 'w-0')} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[9.5px] font-semibold text-white/35">
                  <span>Pelatihan</span>
                  <span>Proyek nyata</span>
                  <span>Penempatan</span>
                </div>

                <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.05] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10.5px] font-semibold text-white/50">
                      Proyek Line 2 · PT Semen Baturaja
                    </p>
                    <span className="text-[10.5px] font-extrabold text-emerald-200">78%</span>
                  </div>
                  <ProgressBar value={78} tone="emerald" className="mt-2 bg-white/10" />
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-300/10 bg-emerald-400/[0.07] px-3 py-2">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-100/80">
                    <ShieldCheck className="h-3 w-3 text-emerald-300" />
                    BPJS bulan ke-3 aktif
                  </span>
                  <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-300">
                    Terverifikasi
                    <Check className="h-3 w-3" />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('hub-pelatihan')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-[11px] font-extrabold text-navy-900 transition hover:bg-emerald-50"
                >
                  Buka ruang kerja
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-16 px-1 sm:-mt-[72px] sm:px-4 lg:px-11">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-float sm:p-3.5">
            <div className="grid gap-2 lg:grid-cols-[1.35fr_1fr_1fr_auto]">
              <div className="rounded-xl border border-slate-200 bg-[#fbfcfe] px-3 py-2 transition focus-within:border-navy-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-navy-500/10">
                <label htmlFor="job-search" className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Cari posisi atau perusahaan
                </label>
                <div className="mt-0.5 flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <input
                    id="job-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') scrollToCatalog();
                    }}
                    placeholder="Contoh: teknisi mesin, barista…"
                    className="w-full border-0 bg-transparent py-0.5 text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#fbfcfe] px-3 py-2 transition focus-within:border-navy-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-navy-500/10">
                <label htmlFor="region-filter" className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Kabupaten / Kota
                </label>
                <div className="relative mt-0.5 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <select
                    id="region-filter"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    className="w-full appearance-none border-0 bg-transparent py-0.5 pr-5 text-[11px] font-medium text-slate-700 outline-none"
                  >
                    {regionOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#fbfcfe] px-3 py-2 transition focus-within:border-navy-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-navy-500/10">
                <label htmlFor="field-filter" className="block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Bidang keahlian vokasi
                </label>
                <div className="relative mt-0.5 flex items-center gap-2">
                  <HardHat className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <select
                    id="field-filter"
                    value={field}
                    onChange={(event) => setField(event.target.value)}
                    className="w-full appearance-none border-0 bg-transparent py-0.5 pr-5 text-[11px] font-medium text-slate-700 outline-none"
                  >
                    {fieldOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex h-full min-h-[46px] items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-[11px] font-extrabold text-white shadow-md shadow-navy-900/15 transition hover:bg-navy-800 active:scale-[0.99]"
              >
                <Search className="h-4 w-4" />
                Cari Lowongan
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-2 px-1 pb-0.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10.5px] font-semibold text-slate-400">Populer:</span>
                {[
                  { label: 'Palembang', region: 'Palembang', kind: 'region' },
                  { label: 'Muara Enim', region: 'Muara Enim', kind: 'region' },
                  { label: 'Teknik Mesin', field: 'Teknik Mesin', kind: 'field' },
                  { label: 'UMKM lokal', query: 'Kopi', kind: 'query' },
                ].map((quick) => {
                  const active =
                    quick.kind === 'region'
                      ? region === quick.region
                      : quick.kind === 'field'
                        ? field === quick.field
                        : query === quick.query;
                  return (
                    <button
                      key={quick.label}
                      type="button"
                      onClick={() => {
                        if (quick.kind === 'region') setRegion(quick.region ?? 'Semua lokasi');
                        if (quick.kind === 'field') setField(quick.field ?? 'Semua bidang');
                        if (quick.kind === 'query') setQuery(quick.query ?? '');
                        scrollToCatalog();
                      }}
                      className={cn(
                        'rounded-full border px-2 py-1 text-[10.5px] font-semibold transition',
                        active
                          ? 'border-navy-200 bg-navy-50 text-navy-800'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-navy-200 hover:text-navy-700',
                      )}
                    >
                      {quick.label}
                    </button>
                  );
                })}
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[10.5px] font-semibold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                Semua lowongan diverifikasi Dinas
              </span>
            </div>
          </div>
        </div>

        <section id="katalog-lowongan" className="mt-7 scroll-mt-36 sm:mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-emerald-brand">Vacancy-first</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {visibleJobs.length} lowongan tersedia
                </span>
              </div>
              <h2 className="mt-1.5 text-[22px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[25px]">
                Katalog Lowongan Terverifikasi
              </h2>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                Lowongan riil dengan jalur rekrutmen formal. Kamu melamar posisi
                yang sudah divalidasi Dinas, bukan sekadar mengikuti pelatihan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10.5px] font-semibold text-slate-600 shadow-sm outline-none transition hover:border-slate-300 focus:border-navy-400"
                  aria-label="Urutkan lowongan"
                >
                  <option value="recommended">Paling relevan</option>
                  <option value="stipend">Uang saku tertinggi</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-bold text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-navy-700"
              >
                Atur ulang
                {activeFilters > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-navy-100 px-1 text-[9.5px] font-extrabold text-navy-800">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeFilters > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-semibold text-slate-400">Filter aktif:</span>
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2 py-1 text-[10.5px] font-bold text-navy-700"
                >
                  “{query}”
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
              {region !== 'Semua lokasi' && (
                <button
                  type="button"
                  onClick={() => setRegion('Semua lokasi')}
                  className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2 py-1 text-[10.5px] font-bold text-navy-700"
                >
                  {region}
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
              {field !== 'Semua bidang' && (
                <button
                  type="button"
                  onClick={() => setField('Semua bidang')}
                  className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2 py-1 text-[10.5px] font-bold text-navy-700"
                >
                  {field}
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          )}

          {visibleJobs.length > 0 ? (
            <div className="mt-4 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedJobs.includes(job.id)}
                  applied={appliedJobs.includes(job.id)}
                  onSave={() => toggleSaved(job)}
                  onOpen={() => setSelectedJob(job)}
                  onApply={() => setSelectedJob(job)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-navy-500">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-slate-800">
                Belum ada lowongan yang cocok
              </h3>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                Coba perluas wilayah atau pilih bidang keahlian lain. Lowongan
                baru ditambahkan setiap minggu.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-navy-900 px-3.5 py-2 text-[10.5px] font-bold text-white"
              >
                Lihat semua lowongan
              </button>
            </div>
          )}
        </section>

        <section id="hub-pelatihan" className="mt-10 scroll-mt-36 sm:mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-emerald-brand">Ruang tumbuhmu</p>
              <h2 className="mt-1.5 text-[22px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[25px]">
                Hub Pelatihan &amp; Proyek Saya
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Pelatihan terstruktur, proyek nyata bersama mentor, sampai
                penempatan formal.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10.5px] font-bold text-emerald-700">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Mentor sedang aktif
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <CompanyMark name="PT Semen Baturaja" size="md" />
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Program magang aktif
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-800">
                    Teknisi Pemeliharaan Mesin
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    PT Semen Baturaja · Baturaja, OKU
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10.5px] font-semibold text-slate-400">Progres program</p>
                  <p className="mt-0.5 text-base font-extrabold text-navy-900">68%</p>
                </div>
                <div className="flex w-28 items-center gap-1.5">
                  <ProgressBar value={68} tone="emerald" className="h-1.5" />
                  <span className="text-[10.5px] font-bold text-emerald-700">2/3</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
                {journeyStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const active = stage.id === 2;
                  const complete = stage.id === 1;
                  const locked = stage.id === 3;
                  return (
                    <div key={stage.id} className="flex flex-1 items-stretch gap-2.5 lg:items-center">
                      <div
                        className={cn(
                          'relative flex flex-1 items-center gap-3 rounded-xl border p-3 transition',
                          active
                            ? 'border-navy-900 bg-navy-950 text-white shadow-lg shadow-navy-950/15'
                            : complete
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-slate-200 bg-slate-50/60',
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ring-1',
                            active
                              ? 'bg-white/10 text-emerald-300 ring-white/10'
                              : complete
                                ? 'bg-white text-emerald-600 ring-emerald-100'
                                : 'bg-white text-slate-400 ring-slate-200',
                          )}
                        >
                          {complete ? (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          ) : locked ? (
                            <LockKeyhole className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'text-[9.5px] font-extrabold uppercase tracking-[0.1em]',
                                active
                                  ? 'text-emerald-300'
                                  : complete
                                    ? 'text-emerald-600'
                                    : 'text-slate-400',
                              )}
                            >
                              Tahap {stage.id}
                            </span>
                            {active && (
                              <span className="h-1 w-1 rounded-full bg-emerald-300" />
                            )}
                          </div>
                          <p
                            className={cn(
                              'mt-0.5 text-[11px] font-extrabold leading-snug',
                              active ? 'text-white' : 'text-slate-700',
                            )}
                          >
                            {stage.title}
                          </p>
                          <p
                            className={cn(
                              'mt-0.5 text-[9.5px] font-medium',
                              active ? 'text-white/40' : 'text-slate-400',
                            )}
                          >
                            {stage.caption}
                          </p>
                        </div>
                      </div>
                      {index < journeyStages.length - 1 && (
                        <>
                          <span className="hidden shrink-0 text-slate-300 lg:grid lg:place-items-center">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <span className="grid shrink-0 place-items-center text-slate-300 lg:hidden">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3.5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-[#fbfcfe] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-navy-50 text-navy-700 ring-1 ring-navy-100">
                        <CloudUpload className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-800">
                          Ruang kerja proyek
                        </h3>
                        <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                          Kumpulkan deliverable untuk mentor
                        </p>
                      </div>
                    </div>
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-[9.5px] font-extrabold text-amber-700 ring-1 ring-amber-600/10">
                      Revisi ke-2
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-rose-50 text-rose-500">
                        <FileText className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-bold text-slate-700">
                          {lastUploadName || 'checklist-perawatan-line2.xlsx'}
                        </p>
                        <p className="mt-0.5 text-[9.5px] text-slate-400">
                          {lastUploadName ? 'Baru saja dikirim' : 'Versi 1 · dikirim 12 Okt 2026'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600">
                        <CircleCheck className="h-3 w-3" />
                        Terkirim
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    <span className="font-bold text-slate-700">Catatan mentor:</span>{' '}
                    Tambahkan kolom temuan dan rekomendasi tindak lanjut sebelum
                    Jumat, ya.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    className="hidden"
                    onChange={(event) => attachFile(event.target.files?.[0])}
                  />
                  {projectFile ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5">
                      <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-bold text-emerald-800">
                          {projectFile.name}
                        </p>
                        <p className="mt-0.5 text-[9.5px] text-emerald-600">
                          {(projectFile.size / 1024).toFixed(0)} KB · siap dikirim
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProjectFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="grid h-6 w-6 place-items-center rounded-md text-emerald-600 transition hover:bg-white"
                        aria-label="Batalkan berkas"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={cn(
                        'mt-3 flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-3 py-4 text-center transition',
                        isDragging
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-300 bg-white hover:border-navy-300 hover:bg-navy-50/30',
                      )}
                    >
                      <CloudUpload className="h-4 w-4 text-slate-400" />
                      <p className="mt-1.5 text-[10.5px] font-bold text-slate-600">
                        Tarik berkas atau <span className="text-navy-700">pilih dari perangkat</span>
                      </p>
                      <p className="mt-0.5 text-[9.5px] text-slate-400">
                        PDF, DOCX, XLSX, ZIP · maks. 20 MB
                      </p>
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1 text-[9.5px] text-slate-400">
                      <Clock3 className="h-2.5 w-2.5" />
                      Sisa 12 hari untuk revisi
                    </p>
                    <button
                      type="button"
                      onClick={submitProject}
                      disabled={!projectFile || projectSubmitted}
                      className={cn(
                        'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[10.5px] font-extrabold transition',
                        projectFile && !projectSubmitted
                          ? 'bg-navy-900 text-white hover:bg-navy-800'
                          : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      <Send className="h-3 w-3" />
                      Kirim ke Mentor
                    </button>
                  </div>
                </div>

                <div className="flex min-h-[340px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-[#fbfcfe]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3.5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <PersonAvatar name="Rangga Wirawan" tone="navy" size="md" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-800">
                          Rangga Wirawan
                        </p>
                        <p className="mt-0.5 text-[9.5px] text-slate-400">
                          Mentor Industri · Engineering Supervisor
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[9.5px] font-bold text-emerald-700">
                      <MessageCircle className="h-2.5 w-2.5" />
                      Online
                    </span>
                  </div>

                  <div className="max-h-[240px] flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.author === 'me' ? 'justify-end' : 'justify-start',
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[82%] rounded-xl px-2.5 py-2 text-[10.5px] leading-relaxed shadow-sm',
                            message.author === 'me'
                              ? 'rounded-br-sm bg-navy-900 text-white'
                              : 'rounded-bl-sm border border-slate-200 bg-white text-slate-600',
                          )}
                        >
                          <p>{message.text}</p>
                          <p
                            className={cn(
                              'mt-1 text-right text-[9.5px]',
                              message.author === 'me' ? 'text-white/40' : 'text-slate-400',
                            )}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isMentorTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-1 rounded-xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2.5">
                          <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                          <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                          <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-slate-200 bg-white p-2.5">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        placeholder="Tulis pesan untuk mentor…"
                        aria-label="Pesan untuk mentor"
                        className="h-8 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[10.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-navy-300 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!messageDraft.trim()}
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-lg transition',
                          messageDraft.trim()
                            ? 'bg-emerald-brand text-white hover:bg-emerald-700'
                            : 'bg-slate-100 text-slate-300',
                        )}
                        aria-label="Kirim pesan"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pelacak-karier" className="mt-10 sm:mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-emerald-brand">Terhubung dengan masa depan</p>
              <h2 className="mt-1.5 text-[22px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[25px]">
                Pelacak Karier Saya
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Status kepesertaan BPJS Ketenagakerjaan dan milestone retensimu,
                transparan dalam satu linimasa.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10.5px] font-bold text-emerald-700 sm:self-auto">
              <ShieldCheck className="h-3 w-3" />
              Kepesertaan aktif
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative overflow-hidden bg-navy-950 p-5 text-white sm:p-6">
                <div className="pointer-events-none absolute inset-0 dotted-grid opacity-40" />
                <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-white/10 ring-1 ring-white/10">
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      </span>
                      <div>
                        <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/40">
                          BPJS Ketenagakerjaan
                        </p>
                        <p className="mt-0.5 text-[10.5px] font-bold text-white/85">
                          Kepesertaan Pekerja
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-200">
                      Aktif
                    </span>
                  </div>

                  <p className="mt-6 text-[10.5px] font-medium text-white/40">
                    Nama peserta
                  </p>
                  <p className="mt-0.5 text-base font-extrabold tracking-tight text-white">
                    NADIA SAFITRI
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-medium text-white/35">
                        Nomor kepesertaan
                      </p>
                      <p className="mt-1 font-mono text-xs tracking-[0.18em] text-white/75">
                        1907 2810 5821
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9.5px] font-medium text-white/35">
                        Terverifikasi
                      </p>
                      <p className="mt-1 text-[10.5px] font-bold text-emerald-200">
                        15 Okt 2026
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="text-[9.5px] font-semibold text-white/50">
                        Program CariGawe · PT Semen Baturaja
                      </span>
                    </div>
                    <span className="font-mono text-[9.5px] tracking-widest text-white/25">
                      SUMSEL
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Linimasa retensi
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-slate-400">
                      Diperbarui otomatis dari verifikasi BPJS.
                    </p>
                  </div>
                  <span className="hidden items-center gap-1 text-[10.5px] font-semibold text-slate-400 sm:flex">
                    <CalendarCheck className="h-3 w-3" />
                    2 dari 3 milestone
                  </span>
                </div>

                <div className="relative mt-4 pl-0">
                  {[
                    {
                      id: 1,
                      title: 'Penempatan magang dimulai',
                      date: '15 Juli 2026',
                      detail: 'Didaftarkan perusahaan ke BPJS Ketenagakerjaan.',
                      state: 'done',
                    },
                    {
                      id: 2,
                      title: 'Milestone bulan ke-3',
                      date: '15 Oktober 2026',
                      detail: 'Iuran bulan ke-3 terverifikasi. Kepesertaan aktif.',
                      state: 'active',
                    },
                    {
                      id: 3,
                      title: 'Milestone bulan ke-6',
                      date: '15 Januari 2027',
                      detail:
                        'Menunggu verifikasi otomatis. Insentif retensi diproses setelah lolos milestone.',
                      state: 'next',
                    },
                  ].map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className={cn(
                        'relative flex gap-3',
                        index < 2 ? 'pb-4' : '',
                      )}
                    >
                      <div className="relative flex w-5 shrink-0 justify-center">
                        {index < 2 && (
                          <span
                            className={cn(
                              'absolute left-1/2 top-5 h-[calc(100%-4px)] w-px -translate-x-1/2',
                              milestone.state === 'done' || milestone.state === 'active'
                                ? index === 0
                                  ? 'bg-emerald-300'
                                  : 'bg-gradient-to-b from-emerald-300 to-slate-200'
                                : 'bg-slate-200',
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'relative z-10 grid h-5 w-5 place-items-center rounded-full ring-4',
                            milestone.state === 'done'
                              ? 'bg-emerald-600 text-white ring-emerald-50'
                              : milestone.state === 'active'
                                ? 'bg-white text-emerald-700 ring-emerald-100 outline outline-1 outline-emerald-500'
                                : 'bg-white text-slate-400 ring-slate-100 outline outline-1 outline-slate-200',
                          )}
                        >
                          {milestone.state === 'done' ? (
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          ) : milestone.state === 'active' ? (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                          ) : (
                            <LockKeyhole className="h-2.5 w-2.5" />
                          )}
                        </span>
                      </div>
                      <div className="flex-1 pb-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={cn(
                              'text-[11px] font-extrabold',
                              milestone.state === 'next'
                                ? 'text-slate-500'
                                : 'text-slate-800',
                            )}
                          >
                            {milestone.title}
                          </p>
                          {milestone.state === 'active' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-extrabold text-emerald-700 ring-1 ring-emerald-600/10">
                              <ShieldCheck className="h-2.5 w-2.5" />
                              Verifikasi BPJS Aktif
                            </span>
                          )}
                          {milestone.state === 'next' && (
                            <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-extrabold text-amber-700">
                              Menunggu
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[9.5px] font-semibold text-slate-400">
                          {milestone.date}
                        </p>
                        <p className="mt-1 max-w-md text-[11px] leading-relaxed text-slate-400">
                          {milestone.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <Target className="mt-0.5 h-3 w-3 shrink-0 text-navy-600" />
                  <p className="text-[9.5px] leading-relaxed text-slate-400">
                    <span className="font-bold text-slate-600">Berikutnya:</span>{' '}
                    verifikasi otomatis akan memeriksa status iuran pada 15 Januari
                    2027. Tidak perlu mengunggah berkas manual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        eyebrow="Lowongan terverifikasi"
        title={selectedJob?.position ?? 'Detail lowongan'}
        description={
          selectedJob
            ? `${selectedJob.company} · ${selectedJob.city}, ${selectedJob.region}`
            : undefined
        }
        width="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Tutup
            </button>
            {selectedJob && (
              <button
                type="button"
                onClick={() => {
                  if (appliedJobs.includes(selectedJob.id)) {
                    setSelectedJob(null);
                    return;
                  }
                  applyToJob(selectedJob);
                }}
                disabled={appliedJobs.includes(selectedJob.id)}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition',
                  appliedJobs.includes(selectedJob.id)
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-navy-900 text-white hover:bg-navy-800',
                )}
              >
                {appliedJobs.includes(selectedJob.id) ? (
                  <>
                    <CheckCircleIcon />
                    Pendaftaran Terkirim
                  </>
                ) : (
                  <>
                    Kirim Pendaftaran
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </>
        }
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerifiedBadge label="Lowongan Riil & Jalur Rekrutmen Formal" />
              {selectedJob.isUmkm && (
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10.5px] font-bold text-amber-700 ring-1 ring-amber-600/10">
                  UMKM binaan Dinas
                </span>
              )}
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  label: 'Uang saku',
                  value: rupiah(selectedJob.stipend),
                  icon: Wallet,
                },
                {
                  label: 'Kuota magang',
                  value: `${selectedJob.quota} orang`,
                  icon: Users,
                },
                {
                  label: 'Batas daftar',
                  value: selectedJob.deadline,
                  icon: CalendarDays,
                },
              ].map((detail) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={detail.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                  >
                    <p className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-400">
                      <Icon className="h-3 w-3" />
                      {detail.label}
                    </p>
                    <p className="mt-1 text-[11px] font-extrabold text-slate-800">
                      {detail.value}
                    </p>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                Tentang program
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
                {selectedJob.summary}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  Kompetensi yang dicari
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-navy-50 px-2 py-1 text-[10.5px] font-semibold text-navy-700 ring-1 ring-navy-700/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  Modul pelatihan
                </p>
                <div className="mt-2 space-y-1.5">
                  {selectedJob.modules.map((module) => (
                    <p
                      key={module}
                      className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500"
                    >
                      <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                      {module}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <p className="text-[10.5px] leading-relaxed text-emerald-800">
                  <span className="font-extrabold">Dijamin terverifikasi.</span>{' '}
                  Lowongan telah melalui validasi Desk Onboarding Dinas, dengan
                  jalur rekrutmen formal dan pencatatan retensi BPJS.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CheckCircleIcon() {
  return <Check className="h-3.5 w-3.5" strokeWidth={3} />;
}
