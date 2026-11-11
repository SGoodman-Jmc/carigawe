# CariGawe — Talent Hub Pemuda Sumatera Selatan

Prototipe platform pemagangan dan ketenagakerjaan pemuda Sumsel. Satu aplikasi, tiga portal peran:

| Peran | Rute | Fokus |
| --- | --- | --- |
| Login / Registrasi | `#login` / `#daftar` | Panel masuk di atas beranda portal: pilih peran, NIK/email, daftar akun, SSO MagangHub Kemnaker |
| Perusahaan / Industri | `#company` | Form lowongan & kompetensi, Syllabus Matcher, evaluasi proyek, pelaporan retensi |
| Peserta / Pemuda | `#youth` | Katalog lowongan terverifikasi, filter Sumsel, hub pelatihan, unggah proyek, chat mentor, linimasa BPJS |
| Admin Dinas | `#admin` | KPI, antrean verifikasi, engine BPJS & insentif APBD, monitor API MagangHub |

## Menjalankan

```bash
cd carigawe
npm install
npm run dev
```

Buka `http://127.0.0.1:5199/`. Rute default adalah portal perusahaan; gunakan switcher peran di header atau hash di atas.

Panel autentikasi dapat dibuka dari tombol **Masuk** / **Daftar** di header, atau langsung lewat `#login` dan `#daftar`. Panel tampil di atas beranda portal; setelah login/SSO, pengguna masuk ke portal sesuai peran yang dipilih: Pemuda, Perusahaan, atau Admin Dinas.

Build produksi:

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS 4
- Lucide React
- Plus Jakarta Sans Variable (`@fontsource-variable/plus-jakarta-sans`)

## Catatan prototipe

- Seluruh alur backend disimulasikan di state React dan toast: verifikasi lowongan, pencairan insentif, sinkronisasi API, unggah berkas, chat mentor, dan perubahan rating/rekomendasi.
- Data contoh menggunakan konteks lokal Sumsel: Palembang, Muara Enim, Baturaja/OKU, Prabumulih; PT Semen Baturaja, PT Bukit Asam, Pupuk Sriwidjaja, KAI Divre III, serta UMKM lokal.
- Nilai UMP Sumsel yang dipakai sebagai acuan uang saku adalah `Rp3,94 juta`.
- Halaman disusun responsif untuk desktop 1440px dan mobile 390px; tabel lebar dapat digeser horizontal di layar kecil.

## Demo video

Video demo 4 scene (±2 menit) dan naskah voice-over tersedia di folder `demo/`:

- `demo/carigawe-demo-2menit.webm` — hasil akhir video vertikal 540 × 960.
- `demo/NASKAH-DEMO.md` — pembagian scene, timing, dan teks voice-over.
- `demo/assets/` — berkas contoh untuk simulasi unggah proyek.

Skrip perekaman otomatis ada di `scripts/record-demo.cjs`. Skrip menjalankan alur login → portal pemuda → portal perusahaan → admin, dengan kursor dan scroll yang terlihat.
