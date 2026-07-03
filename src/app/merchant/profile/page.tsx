"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Store, MapPin, Clock, ShieldCheck, Save, CheckCircle2, Building2, Lock, ArrowRight } from "lucide-react";

const TRANSLATIONS = {
  en: {
    title: "Store Profile",
    description: "Manage your store details, operating hours, and enterprise integration settings.",
    saveBtn: "Save Settings",
    successMsg: "Profile settings saved successfully!",
    generalSection: "General Information",
    storeName: "Store Name",
    storeDesc: "Store Description",
    storeCategory: "Store Category",
    storeAddress: "Store Address",
    logoLabel: "Store Logo",
    bannerLabel: "Store Banner",
    uploadPlaceholder: "Click or drag to upload",
    operationSection: "Operating Hours & Status",
    openingHours: "Opening Hours",
    closingHours: "Closing Hours",
    isOpenLabel: "Open for Orders",
    isOpenDesc: "If disabled, customers cannot place orders on the marketplace.",
    integrationSection: "Enterprise Status",
    integrationDesc: "Verify your corporate link. Independent stores can scale up by registering a new enterprise.",
    statusLabel: "Business Model",
    standaloneLabel: "Independent Store (Standalone)",
    standaloneDesc: "You operate as a standalone business. Your corporate model is independent.",
    enterpriseBranchLabel: "Enterprise Managed Outlet",
    enterpriseBranchDesc: "Your outlet is managed and owned by a parent corporate enterprise.",
    parentEnterpriseName: "Parent Enterprise Name",
    branchId: "Branch ID / Location Name",
    lockedTooltip: "Locked: Branch model is governed by your parent corporate account.",
    growTitle: "Scale Up Your Business",
    growDesc: "Register a parent corporate Enterprise account to manage multiple branches, access bulk analytics, and consolidate sustainability reports.",
    registerEnterpriseBtn: "Register Enterprise Account",
    modalTitle: "Register Parent Enterprise",
    modalDesc: "Establish a corporate profile to link and govern your retail outlets.",
    corpName: "Corporate Entity Name",
    corpPic: "Corporate PIC Name",
    corpEmail: "Corporate Email Address",
    corpPhone: "Corporate Phone Number",
    submitBtn: "Establish Enterprise",
    cancelBtn: "Cancel",
    alertRegistered: "Your store is now successfully linked to the new Enterprise!"
  },
  id: {
    title: "Profil Toko",
    description: "Kelola detail toko Anda, jam operasional, dan pengaturan integrasi enterprise.",
    saveBtn: "Simpan Pengaturan",
    successMsg: "Profil toko berhasil diperbarui!",
    generalSection: "Informasi Umum",
    storeName: "Nama Toko",
    storeDesc: "Deskripsi Toko",
    storeCategory: "Kategori Toko",
    storeAddress: "Alamat Toko",
    logoLabel: "Logo Toko",
    bannerLabel: "Banner Toko",
    uploadPlaceholder: "Klik untuk mengunggah gambar",
    operationSection: "Jam Operasional & Status",
    openingHours: "Jam Buka",
    closingHours: "Jam Tutup",
    isOpenLabel: "Buka untuk Pesanan",
    isOpenDesc: "Jika dinonaktifkan, pelanggan tidak dapat memesan makanan di marketplace.",
    integrationSection: "Status Enterprise",
    integrationDesc: "Verifikasi keterkaitan korporasi Anda. Toko mandiri dapat berkembang dengan mendaftarkan enterprise baru.",
    statusLabel: "Model Bisnis",
    standaloneLabel: "Toko Mandiri (Standalone)",
    standaloneDesc: "Anda beroperasi sebagai bisnis mandiri. Model korporasi Anda adalah independen.",
    enterpriseBranchLabel: "Outlet Terkelola Enterprise",
    enterpriseBranchDesc: "Outlet Anda dikelola dan dimiliki oleh perusahaan induk enterprise.",
    parentEnterpriseName: "Nama Enterprise Induk",
    branchId: "ID Cabang / Nama Lokasi",
    lockedTooltip: "Terkunci: Model cabang diatur langsung oleh akun induk korporasi Anda.",
    growTitle: "Kembangkan Bisnis Anda",
    growDesc: "Daftarkan akun Enterprise induk untuk mengelola banyak cabang, mengakses analitik gabungan, dan mengonsolidasi laporan emisi karbon.",
    registerEnterpriseBtn: "Daftarkan Akun Enterprise",
    modalTitle: "Daftar Enterprise Induk",
    modalDesc: "Buat profil korporasi untuk menghubungkan dan mengatur outlet ritel Anda.",
    corpName: "Nama Entitas Korporasi",
    corpPic: "Nama PIC Korporasi",
    corpEmail: "Alamat Email Korporasi",
    corpPhone: "Nomor Telepon Korporasi",
    submitBtn: "Buat Akun Enterprise",
    cancelBtn: "Batal",
    alertRegistered: "Toko Anda sekarang berhasil terhubung dengan Enterprise baru!"
  }
};

export default function MerchantProfilePage() {
  const [lang, setLang] = useState<"en" | "id">("en");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Profile state
  const [storeName, setStoreName] = useState("UMKM Berkah");
  const [description, setDescription] = useState("Menyediakan aneka roti, kue, dan makanan berat fresh harian.");
  const [category, setCategory] = useState("Bakery & Cafe");
  const [address, setAddress] = useState("Jl. Soekarno Hatta No. 45, Lowokwaru, Malang");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&h=150&q=80");
  const [bannerUrl, setBannerUrl] = useState("");
  
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [isOpenForOrders, setIsOpenForOrders] = useState(true);

  // Enterprise Model state
  const [isBranchOfEnterprise, setIsBranchOfEnterprise] = useState(true); // Default to branch from beginning (locked model)
  const [parentEnterpriseName, setParentEnterpriseName] = useState("UMKM Berkah Group");
  const [branchLocation, setBranchLocation] = useState("Cabang Malang");

  // Registration modal for standalone stores
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newCorpName, setNewCorpName] = useState("");
  const [newCorpPic, setNewCorpPic] = useState("");
  const [newCorpEmail, setNewCorpEmail] = useState("");
  const [newCorpPhone, setNewCorpPhone] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage") as "en" | "id" | null;
    if (savedLang) {
      setLang(savedLang);
    }

    const handleLangChange = () => {
      const currentSaved = localStorage.getItem("preferredLanguage") as "en" | "id" | null;
      if (currentSaved) {
        setLang(currentSaved);
      }
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(t.successMsg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleRegisterEnterprise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorpName) return;

    // Transition to Enterprise branch
    setParentEnterpriseName(newCorpName);
    setBranchLocation(storeName + " - Main Outlet");
    setIsBranchOfEnterprise(true);
    setIsRegisterModalOpen(false);

    setToastMessage(t.alertRegistered);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setLogoUrl(url);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBannerUrl(url);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 w-full pb-24 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">{t.title}</h2>
        <p className="text-slate-500 text-sm">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Settings Column */}
        <form onSubmit={handleSave} className="space-y-6 lg:col-span-2">
          {/* General Settings */}
          <Card className="border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Store className="w-5 h-5 text-resurva-dark" />
                {t.generalSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Media Upload Column */}
                <div className="w-full sm:w-1/3 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-650">{t.logoLabel}</Label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center h-36 bg-slate-50 relative overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-20 h-20 rounded-full object-cover shadow-sm border border-slate-200" />
                      ) : (
                        <span className="text-[10px] text-slate-400">No image</span>
                      )}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-650">{t.bannerLabel}</Label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center h-28 bg-slate-50 relative overflow-hidden">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400">{t.uploadPlaceholder}</span>
                      )}
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* General Details Column */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="storeName">{t.storeName}</Label>
                      <Input 
                        id="storeName" 
                        value={storeName} 
                        onChange={(e) => setStoreName(e.target.value)} 
                        className="rounded-xl border-slate-200"
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="storeCategory">{t.storeCategory}</Label>
                      <Input 
                        id="storeCategory" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="storeDesc">{t.storeDesc}</Label>
                    <Textarea 
                      id="storeDesc" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      rows={2} 
                      className="rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="storeAddress" className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {t.storeAddress}
                    </Label>
                    <Input 
                      id="storeAddress" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours Settings */}
          <Card className="border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-resurva-dark" />
                {t.operationSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="openTime">{t.openingHours}</Label>
                  <Input 
                    id="openTime" 
                    type="time" 
                    value={openTime} 
                    onChange={(e) => setOpenTime(e.target.value)} 
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="closeTime">{t.closingHours}</Label>
                  <Input 
                    id="closeTime" 
                    type="time" 
                    value={closeTime} 
                    onChange={(e) => setCloseTime(e.target.value)} 
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                <div className="space-y-0.5 max-w-[80%]">
                  <Label className="text-sm font-semibold text-slate-800">{t.isOpenLabel}</Label>
                  <p className="text-xs text-slate-500">{t.isOpenDesc}</p>
                </div>
                <Switch checked={isOpenForOrders} onCheckedChange={setIsOpenForOrders} />
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button type="submit" className="bg-resurva-dark hover:bg-resurva-dark-light text-white rounded-xl shadow-lg px-8 font-bold flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t.saveBtn}
            </Button>
          </div>
        </form>

        {/* Enterprise Status Sidecard */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-resurva-dark" />
                {t.integrationSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isBranchOfEnterprise ? (
                /* Enterprise branch: read-only info */
                <div className="space-y-4">
                  <div className="p-3.5 bg-resurva-green-muted/20 border border-resurva-dark/25 rounded-xl flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-resurva-dark mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{t.enterpriseBranchLabel}</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">{t.lockedTooltip}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.parentEnterpriseName}</span>
                      <p className="text-sm font-semibold text-slate-800">{parentEnterpriseName}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.branchId}</span>
                      <p className="text-sm font-semibold text-slate-850">{branchLocation}</p>
                    </div>
                  </div>
                  
                  {/* Simulate unlink for test demo */}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-[10px]"
                    onClick={() => setIsBranchOfEnterprise(false)}
                  >
                    Demo: Reset to Standalone Store
                  </Button>
                </div>
              ) : (
                /* Standalone merchant: can register Enterprise scale-up */
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl">
                    <p className="text-xs font-bold text-blue-800">{t.standaloneLabel}</p>
                    <p className="text-[10px] text-blue-650 mt-1 leading-normal">{t.standaloneDesc}</p>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800">{t.growTitle}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{t.growDesc}</p>
                    <Button 
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold py-2 shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {t.registerEnterpriseBtn}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enterprise Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b bg-indigo-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-indigo-900 text-sm">{t.modalTitle}</h3>
                <p className="text-[10px] text-indigo-650 mt-0.5">{t.modalDesc}</p>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-650">✕</button>
            </div>
            <form onSubmit={handleRegisterEnterprise} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="newCorpName" className="text-xs">{t.corpName}</Label>
                <Input 
                  id="newCorpName"
                  value={newCorpName}
                  onChange={(e) => setNewCorpName(e.target.value)}
                  className="rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newCorpPic" className="text-xs">{t.corpPic}</Label>
                <Input 
                  id="newCorpPic"
                  value={newCorpPic}
                  onChange={(e) => setNewCorpPic(e.target.value)}
                  className="rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newCorpEmail" className="text-xs">{t.corpEmail}</Label>
                <Input 
                  id="newCorpEmail"
                  type="email"
                  value={newCorpEmail}
                  onChange={(e) => setNewCorpEmail(e.target.value)}
                  className="rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newCorpPhone" className="text-xs">{t.corpPhone}</Label>
                <Input 
                  id="newCorpPhone"
                  value={newCorpPhone}
                  onChange={(e) => setNewCorpPhone(e.target.value)}
                  className="rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <Button type="button" variant="outline" className="rounded-xl h-9" onClick={() => setIsRegisterModalOpen(false)}>
                  {t.cancelBtn}
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9">
                  {t.submitBtn}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
