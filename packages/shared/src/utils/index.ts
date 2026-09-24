import {
  NoregFormatConfig,
  JenjangPendidikan,
  StatusBerkas,
  StatusPembayaran,
  StatusKelulusan
} from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function generateNoreg(
  config: NoregFormatConfig,
  level: JenjangPendidikan,
  sequenceNum: number,
  year: number = new Date().getFullYear()
): string {
  const parts: string[] = [];
  if (config.prefix && config.prefix.trim()) {
    parts.push(config.prefix.trim());
  }

  if (config.yearFormat === 'YYYY') {
    parts.push(year.toString());
  } else if (config.yearFormat === 'YY') {
    parts.push(year.toString().slice(-2));
  }

  if (config.includeJenjang) {
    parts.push(level.toUpperCase());
  }

  const seqStr = sequenceNum.toString().padStart(config.digitLength, '0');
  parts.push(seqStr);

  return parts.join(config.separator);
}

export function generateVirtualAccount(noReg: string): string {
  const cleanDigits = noReg.replace(/\D/g, '').slice(-4).padStart(4, '0');
  const year = new Date().getFullYear();
  return `9888 ${year} ${cleanDigits} 0001`;
}

export function getRoleLabel(role?: string): {
  label: string;
  badgeClass: string;
  icon: string;
} {
  switch (role) {
    case 'KETUA_PANITIA':
      return {
        label: 'Ketua Panitia SPMB',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: 'supervisor_account'
      };
    case 'VERIFIKATOR':
      return {
        label: 'Verifikator Berkas',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        icon: 'fact_check'
      };
    case 'BENDAHARA':
      return {
        label: 'Bendahara Penerimaan',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: 'payments'
      };
    case 'ADMIN_SUPER':
      return {
        label: 'Administrator Super',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        icon: 'admin_panel_settings'
      };
    default:
      return {
        label: 'Admin SPMB',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: 'person'
      };
  }
}

export function getStatusBerkasLabel(status: StatusBerkas): {
  label: string;
  badgeClass: string;
  icon: string;
} {
  switch (status) {
    case 'TERVERIFIKASI':
      return {
        label: '100% Terverifikasi',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: 'task_alt'
      };
    case 'REVISI':
      return {
        label: 'Butuh Revisi Dokumen',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: 'report_problem'
      };
    case 'DITOLAK':
      return {
        label: 'Berkas Ditolak',
        badgeClass: 'bg-red-100 text-red-800 border-red-300',
        icon: 'cancel'
      };
    case 'MENUNGGU':
    default:
      return {
        label: 'Menunggu Verifikasi',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: 'hourglass_empty'
      };
  }
}

export function getStatusPembayaranLabel(status: StatusPembayaran): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'LUNAS':
      return {
        label: 'Lunas Terbayar',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    case 'MENUNGGU_KONFIRMASI':
      return {
        label: 'Menunggu Verifikasi Bank',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
      };
    case 'KADALUARSA':
      return {
        label: 'Virtual Account Kadaluarsa',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
      };
    case 'DITOLAK':
      return {
        label: 'Bukti Transfer Ditolak',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
      };
    case 'BELUM_BAYAR':
    default:
      return {
        label: 'Menunggu Pembayaran',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
      };
  }
}

export function getPublicKelulusanStatus(
  status: StatusKelulusan,
  isEmbargoActive: boolean
): {
  isPubliclyAvailable: boolean;
  statusTitle: string;
  statusBadge: string;
  statusDesc: string;
  isPassed: boolean;
} {
  if (isEmbargoActive) {
    return {
      isPubliclyAvailable: false,
      statusTitle: 'Hasil Yudisium Terkunci di Internal (Mode Embargo)',
      statusBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      statusDesc: 'Pengumuman resmi kelulusan santri masih dalam tahap rekapitulasi panitia SPMB dan belum dirilis serentak.',
      isPassed: false
    };
  }

  if (status === 'LOLOS' || status === 'DRAFT_LOLOS') {
    return {
      isPubliclyAvailable: true,
      statusTitle: 'SELAMAT! ANDA DINYATAKAN LOLOS SELEKSI',
      statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      statusDesc: 'Calon santri dinyatakan DITERIMA di Pondok Pesantren Al-Hikmah. Silakan melanjutkan ke tahap Daftar Ulang & Pengukuran Seragam.',
      isPassed: true
    };
  }

  if (status === 'CADANGAN' || status === 'DRAFT_CADANGAN') {
    return {
      isPubliclyAvailable: true,
      statusTitle: 'STATUS CADANGAN (WAITING LIST)',
      statusBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      statusDesc: 'Anda berada di antrean cadangan. Panitia akan menghubungi jika terdapat kuota terbuka dari peserta yang mengundurkan diri.',
      isPassed: false
    };
  }

  if (status === 'TIDAK_LOLOS' || status === 'DRAFT_TIDAK_LOLOS') {
    return {
      isPubliclyAvailable: true,
      statusTitle: 'MOHON MAAF, BELUM DAPAT DITERIMA',
      statusBadge: 'bg-rose-100 text-rose-800 border-rose-300',
      statusDesc: 'Terima kasih telah berpartisipasi dalam SPMB. Kuota telah terpenuhi dan nilai seleksi belum memenuhi passing grade.',
      isPassed: false
    };
  }

  return {
    isPubliclyAvailable: false,
    statusTitle: 'PROSES PENILAIAN BERLANGSUNG',
    statusBadge: 'bg-slate-100 text-slate-800 border-slate-300',
    statusDesc: 'Data santri sedang dalam tahap review oleh tim penguji.',
    isPassed: false
  };
}

export function formatWhatsAppLink(raw: string, message?: string): string {
  const digits = (raw || '').replace(/[^0-9]/g, '');
  if (!digits) return 'https://wa.me/';
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits.startsWith('62') ? digits : `62${digits}`;
  const base = `https://wa.me/${intl}`;
  if (message && message.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}

export function getAdminRoleAllowedTabs(role?: string): string[] {
  const common = ['konten', 'akun'];
  switch (role) {
    case 'KETUA_PANITIA':
    case 'ADMIN_SUPER':
      return ['branding', 'waves', 'formbuilder', 'noreg', 'queue', 'payments', ...common];
    case 'VERIFIKATOR':
      return ['queue', ...common];
    case 'BENDAHARA':
      return ['payments', ...common];
    default:
      return ['queue', ...common];
  }
}

export function canRoleManageEmbargo(role?: string): boolean {
  return role === 'KETUA_PANITIA' || role === 'ADMIN_SUPER';
}

/* =========================================================================
 * NOTIFIKASI WHATSAPP KE WALI (fitur admin: kabari orang tua saat status berubah)
 * ========================================================================= */

export type SantriNotifType =
  | 'BERKAS_TERVERIFIKASI'
  | 'BERKAS_DIREVISI'
  | 'PEMBAYARAN_LUNAS'
  | 'PEMBAYARAN_DITOLAK'
  | 'KELULUSAN_LOLOS'
  | 'KELULUSAN_CADANGAN'
  | 'KELULUSAN_TIDAK_LOLOS';

interface BuildWaNotifOptions {
  pesantrenName: string;
  academicYear: string;
  noReg?: string;
}

/** Bangun pesan notifikasi WhatsApp Indonesia untuk wali, sesuai perubahan status yang dilakukan admin. */
export function buildWaSantriNotifMessage(
  type: SantriNotifType,
  santri: { fullName: string; level?: string; jurusan?: string; parentName?: string; noReg?: string },
  opts: BuildWaNotifOptions
): string {
  const { pesantrenName, academicYear } = opts;
  const wali = santri.parentName ? `Yth. Bapak/Ibu ${santri.parentName}` : 'Yth. Bapak/Ibu Wali';
  const nama = santri.fullName || 'Calon Santri';
  const header = `Assalamu'alaikum Wr. Wb.\n\n${wali}\n\nKabar dari Panitia SPMB ${pesantrenName} (Tahun Ajaran ${academicYear}) mengenai pendaftaran ${nama}:`;

  let isi = '';
  switch (type) {
    case 'BERKAS_TERVERIFIKASI':
      isi = `Alhamdulillah, seluruh berkas persyaratan ${nama} telah kami NYATAKAN LENGKAP & TERVERIFIKASI. 🎉\n\nLanjut ke tahap verifikasi pembayaran & seleksi.\n\n${santri.noReg && santri.noReg.trim() ? `Nomor Registrasi: *${santri.noReg}*\n` : ''}Silakan cek portal secara berkala.`;
      break;
    case 'BERKAS_DIREVISI':
      isi = `Mohon maaf, beberapa berkas persyaratan ${nama} perlu diperbaiki/dilengkapi oleh Bapak/Ibu.\n\n${santri.noReg && santri.noReg.trim() ? `Nomor Registrasi: *${santri.noReg}*\n` : ''}Silakan login ke portal untuk melihat catatan revisi dan mengunggah ulang berkas yang benar.`;
      break;
    case 'PEMBAYARAN_LUNAS':
      isi = `Alhamdulillah, pembayaran pendaftaran ${nama} telah kami KONFIRMASI LUNAS. ✅\n\n${santri.noReg && santri.noReg.trim() ? `Nomor Registrasi: *${santri.noReg}*\n` : ''}Silakan login ke portal untuk mengunduh Kartu Peserta Ujian (CBT).`;
      break;
    case 'PEMBAYARAN_DITOLAK':
      isi = `Mohon maaf, pembayaran pendaftaran ${nama} ditolak panitia karena bukti transfer tidak sesuai.\n\nSilakan cek catatan dari tim SPMB dan mengunggah ulang bukti transfer yang benar melalui portal.`;
      break;
    case 'KELULUSAN_LOLOS':
      isi = `Alhamdulillah, selamat! ${nama} dinyatakan **LOLOS** seleksi SPMB ${pesantrenName} tahun ajaran ${academicYear} dan diterima sebagai santri. 🎉🎊\n\nSilakan ikuti langkah selanjutnya sesuai informasi yang disampaikan panitia.`;
      break;
    case 'KELULUSAN_CADANGAN':
      isi = `Mohon maaf, ${nama} belum dapat dipastikan lolos pada tahap ini dan ditempatkan sebagai **CADANGAN**.\n\nMohon menunggu pengumuman lanjutan dari panitia SPMB ${pesantrenName}.`;
      break;
    case 'KELULUSAN_TIDAK_LOLOS':
      isi = `Mohon maaf, ${nama} dinyatakan **TIDAK LOLOS** seleksi SPMB ${pesantrenName} tahun ajaran ${academicYear}.\n\nKami menghargai partisipasi Bapak/Ibu. Semoga tetap menjadi bekal yang baik di masa depan.`;
      break;
  }

  return `${header}\n\n${isi}\n\nSalam & terima kasih,\nPanitia SPMB ${pesantrenName}`;
}

/** Link WhatsApp langsung ke wali dengan pesan notifikasi yang sudah terisi (untuk tombol "Kirim Notif WA"). */
export function formatWaSantriNotifLink(
  type: SantriNotifType,
  parentPhone: string,
  message: string
): string {
  return formatWhatsAppLink(parentPhone, message);
}

/* =========================================================================
 * EXPORT EXCEL (CSV ber-BOM UTF-8, kompatibel Excel/WPS) daftar santri + jawaban formulir
 * ========================================================================= */

function csvEscape(value: unknown): string {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

interface GenerateSantrisCsvOptions {
  includePayment?: boolean;
}

/** Bangun CSV (delimiter titik-koma, BOM UTF-8) berisi daftar santri + seluruh jawaban field formulir tambahan. */
export function generateSantrisCsv(
  santris: { [key: string]: any }[],
  customFormFields: { key: string; label: string }[],
  opts: GenerateSantrisCsvOptions = {}
): string {
  const { includePayment = true } = opts;

  const headersCSV = [
      'No. Registrasi',
      'Nama Lengkap',
      'NISN',
      'NISN/NIK',
      'NIK',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Email',
      'No. HP',
      'Asal Sekolah',
      'Jenjang',
      'Jurusan',
      'Gelombang',
      'Status Berkas',
      ...(includePayment ? ['Status Pembayaran', 'Nominal Bayar', 'Bank', 'No. Virtual Account', 'Tgl Pembayaran'] : []),
      'Status Kelulusan',
      ...customFormFields.map((f) => f.label)
    ];

    const rows = santris.map((s) => {
      const row = [
        s.noReg || s.no_reg || '',
        s.fullName || s.nama_lengkap || '',
        s.nisn || '',
        s.nik || '',
        s.gender === 'L' ? 'Laki-laki' : s.gender === 'P' ? 'Perempuan' : '',
        s.birthPlace || '',
        s.birthDate || '',
        s.email || '',
        s.phone || s.parentPhone || '',
        s.prevSchool || '',
        s.level || '',
        s.jurusan || '',
        s.waveId || '',
        (s.statusBerkas && getStatusBerkasLabel(s.statusBerkas).label) || s.statusBerkas || '',
        ...(includePayment
          ? [
              (s.statusPembayaran && getStatusPembayaranLabel(s.statusPembayaran).label) || s.statusPembayaran || '',
              s.nominalBayar || '',
              s.bankName || '',
              s.virtualAccount || '',
              s.paidAt || ''
            ]
          : []),
        (
          s.statusKelulusan === 'LOLOS' || s.statusKelulusan === 'DRAFT_LOLOS'
            ? 'Lolos'
            : s.statusKelulusan === 'CADANGAN' || s.statusKelulusan === 'DRAFT_CADANGAN'
              ? 'Cadangan'
              : s.statusKelulusan === 'TIDAK_LOLOS' || s.statusKelulusan === 'DRAFT_TIDAK_LOLOS'
                ? 'Tidak Lolos'
                : s.statusKelulusan === 'BELUM_DITENTUKAN'
                  ? 'Belum Ditentukan'
                  : s.statusKelulusan || ''
        ),
        ...customFormFields.map((f) => {
          const extra = s.extraFields || {};
          return extra[f.key] || (s.answers && s.answers[f.label]) || '';
        })
      ];
      return row.map(csvEscape).join(';');
    });

    return `\uFEFF${[headersCSV.map(csvEscape).join(';'), ...rows].join('\r\n')}`;
  }
