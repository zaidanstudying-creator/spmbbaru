import React, { useState } from 'react';
import {
  useSPMB,
  SantriData,
  StatusBerkas,
  StatusKelulusan,
  JenjangPendidikan,
  formatDateIndo,
  formatCurrency,
  getStatusBerkasLabel
} from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';
import { DocumentModal } from './DocumentModal';

interface VerificationTabProps {
  searchQuery?: string;
}

export const VerificationTab: React.FC<VerificationTabProps> = ({ searchQuery = '' }) => {
  const { santris, updateSantriStatus, embargoState, levels } = useSPMB();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [selectedSantri, setSelectedSantri] = useState<SantriData | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  // Filter logic
  const filteredSantris = santris.filter((s) => {
    if (filterStatus !== 'ALL' && s.statusBerkas !== filterStatus) return false;
    if (filterLevel !== 'ALL' && s.level !== filterLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.fullName.toLowerCase().includes(q);
      const matchNoreg = s.noReg.toLowerCase().includes(q);
      const matchNisn = s.nisn.toLowerCase().includes(q);
      if (!matchName && !matchNoreg && !matchNisn) return false;
    }
    return true;
  });

  const handleOpenDocModal = (snt: SantriData) => {
    setSelectedSantri(snt);
    setShowDocModal(true);
  };

  const handleToggleKelulusan = (snt: SantriData, newStatus: StatusKelulusan) => {
    updateSantriStatus(snt.id, {
      statusKelulusan: newStatus
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Action Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Antrean Verifikasi Berkas & Sidang Yudisium
              </h2>
              <Badge variant="amber" size="sm">
                {santris.filter((s) => s.statusBerkas === 'MENUNGGU').length} Perlu Tindakan
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Periksa keabsahan dokumen persyaratan (Ijazah, KK, Akta, Rapor), berikan catatan revisi, dan tentukan draf status kelulusan peserta.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-semibold">Filter Status:</span>
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'MENUNGGU', label: 'Menunggu' },
              { id: 'TERVERIFIKASI', label: 'Terverifikasi' },
              { id: 'REVISI', label: 'Butuh Revisi' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === f.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Jenjang:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:border-emerald-700"
            >
              <option value="ALL">Semua Jenjang</option>
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Santri Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">No. Registrasi</th>
                <th className="py-3.5 px-4">Calon Santri</th>
                <th className="py-3.5 px-4">Jenjang & Jurusan</th>
                <th className="py-3.5 px-4">Status Berkas</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Draf Yudisium</th>
                <th className="py-3.5 px-4 text-center">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSantris.map((santri) => {
                const bStatus = getStatusBerkasLabel(santri.statusBerkas);
                const isPassed = santri.statusKelulusan === 'DRAFT_LOLOS' || santri.statusKelulusan === 'LOLOS';
                const isWaiting = santri.statusKelulusan === 'DRAFT_CADANGAN' || santri.statusKelulusan === 'CADANGAN';
                const isRejected = santri.statusKelulusan === 'DRAFT_TIDAK_LOLOS' || santri.statusKelulusan === 'TIDAK_LOLOS';

                return (
                  <tr key={santri.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-950 whitespace-nowrap">
                      {santri.noReg}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {formatDateIndo(santri.registrationDate)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={santri.photoUrl}
                          alt={santri.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">
                            {santri.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            NISN: {santri.nisn} &bull; Asal: {santri.prevSchool}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {levels.find((l) => l.id === santri.level)?.shortLabel || santri.level}
                        {santri.level === 'MA' ? ` (${santri.jurusan || 'MIPA'})` : ''}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {santri.gender === 'L' ? 'Santri Putra' : 'Santriwati Putri'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${bStatus.badgeClass}`}
                      >
                        <Icon name={bStatus.icon} size={13} />
                        {bStatus.label}
                      </span>
                      {Object.keys(santri.documents).length > 0 && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {Object.keys(santri.documents).length} berkas terunggah
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          santri.statusPembayaran === 'LUNAS'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        <Icon name={santri.statusPembayaran === 'LUNAS' ? 'verified' : 'pending'} size={14} />
                        {santri.statusPembayaran === 'LUNAS' ? 'BSI Lunas' : 'Menunggu VA'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <select
                          value={santri.statusKelulusan}
                          onChange={(e) =>
                            handleToggleKelulusan(santri, e.target.value as StatusKelulusan)
                          }
                          className={`text-xs px-2 py-1 rounded border font-semibold focus:outline-none ${
                            isPassed
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : isWaiting
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : isRejected
                              ? 'bg-rose-50 text-rose-900 border-rose-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="BELUM_DITENTUKAN">Belum Dinilai</option>
                          <option value="DRAFT_LOLOS">Draf Lolos</option>
                          <option value="DRAFT_CADANGAN">Draf Cadangan</option>
                          <option value="DRAFT_TIDAK_LOLOS">Tidak Lolos</option>
                          <option value="LOLOS">Resmi Lolos</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        iconLeft="folder_open"
                        onClick={() => handleOpenDocModal(santri)}
                      >
                        Periksa Berkas
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {filteredSantris.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data pendaftar yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Review Modal */}
      {showDocModal && selectedSantri && (
        <DocumentModal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          santri={selectedSantri}
        />
      )}
    </div>
  );
};
