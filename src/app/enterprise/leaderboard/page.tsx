"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Package, Leaf } from "lucide-react";

export default function LeaderboardPage() {
  const [filterPeriod, setFilterPeriod] = useState("Bulan Ini");
  const [filterCategory, setFilterCategory] = useState("Semua Kategori");

  const leaderboardData = [
    { rank: 1, name: "Cabang Jakarta Pusat", category: "Cafe", savedKg: 800, co2e: 4560, revenue: 11000000 },
    { rank: 2, name: "Cabang Surabaya", category: "Resto", savedKg: 420, co2e: 2394, revenue: 5600000 },
    { rank: 3, name: "Cabang Malang", category: "Bakery", savedKg: 350, co2e: 1995, revenue: 4200000 },
    { rank: 4, name: "Cabang Bandung", category: "Resto", savedKg: 290, co2e: 1653, revenue: 3800000 },
    { rank: 5, name: "Cabang Bali", category: "Cafe", savedKg: 210, co2e: 1197, revenue: 3100000 },
  ];

  const top3 = leaderboardData.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Leaderboard Kinerja Mitra</h2>
          <p className="text-slate-500 mt-1">
            Peringkat mitra berdasarkan performa reduksi sampah dan kontribusi pendapatan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
             <label className="text-xs font-semibold text-slate-500 uppercase">Periode</label>
             <select 
               className="flex h-9 w-[130px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
               value={filterPeriod}
               onChange={e => setFilterPeriod(e.target.value)}
             >
               <option>Bulan Ini</option>
               <option>Bulan Lalu</option>
               <option>Tahun Ini</option>
             </select>
          </div>
          <div className="space-y-1">
             <label className="text-xs font-semibold text-slate-500 uppercase">Kategori</label>
             <select 
               className="flex h-9 w-[140px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
               value={filterCategory}
               onChange={e => setFilterCategory(e.target.value)}
             >
               <option>Semua Kategori</option>
               <option>Cafe</option>
               <option>Resto</option>
               <option>Bakery</option>
             </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((mitra, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          return (
            <Card key={mitra.rank} className={`relative overflow-hidden border-2 ${isFirst ? 'border-amber-300 shadow-amber-100' : isSecond ? 'border-slate-300 shadow-slate-100' : 'border-orange-300 shadow-orange-100'} shadow-md transform transition-all hover:-translate-y-1`}>
              {/* Medal Indicator */}
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full flex justify-end items-start p-3 ${isFirst ? 'bg-amber-100' : isSecond ? 'bg-slate-100' : 'bg-orange-100'}`}>
                <span className="text-2xl drop-shadow-sm">
                  {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                </span>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className={isFirst ? 'text-amber-600' : isSecond ? 'text-slate-600' : 'text-orange-600'}>
                    Peringkat #{mitra.rank}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{mitra.category}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-5 pr-10 truncate">{mitra.name}</h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium">Pendapatan</span>
                    </div>
                    <span className="font-bold text-slate-900">Rp {(mitra.revenue / 1000000).toFixed(1)} Juta</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Package className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">Diselamatkan</span>
                    </div>
                    <span className="font-bold text-slate-900">{mitra.savedKg} Kg</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Reduksi CO₂e</span>
                    </div>
                    <span className="font-bold text-slate-900">{mitra.co2e.toLocaleString('id-ID')} Kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Daftar Lengkap Peringkat</h3>
          <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 shadow-sm">
            Total: {leaderboardData.length} Mitra
          </Badge>
        </div>
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-16 text-center font-bold">Rank</TableHead>
              <TableHead className="font-bold">Nama Mitra / Cabang</TableHead>
              <TableHead className="font-bold text-center">Kategori</TableHead>
              <TableHead className="text-right font-bold">Pendapatan</TableHead>
              <TableHead className="text-right font-bold">Limbah Diselamatkan</TableHead>
              <TableHead className="text-right font-bold">Emisi CO₂e</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((mitra) => (
              <TableRow key={mitra.name} className="hover:bg-slate-50/80 transition-colors">
                <TableCell className="text-center font-bold text-slate-700">
                  #{mitra.rank}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">{mitra.name}</TableCell>
                <TableCell className="text-center">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{mitra.category}</span>
                </TableCell>
                <TableCell className="text-right font-bold text-emerald-600">
                  Rp {mitra.revenue.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right font-medium text-slate-700">
                  {mitra.savedKg.toLocaleString("id-ID")} Kg
                </TableCell>
                <TableCell className="text-right text-slate-600">
                  {mitra.co2e.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
