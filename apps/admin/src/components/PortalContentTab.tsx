import React, { useState } from 'react';
import { useSPMB, FaqItem, NewsItem, KeyStatItem, MajorOption } from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';

const inputCls = 'w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30';
const areaCls = 'w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30';

export const PortalContentTab: React.FC = () => {
  const {
    landingContent,
    updateLandingContent,
    upsertFaq,
    deleteFaq,
    upsertNews,
    deleteNews,
    upsertStat,
    deleteStat,
    levels,
    updateLevel,
    majors,
    addMajor,
    updateMajor,
    deleteMajor
  } = useSPMB();

  const [toast, setToast] = useState('');
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const [newFaq, setNewFaq] = useState<FaqItem>({ id: '', q: '', a: '' });
  const [newNews, setNewNews] = useState<NewsItem>({ id: '', title: '', date: '', excerpt: '', tag: 'Informasi' });
  const [newStat, setNewStat] = useState<KeyStatItem>({ id: '', label: '', value: '' });
  const [newMajor, setNewMajor] = useState<MajorOption>({ id: '', name: '', desc: '' });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Konten & Halaman Portal</h2>
            <Badge variant="emerald" size="sm">Live Edit</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ubah seluruh konten halaman publik: hero, statistik, program jenjang, jurusan, berita/pengumuman, dan FAQ.
          </p>
        </div>
        <Button variant="primary" size="sm" iconLeft="save" onClick={() => flash('Semua konten halaman tersimpan & langsung tampil di portal publik.')}>
          Simpan & Publikasikan
        </Button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Icon name="check_circle" size={18} className="text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* A. HERO & TEKS UTAMA */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="web_asset" size={20} className="text-emerald-700" /> Hero & Teks Utama
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Label Badge Atas</label>
            <input className={inputCls} value={landingContent.heroEyebrow} onChange={(e) => updateLandingContent({ heroEyebrow: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Badge Status Kanan</label>
            <input className={inputCls} value={landingContent.heroBadge} onChange={(e) => updateLandingContent({ heroBadge: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Utama (Hero)</label>
            <input className={inputCls} value={landingContent.heroTitle} onChange={(e) => updateLandingContent({ heroTitle: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi Hero</label>
            <textarea rows={2} className={areaCls} value={landingContent.heroDescription} onChange={(e) => updateLandingContent({ heroDescription: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">URL Gambar Hero</label>
            <input className={inputCls} value={landingContent.heroImageUrl} onChange={(e) => updateLandingContent({ heroImageUrl: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Callout Kuota</label>
            <input className={inputCls} value={landingContent.quotaCalloutTitle} onChange={(e) => updateLandingContent({ quotaCalloutTitle: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Sub Callout Kuota</label>
            <input className={inputCls} value={landingContent.quotaCalloutSub} onChange={(e) => updateLandingContent({ quotaCalloutSub: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Pengantar Program Jenjang</label>
            <textarea rows={2} className={areaCls} value={landingContent.programsIntro} onChange={(e) => updateLandingContent({ programsIntro: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Pengantar Berita</label>
            <input className={inputCls} value={landingContent.newsIntro} onChange={(e) => updateLandingContent({ newsIntro: e.target.value })} />
          </div>
        </div>
      </Card>

      {/* B. STATISTIK */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="bar_chart" size={20} className="text-emerald-700" /> Statistik Singkat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {landingContent.stats.map((st) => (
            <div key={st.id} className="flex items-center gap-2">
              <input className={`${inputCls} w-24`} value={st.value} onChange={(e) => upsertStat({ ...st, value: e.target.value })} />
              <input className={inputCls} value={st.label} onChange={(e) => upsertStat({ ...st, label: e.target.value })} />
              <button onClick={() => deleteStat(st.id)} className="text-rose-600 hover:text-rose-800 p-1 shrink-0">
                <Icon name="delete" size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input className={`${inputCls} w-24`} placeholder="Nilai" value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} />
          <input className={inputCls} placeholder="Label statistik" value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} />
          <Button
            variant="outline"
            size="sm"
            iconLeft="add"
            onClick={() => {
              if (!newStat.label.trim()) return;
              upsertStat({ ...newStat, id: `st-${Date.now()}` });
              setNewStat({ id: '', label: '', value: '' });
            }}
          >
            Tambah
          </Button>
        </div>
      </Card>

      {/* C. JENJANG PENDIDIKAN */}
      {levels.map((lvl) => (
        <Card key={lvl.id} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Icon name="school" size={20} className="text-emerald-700" /> Jenjang {lvl.shortLabel}
            </h3>
            <Badge variant="emerald" size="sm">{lvl.id}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <input className={inputCls} value={lvl.label} onChange={(e) => updateLevel(lvl.id, { label: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Label Singkat</label>
              <input className={inputCls} value={lvl.shortLabel} onChange={(e) => updateLevel(lvl.id, { shortLabel: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tingkat</label>
              <input className={inputCls} value={lvl.stage} onChange={(e) => updateLevel(lvl.id, { stage: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Sub Catatan</label>
              <input className={inputCls} value={lvl.subNote} onChange={(e) => updateLevel(lvl.id, { subNote: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi</label>
              <textarea rows={2} className={areaCls} value={lvl.description} onChange={(e) => updateLevel(lvl.id, { description: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Info Kuota</label>
              <input className={inputCls} value={lvl.quotaText} onChange={(e) => updateLevel(lvl.id, { quotaText: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Poin Keunggulan</label>
            {lvl.features.map((feat, fi) => (
              <div key={fi} className="flex items-center gap-2">
                <input
                  className={inputCls}
                  value={feat}
                  onChange={(e) => {
                    const features = [...lvl.features];
                    features[fi] = e.target.value;
                    updateLevel(lvl.id, { features });
                  }}
                />
                <button
                  onClick={() => updateLevel(lvl.id, { features: lvl.features.filter((_, i) => i !== fi) })}
                  className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" iconLeft="add" onClick={() => updateLevel(lvl.id, { features: [...lvl.features, ''] })}>
              Tambah Poin
            </Button>
          </div>
        </Card>
      ))}

      {/* D. JURUSAN / PEMINATAN */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="category" size={20} className="text-emerald-700" /> Jurusan / Peminatan
        </h3>
        <div className="space-y-2">
          {majors.map((m) => (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input className={`${inputCls} sm:w-56`} value={m.name} onChange={(e) => updateMajor(m.id, { name: e.target.value })} />
              <input className={inputCls} value={m.desc} onChange={(e) => updateMajor(m.id, { desc: e.target.value })} />
              <button onClick={() => deleteMajor(m.id)} className="text-rose-600 hover:text-rose-800 p-1 shrink-0">
                <Icon name="delete" size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-100">
          <input className={`${inputCls} sm:w-56`} placeholder="Nama jurusan" value={newMajor.name} onChange={(e) => setNewMajor({ ...newMajor, name: e.target.value })} />
          <input className={inputCls} placeholder="Deskripsi jurusan" value={newMajor.desc} onChange={(e) => setNewMajor({ ...newMajor, desc: e.target.value })} />
          <Button
            variant="outline"
            size="sm"
            iconLeft="add"
            onClick={() => {
              if (!newMajor.name.trim()) return;
              addMajor({ ...newMajor, id: newMajor.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || `J${Date.now()}` });
              setNewMajor({ id: '', name: '', desc: '' });
            }}
          >
            Tambah
          </Button>
        </div>
      </Card>

      {/* E. BERITA & PENGUMUMAN */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="newspaper" size={20} className="text-emerald-700" /> Berita & Pengumuman
        </h3>
        <div className="space-y-4">
          {landingContent.news.map((n) => (
            <div key={n.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input className={`${inputCls} md:col-span-3`} placeholder="Judul" value={n.title} onChange={(e) => upsertNews({ ...n, title: e.target.value })} />
                <input type="date" className={inputCls} value={n.date} onChange={(e) => upsertNews({ ...n, date: e.target.value })} />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <input className={`${inputCls} md:w-40`} placeholder="Tag" value={n.tag} onChange={(e) => upsertNews({ ...n, tag: e.target.value })} />
                <textarea rows={2} className={areaCls} placeholder="Ringkasan" value={n.excerpt} onChange={(e) => upsertNews({ ...n, excerpt: e.target.value })} />
                <button onClick={() => deleteNews(n.id)} className="text-rose-600 hover:text-rose-800 p-1 shrink-0 self-start">
                  <Icon name="delete" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <span className="text-xs font-bold text-emerald-900">Tambah Berita Baru</span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input className={`${inputCls} md:col-span-3`} placeholder="Judul berita" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} />
            <input type="date" className={inputCls} value={newNews.date} onChange={(e) => setNewNews({ ...newNews, date: e.target.value })} />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <input className={`${inputCls} md:w-40`} placeholder="Tag" value={newNews.tag} onChange={(e) => setNewNews({ ...newNews, tag: e.target.value })} />
            <input className={inputCls} placeholder="Ringkasan singkat" value={newNews.excerpt} onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })} />
            <Button
              variant="primary"
              size="sm"
              iconLeft="add"
              onClick={() => {
                if (!newNews.title.trim()) return;
                upsertNews({ ...newNews, id: `news-${Date.now()}` });
                setNewNews({ id: '', title: '', date: '', excerpt: '', tag: 'Informasi' });
              }}
            >
              Tambah
            </Button>
          </div>
        </div>
      </Card>

      {/* F. FAQ */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="quiz" size={20} className="text-emerald-700" /> Pertanyaan Umum (FAQ)
        </h3>
        <div className="space-y-4">
          {landingContent.faqs.map((f) => (
            <div key={f.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <input className={inputCls} placeholder="Pertanyaan" value={f.q} onChange={(e) => upsertFaq({ ...f, q: e.target.value })} />
                <button onClick={() => deleteFaq(f.id)} className="text-rose-600 hover:text-rose-800 p-1 shrink-0">
                  <Icon name="delete" size={18} />
                </button>
              </div>
              <textarea rows={3} className={areaCls} placeholder="Jawaban" value={f.a} onChange={(e) => upsertFaq({ ...f, a: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <span className="text-xs font-bold text-emerald-900">Tambah FAQ Baru</span>
          <input className={inputCls} placeholder="Pertanyaan" value={newFaq.q} onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })} />
          <textarea rows={2} className={areaCls} placeholder="Jawaban" value={newFaq.a} onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })} />
          <Button
            variant="primary"
            size="sm"
            iconLeft="add"
            onClick={() => {
              if (!newFaq.q.trim()) return;
              upsertFaq({ ...newFaq, id: `faq-${Date.now()}` });
              setNewFaq({ id: '', q: '', a: '' });
            }}
          >
            Tambah FAQ
          </Button>
        </div>
      </Card>
    </div>
  );
};
