import React, { useState } from 'react';
import { SantriData, useSPMB, getStatusBerkasLabel } from '@spmb/shared';
import { Modal, Button, Badge, Icon, DocumentPreview } from '@spmb/ui';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  santri: SantriData;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, santri }) => {
  const { docRequirements, updateSantriStatus, verifySantriDoc, customFormFields } = useSPMB();
  const [rejectNote, setRejectNote] = useState('');
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);
  const [previewDocKey, setPreviewDocKey] = useState<string | null>(null);

  const berkasStatus = getStatusBerkasLabel(santri.statusBerkas);

  const handleApproveAll = () => {
    // Mark all uploaded docs as valid
    Object.keys(santri.documents).forEach((key) => {
      verifySantriDoc(santri.id, key, 'VALID');
    });
    updateSantriStatus(santri.id, {
      statusBerkas: 'TERVERIFIKASI',
      catatanPanitia: 'Berkas lengkap dan telah diverifikasi sah oleh Panitia SPMB.'
    });
    onClose();
  };

  const handleRejectWithNote = (docKey: string) => {
    if (!rejectNote.trim()) return;
    verifySantriDoc(santri.id, docKey, 'REJECTED', rejectNote.trim());
    updateSantriStatus(santri.id, {
      statusBerkas: 'REVISI',
      catatanPanitia: `Revisi berkas ${docKey}: ${rejectNote.trim()}`
    });
    setActiveDocKey(null);
    setRejectNote('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" title="Verifikasi & Pratinjau Berkas Calon Santri">
      <div className="space-y-6">
        {/* Santri Header in Modal */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={santri.photoUrl}
              alt={santri.fullName}
              className="w-12 h-14 object-cover rounded-lg border border-slate-300"
            />
            <div>
              <span className="font-mono text-xs font-bold text-emerald-800 block">
                {santri.noReg} &bull; NISN: {santri.nisn}
              </span>
              <h4 className="font-serif font-bold text-base text-slate-900">{santri.fullName}</h4>
              <p className="text-xs text-slate-500">
                Jenjang: {santri.level} {santri.jurusan ? `(${santri.jurusan})` : ''} &bull; Asal: {santri.prevSchool}
              </p>
            </div>
          </div>

          <Badge variant={santri.statusBerkas === 'TERVERIFIKASI' ? 'emerald' : 'amber'}>
            {berkasStatus.label}
          </Badge>
        </div>

        {/* Answers of Custom Form Fields */}
        {customFormFields.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-slate-800">
                Jawaban Formulir Tambahan ({Object.keys(santri.extraFields || {}).filter((k) => (santri.extraFields || {})[k]).length} Terisi)
              </h4>
              <Badge variant="sky" size="sm">
                {customFormFields.length} Field Terdaftar
              </Badge>
            </div>

            {customFormFields.length === 0 ? (
              <p className="text-xs text-slate-400">Tidak ada field formulir tambahan terdaftar.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {customFormFields.map((f) => {
                  const answer = (santri.extraFields || {})[f.key] || '';
                  const filled = answer.trim().length > 0;
                  return (
                    <div key={f.id} className="bg-white rounded-lg border border-slate-200 p-2.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {f.label}
                        {f.isRequired ? '' : ' (opsional)'}
                      </span>
                      {filled ? (
                        f.type === 'select' ? (
                          <span className="inline-flex mt-1 text-xs font-bold text-violet-800 bg-violet-100 px-2 py-0.5 rounded-full">
                            {answer}
                          </span>
                        ) : (
                          <span className="mt-1 block text-xs font-semibold text-slate-800 break-words">
                            {answer}
                          </span>
                        )
                      ) : (
                        <span className="mt-1 block text-[11px] italic text-slate-400">
                          Belum diisi
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Document Checklist */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-slate-800">
            Daftar Berkas Persyaratan ({Object.keys(santri.documents).length} Diunggah):
          </h4>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {docRequirements.map((doc) => {
              const uploaded = santri.documents[doc.key];
              const isUploaded = !!uploaded;
              const isValid = uploaded?.status === 'VALID';
              const isRejected = uploaded?.status === 'REJECTED';

              return (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border flex flex-col justify-between gap-2 text-xs transition-all ${
                    isValid
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isRejected
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        name={isValid ? 'check_circle' : isRejected ? 'cancel' : 'description'}
                        size={18}
                        className={isValid ? 'text-emerald-700' : isRejected ? 'text-rose-600' : 'text-slate-400'}
                      />
                      <div>
                        <span className="font-bold text-slate-800">{doc.name}</span>
                        {uploaded && (
                          <span className="text-slate-500 font-mono block text-[11px]">
                            {uploaded.fileName} ({uploaded.fileSize})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isUploaded ? (
                        <>
                          <button
                            onClick={() => setPreviewDocKey(previewDocKey === doc.key ? null : doc.key)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                              previewDocKey === doc.key
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <Icon name="visibility" size={13} />
                            Lihat
                          </button>
                          <button
                            onClick={() => verifySantriDoc(santri.id, doc.key, 'VALID')}
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              isValid
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            Sah (Valid)
                          </button>
                          <button
                            onClick={() => setActiveDocKey(doc.key)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              isRejected
                                ? 'bg-rose-700 text-white'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            Minta Revisi
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Belum Diunggah</span>
                      )}
                    </div>
                  </div>

                  {previewDocKey === doc.key && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Pratinjau Berkas
                        </span>
                        <button
                          onClick={() => setPreviewDocKey(null)}
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

                  {activeDocKey === doc.key && (
                    <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded flex items-center gap-2">
                      <input
                        type="text"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Tulis alasan penolakan/revisi (misal: scan buram)..."
                        className="flex-1 h-8 px-2.5 rounded border border-rose-300 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => handleRejectWithNote(doc.key)}
                        className="px-3 py-1 bg-rose-700 text-white rounded text-xs font-semibold"
                      >
                        Kirim Catatan
                      </button>
                      <button
                        onClick={() => setActiveDocKey(null)}
                        className="text-slate-500 text-xs px-1"
                      >
                        Batal
                      </button>
                    </div>
                  )}

                  {isRejected && uploaded?.rejectionNote && (
                    <div className="text-rose-700 text-[11px] bg-rose-100/60 p-1.5 rounded">
                      <strong>Catatan:</strong> {uploaded.rejectionNote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              iconLeft="verified"
              onClick={handleApproveAll}
            >
              Verifikasi Penuh & Terbitkan Kartu CBT
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
