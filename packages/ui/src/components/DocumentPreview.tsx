import React from 'react';
import { Icon } from './Icon';

export interface DocumentPreviewProps {
  fileUrl: string;
  fileName: string;
  docName: string;
  docKey: string;
  uploadDate?: string;
}

const DOC_PREVIEW_META: Record<string, { title: string; accent: string; ink: string }> = {
  ijazah: { title: 'IJAZAH / SKL', accent: '#065f46', ink: '#0f172a' },
  kartu_keluarga: { title: 'KARTU KELUARGA', accent: '#0e7490', ink: '#0f172a' },
  akta_kelahiran: { title: 'AKTA KELAHIRAN', accent: '#7c3aed', ink: '#3b0764' },
  rapor: { title: 'RAPOR / HASIL BELAJAR', accent: '#b45309', ink: '#0f172a' },
  pasfoto: { title: 'PASFOTO 3x4', accent: '#be123c', ink: '#881337' },
  skkb: { title: 'SKKB / SKCK', accent: '#15803d', ink: '#14532d' },
  surat_kesehatan: { title: 'SURAT KETERANGAN SEHAT', accent: '#0369a1', ink: '#0c4a6e' },
  sertifikat_prestasi: { title: 'SERTIFIKAT PRESTASI', accent: '#a16207', ink: '#713f12' }
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileUrl,
  fileName,
  docName,
  docKey,
  uploadDate
}) => {
  const lowerUrl = (fileUrl || '').toLowerCase();
  const isImage = lowerUrl.startsWith('data:image') || /\.(jpe?g|png|gif|webp|bmp)$/.test(lowerUrl);
  const isPdf = lowerUrl.startsWith('data:application/pdf') || lowerUrl.endsWith('.pdf');
  const isReal = !!fileUrl && fileUrl !== '#' && fileUrl.trim().length > 0;

  if (isReal && (isImage || isPdf)) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[420px] min-h-[220px]">
          {isImage ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-[420px] object-contain"
            />
          ) : (
            <iframe
              src={fileUrl}
              title={fileName}
              className="w-full h-[420px] bg-white"
            />
          )}
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900"
        >
          <Icon name="open_in_new" size={15} />
          Buka di tab baru
        </a>
      </div>
    );
  }

  if (isReal) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 flex flex-col items-center text-center gap-2">
          <Icon name="insert_drive_file" size={40} className="text-slate-400" />
          <p className="text-xs text-slate-500 max-w-xs break-all">{fileName}</p>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900"
        >
          <Icon name="open_in_new" size={15} />
          Buka berkas asli
        </a>
      </div>
    );
  }

  const meta = DOC_PREVIEW_META[docKey] || { title: 'DOKUMEN RESMI', accent: '#334155', ink: '#0f172a' };

  return (
    <div className="space-y-3">
      <div className="relative rounded-lg border border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 p-8 max-w-md mx-auto shadow-sm select-none"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-serif font-black tracking-widest opacity-[0.07] rotate-[-18deg] whitespace-nowrap"
          style={{ color: meta.accent }}
        >
          CONTOH SAMPEL
        </span>

        <div className="text-center space-y-1 border-b-2 pb-3"
          style={{ borderColor: meta.accent }}>
          <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundColor: meta.accent }}>
            AH
          </div>
          <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-slate-500">
            Pesantren Modern Al-Hikmah
          </p>
          <p className="text-xl font-bold tracking-wide" style={{ color: meta.accent }}>
            {meta.title}
          </p>
          <p className="text-[10px] font-sans italic text-slate-400">
            {docName}
          </p>
        </div>

        <div className="mt-4 space-y-2.5 font-sans">
          {[72, 88, 56, 80, 64].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: `${meta.ink}22` }} />
          ))}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="h-12 rounded border border-slate-300 bg-white/60" />
            <div className="h-12 rounded border border-slate-300 bg-white/60" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t pt-2.5 font-sans">
          <div className="h-2.5 rounded-full" style={{ width: '28%', backgroundColor: `${meta.ink}22` }} />
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Icon name="lock" size={11} />
            Berkas demo &mdash; file belum diunggah
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        {uploadDate ? `Diunggah: ${uploadDate}` : 'Contoh pratampilan (demo)'} &mdash; untuk melihat berkas asli, upload file PDF/JPG/PNG dari portal.
      </p>
    </div>
  );
};