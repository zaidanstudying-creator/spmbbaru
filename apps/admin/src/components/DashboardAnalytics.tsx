import React from 'react';
import { useSPMB } from '@spmb/shared';
import { Card, Icon } from '@spmb/ui';

interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

const PALETTE = [
  '#065f46',
  '#d97706',
  '#0284c7',
  '#be123c',
  '#7c3aed',
  '#15803d',
  '#a16207',
  '#0e7490'
];

const countBy = (list: unknown[], key: (x: any) => string) => {
  const out: Record<string, number> = {};
  list.forEach((x) => {
    const k = key(x);
    out[k] = (out[k] || 0) + 1;
  });
  return out;
};

const BarChart: React.FC<{ data: BarDatum[]; title: string; subtitle?: string; max?: number }> = ({
  data,
  title,
  subtitle,
  max
}) => {
  const top = max || Math.max(...data.map((d) => d.value), 1);
  return (
    <Card className="p-5 space-y-4">
      <div>
        <h4 className="font-serif font-bold text-sm text-slate-900">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-end gap-2 sm:gap-3 h-44">
        {data.map((d, i) => {
          const h = Math.max(4, Math.round((d.value / top) * 100));
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-600">{d.value}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, ${d.color || PALETTE[i % PALETTE.length]}, ${d.color || PALETTE[i % PALETTE.length]}cc)`,
                  minHeight: '6px'
                }}
              />
              <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const DonutChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  title: string;
  subtitle?: string;
  centerLabel: string;
  centerValue: number;
}> = ({ data, title, subtitle, centerLabel, centerValue }) => {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 42;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  const segs = data.map((d) => {
    const frac = d.value / total;
    const seg = { ...d, start: acc, end: acc + frac, frac };
    acc += frac;
    return seg;
  });

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h4 className="font-serif font-bold text-sm text-slate-900">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="12" className="stroke-slate-100" />
            {segs.map((s, i) =>
              s.value > 0 ? (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  strokeWidth="12"
                  stroke={s.color}
                  strokeDasharray={`${s.frac * circ} ${circ}`}
                  strokeDashoffset={-s.start * circ}
                />
              ) : null
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-xl font-bold text-slate-900">{centerValue}</span>
            <span className="text-[10px] text-slate-400 uppercase">{centerLabel}</span>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 gap-2 min-w-0">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 text-slate-600 font-medium truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                {d.label}
              </span>
              <span className="font-bold text-slate-900 shrink-0">
                {d.value}
                <span className="text-slate-400 font-normal"> ({Math.round((d.value / total) * 100)}%)</span>
              </span>
            </div>
          ))}
          {data.length === 0 && <span className="text-xs text-slate-400">Belum ada data.</span>}
        </div>
      </div>
    </Card>
  );
};

const StatRow: React.FC<{
  icon: string;
  label: string;
  total: number;
  items: { label: string; value: number; color: string }[];
}> = ({ icon, label, total, items }) => (
  <Card className="p-5 space-y-3">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
          <Icon name={icon} size={16} />
        </span>
        {label}
      </span>
      <span className="text-xs font-bold text-slate-400">{total} Santri</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 flex items-center justify-between"
        >
          <span className="text-[11px] text-slate-500 font-medium">{it.label}</span>
          <span className="text-sm font-bold" style={{ color: it.color }}>
            {it.value}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export const DashboardAnalytics: React.FC = () => {
  const { santris, waves, branding } = useSPMB();

  const waveData = waves.map((w) => {
    const count = santris.filter((s) => s.waveId === w.id).length;
    return { label: `Gel. ${w.waveNumber}`, value: count, color: PALETTE[(w.waveNumber - 1) % PALETTE.length] };
  });

  const monthly: BarDatum[] = (() => {
    const map: Record<string, number> = {};
    santris.forEach((s) => {
      const m = (s.registrationDate || '').slice(0, 7);
      if (m) map[m] = (map[m] || 0) + 1;
    });
    return Object.keys(map)
      .sort()
      .map((m) => {
        const [y, mo] = m.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return { label: months[parseInt(mo, 10) - 1], value: map[m], color: '#065f46' };
      });
  })();

  const gender = santris.filter((s) => s.gender === 'L').length;
  const genderData = [
    { label: 'Santri Putra', value: gender, color: '#0284c7' },
    { label: 'Santriwati Putri', value: santris.length - gender, color: '#be123c' }
  ];

  const levelCounts = countBy(santris, (s) => s.level);
  const jurusanCounts = countBy(santris.filter((s) => s.level === 'MA'), (s) => s.jurusan || 'UMUM');
  const JURUSAN_LABEL: Record<string, string> = {
    MIPA: 'MIPA',
    IPS: 'IPS',
    KEAGAMAAN: 'Keagamaan',
    UMUM: 'Umum'
  };

  const berkas = countBy(santris, (s) => s.statusBerkas);
  const payment = countBy(santris, (s) => s.statusPembayaran);
  const kelulusan = countBy(santris, (s) => s.statusKelulusan);
  const resmiLolos = (kelulusan['LOLOS'] || 0) + (kelulusan['DRAFT_LOLOS'] || 0);
  const cadangan = (kelulusan['CADANGAN'] || 0) + (kelulusan['DRAFT_CADANGAN'] || 0);
  const tidakLolos = (kelulusan['TIDAK_LOLOS'] || 0) + (kelulusan['DRAFT_TIDAK_LOLOS'] || 0);
  const belum = kelulusan['BELUM_DITENTUKAN'] || 0;

  return (
    <div className="space-y-4" id="dashboard-analytics">
      <div className="flex items-center gap-2">
        <h3 className="font-serif text-lg font-bold text-slate-900">
          Rekap & Analitik SPMB {branding.academicYear}
        </h3>
        <span className="text-[11px] text-slate-400">Dashboard ringkasan real-time seluruh pendaftar</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="Tren Pendaftar per Bulan"
          subtitle="Jumlah pendaftar baru per bulan (berdasarkan tanggal registrasi)"
          data={monthly}
        />
        <DonutChart
          title="Proporsi Jenis Kelamin"
          subtitle="Santri Putra vs Santriwati Putri"
          data={genderData}
          centerLabel="Total"
          centerValue={santris.length}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatRow
          icon="date_range"
          label="Per Gelombang"
          total={santris.length}
          items={waveData.map((d) => ({ label: d.label, value: d.value, color: d.color }))}
        />
        <StatRow
          icon="school"
          label="Jenjang & Jurusan"
          total={santris.length}
          items={[
            { label: 'MTS Unggulan', value: levelCounts['MTS'] || 0, color: '#0284c7' },
            { label: 'MA MIPA', value: jurusanCounts['MIPA'] || 0, color: '#065f46' },
            { label: 'MA IPS', value: jurusanCounts['IPS'] || 0, color: '#be123c' },
            { label: 'MA Keagamaan', value: jurusanCounts['KEAGAMAAN'] || 0, color: '#7c3aed' }
          ]}
        />
        <StatRow
          icon="fact_check"
          label="Status Berkas"
          total={santris.length}
          items={[
            { label: 'Menunggu', value: berkas['MENUNGGU'] || 0, color: '#d97706' },
            { label: 'Terverifikasi', value: berkas['TERVERIFIKASI'] || 0, color: '#065f46' },
            { label: 'Revisi', value: berkas['REVISI'] || 0, color: '#be123c' },
            { label: 'Ditolak', value: berkas['DITOLAK'] || 0, color: '#334155' }
          ]}
        />
        <StatRow
          icon="payments"
          label="Pembayaran & Kelulusan"
          total={santris.length}
          items={[
            { label: 'Lunas', value: payment['LUNAS'] || 0, color: '#065f46' },
            { label: 'Menunggu VA', value: (payment['BELUM_BAYAR'] || 0) + (payment['MENUNGGU_KONFIRMASI'] || 0) + (payment['KADALUARSA'] || 0), color: '#d97706' },
            { label: 'Lolos', value: resmiLolos, color: '#0284c7' },
            { label: 'Cadangan', value: cadangan, color: '#a16207' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="Distribusi Gelombang vs Daya Tampung"
          subtitle="Jumlah pendaftar per gelombang"
          data={waveData}
        />
        <Card className="p-5 space-y-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-slate-900">Rekap Evaluasi Yudisium</h4>
            <p className="text-[11px] text-slate-400">Hasil akhir penilaian (draf & resmi)</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Lulus / Diterima', value: resmiLolos, color: '#065f46' },
              { label: 'Cadangan (Waiting List)', value: cadangan, color: '#d97706' },
              { label: 'Tidak Lolos', value: tidakLolos, color: '#be123c' },
              { label: 'Belum Dinilai', value: belum, color: '#94a3b8' }
            ].map((it, i) => {
              const pct = Math.round((it.value / (santris.length || 1)) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{it.label}</span>
                    <span className="font-bold text-slate-900">
                      {it.value} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: it.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};