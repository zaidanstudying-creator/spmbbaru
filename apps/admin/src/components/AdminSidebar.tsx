import React from 'react';
import { useSPMB, getAdminRoleAllowedTabs, canRoleManageEmbargo, getRoleLabel } from '@spmb/shared';
import { Icon, Badge } from '@spmb/ui';

export type AdminTab = 'dashboard' | 'branding' | 'waves' | 'formbuilder' | 'noreg' | 'queue' | 'payments' | 'konten' | 'akun';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenMassPublish: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMassPublish,
  onLogout
}) => {
  const { branding, metrics, currentAdmin } = useSPMB();
  const roleInfo = getRoleLabel(currentAdmin?.role);
  const allowedTabs = getAdminRoleAllowedTabs(currentAdmin?.role);
  const canPub = canRoleManageEmbargo(currentAdmin?.role);
  const showNav = (tab: AdminTab) => allowedTabs.includes(tab);

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.pesantrenName}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-emerald-800 text-white flex items-center justify-center font-serif font-bold text-sm">
              AH
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm text-emerald-950 truncate">
              Admin SPMB Core
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              e-PPDB Pesantren Terpadu
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Section 1: Operasional Harian */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Operasional Harian
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon name="grid_view" size={18} />
                <span>Dashboard Utama</span>
              </button>

              {showNav('queue') && (
                <button
                  onClick={() => onSelectTab('queue')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeTab === 'queue'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name="fact_check" size={18} />
                    <span>Verifikasi Berkas</span>
                  </div>
                  {metrics.pendingDocs > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {metrics.pendingDocs}
                    </span>
                  )}
                </button>
              )}

              {showNav('payments') && (
                <button
                  onClick={() => onSelectTab('payments')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeTab === 'payments'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon name="payments" size={18} />
                  <span>Pembayaran & VA</span>
                </button>
              )}

              {canPub && (
                <button
                  onClick={onOpenMassPublish}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-all text-left"
                >
                  <Icon name="campaign" size={18} className="text-amber-700" />
                  <span>Publikasi Kelulusan</span>
                </button>
              )}
            </nav>
          </div>

          {/* Section 2: Konfigurasi SPMB */}
          {showNav('waves') || showNav('noreg') || showNav('formbuilder') ? (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Konfigurasi SPMB
              </span>
              <nav className="space-y-1">
                {showNav('waves') && (
                  <button
                    onClick={() => onSelectTab('waves')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      activeTab === 'waves'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon name="date_range" size={18} />
                    <span>Setting Gelombang</span>
                  </button>
                )}

                {showNav('noreg') && (
                  <button
                    onClick={() => onSelectTab('noreg')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      activeTab === 'noreg'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon name="pin" size={18} />
                    <span>Format No. Registrasi</span>
                  </button>
                )}

                {showNav('formbuilder') && (
                  <button
                    onClick={() => onSelectTab('formbuilder')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      activeTab === 'formbuilder'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon name="dynamic_form" size={18} />
                    <span>Form & Syarat Builder</span>
                  </button>
                )}
              </nav>
            </div>
          ) : null}

          {/* Section 3: CMS Portal Publik */}
          {(showNav('branding') || showNav('konten')) && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CMS Portal Publik
              </span>
              <nav className="space-y-1">
                {showNav('branding') && (
                <button
                  onClick={() => onSelectTab('branding')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeTab === 'branding'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon name="branding_watermark" size={18} />
                  <span>Branding & Yayasan</span>
                </button>
                )}
                {showNav('konten') && (
                <button
                  onClick={() => onSelectTab('konten')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeTab === 'konten'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon name="edit_note" size={18} />
                  <span>Konten & Halaman</span>
                </button>
                )}
                {showNav('akun') && (
                <button
                  onClick={() => onSelectTab('akun')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeTab === 'akun'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon name="manage_accounts" size={18} />
                  <span>Akun Admin</span>
                </button>
                )}
              </nav>
            </div>
          )}
          </div>

        {/* Footer info & server status */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">Server PPDB Aktif</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">v2.5.0</span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs ${roleInfo.badgeClass}`}>
            <Icon name={roleInfo.icon} size={16} />
            <span className="font-bold">{roleInfo.label}</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 text-center text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Icon name="logout" size={16} />
            <span>Keluar Sesi Panitia</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
