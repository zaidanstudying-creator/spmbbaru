import React, { useState } from 'react';
import { useSPMB, AdminUser, AdminRole } from '@spmb/shared';
import { Button, Badge, Icon, Card } from '@spmb/ui';

const ROLE_OPTIONS: { id: AdminRole; label: string }[] = [
  { id: 'KETUA_PANITIA', label: 'Ketua Panitia' },
  { id: 'ADMIN_SUPER', label: 'Admin Super' },
  { id: 'VERIFIKATOR', label: 'Verifikator Berkas' },
  { id: 'BENDAHARA', label: 'Bendahara' }
];

const inputCls = 'w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30';

export const AccountTab: React.FC = () => {
  const { adminUsers, currentAdmin, updateAdminUser, addAdminUser } = useSPMB();
  const [toast, setToast] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [newAdmin, setNewAdmin] = useState<AdminUser>({
    id: '',
    name: '',
    nip: '',
    email: '',
    password: '',
    role: 'VERIFIKATOR',
    avatarUrl: ''
  });

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Akun Admin & Panitia</h2>
          <Badge variant="emerald" size="sm">{adminUsers.length} Akun</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Ubah identitas, kontak, peran, dan kata sandi akun panitia. Perubahan langsung berlaku untuk login berikutnya.
        </p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Icon name="check_circle" size={18} className="text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {adminUsers.map((adm) => (
        <Card key={adm.id} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {adm.avatarUrl ? (
                <img src={adm.avatarUrl} alt={adm.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                  {adm.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 block text-sm">{adm.name}</span>
                <span className="text-[11px] text-slate-500">{adm.email}</span>
              </div>
            </div>
            {currentAdmin?.id === adm.id && (
              <Badge variant="amber" size="sm">Sesi Aktif</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <input className={inputCls} value={adm.name} onChange={(e) => updateAdminUser(adm.id, { name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">NIP / ID Pegawai</label>
              <input className={inputCls} value={adm.nip} onChange={(e) => updateAdminUser(adm.id, { nip: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Login</label>
              <input className={inputCls} value={adm.email} onChange={(e) => updateAdminUser(adm.id, { email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Peran / Hak Akses</label>
              <select
                className={inputCls}
                value={adm.role}
                onChange={(e) => updateAdminUser(adm.id, { role: e.target.value as AdminRole })}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">URL Foto Profil</label>
              <input className={inputCls} value={adm.avatarUrl} onChange={(e) => updateAdminUser(adm.id, { avatarUrl: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="flex items-center gap-2">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={inputCls}
                  value={adm.password || ''}
                  placeholder="Belum diatur"
                  onChange={(e) => updateAdminUser(adm.id, { password: e.target.value })}
                />
                <button onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-slate-800 p-1 shrink-0">
                  <Icon name={showPass ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="sm" iconLeft="save" onClick={() => flash(`Akun ${adm.name} berhasil diperbarui.`)}>
              Simpan Akun
            </Button>
          </div>
        </Card>
      ))}

      {/* Tambah Admin */}
      <Card className="p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon name="person_add" size={20} className="text-emerald-700" /> Tambah Akun Panitia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Nama lengkap" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
          <input className={inputCls} placeholder="NIP / ID Pegawai" value={newAdmin.nip} onChange={(e) => setNewAdmin({ ...newAdmin, nip: e.target.value })} />
          <input className={inputCls} placeholder="Email login" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
          <input className={inputCls} placeholder="Kata sandi" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
          <select className={inputCls} value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminRole })}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <input className={inputCls} placeholder="URL foto profil (opsional)" value={newAdmin.avatarUrl} onChange={(e) => setNewAdmin({ ...newAdmin, avatarUrl: e.target.value })} />
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            iconLeft="add"
            onClick={() => {
              if (!newAdmin.name.trim() || !newAdmin.email.trim()) {
                flash('Nama dan email wajib diisi.');
                return;
              }
              const created = { ...newAdmin, id: `adm-${Date.now()}` } as AdminUser;
              addAdminUser(created);
              setNewAdmin({ id: '', name: '', nip: '', email: '', password: '', role: 'VERIFIKATOR', avatarUrl: '' });
              flash('Akun panitia baru ditambahkan.');
            }}
          >
            Tambah Akun
          </Button>
        </div>
      </Card>
    </div>
  );
};
