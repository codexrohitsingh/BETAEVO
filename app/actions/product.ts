'use server';

import { 
  scanPhotosImpl, 
  updateProductImpl, 
  purchaseProductImpl 
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
