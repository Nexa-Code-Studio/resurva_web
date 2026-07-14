"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Package, TrendingUp } from "lucide-react";

export default function EnterprisePage() {
  const recentActivities = [
    { id: 1, title: "Pendaftaran Mitra Baru", description: "Cabang Jakarta Pusat telah bergabung", time: "2 jam yang lalu", status: "success" },
    { id: 2, title: "Lonjakan Surplus", description: "Cabang Surabaya melaporkan 50kg surplus harian", time: "5 jam yang lalu", status: "warning" },
    { id: 3, title: "Pencairan Komisi", description: "Berhasil mencairkan komisi ke Cabang Malang", time: "1 hari yang lalu", status: "default" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ringkasan Eksekutif</h1>
          <p className="text-slate-500 mt-1">Pantau performa agregat mitra dan ringkasan aktivitas.</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Total Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">Rp 124.500.000</div>
            <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Total Mitra Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">42 Cabang</div>
            <p className="text-xs text-indigo-600 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +3 mitra baru bulan ini
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              Produk Surplus Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">128 SKU</div>
            <p className="text-xs text-slate-500 mt-1">
              Dari 15 cabang berbeda
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Konversi Penjualan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">68.5%</div>
            <p className="text-xs text-blue-600 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +2.4% dari minggu lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full mr-4 ${
                    activity.status === "success" ? "bg-emerald-500" :
                    activity.status === "warning" ? "bg-amber-500" : "bg-slate-300"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900 leading-none">{activity.title}</p>
                    <p className="text-sm text-slate-500">{activity.description}</p>
                  </div>
                  <div className="text-xs text-slate-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sekilas Performa Mitra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Cabang Jakarta Pusat</p>
                  <p className="text-xs text-slate-500">Peringkat 1 (Penjualan Tertinggi)</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">Rp 45.2M</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Cabang Surabaya</p>
                  <p className="text-xs text-slate-500">Peringkat 2</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">Rp 38.1M</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Cabang Bandung</p>
                  <p className="text-xs text-slate-500">Peringkat 3</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">Rp 22.4M</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
