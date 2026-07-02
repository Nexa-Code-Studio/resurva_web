"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProductStatus = "Aman" | "Surplus" | "Flash Sale";

export interface VariantOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface VariantGroup {
  id: string;
  name: string;
  isRequired: boolean;
  maxSelections: number;
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category: string;
  quantity: number;
  minStock?: number;
  originalPrice: number;
  surplusPrice: number;
  expiryDate?: string; // ISO string e.g. "2026-06-15" (Optional for Reguler)
  status?: ProductStatus;
  imageUrl?: string;
  isPublished?: boolean;
  menuType?: "Surplus" | "Reguler";
  variantGroups?: VariantGroup[];
}

export type OrderStatus = "Menunggu Konfirmasi" | "Disiapkan" | "Siap Diambil" | "Selesai" | "Dibatalkan";
export type OrderType = "Online Delivery" | "Online Pickup" | "POS Dine-In" | "POS Take-Away";

export interface Order {
  id: string;
  customerName: string;
  items: { name: string; qty: number; options?: string[]; notes?: string }[];
  totalAmount: number;
  notes?: string;
  status: OrderStatus;
  orderType: OrderType;
  paymentMethod?: "Tunai" | "QRIS Xendit" | "Online Payment";
  driverInfo?: { name: string; licensePlate: string };
  createdAt: string;
}

interface MerchantContextProps {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const MerchantContext = createContext<MerchantContextProps | undefined>(undefined);

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-1",
      name: "Roti Cokelat",
      description: "Roti isi cokelat premium, cocok untuk sarapan.",
      sku: "BKR-001",
      category: "Bakery",
      quantity: 10,
      minStock: 15,
      originalPrice: 15000,
      surplusPrice: 7500,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours from now (Flash Sale)
      isPublished: true,
      menuType: "Surplus",
      variantGroups: [],
      imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "prod-2",
      name: "Nasi Goreng Ayam",
      description: "Nasi goreng ayam bumbu rempah.",
      sku: "MNB-002",
      category: "Makanan Berat",
      quantity: 5,
      minStock: 10,
      originalPrice: 25000,
      surplusPrice: 15000,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now (Surplus)
      isPublished: true,
      menuType: "Surplus",
      variantGroups: [
        {
          id: "vg-1",
          name: "Level Pedas",
          isRequired: true,
          maxSelections: 1,
          options: [
            { id: "opt-1", name: "Tidak Pedas", additionalPrice: 0 },
            { id: "opt-2", name: "Sedang", additionalPrice: 0 },
            { id: "opt-3", name: "Sangat Pedas", additionalPrice: 2000 },
          ]
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "prod-3",
      name: "Kopi Susu Gula Aren",
      description: "Es kopi susu dengan gula aren asli.",
      sku: "MNM-003",
      category: "Minuman",
      quantity: 20,
      minStock: 10,
      originalPrice: 20000,
      surplusPrice: 10000,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now (Aman)
      isPublished: false,
      menuType: "Reguler",
      variantGroups: [],
      imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=200&q=80",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Budi Santoso",
      items: [
        { name: "Seblak Mewah", qty: 2, options: ["Level Pedas 5", "Kerupuk Extra"], notes: "Kuahnya dibanyakin ya mas" },
        { name: "Es Teh Manis", qty: 2, options: ["Es Sedikit"] }
      ],
      totalAmount: 38000,
      status: "Menunggu Konfirmasi",
      orderType: "Online Delivery",
      paymentMethod: "Online Payment",
      notes: "Tolong cepat ya, saya lapar.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ORD-002",
      customerName: "Ahmad Dani",
      items: [
        { name: "Nasi Goreng Spesial", qty: 1, options: ["Tidak Pedas", "Telur Dadar"] }
      ],
      totalAmount: 25000,
      status: "Menunggu Konfirmasi",
      orderType: "Online Pickup",
      paymentMethod: "Online Payment",
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: "ORD-003",
      customerName: "Siti Aminah",
      items: [
        { name: "Ayam Penyet", qty: 1, options: ["Sambal Ijo"] },
        { name: "Es Jeruk", qty: 1 }
      ],
      totalAmount: 30000,
      status: "Disiapkan",
      orderType: "Online Delivery",
      paymentMethod: "Online Payment",
      driverInfo: { name: "Budi Driver", licensePlate: "N 4321 CX" },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "ORD-004",
      customerName: "Walk-in Pelanggan",
      items: [
        { name: "Kopi Hitam", qty: 2 },
        { name: "Roti Bakar", qty: 1, options: ["Coklat Keju"] }
      ],
      totalAmount: 45000,
      status: "Selesai",
      orderType: "POS Dine-In",
      paymentMethod: "Tunai",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "ORD-005",
      customerName: "Joko Widodo",
      items: [
        { name: "Soto Ayam", qty: 3, options: ["Pisah Kuah"] }
      ],
      totalAmount: 45000,
      status: "Siap Diambil",
      orderType: "Online Pickup",
      paymentMethod: "Online Payment",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "ORD-006",
      customerName: "Rina Nose",
      items: [
        { name: "Mie Goreng", qty: 1, notes: "Jangan pakai sayur sama sekali" }
      ],
      totalAmount: 18000,
      status: "Dibatalkan",
      orderType: "Online Delivery",
      paymentMethod: "Online Payment",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => 
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-4)}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <MerchantContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, orders, addOrder, updateOrderStatus }}>
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchantContext() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useMerchantContext must be used within a MerchantProvider");
  }
  return context;
}
