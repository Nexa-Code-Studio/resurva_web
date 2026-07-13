"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, Shield, X, CheckCircle2 } from "lucide-react";

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [users, setUsers] = useState([
    { id: 1, name: "Budi Santoso", email: "budi@merchant.com", role: "Merchant", status: "Active", joinedAt: "2026-01-15" },
    { id: 2, name: "PT Resurva Group", email: "admin@resurva.com", role: "Enterprise", status: "Active", joinedAt: "2026-02-20" },
    { id: 3, name: "Siti Aminah", email: "siti.a@gmail.com", role: "Customer", status: "Active", joinedAt: "2026-05-10" },
    { id: 4, name: "Admin Utama", email: "superadmin@modal.yuk", role: "Superadmin", status: "Active", joinedAt: "2025-12-01" },
    { id: 5, name: "Toko Berkah", email: "berkah@merchant.com", role: "Merchant", status: "Suspended", joinedAt: "2026-04-05" },
  ]);

  const [formData, setFormData] = useState({ id: 0, name: "", email: "", role: "Merchant", status: "Active" });

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setFormData(user);
      setIsEditMode(true);
    } else {
      setFormData({ id: 0, name: "", email: "", role: "Merchant", status: "Active" });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setUsers(users.map(u => u.id === formData.id ? { ...u, ...formData } : u));
    } else {
      setUsers([{ ...formData, id: Date.now(), joinedAt: new Date().toISOString().substring(0, 10) }, ...users]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-slate-200/60 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-50 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2 shrink-0">
              <Shield className="w-5 h-5 text-resurva-dark" />
              Daftar Pengguna Aplikasi
            </CardTitle>
            
            <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              <button 
                onClick={() => handleOpenModal()}
                className="bg-resurva-dark hover:bg-resurva-dark-light text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer self-end shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Pengguna
              </button>

              <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="pl-9 w-full h-10 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-resurva-dark transition-colors"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => setRoleFilter("all")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${roleFilter === "all" ? "bg-white text-resurva-dark-light shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >Semua</button>
                  <button
                    onClick={() => setRoleFilter("merchant")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${roleFilter === "merchant" ? "bg-white text-resurva-dark-light shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >Merchant</button>
                  <button
                    onClick={() => setRoleFilter("enterprise")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${roleFilter === "enterprise" ? "bg-white text-resurva-dark-light shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >Enterprise</button>
                  <button
                    onClick={() => setRoleFilter("customer")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${roleFilter === "customer" ? "bg-white text-resurva-dark-light shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >Customer</button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Nama Pengguna</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Peran (Role)</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Tanggal Bergabung</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          user.role === 'Superadmin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'Enterprise' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'Merchant' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                          user.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.joinedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(user)}
                            className="p-1.5 text-slate-400 hover:text-resurva-dark hover:bg-resurva-green-muted rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{isEditMode ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-resurva-dark"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Lengkap</label>
                <input 
                  type="email" 
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-resurva-dark"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Peran (Role)</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-resurva-dark font-medium"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Merchant">Merchant</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-resurva-dark font-medium"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold bg-resurva-dark text-white hover:bg-resurva-dark-light transition-colors cursor-pointer shadow-md shadow-resurva-dark/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
