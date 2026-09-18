import React from 'react';
import { Modal, Icon, Button } from '@spmb/ui';
import {
  SantriData,
  WaveConfig,
  BrandingSettings,
  formatCurrency,
  formatDateIndo
} from '@spmb/shared';

interface KwitansiModalProps {
  santri: SantriData;
  currentWave?: WaveConfig;
  branding: BrandingSettings;
  ketuaNama: string;
  onClose: () => void;
}

const SATUAN = ['', ' SATU', ' DUA', ' TIGA', ' EMPAT', ' LIMA', ' ENAM', ' TUJUH', ' DELAPAN', ' SEMBILAN'];
const BELAS = [' SEPULUH', ' SEBELAS', ' DUA BELAS', ' TIGA BELAS', ' EMPAT BELAS', ' LIMA BELAS', ' ENAM BELAS', ' TUJUH BELAS', ' DELAPAN BELAS', ' SEMBILAN BELAS'];

function samAtta(n: number): string {
  const abs = Math.abs(Math.trunc(n));
  if (abs === 0) return 'NOL';
  let out = '';
  let num = abs;
  const chunk = (v: number): string => {
    let res = '';
    const ratus = Math.floor(v / 100);
    const sisa = v % 100;
    if (ratus === 1) res += ' SERATUS';
    else if (ratus > 1) res += SATUAN[ratus] + ' RATUS';
    if (sisa >= 10 && sisa < 20) res += BELAS[sisa - 10];
    else {
      if (sisa > 0) {
        const puluh = Math.floor(sisa / 10);
        const sat = sisa % 10;
        if (puluh === 1) res += ' SEPULUH';
        else if (puluh > 1) res += SATUAN[puluh] + ' PULUH';
        if (sat > 0) res += SATUAN[sat];
      }
    }
    return res;
  };
  if (num >= 1e12) {
    const m = Math.floor(num / 1e12);
    out += chunk(m) + ' TRILIUN';
    num -= m * 1e12;
  }
  if (num >= 1e9) {
    const m = Math.floor(num / 1e9);
    out += chunk(m) + ' MILYAR';
    num -= m * 1e9;
  }
  if (num >= 1e6) {
    const m = Math.floor(num / 1e6);
    out += chunk(m) + ' JUTA';
    num -= m * 1e6;
  }
  if (num >= 1000) {
    const r = Math.floor(num / 1000);
    if (r === 1) out += ' SERIBU';
    else out += chunk(r) + ' RIBU';
    num -= r * 1000;
  }
  if (num > 0) out += chunk(num);
  return out.trim();
}

export const KwitansiModal: React.FC<KwitansiModalProps> = ({
  santri,
  currentWave,
  branding,
  ketuaNama,
  onClose
}) => {
  const wavesName = currentWave?.name || 'Gelombang Pendaftaran';
  const nominal = santri.nominalBayar || currentWave?.registrationFee || 0;
  const bayar =
    santri.paidAt || new Date().toISOString().split('T')[0];

  const receiptHtml = () => `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Kwitansi ${santri.noReg}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Times New Roman', Georgia, serif; color: #0f172a; background: #fff; padding: 32px; }
      .sheet { max-width: 760px; margin: 0 auto; border: 2px solid #065f46; border-radius: 12px; overflow: hidden; }
      .head { background: #065f46; color: #fff; text-align: center; padding: 22px; }
      .head h1 { font-size: 20px; letter-spacing: 2px; text-transform: uppercase; }
      .head p { font-size: 11px; color: #d1fae5; margin-top: 4px; }
      .badge { display: inline-block; margin-top: 8px; background: #f59e0b; color: #451a03; font-weight: 700; font-size: 10px; letter-spacing: 2px; padding: 4px 14px; border-radius: 999px; }
      .body { padding: 28px; }
      .title { text-align: center; margin-bottom: 20px; }
      .title h2 { font-size: 22px; letter-spacing: 3px; }
      .title .no { font-size: 12px; margin-top: 4px; }
      table.meta { width: 100%; border-collapse: collapse; margin-top: 8px; }
      table.meta td { padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; }
      table.meta td:first-child { color: #475569; width: 42%; }
      table.meta td:last-child { font-weight: 700; }
      .amount { background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 10px; padding: 14px 16px; margin-top: 16px; }
      .amount .val { font-size: 22px; font-weight: 700; color: #065f46; }
      .amount .txt { font-size: 12px; color: #334155; margin-top: 4px; }
      .signed { display: flex; justify-content: flex-end; margin-top: 36px; }
      .signed .sq { text-align: center; font-size: 12px; }
      .signed .sq .line { margin-top: 44px; border-top: 1px solid #334155; }
      .footer { border-top: 1px dashed #cbd5e1; margin-top: 26px; padding-top: 10px; font-size: 10px; color: #64748b; text-align: center; }
      .stamp { display: inline-block; border: 2px solid #065f46; color: #065f46; border-radius: 50%; width: 88px; height: 88px; line-height: 88px; font-weight: 700; font-size: 11px; transform: rotate(-12deg); margin-left: 14px; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="head">
        <h1>${branding.pesantrenName}</h1>
        <p>${branding.address || 'Pesantren Modern Islam Terpadu'}</p>
        <span class="badge">Kwitansi Resmi &bull; TAHUN AJARAN ${branding.academicYear}</span>
      </div>
      <div class="body">
        <div class="title">
          <h2>KWITANSI PEMBAYARAN</h2>
          <p class="no">No. Kwitansi: KWT/${santri.noReg.replace(/\//g, '')}/${branding.academicYear}</p>
        </div>
        <table class="meta">
          <tr><td>No. Registrasi Santri</td><td>${santri.noReg}</td></tr>
          <tr><td>Nama Calon Santri</td><td>${santri.fullName}</td></tr>
          <tr><td>NISN</td><td>${santri.nisn || '-'}</td></tr>
          <tr><td>Pilihan Jenjang</td><td>${santri.level}${santri.jurusan ? ` - ${santri.jurusan}` : ''}</td></tr>
          <tr><td>Gelombang / Periode</td><td>${wavesName}</td></tr>
          <tr><td>Bank Tujuan</td><td>${santri.bankName} (${santri.virtualAccount})</td></tr>
          <tr><td>Sumber Pembayaran</td><td>Virtual Account Bank ${santri.bankName}</td></tr>
          <tr><td>Tanggal Pembayaran</td><td>${formatDateIndo(bayar)}</td></tr>
          <tr><td>Status</td><td>LUNAS - TERVERIFIKASI PANITIA</td></tr>
        </table>
        <div class="amount">
          <div class="val">${formatCurrency(nominal)}</div>
          <div class="txt">Terbilang: ${samAtta(nominal).toLowerCase()}</div>
        </div>
        <div class="signed">
          <div class="sq">
            <div>Tangerang, ${formatDateIndo(bayar)}</div>
            <div>Pejabat Berwenang,</div>
            <div class="line">${ketuaNama || 'Panitia SPMB'}</div>
            <div>Ketua / Bendahara Panitia PSB</div>
          </div>
          <span class="stamp">LUNAS</span>
        </div>
        <div class="footer">
          Kwitansi ini diterbitkan otomatis oleh sistem SPMB ${branding.pesantrenName} dan sah tanpa tanda tangan basah.
        </div>
      </div>
    </div>
  </body>
  </html>`;

  const downloadReceipt = () => {
    const blob = new Blob([receiptHtml()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kwitansi_${santri.noReg.replace(/\//g, '-')}-${branding.pesantrenName.split(' ')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const printReceipt = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(receiptHtml());
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Kwitansi Resmi Pembayaran"
      subtitle={`${santri.fullName} • ${santri.noReg}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Preview kwitansi */}
        <div className="border-2 border-emerald-900 rounded-xl overflow-hidden">
          <div className="bg-emerald-900 text-white text-center py-4 px-4">
            <div className="flex items-center justify-center gap-2">
              {branding.logoUrl && (
                <img src={branding.logoUrl} alt="logo" className="h-7 w-auto object-contain brightness-125" />
              )}
              <h3 className="font-serif text-base font-bold tracking-widest uppercase">
                {branding.pesantrenName}
              </h3>
            </div>
            <p className="text-[11px] text-emerald-200 mt-0.5">{branding.address || 'Lembaga Pendidikan Islam'}</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold tracking-widest bg-amber-500 text-amber-950 px-3 py-0.5 rounded-full">
              KWITANSI RESMI • TA {branding.academicYear}
            </span>
          </div>
          <div className="p-6 space-y-3">
            <div className="text-center">
              <h4 className="font-serif text-xl font-bold tracking-[0.2em]">KWITANSI PEMBAYARAN</h4>
              <p className="text-[11px] text-slate-500">No. KWT/{santri.noReg.replace(/\//g, '')}/{branding.academicYear}</p>
            </div>
            <div className="text-xs divide-y divide-dashed divide-slate-200 border-b border-slate-200">
              {[
                ['No. Registrasi Santri', santri.noReg],
                ['Nama Calon Santri', santri.fullName],
                ['NISN', santri.nisn || '-'],
                ['Pilihan Jenjang', `${santri.level}${santri.jurusan ? ` - ${santri.jurusan}` : ''}`],
                ['Gelombang / Periode', wavesName],
                ['Bank Tujuan', `${santri.bankName} (${santri.virtualAccount})`],
                ['Tanggal Pembayaran', formatDateIndo(bayar)],
                ['Status', 'LUNAS - TERVERIFIKASI PANITIA']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-bold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <span className="font-serif text-lg font-bold text-emerald-900">
                {formatCurrency(nominal)}
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Terbilang: {samAtta(nominal).toLowerCase()} rupiah
              </p>
            </div>
            <div className="flex justify-end items-end gap-3 pt-2">
              <div className="text-center text-[11px]">
                <p>{branding.address ? 'Tangerang,' : ''} {formatDateIndo(bayar)}</p>
                <p className="mt-5">( {ketuaNama || 'Panitia SPMB'} )</p>
                <p className="text-slate-500">Ketua / Bendahara Panitia PSB</p>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-emerald-900 text-emerald-900 flex items-center justify-center text-[10px] font-bold -rotate-12">
                LUNAS
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
              Kwitansi ini diterbitkan otomatis oleh sistem SPMB {branding.pesantrenName} dan sah tanpa tanda tangan basah.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" className="flex-1" iconLeft="download" onClick={downloadReceipt}>
            Unduh Kwitansi (.html)
          </Button>
          <Button variant="secondary" className="flex-1" iconLeft="print" onClick={printReceipt}>
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};