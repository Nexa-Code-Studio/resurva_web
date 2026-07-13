"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, CheckCircle, XCircle, Eye, X, Building2, MapPin, FileText } from "lucide-react";

export default function MerchantVerificationPage() {
  const [verifications, setVerifications] = useState([
    { id: 1, name: "Kopi Senja", owner: "Budi Santoso", location: "Jakarta Selatan", type: "F&B", date: "2026-07-10", status: "Pending" },
    { id: 2, name: "Toko Roti Berkah", owner: "Siti Aminah", location: "Bandung", type: "Bakery", date: "2026-07-11", status: "Pending" },
    { id: 3, name: "Warung Nasi Cepat", owner: "Andi Saputra", location: "Surabaya", type: "F&B", date: "2026-07-12", status: "Pending" },
  ]);

  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  const handleAction = (id: number, action: "Approve" | "Reject") => {
    if (confirm(`Apakah Anda yakin ingin ${action === "Approve" ? "menyetujui" : "menolak"} pendaftaran merchant ini?`)) {
      setVerifications(verifications.filter(v => v.id !== id));
      setSelectedMerchant(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-slate-200/60 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-50 pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-resurva-dark" />
            Verifikasi Pendaftaran Merchant (Outlet Tunggal)
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Tinjau dan kelola pengajuan pendaftaran merchant baru yang menunggu persetujuan.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Nama Toko</th>
                  <th className="px-6 py-4 font-bold">Pemilik</th>
                  <th className="px-6 py-4 font-bold">Lokasi</th>
                  <th className="px-6 py-4 font-bold">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada pengajuan merchant baru saat ini.
                    </td>
                  </tr>
                ) : (
                  verifications.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name} <span className="ml-2 text-xs text-slate-400 font-normal">({item.type})</span></td>
                      <td className="px-6 py-4">{item.owner}</td>
                      <td className="px-6 py-4">{item.location}</td>
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => setSelectedMerchant(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, "Approve")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Setuju
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, "Reject")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
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

      {/* Detail Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMerchant(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Store className="w-5 h-5 text-resurva-dark" />
                Detail Pengajuan Merchant
              </h3>
              <button onClick={() => setSelectedMerchant(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Nama Toko</p>
                    <p className="text-base font-medium text-slate-900">{selectedMerchant.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Pemilik</p>
                    <p className="text-base font-medium text-slate-900">{selectedMerchant.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Kategori Bisnis</p>
                    <p className="text-base font-medium text-slate-900">{selectedMerchant.type}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> Lokasi</p>
                    <p className="text-base font-medium text-slate-900">{selectedMerchant.location}</p>
                    <p className="text-sm text-slate-500 mt-1">Jl. Contoh Alamat No. 123, Kelurahan, Kecamatan.</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Tanggal Pengajuan</p>
                    <p className="text-base font-medium text-slate-900">{selectedMerchant.date}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><FileText className="w-3 h-3"/> Dokumen Legalitas</p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                    <FileText className="w-4 h-4 text-rose-500" /> KTP_Pemilik.pdf
                  </div>
                  <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                    <FileText className="w-4 h-4 text-emerald-500" /> NIB_Toko.pdf
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedMerchant(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button 
                onClick={() => handleAction(selectedMerchant.id, "Reject")}
                className="px-6 py-2.5 rounded-xl font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors cursor-pointer flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Tolak
              </button>
              <button 
                onClick={() => handleAction(selectedMerchant.id, "Approve")}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" /> Setuju & Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
