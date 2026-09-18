import React, { useState } from 'react';
import { useSPMB, getRoleLabel } from '@spmb/shared';
import { Button, Badge, Icon } from '@spmb/ui';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const { branding, adminUsers, loginAdmin } = useSPMB();

  const [identifier, setIdentifier] = useState('abdullah.panitia@alhikmah.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const ok = loginAdmin(identifier, password);
      if (ok) {
        onLoginSuccess();
      } else {
        setError('Email/NIP tidak terdaftar atau kata sandi salah.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = (email: string) => {
    loginAdmin(email);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        {/* Left Column: Institutional Dignity & Security Badges */}
        <div className="lg:w-5/12 bg-emerald-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.pesantrenName}
                  className="h-10 w-auto object-contain brightness-125"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center font-serif font-bold text-xl">
                  AH
                </div>
              )}
              <div>
                <span className="font-serif font-bold text-base text-white block leading-tight">
                  {branding.pesantrenName}
                </span>
                <span className="text-[11px] text-emerald-300 uppercase tracking-widest font-semibold">
                  Sistem SPMB Core Internal
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Gerbang Kelola Admisi Santri Baru</span>
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed pt-1">
              Pusat kendali terpadu verifikasi berkas, seleksi CBT akademik, wawancara tahfidz, dan pengesahan kelulusan santri tahun ajaran {branding.academicYear}.
            </p>
          </div>

          {/* Center Image */}
          <div className="relative z-10 my-6">
            <div className="relative h-40 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCspebQweKF0G6Uj8oPQfiOQTCM_zQkuaGGihWSwbgDi9GyfdAiJqGQEIWFPDJZkrd3_KKVxIvqXyCNSvqKlFBuw_BSjQHTHOnKrj5Knr5HYdUx95ddB1fNr0Yw93Z-wxspOuZ0QJ5GErInFQuRrZ0nhUBbGdq9iBlHLGy6DX2i61pj2f6AVL3ZYHZ8_w7bG9sbhcEfGG7Xi_wTM2-xOG0fuNVN_fLz0O8h9t68Rp5Kx3VpPoS4v373"
                alt="Pesantren"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  Integritas &bull; Amanah &bull; Profesional
                </p>
                <p className="text-[11px] text-emerald-100">Dewan Penguji & Panitia SPMB Terpadu</p>
              </div>
            </div>
          </div>

          {/* Security details */}
          <div className="relative z-10 p-3.5 rounded-xl bg-emerald-900/80 border border-emerald-700/60 text-[11px] text-emerald-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1">
                <Icon name="verified_user" size={14} /> 256-Bit SSL Enforced
              </span>
              <span className="flex items-center gap-1">
                <Icon name="security_update_good" size={14} /> Audit Log Aktif
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70">
              Setiap aktivitas akses divalidasi dengan identifikasi digital IP dan pencatatan transaksi formulir secara real-time.
            </p>
          </div>
        </div>

        {/* Right Column: Panitia Login Form */}
        <div className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Top badges */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900">
                <Icon name="badge" size={14} />
                Portal Khusus Panitia & Dewan Guru
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900">
                <Icon name="lock_clock" size={14} />
                Sesi Terenkripsi
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Masuk Admin Panel SPMB
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan akun resmi kepanitiaan Anda untuk mengakses data calon santri dan verifikasi berkas.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Panitia atau NIP Pegawai *
                </label>
                <div className="relative">
                  <Icon name="person" size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="email@alhikmah.sch.id / NIP"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi Panitia *
                  </label>
                </div>
                <div className="relative">
                  <Icon name="lock" size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md"
                iconRight="arrow_forward"
                type="submit"
                isLoading={isLoading}
              >
                Masuk ke Admin SPMB
              </Button>
            </form>

            {/* Quick 1-Click Demo Login */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                ⚡ Demo 1-Klik Masuk Panitia:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {adminUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(user.email)}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-left border border-slate-200 hover:border-emerald-300 transition-colors text-xs"
                  >
                    <span className="font-bold text-slate-900 block truncate">{user.name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      {getRoleLabel(user.role).label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {branding.pesantrenName}. Sistem Terproteksi.
          </div>
        </div>
      </div>
    </div>
  );
};
