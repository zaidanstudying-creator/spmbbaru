import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  BrandingSettings,
  WaveConfig,
  DocRequirement,
  NoregFormatConfig,
  SantriData,
  AdminUser,
  SystemEmbargoState,
  StatusBerkas,
  StatusPembayaran,
  StatusKelulusan,
  JenjangPendidikan,
  Gender,
  JurusanMA,
  UploadedDoc,
  LevelOption,
  MajorOption,
  LandingContent,
  FaqItem,
  NewsItem,
  KeyStatItem
} from '../types';
import {
  DEFAULT_BRANDING,
  DEFAULT_WAVES,
  DEFAULT_DOC_REQUIREMENTS,
  DEFAULT_NOREG_CONFIG,
  DEFAULT_EMBARGO_STATE,
  DEFAULT_ADMIN_USERS,
  DEFAULT_SANTRIS,
  DEFAULT_LEVELS,
  DEFAULT_MAJORS,
  DEFAULT_LANDING_CONTENT,
  DEFAULT_ADMIN_PASSWORD
} from '../constants/defaults';
import { generateNoreg, generateVirtualAccount } from '../utils';

interface SPMBContextType {
  branding: BrandingSettings;
  updateBranding: (data: Partial<BrandingSettings>) => void;
  resetBranding: () => void;

  waves: WaveConfig[];
  updateWave: (waveId: string, updates: Partial<WaveConfig>) => void;
  toggleWaveActive: (waveId: string) => void;

  docRequirements: DocRequirement[];
  updateDocRequirement: (docId: string, updates: Partial<DocRequirement>) => void;
  addDocRequirement: (doc: Omit<DocRequirement, 'id' | 'order'>) => void;
  deleteDocRequirement: (docId: string) => void;

  noregConfig: NoregFormatConfig;
  updateNoregConfig: (updates: Partial<NoregFormatConfig>) => void;

  santris: SantriData[];
  registerNewSantri: (formData: {
    fullName: string;
    nisn: string;
    nik: string;
    gender: Gender;
    birthPlace: string;
    birthDate: string;
    email: string;
    phone: string;
    parentName: string;
    parentPhone: string;
    address: string;
    prevSchool: string;
    level: JenjangPendidikan;
    jurusan?: JurusanMA;
    waveId: string;
  }) => SantriData;
  updateSantriStatus: (
    santriId: string,
    updates: {
      statusBerkas?: StatusBerkas;
      statusPembayaran?: StatusPembayaran;
      statusKelulusan?: StatusKelulusan;
      yudisiumScore?: number;
      catatanPanitia?: string;
      paidAt?: string;
      paymentProofUrl?: string;
    }
  ) => void;
  uploadSantriDoc: (santriId: string, docKey: string, fileInfo: UploadedDoc) => void;
  verifySantriDoc: (santriId: string, docKey: string, status: 'VALID' | 'REJECTED', note?: string) => void;

  embargoState: SystemEmbargoState;
  setEmbargoActive: (active: boolean) => void;
  massPublishRelease: (releasedByName: string, note?: string) => void;

  currentSantri: SantriData | null;
  loginSantri: (identifier: string, passOrBirthDate?: string) => boolean;
  logoutSantri: () => void;
  setCurrentSantri: (santri: SantriData | null) => void;

  currentAdmin: AdminUser | null;
  adminUsers: AdminUser[];
  loginAdmin: (emailOrNip: string, pass?: string) => boolean;
  logoutAdmin: () => void;
  updateAdminUser: (adminId: string, updates: Partial<AdminUser>) => void;
  addAdminUser: (admin: AdminUser) => void;

  levels: LevelOption[];
  updateLevel: (levelId: JenjangPendidikan, updates: Partial<LevelOption>) => void;
  addLevel: (level: LevelOption) => void;
  deleteLevel: (levelId: JenjangPendidikan) => void;
  majors: MajorOption[];
  addMajor: (major: MajorOption) => void;
  updateMajor: (majorId: string, updates: Partial<MajorOption>) => void;
  deleteMajor: (majorId: string) => void;

  landingContent: LandingContent;
  updateLandingContent: (updates: Partial<LandingContent>) => void;
  upsertFaq: (faq: FaqItem) => void;
  deleteFaq: (faqId: string) => void;
  upsertNews: (news: NewsItem) => void;
  deleteNews: (newsId: string) => void;
  upsertStat: (stat: KeyStatItem) => void;
  deleteStat: (statId: string) => void;

  metrics: {
    totalApplicants: number;
    pendingDocs: number;
    draftPassed: number;
    totalQuota: number;
    quotaFilledPercent: number;
    todayNewCount: number;
  };

  resetAllToFactoryDefaults: () => void;
}

const STORAGE_KEY = 'SPMB_PESANTREN_STORAGE_V1';

const SPMBContext = createContext<SPMBContextType | undefined>(undefined);

export const SPMBProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state or fallback to defaults
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load SPMB data from localStorage:', e);
    }
    return null;
  };

  const initial = loadInitialData();

  const [branding, setBranding] = useState<BrandingSettings>(initial?.branding || DEFAULT_BRANDING);
  const [waves, setWaves] = useState<WaveConfig[]>(initial?.waves || DEFAULT_WAVES);
  const [docRequirements, setDocRequirements] = useState<DocRequirement[]>(
    initial?.docRequirements || DEFAULT_DOC_REQUIREMENTS
  );
  const [noregConfig, setNoregConfig] = useState<NoregFormatConfig>(
    initial?.noregConfig || DEFAULT_NOREG_CONFIG
  );
  const [santris, setSantris] = useState<SantriData[]>(initial?.santris || DEFAULT_SANTRIS);
  const [embargoState, setEmbargoState] = useState<SystemEmbargoState>(
    initial?.embargoState || DEFAULT_EMBARGO_STATE
  );
  const [levels, setLevels] = useState<LevelOption[]>(initial?.levels || DEFAULT_LEVELS);
  const [majors, setMajors] = useState<MajorOption[]>(initial?.majors || DEFAULT_MAJORS);
  const [landingContent, setLandingContent] = useState<LandingContent>(
    initial?.landingContent || DEFAULT_LANDING_CONTENT
  );
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(
    initial?.adminUsers?.length ? initial.adminUsers : DEFAULT_ADMIN_USERS
  );

  // Auth States
  const [currentSantri, setCurrentSantriState] = useState<SantriData | null>(() => {
    // Default to demo santri if available
    const list = initial?.santris || DEFAULT_SANTRIS;
    return list[0] || null;
  });

  const [currentAdmin, setCurrentAdminState] = useState<AdminUser | null>(null);

  // Save to localStorage whenever core state updates
  useEffect(() => {
    const payload = {
      branding,
      waves,
      docRequirements,
      noregConfig,
      santris,
      embargoState,
      levels,
      majors,
      landingContent,
      adminUsers
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save SPMB data:', e);
    }
  }, [
    branding,
    waves,
    docRequirements,
    noregConfig,
    santris,
    embargoState,
    levels,
    majors,
    landingContent,
    adminUsers
  ]);

  // Handle multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.branding) setBranding(parsed.branding);
          if (parsed.waves) setWaves(parsed.waves);
          if (parsed.docRequirements) setDocRequirements(parsed.docRequirements);
          if (parsed.noregConfig) setNoregConfig(parsed.noregConfig);
          if (parsed.santris) setSantris(parsed.santris);
          if (parsed.embargoState) setEmbargoState(parsed.embargoState);
          if (parsed.levels) setLevels(parsed.levels);
          if (parsed.majors) setMajors(parsed.majors);
          if (parsed.landingContent) setLandingContent(parsed.landingContent);
          if (parsed.adminUsers?.length) setAdminUsers(parsed.adminUsers);
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actions
  const updateBranding = (data: Partial<BrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...data }));
  };

  const resetBranding = () => {
    setBranding(DEFAULT_BRANDING);
  };

  const updateWave = (waveId: string, updates: Partial<WaveConfig>) => {
    setWaves((prev) => prev.map((w) => (w.id === waveId ? { ...w, ...updates } : w)));
    if (updates.testDate) {
      setSantris((prev) =>
        prev.map((s) => {
          if (s.waveId !== waveId || !s.examCard) return s;
          const updated = { ...s, examCard: { ...s.examCard, jadwalUjian: updates.testDate as string } };
          if (currentSantri?.id === s.id) setCurrentSantriState(updated);
          return updated;
        })
      );
    }
  };

  const toggleWaveActive = (waveId: string) => {
    setWaves((prev) =>
      prev.map((w) => (w.id === waveId ? { ...w, isOpen: !w.isOpen } : w))
    );
  };

  const updateDocRequirement = (docId: string, updates: Partial<DocRequirement>) => {
    setDocRequirements((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, ...updates } : d))
    );
  };

  const addDocRequirement = (doc: Omit<DocRequirement, 'id' | 'order'>) => {
    const newId = `doc-${Date.now()}`;
    const newOrder = docRequirements.length + 1;
    setDocRequirements((prev) => [...prev, { ...doc, id: newId, order: newOrder }]);
  };

  const deleteDocRequirement = (docId: string) => {
    setDocRequirements((prev) => prev.filter((d) => d.id !== docId));
  };

  const updateNoregConfig = (updates: Partial<NoregFormatConfig>) => {
    setNoregConfig((prev) => {
      const next = { ...prev, ...updates };
      next.previewExample = generateNoreg(next, 'MA', 842);
      return next;
    });
  };

  const registerNewSantri = (formData: {
    fullName: string;
    nisn: string;
    nik: string;
    gender: Gender;
    birthPlace: string;
    birthDate: string;
    email: string;
    phone: string;
    parentName: string;
    parentPhone: string;
    address: string;
    prevSchool: string;
    level: JenjangPendidikan;
    jurusan?: JurusanMA;
    waveId: string;
  }): SantriData => {
    const targetWave = waves.find((w) => w.id === formData.waveId) || waves[0];
    const seq = santris.length + 842;
    const newNoReg = generateNoreg(noregConfig, formData.level, seq);
    const va = generateVirtualAccount(newNoReg);
    const newId = `snt-${Date.now()}`;

    const newSantri: SantriData = {
      id: newId,
      noReg: newNoReg,
      nisn: formData.nisn,
      nik: formData.nik,
      fullName: formData.fullName,
      gender: formData.gender,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      email: formData.email,
      phone: formData.phone,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      address: formData.address,
      prevSchool: formData.prevSchool,
      level: formData.level,
      jurusan: formData.jurusan,
      waveId: formData.waveId,
      registrationDate: new Date().toISOString().split('T')[0],
      photoUrl:
        formData.gender === 'P'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
      statusBerkas: 'MENUNGGU',
      statusPembayaran: 'BELUM_BAYAR',
      statusKelulusan: 'BELUM_DITENTUKAN',
      nominalBayar: targetWave.registrationFee,
      bankName: 'Bank Syariah Indonesia (BSI)',
      virtualAccount: va,
      documents: {},
      examCard: {
        nomorPeserta: `CBT-${formData.level}-${seq}`,
        ruangCbt: 'Lab CBT Multazam Lantai 2',
        sesiUjian: 'Sesi 1 (Pukul 08:00 - 11:30 WIB)',
        nomorMeja: `M-${seq.toString().slice(-2)}`,
        pinCbt: Math.floor(1000 + Math.random() * 9000).toString(),
        jadwalUjian: targetWave.testDate,
        lokasiGedung: 'Kampus Utama Al-Hikmah, Gedung Ibnu Sina',
        qrCodeString: `SPMB-ALHIKMAH-${newNoReg}-VALID`,
        isPublished: false
      }
    };

    setSantris((prev) => [newSantri, ...prev]);
    setCurrentSantriState(newSantri);
    return newSantri;
  };

  const updateSantriStatus = (
    santriId: string,
    updates: {
      statusBerkas?: StatusBerkas;
      statusPembayaran?: StatusPembayaran;
      statusKelulusan?: StatusKelulusan;
      yudisiumScore?: number;
      catatanPanitia?: string;
      paidAt?: string;
      paymentProofUrl?: string;
    }
  ) => {
    setSantris((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          const updated = { ...s, ...updates };
          if (updates.statusBerkas === 'TERVERIFIKASI' && s.examCard) {
            updated.examCard = { ...s.examCard, isPublished: true };
          }
          if (currentSantri?.id === santriId) {
            setCurrentSantriState(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const uploadSantriDoc = (santriId: string, docKey: string, fileInfo: UploadedDoc) => {
    setSantris((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          const docs = { ...s.documents, [docKey]: fileInfo };
          const updated = { ...s, documents: docs };
          if (currentSantri?.id === santriId) {
            setCurrentSantriState(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const verifySantriDoc = (
    santriId: string,
    docKey: string,
    status: 'VALID' | 'REJECTED',
    note?: string
  ) => {
    setSantris((prev) =>
      prev.map((s) => {
        if (s.id === santriId && s.documents[docKey]) {
          const updatedDoc = {
            ...s.documents[docKey],
            status,
            rejectionNote: note
          };
          const docs = { ...s.documents, [docKey]: updatedDoc };
          const updated = { ...s, documents: docs };
          if (currentSantri?.id === santriId) {
            setCurrentSantriState(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const setEmbargoActive = (active: boolean) => {
    setEmbargoState((prev) => ({ ...prev, isEmbargoActive: active }));
  };

  const massPublishRelease = (releasedByName: string, note?: string) => {
    // 1. Release embargo
    setEmbargoState({
      isEmbargoActive: false,
      lastReleaseDate: new Date().toISOString(),
      releasedBy: releasedByName,
      releaseNotes: note || 'Hasil Seleksi SPMB Resmi Diumumkan ke Publik'
    });

    // 2. Convert draft status to public status
    setSantris((prev) =>
      prev.map((s) => {
        let finalKelulusan = s.statusKelulusan;
        if (s.statusKelulusan === 'DRAFT_LOLOS') finalKelulusan = 'LOLOS';
        else if (s.statusKelulusan === 'DRAFT_CADANGAN') finalKelulusan = 'CADANGAN';
        else if (s.statusKelulusan === 'DRAFT_TIDAK_LOLOS') finalKelulusan = 'TIDAK_LOLOS';

        return {
          ...s,
          statusKelulusan: finalKelulusan
        };
      })
    );
  };

  const loginSantri = (identifier: string, passOrBirthDate?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = santris.find(
      (s) =>
        s.noReg.toLowerCase() === cleanId ||
        s.nisn.toLowerCase() === cleanId ||
        s.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (found) {
      setCurrentSantriState(found);
      return true;
    }
    return false;
  };

  const logoutSantri = () => {
    setCurrentSantriState(null);
  };

  const setCurrentSantri = (santri: SantriData | null) => {
    setCurrentSantriState(santri);
  };

  const loginAdmin = (emailOrNip: string, pass?: string): boolean => {
    const clean = emailOrNip.trim().toLowerCase();
    const found = adminUsers.find(
      (u) => u.email.toLowerCase() === clean || u.nip.toLowerCase() === clean
    );
    if (!found) return false;
    const expected = found.password || DEFAULT_ADMIN_PASSWORD;
    if (pass && pass !== expected) return false;
    setCurrentAdminState(found);
    return true;
  };

  const logoutAdmin = () => {
    setCurrentAdminState(null);
  };

  const updateAdminUser = (adminId: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        const updated = { ...u, ...updates };
        if (currentAdmin?.id === adminId) setCurrentAdminState(updated);
        return updated;
      })
    );
  };

  const addAdminUser = (admin: AdminUser) => {
    setAdminUsers((prev) => [...prev, admin]);
  };

  const updateLevel = (levelId: JenjangPendidikan, updates: Partial<LevelOption>) => {
    setLevels((prev) => prev.map((l) => (l.id === levelId ? { ...l, ...updates } : l)));
  };

  const addLevel = (level: LevelOption) => {
    setLevels((prev) => [...prev, level]);
  };

  const deleteLevel = (levelId: JenjangPendidikan) => {
    setLevels((prev) => prev.filter((l) => l.id !== levelId));
  };

  const addMajor = (major: MajorOption) => {
    setMajors((prev) => [...prev, major]);
  };

  const updateMajor = (majorId: string, updates: Partial<MajorOption>) => {
    setMajors((prev) => prev.map((m) => (m.id === majorId ? { ...m, ...updates } : m)));
  };

  const deleteMajor = (majorId: string) => {
    setMajors((prev) => prev.filter((m) => m.id !== majorId));
  };

  const updateLandingContent = (updates: Partial<LandingContent>) => {
    setLandingContent((prev) => ({ ...prev, ...updates }));
  };

  const upsertFaq = (faq: FaqItem) => {
    setLandingContent((prev) => {
      const idx = prev.faqs.findIndex((f) => f.id === faq.id);
      const faqs = idx >= 0 ? prev.faqs.map((f) => (f.id === faq.id ? faq : f)) : [...prev.faqs, faq];
      return { ...prev, faqs };
    });
  };

  const deleteFaq = (faqId: string) => {
    setLandingContent((prev) => ({ ...prev, faqs: prev.faqs.filter((f) => f.id !== faqId) }));
  };

  const upsertNews = (news: NewsItem) => {
    setLandingContent((prev) => {
      const idx = prev.news.findIndex((n) => n.id === news.id);
      const list = idx >= 0 ? prev.news.map((n) => (n.id === news.id ? news : n)) : [{ ...news, id: news.id }, ...prev.news];
      return { ...prev, news: list };
    });
  };

  const deleteNews = (newsId: string) => {
    setLandingContent((prev) => ({ ...prev, news: prev.news.filter((n) => n.id !== newsId) }));
  };

  const upsertStat = (stat: KeyStatItem) => {
    setLandingContent((prev) => {
      const idx = prev.stats.findIndex((s) => s.id === stat.id);
      const stats = idx >= 0 ? prev.stats.map((s) => (s.id === stat.id ? stat : s)) : [...prev.stats, stat];
      return { ...prev, stats };
    });
  };

  const deleteStat = (statId: string) => {
    setLandingContent((prev) => ({ ...prev, stats: prev.stats.filter((s) => s.id !== statId) }));
  };

  const resetAllToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBranding(DEFAULT_BRANDING);
    setWaves(DEFAULT_WAVES);
    setDocRequirements(DEFAULT_DOC_REQUIREMENTS);
    setNoregConfig(DEFAULT_NOREG_CONFIG);
    setSantris(DEFAULT_SANTRIS);
    setEmbargoState(DEFAULT_EMBARGO_STATE);
    setLevels(DEFAULT_LEVELS);
    setMajors(DEFAULT_MAJORS);
    setLandingContent(DEFAULT_LANDING_CONTENT);
    setAdminUsers(DEFAULT_ADMIN_USERS);
    setCurrentSantriState(DEFAULT_SANTRIS[0]);
    setCurrentAdminState(null);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalApplicants = santris.length;
    const pendingDocs = santris.filter((s) => s.statusBerkas === 'MENUNGGU' || s.statusBerkas === 'REVISI').length;
    const draftPassed = santris.filter(
      (s) => s.statusKelulusan === 'DRAFT_LOLOS' || s.statusKelulusan === 'LOLOS'
    ).length;

    const totalQuota = waves.reduce((acc, w) => acc + w.quotaPutra + w.quotaPutri, 0);
    const quotaFilledPercent = totalQuota > 0 ? Math.round((draftPassed / totalQuota) * 100) : 68;

    return {
      totalApplicants,
      pendingDocs,
      draftPassed,
      totalQuota,
      quotaFilledPercent,
      todayNewCount: 38
    };
  }, [santris, waves]);

  return (
    <SPMBContext.Provider
      value={{
        branding,
        updateBranding,
        resetBranding,
        waves,
        updateWave,
        toggleWaveActive,
        docRequirements,
        updateDocRequirement,
        addDocRequirement,
        deleteDocRequirement,
        noregConfig,
        updateNoregConfig,
        santris,
        registerNewSantri,
        updateSantriStatus,
        uploadSantriDoc,
        verifySantriDoc,
        embargoState,
        setEmbargoActive,
        massPublishRelease,
        currentSantri,
        loginSantri,
        logoutSantri,
        setCurrentSantri,
        currentAdmin,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        updateAdminUser,
        addAdminUser,
        levels,
        updateLevel,
        addLevel,
        deleteLevel,
        majors,
        addMajor,
        updateMajor,
        deleteMajor,
        landingContent,
        updateLandingContent,
        upsertFaq,
        deleteFaq,
        upsertNews,
        deleteNews,
        upsertStat,
        deleteStat,
        metrics,
        resetAllToFactoryDefaults
      }}
    >
      {children}
    </SPMBContext.Provider>
  );
};

export const useSPMB = (): SPMBContextType => {
  const context = useContext(SPMBContext);
  if (!context) {
    throw new Error('useSPMB must be used within an SPMBProvider');
  }
  return context;
};
