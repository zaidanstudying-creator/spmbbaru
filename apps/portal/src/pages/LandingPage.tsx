import React, { useState } from 'react';
import { useSPMB, formatCurrency, formatDateIndo, formatWhatsAppLink } from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'register' | 'check-status' | 'login' | 'dashboard') => void;
}

const WA_ADMIN_NUMBER = '085158512007';
const WA_MESSAGE = 'Assalamualaikum, saya ingin bertanya lebih lanjut tentang spmb atau tentang pesantren';

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { branding, waves, docRequirements, landingContent, levels } = useSPMB();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const faqs = landingContent.faqs;

  return (
    <div className="flex flex-col w-full">
      {/* WhatsApp Float Button */}
      <a
        href={formatWhatsAppLink(landingContent.waNumber, WA_MESSAGE)}
        target="_blank"
        rel="noreferrer"
        aria-label="Tanya Admin via WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 pl-3 pr-4 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 hover:bg-[#1ebe5b] transition-all"
      >
        <WhatsAppIcon size={30} />
        <span className="text-sm font-bold">Tanya Admin</span>
      </a>

      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-emerald-950 text-white pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background Islamic Pattern & Radial Glows */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a6f2d1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Brand Tagline Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              {branding.logoUrl && (
                <img
                  src={branding.logoUrl}
                  alt={branding.pesantrenName}
                  className="h-10 w-auto object-contain brightness-125 drop-shadow-sm"
                />
              )}
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-tight">
                  {branding.pesantrenName}
                </span>
                <span className="text-xs text-emerald-300 font-medium block">
                  Pusat Admisi & e-PPDB Terpadu TA {branding.academicYear}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold">
                <Icon name="verified" size={16} className="text-amber-400" />
                {branding.accreditation}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-amber-950 text-xs font-bold">
                {landingContent.heroBadge}
              </span>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/90 border border-emerald-700/60 text-emerald-300 text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{landingContent.heroEyebrow}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {landingContent.heroTitle || branding.tagline}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                {landingContent.heroDescription || branding.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="amber"
                  size="lg"
                  iconLeft="how_to_reg"
                  onClick={() => onNavigate('register')}
                  className="w-full sm:w-auto shadow-lg hover:shadow-amber-500/20"
                >
                  Daftar Santri Baru
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft="search"
                  onClick={() => onNavigate('check-status')}
                  className="w-full sm:w-auto"
                >
                  Cek Status Kelulusan
                </Button>
              </div>

              {/* Total Kuota Callout */}
              <div className="mt-4 p-4 rounded-xl bg-emerald-900/60 backdrop-blur border border-emerald-700/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300">
                    <Icon name="groups" size={26} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                      Kapasitas Penuh Asrama
                    </span>
                    <span className="font-serif text-xl font-bold text-white">
                      {landingContent.quotaCalloutTitle}
                    </span>
                    <span className="text-xs text-emerald-200/70 block mt-0.5">
                      {landingContent.quotaCalloutSub.replace(/&bull;/g, '•')}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium">
                  <Icon name="domain" size={16} className="text-emerald-300" />
                  <span>2 Kampus Terpisah</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 p-2 border border-white/10">
                <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden">
                  <img
                    src={landingContent.heroImageUrl}
                    alt="Santri Al-Hikmah"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/80 backdrop-blur text-emerald-200 text-xs font-semibold mb-1">
                      <Icon name="verified" size={14} />
                      Akreditasi A Unggul
                    </div>
                    <h3 className="font-serif text-lg font-bold">
                      Lingkungan Asri, Islami & Kondusif
                    </h3>
                    <p className="text-xs text-emerald-100/80">
                      Berlokasi di kawasan perbukitan sejuk dengan fasilitas modern berstandar internasional.
                    </p>
                  </div>
                </div>

                {/* Floating Info Pill */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Icon name="workspace_premium" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Sertifikasi</span>
                    <span className="font-serif text-sm font-bold text-emerald-900">Sanad Al-Qur'an 30 Juz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAM KEUNGGULAN JENJANG (MTs & MA) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/80 px-3 py-1 rounded-full">
              Pilihan Pendidikan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              Jenjang Pendidikan & Program Unggulan
            </h2>
            <p className="text-slate-600 text-base mt-3">
              {landingContent.programsIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {levels.map((lvl, idx) => {
              const isSecondary = idx % 2 === 1;
              return (
                <Card
                  key={lvl.id}
                  hoverEffect
                  className={`space-y-6 ${isSecondary ? 'border-emerald-300 ring-1 ring-emerald-600/20' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {lvl.stage}
                        </span>
                        {isSecondary && <Badge variant="amber" size="sm">Favorit</Badge>}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                        {lvl.label}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{lvl.subNote.replace(/&bull;/g, '•')}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSecondary ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Icon name={isSecondary ? 'military_tech' : 'school'} size={28} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {lvl.features.map((feat, fi) => {
                      const [head, ...rest] = feat.split(':');
                      return (
                        <div key={fi} className="flex items-start gap-3">
                          <Icon name="check_circle" size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-700">
                            {rest.length > 0 ? (
                              <>
                                <strong>{head}:</strong>{rest.join(':')}
                              </>
                            ) : (
                              feat
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {lvl.quotaText.replace(/&bull;/g, '•')}
                    </span>
                    <Button
                      variant={isSecondary ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onNavigate('register')}
                    >
                      Pilih {lvl.shortLabel} &rarr;
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Statistik Singkat */}
          {landingContent.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {landingContent.stats.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm"
                >
                  <span className="font-serif text-3xl font-bold text-emerald-900 block">
                    {st.value}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold mt-1 block">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. GELOMBANG PENDAFTARAN & BIAYA */}
      <section id="alur-dan-syarat" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full">
              Jadwal & Biaya
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              Gelombang Pendaftaran TA {branding.academicYear}
            </h2>
            <p className="text-slate-600 text-base mt-3">
              Pendaftaran dilakukan secara online. Pastikan mendaftar pada gelombang yang aktif sebelum kuota terpenuhi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {waves.map((wave) => (
              <div
                key={wave.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  wave.isOpen
                    ? 'border-emerald-600 shadow-xl ring-2 ring-emerald-600/20 bg-white relative -translate-y-1'
                    : 'border-slate-200 bg-slate-50/70 opacity-80'
                }`}
              >
                {wave.isOpen && (
                  <div className="absolute -top-3.5 right-6 bg-emerald-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow">
                    Sedang Dibuka
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Gelombang 0{wave.waveNumber}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900">{wave.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{wave.tagline}</p>

                  {/* Pricing Box */}
                  <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 block">Biaya Formulir & Seleksi CBT</span>
                    <span className="font-serif text-2xl font-bold text-emerald-900">
                      {formatCurrency(wave.registrationFee)}
                    </span>
                  </div>

                  {/* Schedule dates */}
                  <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Periode Daftar:</span>
                      <span className="font-semibold text-slate-800">
                        {formatDateIndo(wave.startDate)} - {formatDateIndo(wave.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pelaksanaan Tes CBT:</span>
                      <span className="font-semibold text-emerald-800">
                        {formatDateIndo(wave.testDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pengumuman:</span>
                      <span className="font-semibold text-slate-800">
                        {formatDateIndo(wave.announcementDate)}
                      </span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2 text-xs text-slate-600">
                    {wave.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="check" size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {wave.isOpen ? (
                    <Button
                      variant="primary"
                      className="w-full"
                      iconLeft="how_to_reg"
                      onClick={() => onNavigate('register')}
                    >
                      Daftar Gelombang {wave.waveNumber}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      {wave.badgeText || 'Belum Dibuka'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ALUR & SYARAT SPMB */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: 5 Alur Pendaftaran */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                  Panduan Alur
                </span>
                <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
                  5 Langkah Mudah Pendaftaran Online
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Daftar Akun & Isi Formulir',
                    desc: 'Lengkapi biodata calon santri, data orang tua/wali, serta pilihan jenjang madrasah.'
                  },
                  {
                    step: 2,
                    title: 'Bayar Biaya Seleksi & Unggah Berkas',
                    desc: 'Dapatkan Virtual Account BSI dan unggah scan dokumen persyaratan (Ijazah, KK, Akta, dll).'
                  },
                  {
                    step: 3,
                    title: 'Cetak Kartu Ujian CBT',
                    desc: 'Setelah berkas tervalidasi oleh panitia, cetak Kartu Tanda Peserta CBT resmi yang memuat nomor meja dan PIN ujian.'
                  },
                  {
                    step: 4,
                    title: 'Ikuti Tes CBT & Wawancara Tahfidz',
                    desc: 'Pelaksanaan ujian potensi akademik online di laboratorium CBT dan wawancara komitmen wali santri.'
                  },
                  {
                    step: 5,
                    title: 'Pengumuman Kelulusan & Daftar Ulang',
                    desc: 'Cek status kelulusan mandiri melalui portal ini dan lanjutkan proses daftar ulang.'
                  }
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      0{item.step}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dokumen Persyaratan Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Icon name="folder_open" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Dokumen Persyaratan Masuk
                  </h3>
                  <p className="text-xs text-slate-500">Berkas yang perlu disiapkan dalam format digital</p>
                </div>
              </div>

              <div className="space-y-3">
                {docRequirements.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-800">{idx + 1}.</span>
                      <div>
                        <span className="font-semibold text-slate-800 block">{doc.name}</span>
                        <span className="text-slate-500 text-[11px]">{doc.description}</span>
                      </div>
                    </div>
                    <Badge variant={doc.isRequired ? 'rose' : 'neutral'} size="sm">
                      {doc.isRequired ? 'Wajib' : 'Opsional'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  iconLeft="how_to_reg"
                  onClick={() => onNavigate('register')}
                >
                  Mulai Pendaftaran Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 BERITA & PENGUMUMAN */}
      {landingContent.news.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                Kabar Pesantren
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
                Berita & Pengumuman Terbaru
              </h2>
              <p className="text-slate-600 text-sm mt-2">{landingContent.newsIntro}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landingContent.news.map((n) => (
                <Card key={n.id} hoverEffect className="p-6 space-y-3 flex flex-col">
                  {n.imageUrl && (
                    <div className="relative h-36 -mx-6 -mt-6 mb-1 rounded-t-2xl overflow-hidden">
                      {n.imageUrl.startsWith('data:application/pdf') || n.imageUrl.endsWith('.pdf') ? (
                        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-2">
                          <Icon name="picture_as_pdf" size={34} className="text-rose-500" />
                          <span className="text-[11px] text-slate-500 font-semibold">File PDF terlampir</span>
                        </div>
                      ) : (
                        <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="emerald" size="sm">{n.tag}</Badge>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {formatDateIndo(n.date)}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{n.excerpt}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQ SECTION */}
      <section id="faq-dan-bantuan" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
              Tanya Jawab
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Informasi lengkap seputar persyaratan, tes masuk, asrama, dan biaya pendidikan.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {faq.q}
                    </span>
                    <Icon
                      name={isOpen ? 'expand_less' : 'expand_more'}
                      size={22}
                      className="text-slate-500 shrink-0"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.5 BANTUAN / HUBUNGI PANITIA (di atas footer) */}
      <section className="py-14 bg-emerald-50 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0">
                <WhatsAppIcon size={30} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {landingContent.helpTitle}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{landingContent.helpSubtitle}</p>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Chat Panitia: {WA_ADMIN_NUMBER}
                </p>
              </div>
            </div>
            <a
href={formatWhatsAppLink(WA_ADMIN_NUMBER, WA_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow-lg hover:bg-[#1ebe5b] transition-colors shrink-0"
            >
              <WhatsAppIcon size={20} />
              Chat Panitia Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="bg-emerald-900 text-white py-14 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Siap Bergabung dengan Keluarga Besar {branding.pesantrenName}?
            </h3>
            <p className="text-sm text-emerald-200 max-w-xl">
              Pendaftaran Gelombang 1 Terbuka Terbatas. Segera daftarkan putra-putri tercinta untuk masa depan Qur'ani & berwawasan global.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="amber"
              size="lg"
              iconLeft="how_to_reg"
              onClick={() => onNavigate('register')}
            >
              Daftar Online Sekarang
            </Button>
            <Button
              variant="secondary"
              size="lg"
              iconLeft="search"
              onClick={() => onNavigate('check-status')}
            >
              Cek Status Pendaftaran
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
