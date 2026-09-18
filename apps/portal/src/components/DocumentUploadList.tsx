import React, { useRef, useState } from 'react';
import { SantriData, useSPMB } from '@spmb/shared';
import { Badge, Button, Icon, DocumentPreview } from '@spmb/ui';

interface DocumentUploadListProps {
  santri: SantriData;
}

export const DocumentUploadList: React.FC<DocumentUploadListProps> = ({ santri }) => {
  const { docRequirements, uploadSantriDoc } = useSPMB();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePickFile = (docKey: string) => {
    setPendingKey(docKey);
    setErrorMsg('');
    requestAnimationFrame(() => fileInputRef.current?.click());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const doc = docRequirements.find((d) => d.key === pendingKey);
    e.target.value = '';
    if (!file || !doc || !pendingKey) return;

    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    if (!doc.allowedFormats.includes(ext)) {
      setErrorMsg(`Format ${ext} tidak diizinkan untuk ${doc.name}. Gunakan: ${doc.allowedFormats.join(', ')}`);
      setPendingKey(null);
      return;
    }
    if (file.size > doc.maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Ukuran ${file.name} melebihi ${doc.maxSizeMB}MB. Perkecil dahulu lalu ulangi.`);
      setPendingKey(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadSantriDoc(santri.id, pendingKey, {
        docKey: pendingKey,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: String(reader.result || ''),
        status: 'PENDING'
      });
      setPendingKey(null);
      setPreviewKey(pendingKey);
      setErrorMsg('');
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file. Coba file lain.');
      setPendingKey(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Dokumen & Berkas Persyaratan Masuk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah berkas sesuai format (PDF/JPG/PNG). Status verifikasi akan diperiksa oleh Panitia SPMB.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" icon="check_circle">
            {Object.keys(santri.documents).length} dari {docRequirements.length} Berkas Diunggah
          </Badge>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <Icon name="info" size={16} className="shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docRequirements.map((doc) => {
          const uploaded = santri.documents[doc.key];
          const isUploaded = !!uploaded;
          const isRevising = uploaded?.status === 'REJECTED';
          const isValid = uploaded?.status === 'VALID';
          const isPending = uploaded?.status === 'PENDING';
          const isPreviewing = previewKey === doc.key;

          return (
            <div
              key={doc.id}
              className={`p-4 rounded-xl border transition-all ${
                isRevising
                  ? 'border-rose-300 bg-rose-50/40'
                  : isValid
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : isPending
                  ? 'border-blue-200 bg-blue-50/30'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isValid
                        ? 'bg-emerald-100 text-emerald-700'
                        : isRevising
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon name={isValid ? 'task_alt' : isRevising ? 'report_problem' : 'description'} size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      {doc.name}
                      {doc.isRequired && (
                        <span className="text-rose-500 text-xs" title="Wajib">*</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500">{doc.description}</p>
                  </div>
                </div>

                {isValid && <Badge variant="emerald" size="sm">Valid</Badge>}
                {isRevising && <Badge variant="rose" size="sm">Revisi</Badge>}
                {isPending && <Badge variant="sky" size="sm">Diperiksa</Badge>}
                {!isUploaded && <Badge variant="neutral" size="sm">Belum Upload</Badge>}
              </div>

              {isUploaded && (
                <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Icon name="attach_file" size={16} className="text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700 truncate">{uploaded.fileName}</span>
                    <span className="text-slate-400">({uploaded.fileSize})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{uploaded.uploadDate}</span>
                </div>
              )}

              {isRevising && uploaded.rejectionNote && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-100 border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
                  <Icon name="info" size={16} className="shrink-0 text-rose-600 mt-0.5" />
                  <span><strong>Catatan Panitia:</strong> {uploaded.rejectionNote}</span>
                </div>
              )}

              {isPreviewing && isUploaded && (
                <div className="mt-3 rounded-lg bg-slate-50/70 border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pratinjau
                    </span>
                    <button
                      onClick={() => setPreviewKey(null)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Tutup
                    </button>
                  </div>
                  <DocumentPreview
                    fileUrl={uploaded.fileUrl}
                    fileName={uploaded.fileName}
                    docName={doc.name}
                    docKey={doc.key}
                    uploadDate={uploaded.uploadDate}
                  />
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Format: {doc.allowedFormats.join(', ')} (Maks {doc.maxSizeMB}MB)
                </span>

                <div className="flex items-center gap-1.5">
                  {isUploaded && (
                    <button
                      onClick={() => setPreviewKey(isPreviewing ? null : doc.key)}
                      className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
                    >
                      <Icon name="visibility" size={14} />
                      {isPreviewing ? 'Sembunyikan' : 'Lihat'}
                    </button>
                  )}
                  <Button
                    variant={isRevising ? 'danger' : isUploaded ? 'outline' : 'secondary'}
                    size="sm"
                    iconLeft={isUploaded ? 'refresh' : 'upload_file'}
                    onClick={() => handlePickFile(doc.key)}
                  >
                    {isRevising ? 'Upload Ulang' : isUploaded ? 'Ganti Berkas' : 'Unggah'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};