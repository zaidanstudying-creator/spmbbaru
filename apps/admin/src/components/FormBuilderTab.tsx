import React, { useState } from 'react';
import { useSPMB, DocRequirement, FormField, FormFieldType } from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';

export const FormBuilderTab: React.FC = () => {
  const { docRequirements, updateDocRequirement, addDocRequirement, deleteDocRequirement } =
    useSPMB();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    key: '',
    name: '',
    description: '',
    allowedFormats: ['PDF', 'JPG'],
    maxSizeMB: 2,
    isRequired: true,
    category: 'TAMBAHAN' as const
  });

  const {
    customFormFields,
    addFormField,
    updateFormField,
    deleteFormField
  } = useSPMB();

  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState({
    key: '',
    label: '',
    type: 'text' as FormFieldType,
    isRequired: true,
    minLength: 0,
    placeholder: '',
    optionsText: ''
  });

  const openNewFieldEditor = () => {
    setEditingFieldId(null);
    setFieldForm({
      key: '',
      label: '',
      type: 'text',
      isRequired: true,
      minLength: 0,
      placeholder: '',
      optionsText: ''
    });
    setShowFieldEditor(true);
  };

  const openEditField = (f: FormField) => {
    setEditingFieldId(f.id);
    setFieldForm({
      key: f.key,
      label: f.label,
      type: f.type,
      isRequired: f.isRequired,
      minLength: f.minLength || 0,
      placeholder: f.placeholder || '',
      optionsText: (f.options || []).join('\n')
    });
    setShowFieldEditor(true);
  };

  const saveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldForm.label.trim()) return;
    const cleanKey =
      (fieldForm.key.trim() || fieldForm.label.toLowerCase().replace(/[^a-z0-9]/g, '_')) ||
      `field_${Date.now()}`;
    const options =
      fieldForm.type === 'select'
        ? fieldForm.optionsText
            .split('\n')
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;
    const minLength = Math.max(0, Number(fieldForm.minLength) || 0);

    const data = {
      key: cleanKey,
      label: fieldForm.label.trim(),
      type: fieldForm.type,
      isRequired: fieldForm.isRequired,
      minLength,
      placeholder: fieldForm.placeholder.trim() || undefined,
      options: options && options.length > 0 ? options : undefined
    };

    if (editingFieldId) {
      updateFormField(editingFieldId, data);
    } else {
      addFormField({ id: `field_${Date.now()}`, ...data });
    }
    setShowFieldEditor(false);
    setEditingFieldId(null);
  };

  const typeLabel: Record<FormFieldType, { label: string; cls: string; icon: string }> = {
    text: { label: 'Teks / Huruf', cls: 'bg-sky-100 text-sky-800', icon: 'text_fields' },
    number: { label: 'Angka', cls: 'bg-amber-100 text-amber-800', icon: 'pin' },
    select: { label: 'Dropdown', cls: 'bg-violet-100 text-violet-800', icon: 'arrow_drop_down_circle' }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name.trim()) return;
    const cleanKey = (newDoc.key.trim() || newDoc.name.toLowerCase().replace(/[^a-z0-9]/g, '')) || `doc_${Date.now()}`;
    addDocRequirement({
      ...newDoc,
      key: cleanKey
    });
    setShowAddForm(false);
    setNewDoc({
      key: '',
      name: '',
      description: '',
      allowedFormats: ['PDF', 'JPG'],
      maxSizeMB: 2,
      isRequired: true,
      category: 'TAMBAHAN'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Form & Dokumen Persyaratan Builder
            </h2>
            <Badge variant="emerald" size="sm">
              {docRequirements.length} Berkas Terdaftar
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi jenis berkas digital yang harus diunggah calon santri saat registrasi online. Anda dapat menambah, mengubah status wajib/opsional, dan batas ukuran file.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconLeft="add"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Tutup Form' : 'Tambah Berkas Baru'}
        </Button>
      </div>

      {/* Add new doc requirement form */}
      {showAddForm && (
        <Card className="p-6 bg-slate-50 border-emerald-300">
          <form onSubmit={handleAdd} className="space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900">
              Tambah Syarat Dokumen Baru
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Dokumen *</label>
                <input
                  type="text"
                  required
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  placeholder="Contoh: Surat Rekomendasi MWC NU / DMI"
                  className="w-full h-9 px-3 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi Petunjuk</label>
                <input
                  type="text"
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  placeholder="Scan asli yang ditandatangani"
                  className="w-full h-9 px-3 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Maksimal Ukuran (MB)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newDoc.maxSizeMB}
                  onChange={(e) => setNewDoc({ ...newDoc, maxSizeMB: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sifat Dokumen</label>
                <div className="flex gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="isRequired"
                      checked={newDoc.isRequired}
                      onChange={() => setNewDoc({ ...newDoc, isRequired: true })}
                    />
                    <span>Wajib Diunggah</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="isRequired"
                      checked={!newDoc.isRequired}
                      onChange={() => setNewDoc({ ...newDoc, isRequired: false })}
                    />
                    <span>Opsional (Pelengkap)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Simpan Dokumen
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* === FIELD FORMULIR PENDAFTARAN === */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Field Formulir Pendaftaran
            </h2>
            <Badge variant="sky" size="sm">
              {customFormFields.length} Field Aktif
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola pertanyaan input pada formulir pendaftaran santri: tambah/hapus field, pilih
            tipe (Teks, Angka, Dropdown), atur minimal karakter, dan tulis teks &quot;preview&quot;
            yang tampil sebagai petunjuk pengisian di form.
          </p>
        </div>

        <Button variant="primary" size="sm" iconLeft="add" onClick={openNewFieldEditor}>
          {showFieldEditor ? 'Tutup' : 'Tambah Field Baru'}
        </Button>
      </div>

      {showFieldEditor && (
        <Card className="p-6 bg-slate-50 border-emerald-300">
          <form onSubmit={saveField} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editingFieldId ? 'Edit Field Formulir' : 'Tambah Field Formulir Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowFieldEditor(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pertanyaan / Label *</label>
                <input
                  type="text"
                  required
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                  placeholder="cth: Asal SMP / Madrasah sebelumnya"
                  className="w-full h-9 px-3 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key (opsional, unik)</label>
                <input
                  type="text"
                  value={fieldForm.key}
                  onChange={(e) => setFieldForm({ ...fieldForm, key: e.target.value })}
                  placeholder="cth: asal_sekolah (isi kosong = otomatis)"
                  className="w-full h-9 px-3 rounded border border-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tipe Input</label>
                <select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as FormFieldType })}
                  className="w-full h-9 px-3 rounded border border-slate-300 bg-white"
                >
                  <option value="text">Teks / Huruf</option>
                  <option value="number">Angka</option>
                  <option value="select">Dropdown (Pilihan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Minimal Karakter {fieldForm.type === 'number' ? '(digit)' : ''}
                </label>
                <input
                  type="number"
                  min={0}
                  value={fieldForm.minLength}
                  onChange={(e) => setFieldForm({ ...fieldForm, minLength: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded border border-slate-300 font-mono"
                />
                <p className="text-[10px] text-slate-400">0 = tanpa batas.</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">
                  Teks Preview di Form (petunjuk apa yang harus diisi)
                </label>
                <input
                  type="text"
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                  placeholder="cth: Tulis nama sekolah asal secara lengkap"
                  className="w-full h-9 px-3 rounded border border-slate-300"
                />
              </div>

              {fieldForm.type === 'select' && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">
                    Opsi Dropdown (satu pilihan per baris)
                  </label>
                  <textarea
                    value={fieldForm.optionsText}
                    onChange={(e) => setFieldForm({ ...fieldForm, optionsText: e.target.value })}
                    rows={4}
                    placeholder={'MTs Negeri\nMTs Swasta\nSMP Negeri\nSMP Swasta'}
                    className="w-full p-3 rounded border border-slate-300 font-mono text-xs resize-y"
                  />
                </div>
              )}

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Sifat Field</label>
                <div className="flex gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="fieldRequired"
                      checked={fieldForm.isRequired}
                      onChange={() => setFieldForm({ ...fieldForm, isRequired: true })}
                    />
                    <span>Wajib Diisi</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="fieldRequired"
                      checked={!fieldForm.isRequired}
                      onChange={() => setFieldForm({ ...fieldForm, isRequired: false })}
                    />
                    <span>Opsional</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowFieldEditor(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {editingFieldId ? 'Simpan Perubahan' : 'Simpan Field'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customFormFields.map((f, idx) => {
          const t = typeLabel[f.type];
          return (
            <div
              key={f.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Icon name={t.icon} size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{f.label}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">key: {f.key}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.cls}`}>
                        {t.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          f.isRequired
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {f.isRequired ? 'Wajib' : 'Opsional'}
                      </span>
                      {f.minLength > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Min {f.minLength} kar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {f.placeholder && (
                <div className="p-2 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-[11px] text-slate-500 flex items-start gap-1.5">
                  <Icon name="preview" size={14} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Preview di form:</strong> {f.placeholder}
                  </span>
                </div>
              )}

              {f.options && f.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {f.options.map((o) => (
                    <span key={o} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {o}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Field formulir #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditField(f)}
                    className="text-sky-700 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus field "${f.label}"?`)) {
                        deleteFormField(f.id);
                      }
                    }}
                    className="text-rose-600 hover:underline ml-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {customFormFields.length === 0 && (
          <div className="md:col-span-2 p-10 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            Belum ada field formulir tambahan. Klik &quot;Tambah Field Baru&quot; untuk mulai.
          </div>
        )}
      </div>

      {/* Doc Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docRequirements.map((doc, idx) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                </div>
              </div>

              <button
                onClick={() =>
                  updateDocRequirement(doc.id, { isRequired: !doc.isRequired })
                }
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                  doc.isRequired
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {doc.isRequired ? 'Wajib' : 'Opsional'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">
                Format: {doc.allowedFormats.join(', ')} &bull; Maks {doc.maxSizeMB}MB
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newSize = prompt('Masukkan ukuran maksimal MB:', doc.maxSizeMB.toString());
                    if (newSize && !isNaN(Number(newSize))) {
                      updateDocRequirement(doc.id, { maxSizeMB: Number(newSize) });
                    }
                  }}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Edit Size
                </button>
                {docRequirements.length > 3 && (
                  <button
                    onClick={() => {
                      if (confirm(`Hapus syarat ${doc.name}?`)) {
                        deleteDocRequirement(doc.id);
                      }
                    }}
                    className="text-rose-600 hover:underline ml-2"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
