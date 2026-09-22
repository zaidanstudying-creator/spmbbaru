export type Gender = 'L' | 'P';
export type JenjangPendidikan = 'MTS' | 'MA' | (string & {});
export type JurusanMA = 'MIPA' | 'IPS' | 'KEAGAMAAN' | 'UMUM';

export type StatusBerkas = 'MENUNGGU' | 'TERVERIFIKASI' | 'REVISI' | 'DITOLAK';
export type StatusPembayaran = 'BELUM_BAYAR' | 'MENUNGGU_KONFIRMASI' | 'LUNAS' | 'KADALUARSA' | 'DITOLAK';
export type StatusKelulusan = 'DRAFT_LOLOS' | 'DRAFT_CADANGAN' | 'DRAFT_TIDAK_LOLOS' | 'LOLOS' | 'CADANGAN' | 'TIDAK_LOLOS' | 'BELUM_DITENTUKAN';
export type AdminRole = 'KETUA_PANITIA' | 'VERIFIKATOR' | 'BENDAHARA' | 'ADMIN_SUPER';
export type AdminTabId =
  | 'branding'
  | 'waves'
  | 'formbuilder'
  | 'noreg'
  | 'queue'
  | 'payments'
  | 'konten'
  | 'akun';

export interface BrandingSettings {
  pesantrenName: string;
  subName: string;
  yayasanName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  accreditation: string;
  legalPermitNumber: string;
  academicYear: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export interface WaveConfig {
  id: string;
  waveNumber: number;
  name: string;
  tagline: string;
  startDate: string;
  endDate: string;
  testDate: string;
  announcementDate: string;
  registrationFee: number;
  quotaPutra: number;
  quotaPutri: number;
  isActive: boolean;
  isOpen: boolean;
  badgeText?: string;
  features: string[];
}

export interface DocRequirement {
  id: string;
  key: string;
  name: string;
  description: string;
  allowedFormats: string[]; // e.g. ['PDF', 'JPG', 'PNG']
  maxSizeMB: number;
  isRequired: boolean;
  order: number;
  category: 'AKADEMIK' | 'IDENTITAS' | 'KESEHATAN' | 'TAMBAHAN';
}

export type FormFieldType = 'text' | 'number' | 'select';

export interface FormField {
  id: string;
  key: string;
  label: string;
  type: FormFieldType;
  isRequired: boolean;
  minLength?: number;
  placeholder?: string;
  options?: string[];
}

export interface NoregFormatConfig {
  prefix: string; // e.g. "REG", "SPMB", "PPDB"
  separator: '-' | '/' | '.' | '';
  yearFormat: 'YYYY' | 'YY' | 'NONE';
  includeJenjang: boolean; // e.g. MTS / MA
  digitLength: number; // e.g. 4 -> 0001
  previewExample: string;
}

export interface UploadedDoc {
  docKey: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileUrl: string;
  status: 'PENDING' | 'VALID' | 'REJECTED';
  rejectionNote?: string;
}

export interface ExamCardData {
  nomorPeserta: string;
  ruangCbt: string;
  sesiUjian: string;
  nomorMeja: string;
  pinCbt: string;
  jadwalUjian: string;
  lokasiGedung: string;
  qrCodeString: string;
  isPublished: boolean;
}

export interface SantriData {
  id: string;
  noReg: string;
  nisn: string;
  nik: string;
  fullName: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  prevSchool: string;
  level: JenjangPendidikan;
  jurusan?: JurusanMA;
  waveId: string;
  registrationDate: string;
  photoUrl: string;
  
  // Status Tracking
  statusBerkas: StatusBerkas;
  statusPembayaran: StatusPembayaran;
  statusKelulusan: StatusKelulusan; // Real state in internal database
  yudisiumScore?: number;
  catatanPanitia?: string;
  
  // Financial info
  nominalBayar: number;
  bankName: string;
  virtualAccount: string;
  paymentProofUrl?: string;
  paidAt?: string;

  // Documents
  documents: Record<string, UploadedDoc>;

  // Extra custom form fields (configurable by admin)
  extraFields?: { [key: string]: string };

  // Exam Card
  examCard?: ExamCardData;
}

export interface AdminUser {
  id: string;
  name: string;
  nip: string;
  email: string;
  password?: string;
  role: AdminRole;
  avatarUrl: string;
}

export interface LevelOption {
  id: JenjangPendidikan;
  label: string;
  shortLabel: string;
  stage: string;
  subNote: string;
  description: string;
  features: string[];
  quotaText: string;
}

export interface MajorOption {
  id: string;
  name: string;
  desc: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  imageUrl?: string;
}

export interface KeyStatItem {
  id: string;
  label: string;
  value: string;
}

export interface LandingContent {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroBadge: string;
  quotaCalloutTitle: string;
  quotaCalloutSub: string;
  programsIntro: string;
  newsIntro: string;
  waNumber: string;
  helpTitle: string;
  helpSubtitle: string;
  stats: KeyStatItem[];
  faqs: FaqItem[];
  news: NewsItem[];
}

export interface SystemEmbargoState {
  isEmbargoActive: boolean;
  lastReleaseDate?: string;
  releasedBy?: string;
  releaseNotes?: string;
}
