export type Product = {
  id: string;
  tenantId: string;
  name: string;
  barcode?: string | null;
  sellPrice: number;
  costPrice?: number;
  stockQty: number;
  reorderLevel: number;
  vatInclusive: boolean;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  barcode?: string;
  sellPrice: number;
  costPrice?: number;
  stockQty?: number;
  reorderLevel?: number;
  vatInclusive?: boolean;
};
