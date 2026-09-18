import React, { useState } from 'react';
import {
  useSPMB,
  formatCurrency,
  formatDateIndo,
  getStatusBerkasLabel,
  getStatusPembayaranLabel
} from '@spmb/shared';
import { Button, Badge, Icon, Card, DocumentPreview } from '@spmb/ui';
import { StepperProgress } from '../components/StepperProgress';
import { DocumentUploadList } from '../components/DocumentUploadList';
import { ExamCardModal } from '../components/ExamCardModal';
import { KwitansiModal } from '../components/KwitansiModal';

interface StudentDashboardProps {
  onNavigate: (view: 'landing' | 'register' | 'check-status' | 'login' | 'dashboard') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const {
    branding,
    waves,
    currentSantri,
    santris,
    setCurrentSantri,
    embargoState,
    updateSantriStatus,
    levels,
    adminUsers
  } = useSPMB();

  const [showExamModal, setShowExamModal] = useState(false);
  const [showKwitansi, setShowKwitansi] = useState(false);
  const [proofError, setProofError] = useState('');
  const [proofOk, setProofOk] = useState('');

  // If no logged in student, fallback to first mock student
  const santri = currentSantri || santris[0];

  if (!santri) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="text-center p-8 space-y-4 max-w-md">
          <Icon name="person_off" size={36} className="text-slate-400 mx-auto" />
          <h2 className="font-serif text-xl font-bold">Belum Ada Sesi Santri</h2>
          <p className="text-xs text-slate-500">
            Silakan masuk dengan akun santri Anda terlebih dahulu.
          </p>
          <Button variant="primary" onClick={() => onNavigate('login')}>
            Ke Halaman Login
          </Button>
        </Card>
      </div>
    );
  }

  const currentWave = waves.find((w) => w.id === santri.waveId) || waves[0];
  const ketuaNama = adminUsers.find((u) => u.role === 'KETUA_PANITIA')?.name || 'Panitia SPMB';
  const berkasStatus = getStatusBerkasLabel(santri.statusBerkas);
  const paymentStatus = getStatusPembayaranLabel(santri.statusPembayaran);
  const isAllVerified = santri.statusBerkas === 'TERVERIFIKASI';

  // Calculate current stage (1-5)
  const calculateStage = () => {
    if (!embargoState.isEmbargoActive && santri.statusKelulusan !== 'BELUM_DITENTUKAN') return 5;
    if (santri.examCard?.isPublished && isAllVerified) return 4;
    if (santri.statusPembayaran === 'LUNAS') return 3;
    if (Object.keys(santri.documents).length > 0) return 2;
    return 1;
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofError('');
    setProofOk('');
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setProofError('Format harus JPG, PNG, WEBP, atau PDF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProofError('Ukuran file maksimal 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateSantriStatus(santri.id, {
        paymentProofUrl: String(reader.result || ''),
        statusPembayaran: 'MENUNGGU_KONFIRMASI'
      });
      setProofOk('Bukti transfer berhasil diunggah. Menunggu verifikasi panitia.');
    };
    reader.onerror = () => setProofError('Gagal membaca file. Coba lagi.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      {/* 1. Status Alert Top Banner */}
      <div
        className={`w-full text-white px-4 sm:px-6 lg:px-8 py-2.5 shadow-sm transition-colors ${
          isAllVerified ? 'bg-emerald-800' : 'bg-amber-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Icon
              name={isAllVerified ? 'task_alt' : 'hourglass_top'}
              size={20}
              filled
              className="text-amber-300 shrink-0"
            />
            <span className="text-xs sm:text-sm font-medium">
              Status Berkas: <strong>{berkasStatus.label}</strong>.{' '}
              {isAllVerified
                ? 'Kartu Tanda Peserta CBT telah diterbitkan dan sah untuk dicetak.'
                : 'Lengkapi berkas pendaftaran Anda untuk penerbitan Kartu CBT.'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-emerald-100">
              Jadwal Seleksi: {currentWave.testDate ? formatDateIndo(currentWave.testDate) : 'H-12 Hari'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. HEADER PROFIL SANTRI RESMI */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={santri.photoUrl}
                  alt={santri.fullName}
                  className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl object-cover shadow-md border-2 border-emerald-700"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-800 text-white rounded-full p-1 shadow">
                  <Icon name="verified" size={16} filled />
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {currentWave.name}
                  </span>
                  <span className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {(levels.find((l) => l.id === santri.level)?.label || santri.level)}
                    {santri.level === 'MA' ? ` (${santri.jurusan || 'MIPA'})` : ''}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {santri.fullName}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-emerald-800 font-mono">No. Reg: {santri.noReg}</span>
                  <span>&bull;</span>
                  <span className="font-mono">NISN: {santri.nisn}</span>
                  <span>&bull;</span>
                  <span>Asal: {santri.prevSchool}</span>
                </div>
              </div>
            </div>

            {/* Badges & Print Card Trigger */}
            <div className="flex flex-col items-stretch sm:items-end gap-3 w-full lg:w-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold border ${berkasStatus.badgeClass}`}>
                  <Icon name={berkasStatus.icon} size={14} />
                  {berkasStatus.label}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  <Icon name="payments" size={14} />
                  BSI {santri.statusPembayaran === 'LUNAS' ? 'Lunas' : 'Menunggu'} {formatCurrency(santri.nominalBayar)}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                iconLeft="print"
                onClick={() => setShowExamModal(true)}
                className="shadow-md hover:shadow-emerald-700/20"
              >
                Cetak Kartu Peserta Ujian (PDF)
              </Button>
            </div>
          </div>
        </div>

        {/* 3. STEPPER PROGRESS TAHAPAN PENDAFTARAN */}
        <StepperProgress currentStage={calculateStage()} />

        {/* 4. GRID 2 KOLOM: KIRI JADWAL CBT & PEMBAYARAN, KANAN BERKAS PERSYARATAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Info Ujian CBT & Virtual Account */}
          <div className="lg:col-span-5 space-y-6">
            {/* Kartu Jadwal Ujian CBT */}
            <Card className="p-6 space-y-5 border-emerald-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Icon name="devices" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      Jadwal Seleksi CBT & Wawancara
                    </h3>
                    <p className="text-[11px] text-slate-500">Informasi teknis pelaksanaan ujian</p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">
                  {santri.examCard?.nomorPeserta || 'CBT Ready'}
                </Badge>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Hari, Tanggal:</span>
                  <span className="font-bold text-slate-900">
                    {santri.examCard?.jadwalUjian
                      ? formatDateIndo(santri.examCard.jadwalUjian)
                      : 'Sabtu, 08 Maret 2025'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Sesi & Waktu:</span>
                  <span className="font-bold text-emerald-800">
                    {santri.examCard?.sesiUjian || 'Sesi 1 (08:00 - 11:30 WIB)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Ruang Ujian & Meja:</span>
                  <span className="font-bold text-slate-900">
                    {santri.examCard?.ruangCbt || 'Lab CBT 2'} (Meja {santri.examCard?.nomorMeja || 'M-24'})
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                  <span className="text-emerald-800 font-semibold">PIN CBT Ujian:</span>
                  <span className="font-mono text-lg font-bold text-emerald-950">
                    {santri.examCard?.pinCbt || '8421'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Materi yang Diujikan:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px]">
                  <li>Tes Potensi Akademik & Minat Bakat (CBT Komputer)</li>
                  <li>Tes Membaca Al-Qur'an, Tajwid, & Tahfidz</li>
                  <li>Wawancara Kepribadian Calon Santri & Komitmen Wali</li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                iconLeft="visibility"
                onClick={() => setShowExamModal(true)}
              >
                Pratinjau Kartu Peserta
              </Button>
            </Card>

            {/* Kartu Status Pembayaran BSI Virtual Account */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Icon name="account_balance" size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      Rincian Pembayaran BSI
                    </h3>
                    <p className="text-[11px] text-slate-500">Virtual Account SPMB Otomatis</p>
                  </div>
                </div>
                <Badge variant={santri.statusPembayaran === 'LUNAS' ? 'emerald' : 'amber'} size="sm">
                  {paymentStatus.label}
                </Badge>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Tujuan:</span>
                  <span className="font-semibold text-slate-800">{santri.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">No. Virtual Account:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {santri.virtualAccount}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Total Tagihan:</span>
                  <span className="font-serif font-bold text-emerald-900 text-base">
                    {formatCurrency(santri.nominalBayar)}
                  </span>
                </div>
              </div>

              {santri.statusPembayaran === 'LUNAS' ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <Icon name="verified" size={16} className="text-emerald-700" />
                    Pembayaran telah dikonfirmasi lunas oleh panitia.
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    iconLeft="receipt_long"
                    onClick={() => setShowKwitansi(true)}
                  >
                    Unduh Kwitansi Resmi Pesantren
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Unggah Bukti Transfer (JPG/PNG/PDF, maks 2MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleProofUpload}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                  />
                  {proofError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{proofError}</p>
                  )}
                  {proofOk && (
                    <p className="text-[11px] text-emerald-700 font-semibold">{proofOk}</p>
                  )}
                  {santri.paymentProofUrl && (
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-slate-600 mb-1.5">
                        Bukti terunggah:
                      </p>
                      <DocumentPreview
                        fileUrl={santri.paymentProofUrl}
                        fileName={`bukti-${santri.noReg}`}
                        docName="Bukti Transfer Biaya Pendaftaran"
                        docKey="bukti_pembayaran"
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Quick Demo Switcher */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2">
              <span className="font-semibold text-slate-600 block">
                🔄 Ganti Profil Demo Santri:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {santris.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSantri(s)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                      s.id === santri.id
                        ? 'bg-emerald-800 text-white border-emerald-900 font-bold'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {s.fullName.split(' ')[0]} ({s.noReg})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Dokumen Persyaratan & Verifikasi */}
          <div className="lg:col-span-7">
            <DocumentUploadList santri={santri} />
          </div>
        </div>
      </div>

      {/* Modal Kartu Peserta Ujian CBT */}
      {showExamModal && (
        <ExamCardModal
          isOpen={showExamModal}
          onClose={() => setShowExamModal(false)}
          santri={santri}
        />
      )}

      {/* Modal Kwitansi Resmi Pembayaran */}
      {showKwitansi && (
        <KwitansiModal
          santri={santri}
          currentWave={currentWave}
          branding={branding}
          ketuaNama={ketuaNama}
          onClose={() => setShowKwitansi(false)}
        />
      )}
    </div>
  );
};
