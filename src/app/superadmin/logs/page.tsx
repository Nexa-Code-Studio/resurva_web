"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Search, Filter, Monitor, Smartphone, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function SystemLogsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const [logs] = useState([
    { id: 1, timestamp: "2026-07-13 10:45:12", source: "Mobile Kasir", severity: "Info", event: "User login successful", user: "kasir@kopisenja.com", ip: "114.122.14.5" },
    { id: 2, timestamp: "2026-07-13 10:42:05", source: "Web Dashboard", severity: "Warning", event: "Failed login attempt (3x)", user: "admin@resurva.com", ip: "103.44.22.1" },
    { id: 3, timestamp: "2026-07-13 10:30:00", source: "Mobile Pelanggan", severity: "Error", event: "Payment Gateway Timeout", user: "budi.customer@gmail.com", ip: "182.253.44.11" },
    { id: 4, timestamp: "2026-07-13 10:15:22", source: "Web Dashboard", severity: "Info", event: "Exported SDG Report PDF", user: "hq@boga.com", ip: "114.122.10.88" },
    { id: 5, timestamp: "2026-07-13 09:55:10", source: "Mobile Kasir", severity: "Info", event: "Created new transaction #TRX-9921", user: "kasir@tokoberkah.com", ip: "114.122.14.5" },
    { id: 6, timestamp: "2026-07-13 09:12:45", source: "System", severity: "Error", event: "Database Backup Failed", user: "system", ip: "localhost" },
    { id: 7, timestamp: "2026-07-13 08:30:00", source: "Mobile Pelanggan", severity: "Info", event: "Claimed Surplus Promo", user: "siti.a@gmail.com", ip: "182.253.44.11" },
  ]);

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.event.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    
    let matchPlatform = true;
    if (platformFilter !== "all") {
      matchPlatform = log.source === platformFilter;
    }

    let matchSeverity = true;
    if (severityFilter !== "all") {
      matchSeverity = log.severity.toLowerCase() === severityFilter.toLowerCase();
    }

    return matchSearch && matchPlatform && matchSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Info": return <Info className="w-4 h-4 text-blue-500" />;
      case "Warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "Error": return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes("Web")) return <Monitor className="w-4 h-4 text-slate-500" />;
    if (source.includes("Mobile")) return <Smartphone className="w-4 h-4 text-slate-500" />;
    return <Monitor className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-slate-200/60 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-50 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-resurva-dark" />
                Riwayat Log Sistem Terpadu
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Pantau seluruh aktivitas dari aplikasi Web Dashboard, Mobile Kasir, dan Mobile Pelanggan.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari event atau user..." 
                  className="pl-9 w-full h-10 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-resurva-dark transition-colors"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <select 
                className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-resurva-dark text-slate-600"
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
              >
                <option value="all">Semua Platform</option>
                <option value="Web Dashboard">Web Dashboard</option>
                <option value="Mobile Kasir">Mobile Kasir</option>
                <option value="Mobile Pelanggan">Mobile Pelanggan</option>
                <option value="System">System</option>
              </select>

              <select 
                className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-resurva-dark text-slate-600"
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
              >
                <option value="all">Semua Tingkat</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600 font-mono">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 font-sans">
                <tr>
                  <th className="px-6 py-4 font-bold">Waktu (Timestamp)</th>
                  <th className="px-6 py-4 font-bold">Tingkat</th>
                  <th className="px-6 py-4 font-bold">Sumber Platform</th>
                  <th className="px-6 py-4 font-bold">Event / Aktivitas</th>
                  <th className="px-6 py-4 font-bold">User & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans">
                      Tidak ada log yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getSeverityIcon(log.severity)}
                          <span className={`text-xs font-bold ${
                            log.severity === 'Error' ? 'text-rose-600' : 
                            log.severity === 'Warning' ? 'text-amber-600' : 'text-blue-600'
                          }`}>{log.severity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          {getSourceIcon(log.source)}
                          {log.source}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{log.event}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800">{log.user}</span>
                          <span className="text-xs text-slate-400">{log.ip}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl font-sans">
            <span className="text-sm text-slate-500">
              Menampilkan {filteredLogs.length} entri log
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
