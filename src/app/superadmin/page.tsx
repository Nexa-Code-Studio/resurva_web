"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  Wind, 
  Recycle, 
  Users, 
  Store, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function SuperadminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Utama Superadmin</h1>
          <p className="text-slate-500 mt-1">Pantau seluruh aktivitas pengguna, metrik keberlanjutan global, dan antrean sistem.</p>
        </div>
      </div>

      {/* 1. Global Sustainability Metrics */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          Dampak Keberlanjutan Global
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-500" />
                Total Surplus Diselamatkan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">24.5 Ton</div>
              <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +1.2 Ton dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                Total Reduksi Emisi CO₂
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">38.200 Kg</div>
              <p className="text-xs text-blue-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +2.100 Kg dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-resurva-dark" />
                Total Transaksi Surplus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">142.850</div>
              <p className="text-xs text-slate-500 mt-1">Transaksi sukses lintas platform</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Platform Growth Metrics & Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Growth Metrics */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-resurva-dark" />
            Pertumbuhan Platform
          </h2>
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-resurva-green-muted flex items-center justify-center">
                      <Users className="w-5 h-5 text-resurva-dark" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Total Pengguna (Customers)</p>
                      <p className="text-xs text-slate-500">Akun terdaftar aktif</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">45.2K</p>
                    <p className="text-xs text-emerald-600 font-bold">+2.4K bulan ini</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Store className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Total Mitra (Merchant & Enterprise)</p>
                      <p className="text-xs text-slate-500">Cabang dan UMKM terdaftar</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">1.250</p>
                    <p className="text-xs text-emerald-600 font-bold">+45 bulan ini</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Global GMV</p>
                      <p className="text-xs text-slate-500">Perputaran transaksi keseluruhan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">Rp 4.5 Milyar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Queue (To-Do List) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            Antrean Verifikasi (To-Do)
          </h2>
          <Card className="border-slate-200/60 shadow-sm border-l-4 border-l-rose-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-900">Perlu Tindakan Segera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <Link href="/superadmin/verifications/merchant" className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-slate-400 group-hover:text-resurva-dark transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Verifikasi Merchant Tunggal</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> 3 pengajuan menunggu
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                  </div>
                </Link>

                <Link href="/superadmin/verifications/enterprise" className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-400 group-hover:text-resurva-dark transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Verifikasi Enterprise</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> 2 pengajuan menunggu
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
