import React, { useState } from 'react';
import {
  useSPMB,
  SantriData,
  StatusPembayaran,
  formatCurrency,
  formatDateIndo,
  getStatusPembayaranLabel,
  buildWaSantriNotifMessage,
  formatWaSantriNotifLink
} from '@spmb/shared';
import { Badge, Icon, Button, Modal, DocumentPreview } from '@spmb/ui';

interface PaymentsTabProps {
  searchQuery?: string;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ searchQuery = '' }) => {
  const { santris, updateSantriStatus, levels, branding } = useSPMB();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [proofSantri, setProofSantri] = useState<SantriData | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const openProofModal = (snt: SantriData) => {
    setRejectReason('');
    setProofSantri(snt);
  };

  const filtered = santris.filter((s) => {
    if (filterStatus !== 'ALL' && s.statusPembayaran !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !s.fullName.toLowerCase().includes(q) &&
        !s.noReg.toLowerCase().includes(q) &&
        !s.virtualAccount.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const countByStatus = (st: StatusPembayaran) =>
    santris.filter((s) => s.statusPembayaran === st).length;

  const confirmPaid = (snt: SantriData) => {
    updateSantriStatus(snt.id, {
      statusPembayaran: 'LUNAS',
      paidAt: new Date().toISOString().split('T')[0]
    });
  };

  const rejectProof = (snt: SantriData) => {
    updateSantriStatus(snt.id, {
      statusPembayaran: 'DITOLAK',
      catatanPanitia:
        rejectReason.trim() || 'Bukti transfer tidak sesuai. Silakan unggah ulang bukti transfer yang benar.'
    });
    setProofSantri(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Rekonsiliasi Pembayaran Uang Pendaftaran
              </h2>
              <Badge variant="amber" size="sm">
                {(santris.length - countByStatus('LUNAS')).toLocaleString('id-ID')} Belum Lunas
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pantau Virtual Account BSI, konfirmasi pembayaran santri, dan lacak tunggakan biaya pendaftaran.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-semibold">Filter Status:</span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'LUNAS', label: `Lunas (${countByStatus('LUNAS')})` },
            { id: 'MENUNGGU_KONFIRMASI', label: `Menunggu Konfirmasi (${countByStatus('MENUNGGU_KONFIRMASI')})` },
            { id: 'BELUM_BAYAR', label: `Belum Bayar (${countByStatus('BELUM_BAYAR')})` },
            { id: 'DITOLAK', label: `Bukti Ditolak (${countByStatus('DITOLAK')})` }
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
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">No. Registrasi</th>
                <th className="py-3.5 px-4">Calon Santri</th>
                <th className="py-3.5 px-4">Jenjang</th>
                <th className="py-3.5 px-4">Virtual Account</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const pStatus = getStatusPembayaranLabel(s.statusPembayaran);
                const isLunas = s.statusPembayaran === 'LUNAS';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-950 whitespace-nowrap">
                      {s.noReg}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {formatDateIndo(s.registrationDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.photoUrl}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{s.fullName}</span>
                          <span className="text-[11px] text-slate-500">NISN: {s.nisn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                      {levels.find((l) => l.id === s.level)?.shortLabel || s.level}
                      {s.level === 'MA' ? ` (${s.jurusan || 'MIPA'})` : ''}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-mono text-[11px] font-semibold">{s.virtualAccount}</span>
                      <span className="text-[10px] text-slate-400 block">{s.bankName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(s.nominalBayar)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${pStatus.badgeClass}`}>
                        <Icon name={isLunas ? 'verified' : 'pending'} size={13} />
                        {pStatus.label}
                      </span>
                      {s.paidAt && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">Lunas sejak {formatDateIndo(s.paidAt)}</span>
                      )}
                      {s.paymentProofUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 mt-0.5">
                          <Icon name="attach_file" size={12} /> Bukti transfer terunggah
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isLunas ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                          <Icon name="verified" size={13} /> Lunas
                        </span>
                      ) : s.paymentProofUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft="visibility"
                          onClick={() => openProofModal(s)}
                        >
                          Cek Bukti & Verifikasi
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          Menunggu bukti transfer dari santri
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada tagihan yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!proofSantri}
        onClose={() => setProofSantri(null)}
        title="Bukti Transfer Pembayaran"
        subtitle={proofSantri ? `${proofSantri.fullName} • ${proofSantri.noReg} • ${proofSantri.virtualAccount}` : undefined}
        maxWidth="2xl"
      >
        {proofSantri && (
          <div className="space-y-4">
            {proofSantri.statusPembayaran === 'DITOLAK' && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                <div className="flex items-start gap-2">
                  <Icon name="report_problem" size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong>Bukti ini sebelumnya ditolak.</strong>{' '}
                    {proofSantri.catatanPanitia
                      ? `Alasan: ${proofSantri.catatanPanitia}`
                      : 'Tunggu punggung ulang bukti oleh santri.'}
                  </div>
                </div>
              </div>
            )}
            <DocumentPreview
              fileUrl={proofSantri.paymentProofUrl || ''}
              fileName={`bukti-${proofSantri.noReg}.jpg`}
              docName="Bukti Transfer Biaya Pendaftaran"
              docKey="bukti_pembayaran"
              uploadDate={proofSantri.paidAt}
            />
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <div className="flex items-start gap-2">
                <Icon name="fact_check" size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Cek ulang sebelum ACC:</strong> pastikan bukti atas nama calon santri yang
                  bersangkutan, nominal sesuai tagihan, Virtual Account tujuan cocok, dan tanggal
                  transfer valid. Baru kemudian konfirmasi lunas.
                </div>
              </div>
            </div>
            {proofSantri.statusPembayaran !== 'LUNAS' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Alasan minta unggah ulang (opsional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  placeholder="cth: nominal transfer tidak sesuai, bukti buram, nama pengirim tidak cocok..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600">
                Nominal tagihan:{' '}
                <strong className="text-slate-900">{formatCurrency(proofSantri.nominalBayar)}</strong>
              </span>
          {proofSantri.statusPembayaran !== 'LUNAS' && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    iconLeft="refresh"
                    onClick={() => rejectProof(proofSantri)}
                  >
                    Minta Upload Ulang
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft="verified"
                    onClick={() => {
                      confirmPaid(proofSantri);
                      setProofSantri(null);
                    }}
                  >
                    ACC, Konfirmasi Lunas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconRight="arrow_forward"
                    onClick={() => {
                      const link = formatWaSantriNotifLink(
                        'PEMBAYARAN_LUNAS',
                        proofSantri.parentPhone,
                        buildWaSantriNotifMessage('PEMBAYARAN_LUNAS', proofSantri, {
                          pesantrenName: branding.pesantrenName,
                          academicYear: branding.academicYear
                        })
                      );
                      window.open(link, '_blank');
                    }}
                  >
                    Notif WA Lunas ke Wali
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconRight="arrow_forward"
                    onClick={() => {
                      const link = formatWaSantriNotifLink(
                        'PEMBAYARAN_DITOLAK',
                        proofSantri.parentPhone,
                        buildWaSantriNotifMessage('PEMBAYARAN_DITOLAK', proofSantri, {
                          pesantrenName: branding.pesantrenName,
                          academicYear: branding.academicYear
                        })
                      );
                      window.open(link, '_blank');
                    }}
                  >
                    Notif WA Ditolak
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};