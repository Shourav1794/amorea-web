import { products } from '@/utils/catalog';

export const clothingSizes = ['S', 'M', 'L', 'XL'] as const;

export type ClothingSize = (typeof clothingSizes)[number];
export type ProductSize = ClothingSize | '';

export function isSizedProduct(productId: number) {
  return productId === 1 || productId === 2;
}

export function getProductSize(productId: number, value: unknown): ProductSize | null {
  if (!products.some((product) => product.id === productId)) return null;

  if (isSizedProduct(productId)) {
    return typeof value === 'string'
      ? clothingSizes.find((size) => size === value) ?? null
      : null;
  }

  return value === undefined || value === null || value === '' ? '' : null;
}
