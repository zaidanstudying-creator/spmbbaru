import {
  BrandingSettings,
  WaveConfig,
  DocRequirement,
  NoregFormatConfig,
  SantriData,
  AdminUser,
  AdminRole,
  AdminTabId,
  SystemEmbargoState
} from '../types';

export const ADMIN_ROLE_TABS: Record<AdminRole, AdminTabId[]> = {
  ADMIN_SUPER: ['branding', 'waves', 'formbuilder', 'noreg', 'queue', 'payments'],
  KETUA_PANITIA: ['branding', 'waves', 'formbuilder', 'noreg', 'queue', 'payments'],
  VERIFIKATOR: ['queue'],
  BENDAHARA: ['payments']
};

export const CAN_MANAGE_EMBARGO: AdminRole[] = ['ADMIN_SUPER', 'KETUA_PANITIA'];

export const DEFAULT_BRANDING: BrandingSettings = {
  pesantrenName: 'Pesantren Modern Al-Hikmah',
  subName: 'Boarding School & Tahfidz Quran',
  yayasanName: 'Yayasan Pendidikan Islam Al-Hikmah Indonesia',
  tagline: 'Mencetak Generasi Qurani, Berakhlak Mulia & Berwawasan Global',
  description: 'Pendidikan holistik terintegrasi antara kurikulum nasional merdeka, sains teknologi modern, serta pembinaan tahfidz Al-Quran 30 Juz.',
  logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VHxqboS3x6LoyqcuEZ3z-eH4OFZTdY5lOByqSDxMc8eEFiA4LX79QSkwJMVueNDNXI_Tfm1HnPe3DQH3S-36Cic2ETXKwyrh0GVAqbyjhK9EV5gNvvK4S__jBI_zJlOZizEghPGRQdbYd7bdDZFGVb8x3b8sSe0WT5m2KnxgYbm6lh1z9i-r3Y3RLn7s36nJ2MLCr2SsaMPv7bVxP3RXFQ_PLMYeubBESRcW9-4zMlW-zzhm6-3FW5yZE',
  phone: '(022) 8765-4321',
  whatsapp: '0812-3456-7890',
  email: 'spmb@alhikmah-pesantren.sch.id',
  address: 'Jl. Raya Ciburial No. 88, Dago Atas, Bandung, Jawa Barat 40198',
  mapsUrl: 'https://maps.google.com',
  accreditation: 'Akreditasi A Unggul (Kemenag RI)',
  legalPermitNumber: 'SK Kemenag RI No. Kd.10.04/4/PP.00.7/1820/2020',
  academicYear: '2025/2026',
  primaryColor: '#065f46',
  secondaryColor: '#d97706',
  tertiaryColor: '#10b981'
};

export const DEFAULT_WAVES: WaveConfig[] = [
  {
    id: 'gel-1',
    waveNumber: 1,
    name: 'Gelombang I - Jalur Prestasi & Tahfidz',
    tagline: 'Bebas Uang Pangkal 50% bagi Penghafal Al-Quran minimal 3 Juz',
    startDate: '2024-11-01',
    endDate: '2025-02-28',
    testDate: '2025-03-08',
    announcementDate: '2025-03-15',
    registrationFee: 350000,
    quotaPutra: 120,
    quotaPutri: 100,
    isActive: true,
    isOpen: true,
    badgeText: 'Sedang Dibuka',
    features: [
      'Prioritas Pemilihan Kamar Asrama',
      'Beasiswa Uang Pangkal s.d 100%',
      'Ujian CBT Online & Wawancara Khusus',
      'Tes Minat Bakat Digital'
    ]
  },
  {
    id: 'gel-2',
    waveNumber: 2,
    name: 'Gelombang II - Jalur Reguler Mandiri',
    tagline: 'Penerimaan santri reguler umum MTs & MA',
    startDate: '2025-03-01',
    endDate: '2025-05-15',
    testDate: '2025-05-24',
    announcementDate: '2025-05-31',
    registrationFee: 400000,
    quotaPutra: 80,
    quotaPutri: 70,
    isActive: true,
    isOpen: false,
    badgeText: 'Akan Datang',
    features: [
      'Ujian Masuk CBT Terpadu',
      'Wawancara Orang Tua/Wali',
      'Tes Baca Al-Quran & Ibadah Praktis'
    ]
  },
  {
    id: 'gel-3',
    waveNumber: 3,
    name: 'Gelombang III - Jalur Afirmasi & Kuota Sisa',
    tagline: 'Kesempatan khusus bagi santri berprestasi yatim/dhuafa & sisa kuota',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    testDate: '2025-07-05',
    announcementDate: '2025-07-10',
    registrationFee: 400000,
    quotaPutra: 40,
    quotaPutri: 30,
    isActive: false,
    isOpen: false,
    badgeText: 'Penyisihan',
    features: [
      'Subsidi Biaya Pendidikan bagi Mustahik',
      'Pemeriksaan Berkas Cepat',
      'Penempatan Kelas Unggulan'
    ]
  }
];

export const DEFAULT_DOC_REQUIREMENTS: DocRequirement[] = [
  {
    id: 'doc-1',
    key: 'ijazah',
    name: 'Ijazah / Surat Keterangan Lulus (SKL)',
    description: 'Scan asli atau legalisir basah dari sekolah asal',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 2,
    isRequired: true,
    order: 1,
    category: 'AKADEMIK'
  },
  {
    id: 'doc-2',
    key: 'kk',
    name: 'Kartu Keluarga (KK)',
    description: 'Scan Kartu Keluarga terbaru ber-barcode Disdukcapil',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 2,
    isRequired: true,
    order: 2,
    category: 'IDENTITAS'
  },
  {
    id: 'doc-3',
    key: 'akta',
    name: 'Akta Kelahiran Calon Santri',
    description: 'Scan Akta Kelahiran asli yang sah',
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 2,
    isRequired: true,
    order: 3,
    category: 'IDENTITAS'
  },
  {
    id: 'doc-4',
    key: 'rapor',
    name: 'Rapor Terakhir (5 Semester)',
    description: 'Scan rapor semester 1-5 yang telah dilegalisir kepala sekolah',
    allowedFormats: ['PDF'],
    maxSizeMB: 5,
    isRequired: true,
    order: 4,
    category: 'AKADEMIK'
  },
  {
    id: 'doc-5',
    key: 'pasfoto',
    name: 'Pas Foto Resmi Berwarna (3x4)',
    description: 'Foto berpeci/jilbab latar belakang merah/biru, berpakaian sopan',
    allowedFormats: ['JPG', 'PNG'],
    maxSizeMB: 2,
    isRequired: true,
    order: 5,
    category: 'IDENTITAS'
  },
  {
    id: 'doc-6',
    key: 'skkb',
    name: 'Surat Keterangan Berkelakuan Baik (SKKB)',
    description: 'Diterbitkan oleh Kepala Madrasah/Sekolah Asal',
    allowedFormats: ['PDF', 'JPG'],
    maxSizeMB: 2,
    isRequired: false,
    order: 6,
    category: 'TAMBAHAN'
  },
  {
    id: 'doc-7',
    key: 'kesehatan',
    name: 'Surat Keterangan Sehat & Bebas Narkoba',
    description: 'Dari dokter RS Pemerintah / Puskesmas setempat',
    allowedFormats: ['PDF', 'JPG'],
    maxSizeMB: 2,
    isRequired: true,
    order: 7,
    category: 'KESEHATAN'
  },
  {
    id: 'doc-8',
    key: 'prestasi',
    name: 'Sertifikat Tahfidz / Prestasi Piagam',
    description: 'Sertifikat Tahfidz min. 1 Juz atau kejuaraan sains/olahraga/seni',
    allowedFormats: ['PDF', 'JPG'],
    maxSizeMB: 4,
    isRequired: false,
    order: 8,
    category: 'TAMBAHAN'
  }
];

export const DEFAULT_NOREG_CONFIG: NoregFormatConfig = {
  prefix: 'REG',
  separator: '-',
  yearFormat: 'YYYY',
  includeJenjang: false,
  digitLength: 4,
  previewExample: 'REG-2025-0842'
};

export const DEFAULT_EMBARGO_STATE: SystemEmbargoState = {
  isEmbargoActive: true,
  lastReleaseDate: undefined,
  releasedBy: undefined,
  releaseNotes: 'Hasil Yudisium Kelulusan Terkunci di Internal Panitia SPMB'
};

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Ust. H. Abdullah M., M.Pd.I',
    nip: '198408152008011002',
    email: 'abdullah.panitia@alhikmah.sch.id',
    role: 'KETUA_PANITIA',
    avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UZRfAtQUiH86beKGAri5kySahq2-BNgAY0S1fOHE2yeNQ_vohiMAzzanEt_4L5ZRXREhbWie2k6oR3h44gV2-sGNX2pa2VKOQo90G5Vm35tfidJ5gnTNTG2EcKTyFGFDa7lzJA4K1bUlNeILStCI4tryJ5VIDMvOufEKzO_Tg7gcOTtL95r6u9Z5nTPyuuiv4bEoKRrEN4tYfz3jvFEkmKMN5frZkNvuF2-5okpt6WABBC97gnErWQq74'
  },
  {
    id: 'adm-2',
    name: 'Usth. Siti Rahmah, S.Ag',
    nip: '198904122014022001',
    email: 'verifikator@alhikmah.sch.id',
    role: 'VERIFIKATOR',
    avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UZRfAtQUiH86beKGAri5kySahq2-BNgAY0S1fOHE2yeNQ_vohiMAzzanEt_4L5ZRXREhbWie2k6oR3h44gV2-sGNX2pa2VKOQo90G5Vm35tfidJ5gnTNTG2EcKTyFGFDa7lzJA4K1bUlNeILStCI4tryJ5VIDMvOufEKzO_Tg7gcOTtL95r6u9Z5nTPyuuiv4bEoKRrEN4tYfz3jvFEkmKMN5frZkNvuF2-5okpt6WABBC97gnErWQq74'
  },
  {
    id: 'adm-3',
    name: 'Sdr. Muhammad Zainul Muttaqin, S.E.',
    nip: '199001252020121004',
    email: 'bendahara@alhikmah.sch.id',
    role: 'BENDAHARA',
    avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UZRfAtQUiH86beKGAri5kySahq2-BNgAY0S1fOHE2yeNQ_vohiMAzzanEt_4L5ZRXREhbWie2k6oR3h44gV2-sGNX2pa2VKOQo90G5Vm35tfidJ5gnTNTG2EcKTyFGFDa7lzJA4K1bUlNeILStCI4tryJ5VIDMvOufEKzO_Tg7gcOTtL95r6u9Z5nTPyuuiv4bEoKRrEN4tYfz3jvFEkmKMN5frZkNvuF2-5okpt6WABBC97gnErWQq74'
  },
  {
    id: 'adm-4',
    name: 'Tim IT SPMB Al-Hikmah',
    nip: '202307010001',
    email: 'admin@alhikmah.sch.id',
    role: 'ADMIN_SUPER',
    avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UZRfAtQUiH86beKGAri5kySahq2-BNgAY0S1fOHE2yeNQ_vohiMAzzanEt_4L5ZRXREhbWie2k6oR3h44gV2-sGNX2pa2VKOQo90G5Vm35tfidJ5gnTNTG2EcKTyFGFDa7lzJA4K1bUlNeILStCI4tryJ5VIDMvOufEKzO_Tg7gcOTtL95r6u9Z5nTPyuuiv4bEoKRrEN4tYfz3jvFEkmKMN5frZkNvuF2-5okpt6WABBC97gnErWQq74'
  }
];

export const DEFAULT_SANTRIS: SantriData[] = [
  {
    id: 'snt-1',
    noReg: 'REG-2025-0842',
    nisn: '0087192841',
    nik: '3273011405080002',
    fullName: 'Muhammad Fatih Al-Faruq',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2008-05-14',
    email: 'fatih.alfaruq@gmail.com',
    phone: '0813-2288-9901',
    parentName: 'Drs. H. Ahmad Faruq, M.Ag',
    parentPhone: '0812-8877-6655',
    address: 'Jl. Cisitu Indah No. 45, Coblong, Kota Bandung, Jawa Barat',
    prevSchool: 'MTsN 1 Kota Bandung',
    level: 'MA',
    jurusan: 'MIPA',
    waveId: 'gel-1',
    registrationDate: '2025-01-15',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrAozg9Pnhnj2ltI5n7uRhgtOxPYu6-uejYLQIitBNE0_R_qVeD58zETdRup0O2a7r-nCFNsbrKpMOcL-tIY40ZsK-5wqAM19pa5x6B59rqg5oh5kkthPpiukssCKlZ7Wy6ILEXwPcVJt1FTer7pwNUgyVPkw1RllBPxc2LjQDLiEl7XzhJmswAF4BzasSZtdWjj3PfvjgdJeC4EzCnNN00AejTKnRTSsMEgI5wBi8ZVRfUej-xf4F',
    statusBerkas: 'TERVERIFIKASI',
    statusPembayaran: 'LUNAS',
    statusKelulusan: 'DRAFT_LOLOS',
    yudisiumScore: 94.5,
    catatanPanitia: 'Berkas lengkap, nilai tahfidz 5 Juz mutqin A+',
    nominalBayar: 350000,
    bankName: 'Bank Syariah Indonesia (BSI)',
    virtualAccount: '9888 2025 0842 0001',
    paidAt: '2025-01-16 10:24',
    documents: {
      ijazah: {
        docKey: 'ijazah',
        fileName: 'Scan_SKL_MTsN1Bandung_Fatih.pdf',
        fileSize: '1.4 MB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      kk: {
        docKey: 'kk',
        fileName: 'Kartu_Keluarga_AhmadFaruq.pdf',
        fileSize: '980 KB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      akta: {
        docKey: 'akta',
        fileName: 'Akta_Lahir_Fatih_AlFaruq.pdf',
        fileSize: '820 KB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      rapor: {
        docKey: 'rapor',
        fileName: 'Rapor_Semester_1-5_Legalisir.pdf',
        fileSize: '3.8 MB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      pasfoto: {
        docKey: 'pasfoto',
        fileName: 'Pasfoto_Fatih_3x4_Merah.jpg',
        fileSize: '450 KB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      kesehatan: {
        docKey: 'kesehatan',
        fileName: 'Surat_Kesehatan_BebasNarkoba_RSUD.pdf',
        fileSize: '1.1 MB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      },
      prestasi: {
        docKey: 'prestasi',
        fileName: 'Sertifikat_Tahfidz_5_Juz_Kemenag.pdf',
        fileSize: '1.8 MB',
        uploadDate: '2025-01-15',
        fileUrl: '#',
        status: 'VALID'
      }
    },
    examCard: {
      nomorPeserta: 'CBT-MA-0842',
      ruangCbt: 'Lab CBT Multazam Lantai 2',
      sesiUjian: 'Sesi 1 (Pukul 08:00 - 11:30 WIB)',
      nomorMeja: 'M-24',
      pinCbt: '9842',
      jadwalUjian: '2025-03-08',
      lokasiGedung: 'Kampus Utama Al-Hikmah, Gedung Ibnu Sina',
      qrCodeString: 'SPMB-ALHIKMAH-REG20250842-VALID',
      isPublished: true
    }
  },
  {
    id: 'snt-2',
    noReg: 'REG-2025-0843',
    nisn: '0089234112',
    nik: '3273026208080004',
    fullName: 'Aisyah Humaira Azzahra',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2008-08-22',
    email: 'aisyah.azzahra@gmail.com',
    phone: '0812-9900-1122',
    parentName: 'H. Ridwan Kamil, S.T',
    parentPhone: '0811-2233-4455',
    address: 'Jl. Riau No. 12, Bandung Wetan, Kota Bandung',
    prevSchool: 'SMP Islam Terpadu As-Syifa',
    level: 'MA',
    jurusan: 'KEAGAMAAN',
    waveId: 'gel-1',
    registrationDate: '2025-01-18',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrAozg9Pnhnj2ltI5n7uRhgtOxPYu6-uejYLQIitBNE0_R_qVeD58zETdRup0O2a7r-nCFNsbrKpMOcL-tIY40ZsK-5wqAM19pa5x6B59rqg5oh5kkthPpiukssCKlZ7Wy6ILEXwPcVJt1FTer7pwNUgyVPkw1RllBPxc2LjQDLiEl7XzhJmswAF4BzasSZtdWjj3PfvjgdJeC4EzCnNN00AejTKnRTSsMEgI5wBi8ZVRfUej-xf4F',
    statusBerkas: 'MENUNGGU',
    statusPembayaran: 'LUNAS',
    statusKelulusan: 'BELUM_DITENTUKAN',
    nominalBayar: 350000,
    bankName: 'Bank Syariah Indonesia (BSI)',
    virtualAccount: '9888 2025 0843 0002',
    paidAt: '2025-01-18 14:10',
    documents: {
      ijazah: {
        docKey: 'ijazah',
        fileName: 'Surat_Ket_Lulus_Aisyah.pdf',
        fileSize: '1.2 MB',
        uploadDate: '2025-01-18',
        fileUrl: '#',
        status: 'PENDING'
      }
    }
  },
  {
    id: 'snt-3',
    noReg: 'REG-2025-0844',
    nisn: '0091238475',
    nik: '3204121511110001',
    fullName: 'Rayhan Putra Pratama',
    gender: 'L',
    birthPlace: 'Cimahi',
    birthDate: '2011-11-15',
    email: 'rayhan.pratama@gmail.com',
    phone: '0857-1122-3344',
    parentName: 'Bambang Sudibyo',
    parentPhone: '0858-9988-7766',
    address: 'Jl. Kolonel Masturi No. 102, Cimahi Utara',
    prevSchool: 'SDN Cimahi 1',
    level: 'MTS',
    waveId: 'gel-1',
    registrationDate: '2025-01-20',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrAozg9Pnhnj2ltI5n7uRhgtOxPYu6-uejYLQIitBNE0_R_qVeD58zETdRup0O2a7r-nCFNsbrKpMOcL-tIY40ZsK-5wqAM19pa5x6B59rqg5oh5kkthPpiukssCKlZ7Wy6ILEXwPcVJt1FTer7pwNUgyVPkw1RllBPxc2LjQDLiEl7XzhJmswAF4BzasSZtdWjj3PfvjgdJeC4EzCnNN00AejTKnRTSsMEgI5wBi8ZVRfUej-xf4F',
    statusBerkas: 'REVISI',
    statusPembayaran: 'LUNAS',
    statusKelulusan: 'BELUM_DITENTUKAN',
    nominalBayar: 350000,
    bankName: 'Bank Syariah Indonesia (BSI)',
    virtualAccount: '9888 2025 0844 0003',
    paidAt: '2025-01-20 16:30',
    catatanPanitia: 'Foto Rapor buram tidak terbaca, silakan upload ulang lembar semester 3 & 4',
    documents: {
      rapor: {
        docKey: 'rapor',
        fileName: 'Rapor_Rayhan_Buram.pdf',
        fileSize: '890 KB',
        uploadDate: '2025-01-20',
        fileUrl: '#',
        status: 'REJECTED',
        rejectionNote: 'Scan tidak jelas'
      }
    }
  },
  {
    id: 'snt-4',
    noReg: 'REG-2025-0845',
    nisn: '0086349821',
    nik: '3209140203080005',
    fullName: 'Zahra Nur Salsabila',
    gender: 'P',
    birthPlace: 'Cirebon',
    birthDate: '2008-03-02',
    email: 'zahra.salsabila@gmail.com',
    phone: '0878-3344-5566',
    parentName: 'Ir. H. Lukman Hakim',
    parentPhone: '0813-7788-9900',
    address: 'Jl. Kartini No. 28, Kesambi, Kota Cirebon',
    prevSchool: 'SMP Negeri 1 Cirebon',
    level: 'MA',
    jurusan: 'MIPA',
    waveId: 'gel-1',
    registrationDate: '2025-01-22',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrAozg9Pnhnj2ltI5n7uRhgtOxPYu6-uejYLQIitBNE0_R_qVeD58zETdRup0O2a7r-nCFNsbrKpMOcL-tIY40ZsK-5wqAM19pa5x6B59rqg5oh5kkthPpiukssCKlZ7Wy6ILEXwPcVJt1FTer7pwNUgyVPkw1RllBPxc2LjQDLiEl7XzhJmswAF4BzasSZtdWjj3PfvjgdJeC4EzCnNN00AejTKnRTSsMEgI5wBi8ZVRfUej-xf4F',
    statusBerkas: 'TERVERIFIKASI',
    statusPembayaran: 'LUNAS',
    statusKelulusan: 'DRAFT_LOLOS',
    yudisiumScore: 91.0,
    catatanPanitia: 'Lolos berkas, nilai CBT 88.5, Wawancara 93.5',
    nominalBayar: 350000,
    bankName: 'Bank Syariah Indonesia (BSI)',
    virtualAccount: '9888 2025 0845 0004',
    paidAt: '2025-01-22 09:15',
    documents: {},
    examCard: {
      nomorPeserta: 'CBT-MA-0845',
      ruangCbt: 'Lab CBT Multazam Lantai 2',
      sesiUjian: 'Sesi 2 (Pukul 13:00 - 16:30 WIB)',
      nomorMeja: 'M-12',
      pinCbt: '9845',
      jadwalUjian: '2025-03-08',
      lokasiGedung: 'Kampus Utama Al-Hikmah, Gedung Ibnu Sina',
      qrCodeString: 'SPMB-ALHIKMAH-REG20250845-VALID',
      isPublished: true
    }
  }
];
