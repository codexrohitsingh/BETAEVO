'use server';

import { 
  scanPhotosImpl, 
  updateProductImpl, 
  purchaseProductImpl,
  addToCartImpl,
  deleteProductImpl
} from '@/lib/product-service';

export async function scanPhotos() {
  return scanPhotosImpl();
}

export async function updateProduct(id: string, formData: FormData) {
  return updateProductImpl(id, formData);
}

export async function purchaseProduct(id: string) {
  return purchaseProductImpl(id);
}

export async function addToCart(id: string) {
  return addToCartImpl(id);
}

export async function deleteProduct(id: string) {
  return deleteProductImpl(id);
}
