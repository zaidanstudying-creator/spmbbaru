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

export function getAdminRoleAllowedTabs(role?: string): string[] {
  switch (role) {
    case 'KETUA_PANITIA':
    case 'ADMIN_SUPER':
      return ['branding', 'waves', 'formbuilder', 'noreg', 'queue', 'payments'];
    case 'VERIFIKATOR':
      return ['queue'];
    case 'BENDAHARA':
      return ['payments'];
    default:
      return ['queue'];
  }
}

export function canRoleManageEmbargo(role?: string): boolean {
  return role === 'KETUA_PANITIA' || role === 'ADMIN_SUPER';
}
