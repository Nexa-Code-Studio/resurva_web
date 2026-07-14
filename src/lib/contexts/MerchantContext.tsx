"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiClient, getStoredUser } from "@/lib/api";

// ─── Shared types ─────────────────────────────────────────────────────────────

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

export interface ProductBatch {
  id: string;
  productId?: string;          // maps from backend inventory_batch.product_id
  qty: number;
  remainingQty: number;
  menuType: "Surplus" | "Reguler";
  batchTag?: string;
  expiryDate?: string;       // ISO String
  surplusStartDate?: string; // ISO String (was available_from)
  createdAt?: string;        // ISO String
}

export interface ProductIngredient {
  carbonCategory: string;
  percentage: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category: string;           // maps from product_type
  quantity: number;           // stock from backend
  weight: number;
  minStock?: number;
  originalPrice: number;
  surplusPrice: number;       // maps from discounted_price
  imageUrl?: string;
  isPublished?: boolean;
  autoSurplusEnabled?: boolean;
  surplusTriggerHours?: number;
  variantGroups?: VariantGroup[];
  batches?: ProductBatch[];
  ingredients?: ProductIngredient[];
  estimatedExpiryHours?: number;  // maps from expiry_time
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName?: string;       // resolved on frontend from products list
  sku?: string;               // resolved on frontend from products list
  storeId: string;
  inventoryBatchId?: string;
  batchTag?: string;
  type: string;
  quantity: number;
  qty?: number;               // alias for quantity, for backward compat
  reason: string;
  reference?: string;
  createdAt: string;
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

// ─── Backend response shapes (matching FastAPI schemas) ───────────────────────

interface BackendStore {
  id: string;
  name: string;
  address: string;
  city: string;
  longitude: number;
  latitude: number;
  business_id: string;
  is_active: boolean;
  category?: string;
  pickup_time?: string;
  image_url?: string;
  categories_data?: string;
}

interface BackendProduct {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  product_type: string;
  stock: number;
  weight: number;
  original_price: number;
  discounted_price: number;
  image_url?: string;
  is_published: boolean;
  auto_surplus_enabled: boolean;
  surplus_trigger_hours: number;
  expiry_time: number;
  variant_groups?: BackendVariantGroup[];
  ingredients?: { carbonCategory: string; percentage: number }[];
}

interface BackendVariantGroup {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  max_selections: number;
  options: BackendVariantOption[];
}

interface BackendVariantOption {
  id: string;
  variant_group_id: string;
  name: string;
  additional_price: number;
}

interface BackendBatch {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  remaining_quantity: number;
  expired_at: string;
  surplus_starts_at?: string;
  batch_tag?: string;
  created_at: string;
}

interface BackendStockTransaction {
  id: string;
  product_id: string;
  store_id: string;
  inventory_batch_id?: string;
  batch_tag?: string;
  type: string;
  quantity: number;
  reason: string;
  reference?: string;
  created_at: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapProductType(pt: string): string {
  const map: Record<string, string> = {
    "ready-to-eat": "Makanan Berat",
    packaged: "Makanan Kemasan",
    bakery: "Bakery",
    produce: "Produk Segar",
    other: "Lainnya",
  };
  return map[pt] ?? pt;
}

function unmapProductType(category: string): string {
  const map: Record<string, string> = {
    "Makanan Berat": "ready-to-eat",
    "Makanan Kemasan": "packaged",
    "Bakery": "bakery",
    "Produk Segar": "produce",
    "Lainnya": "other",
  };
  return map[category] ?? category;
}

function mapBackendProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    sku: p.sku,
    category: mapProductType(p.product_type),
    quantity: p.stock,
    weight: p.weight,
    originalPrice: p.original_price,
    surplusPrice: p.discounted_price,
    imageUrl: p.image_url,
    isPublished: p.is_published,
    autoSurplusEnabled: p.auto_surplus_enabled,
    surplusTriggerHours: p.surplus_trigger_hours,
    estimatedExpiryHours: p.expiry_time,
    ingredients: p.ingredients ?? [],
    variantGroups: (p.variant_groups ?? []).map((vg) => ({
      id: vg.id,
      name: vg.name,
      isRequired: vg.is_required,
      maxSelections: vg.max_selections,
      options: vg.options.map((o) => ({
        id: o.id,
        name: o.name,
        additionalPrice: o.additional_price,
      })),
    })),
  };
}

function mapBackendBatch(b: BackendBatch): ProductBatch {
  const now = Date.now();
  const surplusStart = b.surplus_starts_at ? new Date(b.surplus_starts_at).getTime() : null;
  const isSurplus = surplusStart !== null && surplusStart <= now;
  return {
    id: b.id,
    productId: b.product_id,
    qty: b.quantity,
    remainingQty: b.remaining_quantity,
    menuType: isSurplus ? "Surplus" : "Reguler",
    batchTag: b.batch_tag,
    expiryDate: b.expired_at,
    surplusStartDate: b.surplus_starts_at,
    createdAt: b.created_at,
  };
}

function mapStockTransaction(t: BackendStockTransaction, products: BackendProduct[] = []): StockTransaction {
  return {
    id: t.id,
    productId: t.product_id,
    storeId: t.store_id,
    inventoryBatchId: t.inventory_batch_id,
    batchTag: t.batch_tag,
    type: t.type,
    quantity: t.quantity,
    qty: Math.abs(t.quantity),
    reason: t.reason,
    reference: t.reference,
    createdAt: t.created_at,
  };
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface MerchantContextProps {
  storeId: string | null;
  products: Product[];
  loadingProducts: boolean;
  refetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | undefined>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  batches: ProductBatch[];
  loadingBatches: boolean;
  refetchBatches: () => Promise<void>;
  addBatch: (productId: string, qty: number, remainingQty: number, expiryDate: string, surplusStartDate?: string) => Promise<void>;
  updateBatch: (batchId: string, fields: { remaining_quantity?: number; expired_at?: string; surplus_starts_at?: string }) => Promise<void>;
  deleteBatch: (batchId: string) => Promise<void>;

  stockLogs: StockTransaction[];
  loadingLogs: boolean;
  refetchLogs: (productId?: string) => Promise<void>;

  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  categories: string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
}

const MerchantContext = createContext<MerchantContextProps | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [stockLogs, setStockLogs] = useState<StockTransaction[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Bakery", "Makanan Berat", "Minuman", "Makanan Kemasan", "Produk Segar", "Lainnya"]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Resolve storeId from localStorage on mount
  useEffect(() => {
    const user = getStoredUser();
    if (user?.store_id) {
      setStoreId(user.store_id);
    }
  }, []);

  // Fetch products when storeId is available
  // Fetch products when storeId is available
  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    setLoadingProducts(true);
    try {
      const data = await apiClient.get<PaginatedResponse<BackendProduct>>(
        `/products?store_id=${storeId}&page_size=200`
      );
      const mapped = data.items.map(mapBackendProduct);
      setProducts(mapped);

      // Dynamically load any categories that are returned from the backend products
      const loadedCats = Array.from(new Set(mapped.map(p => p.category)));
      setCategories(prev => Array.from(new Set([...prev, ...loadedCats])));
    } catch (err) {
      console.error("[MerchantContext] fetchProducts failed:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [storeId]);

  // Fetch active batches for the store
  const fetchBatches = useCallback(async () => {
    if (!storeId) return;
    setLoadingBatches(true);
    try {
      const data = await apiClient.get<BackendBatch[]>(
        `/inventory/store/${storeId}/batches`
      );
      setBatches(data.map(mapBackendBatch));
    } catch (err) {
      console.error("[MerchantContext] fetchBatches failed:", err);
    } finally {
      setLoadingBatches(false);
    }
  }, [storeId]);

  // Fetch store custom categories
  const fetchStoreCategories = useCallback(async () => {
    if (!storeId) return;
    try {
      const store = await apiClient.get<BackendStore>(`/stores/${storeId}`);
      if (store.categories_data) {
        const customCats = JSON.parse(store.categories_data);
        if (Array.isArray(customCats) && customCats.length > 0) {
          setCategories(customCats);
        }
      }
    } catch (err) {
      console.error("[MerchantContext] fetchStoreCategories failed:", err);
    }
  }, [storeId]);

  // Fetch stock movement logs
  const fetchLogs = useCallback(async (productId?: string) => {
    if (!storeId) return;
    setLoadingLogs(true);
    try {
      const qs = productId
        ? `/inventory/stock-logs?store_id=${storeId}&product_id=${productId}&page_size=100`
        : `/inventory/stock-logs?store_id=${storeId}&page_size=100`;
      const data = await apiClient.get<PaginatedResponse<BackendStockTransaction>>(qs);
      setStockLogs(data.items.map((t) => mapStockTransaction(t)));
    } catch (err) {
      console.error("[MerchantContext] fetchLogs failed:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
    fetchBatches();
    fetchStoreCategories();
  }, [fetchProducts, fetchBatches, fetchStoreCategories]);

  // ─── Product CRUD ────────────────────────────────────────────────────────────

  const addProduct = async (product: Omit<Product, "id">): Promise<Product | undefined> => {
    if (!storeId) return;
    const payload = {
      store_id: storeId,
      name: product.name,
      description: product.description,
      original_price: product.originalPrice,
      discounted_price: product.surplusPrice,
      stock: product.quantity,
      product_type: unmapProductType(product.category),
      expired_at: new Date(Date.now() + (product.estimatedExpiryHours ?? 24) * 3600 * 1000).toISOString(),
      image_url: product.imageUrl,
      sku: product.sku,
      weight: product.weight,
      is_published: product.isPublished ?? true,
      auto_surplus_enabled: product.autoSurplusEnabled ?? false,
      surplus_trigger_hours: product.surplusTriggerHours ?? 0,
      expiry_time: product.estimatedExpiryHours ?? 24,
      ingredients: product.ingredients ?? [],
      variant_groups: (product.variantGroups ?? []).map(vg => ({
        name: vg.name,
        is_required: vg.isRequired,
        max_selections: vg.maxSelections,
        options: (vg.options ?? []).map(opt => ({
          name: opt.name,
          additional_price: opt.additionalPrice
        }))
      }))
    };
    const created = await apiClient.post<BackendProduct>("/products", payload);
    const mapped = mapBackendProduct(created);
    setProducts((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const payload: Record<string, unknown> = {};
    if (updatedFields.name !== undefined) payload.name = updatedFields.name;
    if (updatedFields.description !== undefined) payload.description = updatedFields.description;
    if (updatedFields.originalPrice !== undefined) payload.original_price = updatedFields.originalPrice;
    if (updatedFields.surplusPrice !== undefined) payload.discounted_price = updatedFields.surplusPrice;
    if (updatedFields.quantity !== undefined) payload.stock = updatedFields.quantity;
    if (updatedFields.imageUrl !== undefined) payload.image_url = updatedFields.imageUrl;
    if (updatedFields.sku !== undefined) payload.sku = updatedFields.sku;
    if (updatedFields.weight !== undefined) payload.weight = updatedFields.weight;
    if (updatedFields.isPublished !== undefined) payload.is_published = updatedFields.isPublished;
    if (updatedFields.autoSurplusEnabled !== undefined) payload.auto_surplus_enabled = updatedFields.autoSurplusEnabled;
    if (updatedFields.surplusTriggerHours !== undefined) payload.surplus_trigger_hours = updatedFields.surplusTriggerHours;
    if (updatedFields.estimatedExpiryHours !== undefined) payload.expiry_time = updatedFields.estimatedExpiryHours;
    if (updatedFields.category !== undefined) payload.product_type = unmapProductType(updatedFields.category);
    if (updatedFields.ingredients !== undefined) payload.ingredients = updatedFields.ingredients;
    if (updatedFields.variantGroups !== undefined) {
      payload.variant_groups = updatedFields.variantGroups.map(vg => ({
        name: vg.name,
        is_required: vg.isRequired,
        max_selections: vg.maxSelections,
        options: (vg.options ?? []).map(opt => ({
          name: opt.name,
          additional_price: opt.additionalPrice
        }))
      }));
    }

    const updated = await apiClient.put<BackendProduct>(`/products/${id}`, payload);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...mapBackendProduct(updated) } : p))
    );
  };

  const deleteProduct = async (id: string) => {
    await apiClient.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ─── Batch CRUD ──────────────────────────────────────────────────────────────

  const addBatch = async (
    productId: string,
    qty: number,
    remainingQty: number,
    expiryDate: string,
    surplusStartDate?: string
  ) => {
    if (!storeId) return;
    const payload = {
      product_id: productId,
      store_id: storeId,
      quantity: qty,
      remaining_quantity: remainingQty,
      expired_at: expiryDate,
      surplus_starts_at: surplusStartDate ?? null,
    };
    const created = await apiClient.post<BackendBatch>("/inventory/batches", payload);
    setBatches((prev) => [mapBackendBatch(created), ...prev]);
    // Refresh products list to show new stock totals in the main inventory page
    await fetchProducts();
    await fetchLogs(productId);
  };

  const updateBatch = async (
    batchId: string,
    fields: { remaining_quantity?: number; expired_at?: string; surplus_starts_at?: string }
  ) => {
    const updated = await apiClient.put<BackendBatch>(`/inventory/batches/${batchId}`, fields);
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? mapBackendBatch(updated) : b))
    );
    // Refresh products list to show updated stock totals in the main inventory page
    await fetchProducts();
    await fetchLogs(updated.product_id);
  };

  const deleteBatch = async (batchId: string) => {
    // Find the batch first to know which product it belongs to for refetch logs
    const batch = batches.find((b) => b.id === batchId);
    await apiClient.delete(`/inventory/batches/${batchId}`);
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
    // Refresh products list to show updated stock totals in the main inventory page
    await fetchProducts();
    if (batch) {
      await fetchLogs(batch.productId);
    }
  };

  // ─── Orders (still local – no backend order management in scope) ─────────────

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: `ORD-${Date.now().toString().slice(-4)}` };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ─── Categories ──────────────────────────────────────────────────────────────

  const addCategory = async (name: string) => {
    if (!storeId) return;
    if (!categories.includes(name)) {
      const newCats = [...categories, name];
      setCategories(newCats);
      try {
        await apiClient.put(`/stores/${storeId}`, {
          categories_data: JSON.stringify(newCats),
        });
      } catch (err) {
        console.error("Failed to save category on backend:", err);
      }
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    if (!storeId) return;
    const newCats = categories.map((c) => (c === oldName ? newName : c));
    setCategories(newCats);
    try {
      await apiClient.put(`/stores/${storeId}`, {
        categories_data: JSON.stringify(newCats),
      });
    } catch (err) {
      console.error("Failed to update store categories list on backend:", err);
    }

    const targetProducts = products.filter((p) => p.category === oldName);
    for (const p of targetProducts) {
      try {
        await updateProduct(p.id, { category: newName });
      } catch (err) {
        console.error(`Failed to update category for product ${p.id}:`, err);
      }
    }
  };

  const deleteCategory = async (name: string) => {
    if (!storeId) return;
    const newCats = categories.filter((c) => c !== name);
    setCategories(newCats);
    try {
      await apiClient.put(`/stores/${storeId}`, {
        categories_data: JSON.stringify(newCats),
      });
    } catch (err) {
      console.error("Failed to delete category from store metadata on backend:", err);
    }

    const targetProducts = products.filter((p) => p.category === name);
    for (const p of targetProducts) {
      try {
        await updateProduct(p.id, { category: "Lainnya" });
      } catch (err) {
        console.error(`Failed to reset category for product ${p.id}:`, err);
      }
    }
  };

  return (
    <MerchantContext.Provider
      value={{
        storeId,
        products,
        loadingProducts,
        refetchProducts: fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        batches,
        loadingBatches,
        refetchBatches: fetchBatches,
        addBatch,
        updateBatch,
        deleteBatch,
        stockLogs,
        loadingLogs,
        refetchLogs: fetchLogs,
        orders,
        addOrder,
        updateOrderStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
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
