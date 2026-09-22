import React, { useState } from 'react';
import {
  useSPMB,
  JenjangPendidikan,
  Gender,
  JurusanMA,
  SantriData,
  formatCurrency
} from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';

interface RegisterPageProps {
  onNavigate: (view: 'landing' | 'register' | 'check-status' | 'login' | 'dashboard') => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { branding, waves, registerNewSantri, setCurrentSantri, levels, majors, customFormFields } =
    useSPMB();

  const [step, setStep] = useState<number>(1);
  const [createdSantri, setCreatedSantri] = useState<SantriData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    level: 'MA' as JenjangPendidikan,
    jurusan: 'MIPA' as JurusanMA,
    waveId: waves.find((w) => w.isOpen)?.id || waves[0].id,
    fullName: '',
    nisn: '',
    nik: '',
    gender: 'L' as Gender,
    birthPlace: '',
    birthDate: '',
    email: '',
    phone: '',
    prevSchool: '',
    parentName: '',
    parentPhone: '',
    address: '',
    extra: {} as Record<string, string>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedWave = waves.find((w) => w.id === formData.waveId) || waves[0];

  const validateStep = () => {
    const err: Record<string, string> = {};

    if (step === 1) {
      if (!formData.waveId) err.waveId = 'Pilih gelombang pendaftaran';
      if (!formData.level) err.level = 'Pilih jenjang pendidikan';
    } else if (step === 2) {
      if (!formData.fullName.trim()) err.fullName = 'Nama lengkap wajib diisi';
      if (!formData.nisn.trim() || formData.nisn.length < 8)
        err.nisn = 'NISN minimal 8-10 digit valid';
      if (!formData.nik.trim()) err.nik = 'NIK wajib diisi';
      if (!formData.birthPlace.trim()) err.birthPlace = 'Tempat lahir wajib diisi';
      if (!formData.birthDate) err.birthDate = 'Tanggal lahir wajib diisi';
      if (!formData.prevSchool.trim()) err.prevSchool = 'Asal sekolah wajib diisi';
      for (const f of customFormFields) {
        const v = (formData.extra[f.id] || '').trim();
        if (f.type === 'select' && f.isRequired && !v) {
          err[`extra_${f.id}`] = 'Pilih salah satu opsi yang tersedia';
        } else if (f.type !== 'select' && f.isRequired && !v) {
          err[`extra_${f.id}`] = 'Wajib diisi';
        } else if (f.minLength && v.length < f.minLength) {
          err[`extra_${f.id}`] = `Minimal ${f.minLength} ${f.type === 'number' ? 'digit' : 'karakter'}`;
        }
      }
    } else if (step === 3) {
      if (!formData.parentName.trim()) err.parentName = 'Nama orang tua/wali wajib diisi';
      if (!formData.parentPhone.trim() || formData.parentPhone.length < 9)
        err.parentPhone = 'Nomor WhatsApp wajib diisi';
      if (!formData.address.trim()) err.address = 'Alamat lengkap wajib diisi';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const newSantri = registerNewSantri({
      fullName: formData.fullName,
      nisn: formData.nisn,
      nik: formData.nik,
      gender: formData.gender,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      email: formData.email || `${formData.nisn}@alhikmah.santri`,
      phone: formData.phone || formData.parentPhone,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      address: formData.address,
prevSchool: formData.prevSchool,
    level: formData.level,
    jurusan: formData.level === 'MA' ? formData.jurusan : undefined,
    waveId: formData.waveId,
    extraFields: Object.fromEntries(
      customFormFields
        .map((f) => [f.key, (formData.extra[f.id] || '').trim()])
        .filter(([, v]) => (v as string).length > 0)
    )
  });

    setCreatedSantri(newSantri);
    setStep(5); // Success step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
            e-PPDB Online &bull; {branding.pesantrenName}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Formulir Pendaftaran Santri Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tahun Ajaran {branding.academicYear} &bull; Proses Mudah, Resmi, & Terintegrasi
          </p>
        </div>

        {/* Stepper Wizard Bar */}
        {step <= 4 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-8">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { s: 1, label: 'Pilihan Jenjang' },
                { s: 2, label: 'Biodata Santri' },
                { s: 3, label: 'Data Orang Tua' },
                { s: 4, label: 'Konfirmasi' }
              ].map((item) => (
                <div
                  key={item.s}
                  className={`py-2 px-1 rounded-lg font-semibold transition-all ${
                    step === item.s
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : step > item.s
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-400 bg-slate-50'
                  }`}
                >
                  <span className="block text-[10px] opacity-75">Langkah 0{item.s}</span>
                  <span className="truncate block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* STEP 1: Pilihan Jenjang & Gelombang */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Langkah 1: Pilih Jenjang & Gelombang Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan tingkatan madrasah dan gelombang pendaftaran yang sedang dibuka.
                </p>
              </div>

              {/* Jenjang Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilihan Jenjang Pendidikan *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {levels.map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, level: lvl.id })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.level === lvl.id
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-lg text-slate-900">{lvl.label}</span>
                        <Icon
                          name={formData.level === lvl.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                          size={20}
                          className={formData.level === lvl.id ? 'text-emerald-700' : 'text-slate-400'}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{lvl.subNote.replace(/&bull;/g, '•')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jurusan MA if selected */}
              {formData.level !== 'MTS' && majors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pilihan Jurusan *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {majors.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => setFormData({ ...formData, jurusan: j.id as JurusanMA })}
                        className={`p-3 rounded-lg border cursor-pointer text-xs ${
                          formData.jurusan === j.id
                            ? 'border-emerald-600 bg-emerald-50 font-semibold text-emerald-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-bold block text-sm">{j.name}</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{j.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gelombang Choice */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilihan Gelombang Pendaftaran *
                </label>
                <div className="space-y-3">
                  {waves.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => w.isOpen && setFormData({ ...formData, waveId: w.id })}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        !w.isOpen
                          ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                          : formData.waveId === w.id
                          ? 'border-emerald-700 bg-emerald-50/60 shadow-sm cursor-pointer'
                          : 'border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          name={
                            formData.waveId === w.id
                              ? 'radio_button_checked'
                              : 'radio_button_unchecked'
                          }
                          size={20}
                          className={formData.waveId === w.id ? 'text-emerald-700' : 'text-slate-400'}
                        />
                        <div>
                          <span className="font-serif font-bold text-base text-slate-900 block">
                            {w.name}
                          </span>
                          <span className="text-xs text-slate-500">{w.tagline}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-emerald-900 text-sm block">
                          {formatCurrency(w.registrationFee)}
                        </span>
                        <Badge variant={w.isOpen ? 'emerald' : 'neutral'} size="sm">
                          {w.isOpen ? 'Buka' : 'Tutup'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button variant="primary" iconRight="arrow_forward" onClick={handleNext}>
                  Lanjut ke Biodata Santri
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Biodata Santri */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Langkah 2: Data Diri Calon Santri
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi data calon santri sesuai dengan dokumen Akta Kelahiran dan Kartu Keluarga resmi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nama Lengkap Calon Santri *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Contoh: Muhammad Fatih Al-Faruq"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName}</p>}
                </div>

                {/* NISN */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nomor Induk Siswa Nasional (NISN) *
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="10 digit NISN resmi"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.nisn && <p className="text-xs text-rose-600">{errors.nisn}</p>}
                </div>

                {/* NIK */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    NIK Calon Santri (Sesuai KK) *
                  </label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="16 digit NIK"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.nik && <p className="text-xs text-rose-600">{errors.nik}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Jenis Kelamin *
                  </label>
                  <div className="grid grid-cols-2 gap-2 h-11">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'L' })}
                      className={`rounded-lg border text-sm font-medium transition-all ${
                        formData.gender === 'L'
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Laki-laki (Santri)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'P' })}
                      className={`rounded-lg border text-sm font-medium transition-all ${
                        formData.gender === 'P'
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Perempuan (Santriwati)
                    </button>
                  </div>
                </div>

                {/* Prev School */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Asal Sekolah / Madrasah *
                  </label>
                  <input
                    type="text"
                    value={formData.prevSchool}
                    onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                    placeholder="Contoh: MTsN 1 Kota Bandung / SDN 2"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.prevSchool && <p className="text-xs text-rose-600">{errors.prevSchool}</p>}
                </div>

                {/* Birth Place */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Kota kelahiran"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.birthPlace && <p className="text-xs text-rose-600">{errors.birthPlace}</p>}
                </div>

                {/* Birth Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.birthDate && <p className="text-xs text-rose-600">{errors.birthDate}</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Button variant="outline" iconLeft="arrow_back" onClick={handlePrev}>
                  Kembali
                </Button>
                <Button variant="primary" iconRight="arrow_forward" onClick={handleNext}>
                  Lanjut ke Data Orang Tua
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Data Orang Tua / Wali */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Langkah 3: Data Orang Tua / Wali Santri
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nomor WhatsApp aktif digunakan untuk pengiriman notifikasi pendaftaran dan informasi ujian seleksi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Parent Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nama Lengkap Ayah / Ibu / Wali *
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Contoh: Drs. H. Ahmad Faruq, M.Ag"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.parentName && <p className="text-xs text-rose-600">{errors.parentName}</p>}
                </div>

                {/* Parent Phone / WA */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    No. WhatsApp Aktif Orang Tua *
                  </label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.parentPhone && <p className="text-xs text-rose-600">{errors.parentPhone}</p>}
                </div>

                {/* Santri Phone (Optional) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    No. HP Calon Santri (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0813-xxxx-xxxx"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Alamat Lengkap Tempat Tinggal *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi"
                    className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  {errors.address && <p className="text-xs text-rose-600">{errors.address}</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Button variant="outline" iconLeft="arrow_back" onClick={handlePrev}>
                  Kembali
                </Button>
                <Button variant="primary" iconRight="arrow_forward" onClick={handleNext}>
                  Lanjut ke Konfirmasi
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Konfirmasi & Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Langkah 4: Konfirmasi & Pernyataan Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periksa kembali kebenaran data sebelum mengirim formulir pendaftaran.
                </p>
              </div>

              {/* Summary Table */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Pilihan Jenjang:</span>
                  <span className="font-bold text-emerald-900">
                    {levels.find((l) => l.id === formData.level)?.label || formData.level}
                    {formData.level === 'MA' ? ` - ${formData.jurusan}` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Gelombang Pendaftaran:</span>
                  <span className="font-semibold text-slate-800">{selectedWave.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Nama Lengkap Santri:</span>
                  <span className="font-bold text-slate-900 uppercase">{formData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">NISN / NIK:</span>
                  <span className="font-mono text-slate-700">{formData.nisn} / {formData.nik}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">Nama Orang Tua/Wali:</span>
                  <span className="font-semibold text-slate-800">{formData.parentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-500">No. WhatsApp Wali:</span>
                  <span className="font-mono text-slate-800">{formData.parentPhone}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Biaya Formulir & Seleksi:</span>
                  <span className="font-serif text-base font-bold text-emerald-900">
                    {formatCurrency(selectedWave.registrationFee)}
                  </span>
                </div>
              </div>

              {/* Statement checkbox */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-start gap-2.5">
                  <Icon name="verified_user" size={20} className="text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    Dengan ini saya menyatakan bahwa data yang diisikan di atas adalah benar dan sah. Saya bersedia mematuhi seluruh tata tertib dan ketentuan yang ditetapkan oleh Panitia SPMB {branding.pesantrenName}.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Button variant="outline" iconLeft="arrow_back" onClick={handlePrev}>
                  Ubah Data
                </Button>
                <Button variant="amber" size="lg" iconLeft="how_to_reg" onClick={handleSubmit}>
                  Kirim & Daftarkan Santri Baru
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS / TANDA BUKTI PENDAFTARAN */}
          {step === 5 && createdSantri && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <Icon name="check_circle" size={40} filled />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                  Pendaftaran Berhasil Terkirim!
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Selamat Datang di Portal SPMB {branding.pesantrenName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  Data formulir Anda telah tersimpan di sistem pusat. Simpan Nomor Registrasi dan nomor Virtual Account di bawah ini.
                </p>
              </div>

              {/* Registration Result Card */}
              <div className="bg-emerald-900 text-white rounded-2xl p-6 max-w-lg mx-auto text-left shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
                  <span className="text-xs text-emerald-300">Nomor Registrasi Santri:</span>
                  <span className="font-mono text-lg font-bold text-amber-300">
                    {createdSantri.noReg}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-emerald-100">
                  <p><strong>Nama:</strong> {createdSantri.fullName}</p>
                  <p><strong>Jenjang:</strong> {createdSantri.level} &bull; {createdSantri.jurusan || 'MTs'}</p>
                  <p><strong>Gelombang:</strong> {selectedWave.name}</p>
                </div>

                <div className="bg-emerald-950 p-3.5 rounded-xl border border-emerald-800">
                  <span className="text-[11px] text-emerald-300 block">Nomor Virtual Account BSI:</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wider block mt-0.5">
                    {createdSantri.virtualAccount}
                  </span>
                  <span className="text-[11px] text-amber-300 block mt-1">
                    Nominal Transfer: {formatCurrency(createdSantri.nominalBayar)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  iconLeft="dashboard"
                  onClick={() => {
                    setCurrentSantri(createdSantri);
                    onNavigate('dashboard');
                  }}
                >
                  Buka Dashboard Santri Sekarang
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft="home"
                  onClick={() => onNavigate('landing')}
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
