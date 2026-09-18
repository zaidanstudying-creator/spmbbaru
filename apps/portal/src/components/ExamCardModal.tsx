import React from 'react';
import { SantriData, useSPMB, formatDateIndo } from '@spmb/shared';
import { Modal, Button, Icon } from '@spmb/ui';

interface ExamCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  santri: SantriData;
}

export const ExamCardModal: React.FC<ExamCardModalProps> = ({ isOpen, onClose, santri }) => {
  const { branding, waves } = useSPMB();
  const currentWave = waves.find((w) => w.id === santri.waveId) || waves[0];
  const exam = santri.examCard;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" showCloseButton={true}>
      <div className="space-y-6">
        {/* Printable Card Area */}
        <div
          id="printable-exam-card"
          className="bg-white border-2 border-emerald-900 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg"
        >
          {/* Islamic Ornament Background Watermark */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <svg className="w-96 h-96 text-emerald-900" fill="currentColor" viewBox="0 0 100 100">
              <polygon points="50,0 62,38 100,50 62,62 50,100 38,62 0,50 38,38" />
            </svg>
          </div>

          {/* Card Top Header / Kop Surat */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-4 mb-6">
            <div className="flex items-center gap-4">
              {branding.logoUrl && (
                <img
                  src={branding.logoUrl}
                  alt={branding.pesantrenName}
                  className="h-16 w-auto object-contain"
                />
              )}
              <div>
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase block">
                  PANITIA PENERIMAAN SANTRI BARU (SPMB)
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950 leading-tight">
                  {branding.pesantrenName}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {branding.address} &bull; Telp: {branding.phone}
                </p>
                <p className="text-[11px] text-emerald-700 italic mt-0.5">
                  {branding.accreditation} &bull; {branding.legalPermitNumber}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-block px-3 py-1 rounded bg-emerald-900 text-white font-mono text-xs font-bold uppercase">
                TA {branding.academicYear}
              </span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg py-2.5 px-4 mb-6 text-center">
            <h3 className="font-serif text-lg font-bold text-emerald-900 uppercase tracking-wide">
              KARTU TANDA PESERTA UJIAN SELEKSI CBT & WAWANCARA
            </h3>
            <p className="text-xs text-emerald-700 font-medium">
              Jalur: {currentWave.name}
            </p>
          </div>

          {/* Main Grid: Left Candidate Bio, Right Official Photo & QR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Bio Details */}
            <div className="md:col-span-8 space-y-3">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium w-40">Nomor Registrasi</td>
                    <td className="py-1.5 font-mono font-bold text-emerald-900">{santri.noReg}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">Nomor Peserta CBT</td>
                    <td className="py-1.5 font-mono font-bold text-amber-900 bg-amber-50 px-2 rounded inline-block my-0.5">
                      {exam?.nomorPeserta || `CBT-${santri.level}-${santri.noReg.slice(-4)}`}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">Nama Lengkap</td>
                    <td className="py-1.5 font-bold text-slate-900 uppercase">{santri.fullName}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">NISN / NIK</td>
                    <td className="py-1.5 font-mono text-slate-700">{santri.nisn} / {santri.nik}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">Tempat, Tgl Lahir</td>
                    <td className="py-1.5 text-slate-700">{santri.birthPlace}, {formatDateIndo(santri.birthDate)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">Pilihan Jenjang</td>
                    <td className="py-1.5 font-semibold text-emerald-800">
                      {santri.level === 'MA' ? `Madrasah Aliyah (MA) - Jurusan ${santri.jurusan || 'MIPA'}` : 'Madrasah Tsanawiyah (MTs)'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-500 font-medium">Asal Sekolah</td>
                    <td className="py-1.5 text-slate-700">{santri.prevSchool}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-500 font-medium">Nama Orang Tua/Wali</td>
                    <td className="py-1.5 text-slate-700">{santri.parentName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Photo, Pin & QR Code */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="relative mb-3">
                <img
                  src={santri.photoUrl}
                  alt={santri.fullName}
                  className="w-28 h-36 object-cover rounded-lg border-2 border-emerald-800 shadow-sm"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                  SAH
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-inner w-full mb-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">PIN CBT Ujian</span>
                <span className="font-mono text-xl font-bold tracking-widest text-emerald-900">
                  {exam?.pinCbt || '8421'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                QR: {exam?.qrCodeString || `SPMB-${santri.noReg}-OK`}
              </div>
            </div>
          </div>

          {/* Exam Technical Info Box */}
          <div className="mt-6 bg-emerald-900 text-white rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-emerald-300 font-medium block">Hari & Tanggal Ujian</span>
              <span className="text-sm font-bold block mt-0.5">
                {exam?.jadwalUjian ? formatDateIndo(exam.jadwalUjian) : currentWave?.testDate ? formatDateIndo(currentWave.testDate) : 'Belum dijadwalkan'}
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-300 font-medium block">Sesi & Ruang CBT</span>
              <span className="text-sm font-bold block mt-0.5">
                {exam?.sesiUjian || 'Sesi 1 (08:00 - 11:30 WIB)'} &bull; {exam?.ruangCbt || 'Lab CBT 2'}
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-300 font-medium block">Nomor Meja</span>
              <span className="text-sm font-bold text-amber-300 block mt-0.5">
                Meja {exam?.nomorMeja || 'M-24'}
              </span>
            </div>
          </div>

          {/* Tata Tertib */}
          <div className="mt-6 border-t border-slate-200 pt-4 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Tata Tertib Peserta Ujian:</p>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Membawa cetak Kartu Tanda Peserta Ujian ini saat memasuki ruang CBT.</li>
              <li>Hadir di lokasi ujian 30 menit sebelum sesi dimulai dengan berpakaian muslim/muslimah rapi dan sopan.</li>
              <li>Wajib mengikuti seluruh tahapan tes: CBT Potensi Akademik, Tes Wawancara Tahfidz, dan Wawancara Orang Tua.</li>
            </ol>
          </div>

          {/* Signature & Stamp */}
          <div className="mt-6 flex justify-between items-end pt-4 border-t border-slate-200 text-xs text-slate-700">
            <div>
              <p>Divalidasi Panitia:</p>
              <p className="text-[10px] text-slate-500">Sistem SPMB Pesantren Core v2.5</p>
            </div>
            <div className="text-right">
              <p>Ketua Panitia SPMB,</p>
              <div className="h-10 flex items-center justify-end">
                <span className="text-emerald-700 font-serif italic text-sm font-bold">Ust. H. Abdullah M.</span>
              </div>
              <p className="font-bold underline">Ust. H. Abdullah M., M.Pd.I</p>
              <p className="text-[10px] text-slate-500">NIP. 198408152008011002</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={onClose}>
            Tutup Preview
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" iconLeft="download" onClick={handlePrint}>
              Unduh Dokumen
            </Button>
            <Button variant="primary" iconLeft="print" onClick={handlePrint}>
              Cetak Kartu Ujian (PDF)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
