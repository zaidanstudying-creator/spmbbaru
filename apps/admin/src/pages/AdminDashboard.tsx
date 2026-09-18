import React, { useState } from 'react';
import { useSPMB, getAdminRoleAllowedTabs, canRoleManageEmbargo, getRoleLabel } from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';
import { AdminSidebar, AdminTab } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { CmsBrandingTab } from '../components/CmsBrandingTab';
import { WavesConfigTab } from '../components/WavesConfigTab';
import { FormBuilderTab } from '../components/FormBuilderTab';
import { NoregGeneratorTab } from '../components/NoregGeneratorTab';
import { VerificationTab } from '../components/VerificationTab';
import { PaymentsTab } from '../components/PaymentsTab';
import { MassPublishModal } from '../components/MassPublishModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { branding, metrics, embargoState, currentAdmin } = useSPMB();
  const allowedTabs = getAdminRoleAllowedTabs(currentAdmin?.role);
  const canPub = canRoleManageEmbargo(currentAdmin?.role);
  const roleInfo = getRoleLabel(currentAdmin?.role);

  const defaultTab: AdminTab =
    currentAdmin?.role === 'BENDAHARA'
      ? 'payments'
      : currentAdmin?.role === 'VERIFIKATOR'
      ? 'queue'
      : 'branding';

  const [activeTab, setActiveTab] = useState<AdminTab>(defaultTab);
  const [showMassPublishModal, setShowMassPublishModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'dashboard') setActiveTab(defaultTab);
          else setActiveTab(tab);
        }}
        onOpenMassPublish={() => setShowMassPublishModal(true)}
        onLogout={onLogout}
      />

      {/* Main Container */}
      <div className="pl-72">
        <AdminHeader onSearchQuery={setSearchQuery} />

        <main className="w-full pt-20 p-8 space-y-6 max-w-7xl">
          {/* 1. Sub-Header Identitas Lembaga & Status Core */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Icon name="account_balance" size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-slate-900">
                    Sekretariat SPMB {branding.pesantrenName}
                  </h1>
                  <Badge variant="emerald" size="sm">
                    TA {branding.academicYear}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pusat Kendali Pengaturan Dokumen, Gelombang, Format Noreg, dan CMS Identitas Lembaga
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-semibold ${roleInfo.badgeClass}`}>
                <Icon name={roleInfo.icon} size={14} />
                {roleInfo.label}
              </span>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-900 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Status Core: Siap Menerima</span>
              </div>
            </div>
          </div>

          {/* 2. Alert Embargo Kelulusan & Tombol Rilis Serentak Masal */}
          <div
            className={`rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
              embargoState.isEmbargoActive
                ? 'bg-gradient-to-r from-amber-50 via-amber-100/50 to-white border-amber-200'
                : 'bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-white border-emerald-200'
            }`}
          >
            <div className="flex items-start gap-4 max-w-3xl">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  embargoState.isEmbargoActive
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <Icon
                  name={embargoState.isEmbargoActive ? 'lock_clock' : 'campaign'}
                  size={24}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      embargoState.isEmbargoActive
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-emerald-200 text-emerald-950'
                    }`}
                  >
                    {embargoState.isEmbargoActive ? 'Mode Embargo Aktif' : 'Status Publikasi Terbuka'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    {embargoState.isEmbargoActive
                      ? 'Hasil Yudisium Terkunci di Internal Panitia'
                      : 'Hasil Kelulusan SPMB Sudah Dirilis ke Publik'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {embargoState.isEmbargoActive
                    ? 'Status kelulusan santri (Diterima / Tidak Lolos) tidak dapat diakses oleh publik ataupun calon santri hingga Panitia SPMB mengesahkan rilis masal serentak.'
                    : 'Pengumuman resmi kelulusan telah dibuka ke modul Cek Kelulusan Mandiri santri.'}
                </p>
              </div>
            </div>

            {canPub ? (
              <Button
                variant="amber"
                size="md"
                iconLeft="campaign"
                onClick={() => setShowMassPublishModal(true)}
                className="shrink-0 shadow-md"
              >
                {embargoState.isEmbargoActive ? 'Publikasi Masal Kelulusan' : 'Kelola Publikasi Masal'}
              </Button>
            ) : (
              <span className="text-[11px] italic text-slate-500 shrink-0">
                Menu publikasi & embargo hanya untuk Ketua Panitia / Admin Super.
              </span>
            )}
          </div>

          {/* 3. Quick Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
                <p className="font-serif text-2xl font-bold text-slate-900">{metrics.totalApplicants}</p>
                <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Icon name="arrow_upward" size={13} /> +38 pendaftar
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Icon name="group_add" size={22} />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Antrean Berkas</p>
                <p className="font-serif text-2xl font-bold text-slate-900">
                  {metrics.pendingDocs} <span className="text-xs font-sans text-slate-400 font-normal">Antrean</span>
                </p>
                <p className="text-[11px] text-amber-700 flex items-center gap-1 mt-0.5">
                  <Icon name="pending_actions" size={13} /> Butuh tindakan
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Icon name="fact_check" size={22} />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Draf Lolos Yudisium</p>
                <p className="font-serif text-2xl font-bold text-slate-900">{metrics.draftPassed}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Icon name="lock" size={13} /> {embargoState.isEmbargoActive ? 'Tertahan Embargo' : 'Dirilis'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Icon name="verified" size={22} />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Daya Tampung Asrama</p>
                <p className="font-serif text-2xl font-bold text-slate-900">{metrics.quotaFilledPercent}%</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Icon name="groups" size={13} /> Kuota: {metrics.totalQuota} Santri
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Icon name="pie_chart" size={22} />
              </div>
            </Card>
          </div>

          {/* 4. Tab Navigation Bar */}
          <div className="bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-sm flex flex-wrap gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'branding' as AdminTab, label: 'CMS Branding & Identitas', icon: 'branding_watermark' },
              { id: 'waves' as AdminTab, label: 'Setting Gelombang & Kuota', icon: 'calendar_month' },
              { id: 'formbuilder' as AdminTab, label: 'Form & Dokumen Builder', icon: 'dynamic_form' },
              { id: 'noreg' as AdminTab, label: 'Generator Format Noreg', icon: 'pin' },
              { id: 'queue' as AdminTab, label: 'Antrean Verifikasi Berkas', icon: 'fact_check', badge: metrics.pendingDocs },
              { id: 'payments' as AdminTab, label: 'Pembayaran & VA', icon: 'payments' }
            ]
              .filter((tab) => allowedTabs.includes(tab.id))
              .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 5. Tab Content Sections */}
          <div>
            {activeTab === 'branding' && <CmsBrandingTab />}
            {activeTab === 'waves' && <WavesConfigTab />}
            {activeTab === 'formbuilder' && <FormBuilderTab />}
            {activeTab === 'noreg' && <NoregGeneratorTab />}
            {activeTab === 'queue' && <VerificationTab searchQuery={searchQuery} />}
            {activeTab === 'payments' && <PaymentsTab searchQuery={searchQuery} />}
          </div>
        </main>
      </div>

      {/* Mass Publish Embargo Modal */}
      {showMassPublishModal && (
        <MassPublishModal
          isOpen={showMassPublishModal}
          onClose={() => setShowMassPublishModal(false)}
        />
      )}
    </div>
  );
};
