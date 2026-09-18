import React, { useState } from 'react';
import {
  useSPMB,
  SantriData,
  StatusPembayaran,
  formatCurrency,
  formatDateIndo,
  getStatusPembayaranLabel
} from '@spmb/shared';
import { Badge, Icon, Button } from '@spmb/ui';

interface PaymentsTabProps {
  searchQuery?: string;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ searchQuery = '' }) => {
  const { santris, updateSantriStatus } = useSPMB();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
            { id: 'BELUM_BAYAR', label: `Belum Bayar (${countByStatus('BELUM_BAYAR')})` }
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
                      {s.level === 'MA' ? `MA (${s.jurusan || 'MIPA'})` : 'MTs Unggulan'}
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
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isLunas ? (
                        <span className="text-[11px] text-slate-400 italic">Sudah dikonfirmasi</span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          iconLeft="verified"
                          onClick={() => confirmPaid(s)}
                        >
                          Konfirmasi Lunas
                        </Button>
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
    </div>
  );
};