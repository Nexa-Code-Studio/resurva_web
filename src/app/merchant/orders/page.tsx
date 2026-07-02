"use client";

import React, { useState, useMemo } from "react";
import { useMerchantContext, Order } from "@/lib/contexts/MerchantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Package, Clock, CheckCircle, XCircle, Store, Printer, CreditCard, Banknote, User, AlertCircle, NotepadText, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useMerchantContext();
  const [activeTab, setActiveTab] = useState<"Baru" | "Berlangsung" | "Selesai">("Baru");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Konfirmasi": return "bg-orange-50 text-orange-600 border-orange-200";
      case "Disiapkan": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Siap Diambil": return "bg-purple-50 text-purple-600 border-purple-200";
      case "Selesai": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Dibatalkan": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getOrderIcon = (type: string) => {
    if (type.includes("Delivery")) return <MapPin className="w-3.5 h-3.5" />;
    if (type.includes("Pickup")) return <Package className="w-3.5 h-3.5" />;
    return <Store className="w-3.5 h-3.5" />;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      let matchesTab = false;
      if (activeTab === "Baru") matchesTab = order.status === "Menunggu Konfirmasi";
      if (activeTab === "Berlangsung") matchesTab = ["Disiapkan", "Siap Diambil"].includes(order.status);
      if (activeTab === "Selesai") matchesTab = ["Selesai", "Dibatalkan"].includes(order.status);
      
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, activeTab, searchQuery]);

  // Actions
  const handleConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateOrderStatus(id, "Disiapkan");
    if (selectedOrderModal?.id === id) {
      setSelectedOrderModal(prev => prev ? { ...prev, status: "Disiapkan" } : null);
    }
  };

  const handleMarkReady = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateOrderStatus(id, "Siap Diambil");
    if (selectedOrderModal?.id === id) {
      setSelectedOrderModal(prev => prev ? { ...prev, status: "Siap Diambil" } : null);
    }
  };

  const handleHandover = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateOrderStatus(id, "Selesai");
    if (selectedOrderModal?.id === id) {
      setSelectedOrderModal(prev => prev ? { ...prev, status: "Selesai" } : null);
    }
  };

  const handleRejectClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOrderToReject(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (orderToReject && rejectReason) {
      updateOrderStatus(orderToReject, "Dibatalkan");
      if (selectedOrderModal?.id === orderToReject) {
        setSelectedOrderModal(prev => prev ? { ...prev, status: "Dibatalkan" } : null);
      }
      setRejectModalOpen(false);
      setOrderToReject(null);
    }
  };

  const handlePrint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.print();
  };

  // Komponen Resi Cetak (Struk Termal)
  const ThermalReceipt = ({ order }: { order: Order }) => {
    return (
      <div className="hidden print:block w-[80mm] max-w-[300px] mx-auto bg-white text-black font-sans p-4">
        {/* Header Logo */}
        <div className="text-center pb-2">
          <h2 className="text-xl font-extrabold flex justify-center items-center gap-1">
            <Store className="w-5 h-5 text-black" />
            Resurva
          </h2>
          <h3 className="font-bold text-lg mt-1">UMKM Berkah</h3>
        </div>

        {/* Order Number Box */}
        <div className="text-center font-bold text-xl border-y border-dashed border-black py-2 my-2">
          #{order.id.replace("ORD-", "")}
        </div>

        {/* Customer Info */}
        <div className="text-sm space-y-1 mb-3">
          <div className="flex">
            <span className="w-32">Pelanggan:</span>
            <span className="flex-1 font-semibold">{order.customerName}</span>
          </div>
          <div className="flex">
            <span className="w-32">Waktu Pesan:</span>
            <span className="flex-1">{new Date(order.createdAt).toLocaleString("id-ID", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex">
            <span className="w-32">Nomor Pesanan:</span>
            <span className="flex-1">{order.id}</span>
          </div>
          {order.notes && (
            <div className="flex pt-1 mt-1 border-t border-dotted">
              <span className="w-32 font-bold">Catatan:</span>
              <span className="flex-1 italic">"{order.notes}"</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-black pt-2 mb-2"></div>

        {/* Items */}
        <div className="text-sm space-y-3 mb-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex justify-between items-start">
                <span className="font-semibold pr-2">{item.qty} x {item.name}</span>
              </div>
              {item.options && item.options.length > 0 && (
                <span className="text-[11px] text-gray-700 ml-4 italic">- {item.options.join(", ")}</span>
              )}
              {item.notes && (
                <span className="text-[11px] text-gray-700 ml-4 font-bold">NB: {item.notes}</span>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black pt-2 mb-2"></div>

        {/* Totals */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between items-center font-bold">
            <span>Harga Pesanan</span>
            <span>Rp{order.totalAmount.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-start pt-2">
            <span>Metode pembayaran</span>
            <span className="text-right w-1/2 break-words">
              {order.paymentMethod?.includes("Online") || order.paymentMethod?.includes("QRIS") 
                ? "Online Telah dibayar" 
                : "Tunai"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedOrderModal) return null;
    const order = selectedOrderModal;
    const isOnlineDelivery = order.orderType === "Online Delivery";
    const showDriver = isOnlineDelivery && ["Disiapkan", "Siap Diambil", "Selesai"].includes(order.status);
    const canPrint = !["Menunggu Konfirmasi", "Dibatalkan"].includes(order.status);

    const steps = [
      { label: "Pesanan Masuk", active: true },
      { label: "Disiapkan", active: ["Disiapkan", "Siap Diambil", "Selesai"].includes(order.status) },
      { label: isOnlineDelivery ? "Kurir Menuju Lokasi" : "Siap Diambil", active: ["Siap Diambil", "Selesai"].includes(order.status) },
      { label: "Selesai", active: order.status === "Selesai" },
    ];

    if (order.status === "Dibatalkan") {
      steps.forEach(s => s.active = false);
      steps[0].active = true;
      steps.push({ label: "Dibatalkan", active: true });
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:bg-white print:p-0">
        
        {/* Web Modal UI (Hidden on Print) */}
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:hidden">
          {/* Header */}
          <div className="p-4 border-b bg-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                Detail Pesanan {order.id}
                <Badge variant="outline" className={`ml-2 bg-white ${order.orderType.includes('Delivery') ? 'border-blue-200 text-blue-700' : 'border-emerald-200 text-emerald-700'}`}>
                  {order.orderType}
                </Badge>
              </h3>
              <p className="text-sm text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
            </div>
            <div className="flex gap-2 items-start">
              {canPrint && (
                <Button variant="outline" size="sm" onClick={handlePrint} className="text-slate-600 border-slate-200">
                  <Printer className="w-4 h-4 mr-2" /> Cetak Resi
                </Button>
              )}
              <button onClick={() => setSelectedOrderModal(null)} className="text-slate-400 hover:text-slate-600 px-2 font-bold p-1 bg-slate-100 rounded-lg hover:bg-slate-200">✕</button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Stepper Timeline */}
            <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
                {order.status !== "Dibatalkan" && <div className="absolute top-1/2 left-0 h-1 bg-resurva-dark -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(steps.filter(s => s.active).length - 1) / (steps.length - 1) * 100}%` }}></div>}
                
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step.active 
                        ? (step.label === "Dibatalkan" ? "bg-red-500 text-white" : "bg-resurva-dark text-white ring-4 ring-resurva-green-muted") 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-medium text-center w-20 ${step.active ? (step.label === "Dibatalkan" ? "text-red-600" : "text-resurva-dark") : "text-slate-400"}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Note Alert */}
            {order.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">Catatan Pelanggan</h4>
                  <p className="text-sm text-amber-700 mt-1 italic">"{order.notes}"</p>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Pelanggan</p>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> {order.customerName}
                </p>
              </div>
              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Metode Pembayaran</p>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  {order.paymentMethod?.includes("QRIS") || order.paymentMethod?.includes("Online") ? <CreditCard className="w-4 h-4 text-slate-400" /> : <Banknote className="w-4 h-4 text-slate-400" />}
                  {order.paymentMethod || "Tunai"}
                </p>
              </div>
            </div>

            {/* Driver Info */}
            {showDriver && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Informasi Kurir</p>
                  <p className="font-semibold text-slate-900">{order.driverInfo?.name || "Budi Driver (Simulasi)"}</p>
                  <p className="text-sm text-slate-600">{order.driverInfo?.licensePlate || "N 1234 AB"}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                   <MapPin className="w-5 h-5" />
                </div>
              </div>
            )}

            {/* Item List */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Rincian Item</h4>
                <Badge className={`${getStatusColor(order.status)}`} variant="secondary">
                  Status: {order.status}
                </Badge>
              </div>
              
              <ul className="space-y-3 bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <li key={idx} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start text-sm">
                      <div className="flex gap-3">
                        <span className="font-bold text-resurva-dark bg-resurva-green-muted/30 px-2 py-0.5 rounded-md h-fit">{item.qty}x</span>
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          
                          {/* Options */}
                          {item.options && item.options.length > 0 && (
                            <div className="text-xs text-slate-500 font-medium">
                              {item.options.map((opt, i) => (
                                <span key={i} className="inline-block bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 mr-1 mb-1">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Item specific notes */}
                          {item.notes && (
                            <div className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                              <NotepadText className="w-3 h-3" />
                              Note: "{item.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                
                {/* Total Row */}
                <li className="p-4 bg-slate-50">
                  <div className="flex justify-between items-center border-slate-200">
                    <span className="font-bold text-slate-900 text-sm">Total Keseluruhan</span>
                    <span className="font-extrabold text-resurva-dark text-xl">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 border-t bg-white flex justify-end gap-3">
            {order.status === "Menunggu Konfirmasi" && (
              <div className="flex w-full gap-3">
                <Button variant="outline" className="w-1/2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={(e) => handleRejectClick(e, order.id)}>
                  Tolak Pesanan
                </Button>
                <Button className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={(e) => handleConfirm(e, order.id)}>
                  Konfirmasi & Siapkan
                </Button>
              </div>
            )}
            
            {order.status === "Disiapkan" && (
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold" onClick={(e) => handleMarkReady(e, order.id)}>
                <CheckCircle className="w-4 h-4 mr-2" /> Tandai Pesanan Siap
              </Button>
            )}
            
            {order.status === "Siap Diambil" && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={(e) => handleHandover(e, order.id)}>
                Serahkan ke Kurir/Pelanggan
              </Button>
            )}
          </div>
        </div>
        
        {/* Thermal Receipt UI (Hidden on Screen, Shows on Print) */}
        {canPrint && <ThermalReceipt order={order} />}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-8 print:p-0 print:m-0 print:bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pesanan</h2>
          <p className="text-slate-500">
            Kelola pesanan online dari marketplace dan offline dari POS.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Cari ID / Nama Pelanggan..." 
            className="pl-10 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 print:hidden overflow-x-auto hide-scrollbar">
        {(["Baru", "Berlangsung", "Selesai"] as const).map(tab => {
          let count = 0;
          if (tab === "Baru") count = orders.filter(o => o.status === "Menunggu Konfirmasi").length;
          if (tab === "Berlangsung") count = orders.filter(o => ["Disiapkan", "Siap Diambil"].includes(o.status)).length;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? "border-resurva-dark text-resurva-dark" 
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab ? "bg-resurva-dark text-white" : "bg-slate-200 text-slate-600"}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Grid Order List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 print:hidden">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500 border-2 border-dashed rounded-xl bg-slate-50/50">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-lg">Tidak ada pesanan di tab ini.</p>
            <p className="text-sm mt-1">Pesanan yang sesuai dengan filter akan muncul di sini.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const canPrint = !["Menunggu Konfirmasi", "Dibatalkan"].includes(order.status);
            const totalItemsCount = order.items.reduce((acc, item) => acc + item.qty, 0);
            const hasNotes = order.notes || order.items.some(i => i.notes);
            
            return (
              <Card 
                key={order.id} 
                className="overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-resurva-dark/40 transition-all cursor-pointer rounded-xl flex flex-col h-full"
                onClick={() => setSelectedOrderModal(order)}
              >
                {/* Header Compact */}
                <div className="p-4 pb-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-slate-500 shrink-0">{order.id}</span>
                    <Badge variant="outline" className={`shrink-0 flex items-center gap-1 bg-white ${order.orderType.includes('Delivery') ? 'border-blue-200 text-blue-700' : 'border-emerald-200 text-emerald-700'} px-1.5 py-0`}>
                      {getOrderIcon(order.orderType)}
                    </Badge>
                  </div>
                  
                  {/* Status Badge atau Print Icon */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(order.status)}`} variant="secondary">
                      {order.status}
                    </Badge>
                    {canPrint && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOrderModal(order); setTimeout(handlePrint, 100); }} 
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                        title="Cetak Resi"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-4 flex-1 flex flex-col gap-3 pointer-events-none">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight truncate" title={order.customerName}>
                      {order.customerName}
                    </h3>
                    <div className="flex items-center text-[11px] text-slate-500 font-medium mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total</p>
                      <div className="font-extrabold text-resurva-dark text-xl leading-none">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>

                  {/* Catatan Warning Label */}
                  {hasNotes && (
                    <div className="mt-1 flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 w-fit">
                      <AlertCircle className="w-3 h-3" /> Ada Catatan Khusus
                    </div>
                  )}
                  
                  {/* Item Summary (Compact Box) */}
                  <div className="mt-auto pt-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Daftar Item</p>
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700">Total {totalItemsCount} Item</span>
                      <span className="text-xs text-blue-600 font-medium flex items-center">Lihat Detail <ChevronRight className="w-3 h-3 ml-0.5" /></span>
                    </div>
                  </div>
                </div>
                
                {/* Footer Actions (Full width) */}
                {activeTab !== "Selesai" && (
                  <div className="p-3 border-t border-slate-100 bg-white">
                    {order.status === "Menunggu Konfirmasi" && (
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-1/2 text-red-600 border-red-200 hover:bg-red-50 text-xs px-0" 
                          onClick={(e) => handleRejectClick(e, order.id)}
                        >
                          Tolak
                        </Button>
                        <Button 
                          size="sm"
                          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-0" 
                          onClick={(e) => handleConfirm(e, order.id)}
                        >
                          Konfirmasi
                        </Button>
                      </div>
                    )}
                    
                    {order.status === "Disiapkan" && (
                      <Button 
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs" 
                        onClick={(e) => handleMarkReady(e, order.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Tandai Siap
                      </Button>
                    )}
                    
                    {order.status === "Siap Diambil" && (
                      <Button 
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold" 
                        onClick={(e) => handleHandover(e, order.id)}
                      >
                        Serahkan Pesanan
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-red-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Tolak Pesanan
              </h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Pilih alasan penolakan pesanan <strong>{orderToReject}</strong>. Pelanggan akan mendapatkan notifikasi pengembalian dana.
              </p>
              
              <div className="space-y-2">
                {["Stok Habis / Sold Out", "Toko Sedang Tutup / Sibuk", "Item Bermasalah", "Lainnya"].map(reason => (
                  <label key={reason} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="radio" 
                      name="rejectReason" 
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm font-medium text-slate-800">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Batal</Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={confirmReject}
                disabled={!rejectReason}
              >
                Konfirmasi Tolak
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {renderDetailModal()}
    </div>
  );
}
