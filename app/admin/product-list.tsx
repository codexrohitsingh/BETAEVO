'use client'

import { updateProduct, deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

type AdminProduct = {
  id: string;
  imagePath: string;
  name: string | null;
  description: string | null;
  price: number | null;
  discountPercentage: number;
  stock: number;
};

export default function AdminProductList({ products }: { products: AdminProduct[] }) {
  return (
    <div className="grid gap-6">
      {products.map(product => (
        <ProductEditor key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductEditor({ product }: { product: AdminProduct }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await updateProduct(product.id, formData);
    setLoading(false);
    alert("Updated!");
  }
  
  async function handleDelete() {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    setLoading(true);
    const result = await deleteProduct(product.id);
    setLoading(false);
    if (result?.success) {
      window.location.reload();
    } else {
      alert("Failed to delete product");
    }
  }

  return (
    <div className="border p-4 rounded flex flex-col md:flex-row gap-4 bg-white shadow-sm">
      <div className="w-32 h-32 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <Image 
            src={product.imagePath} 
            alt="Product" 
            fill 
            className="object-contain" 
        />
      </div>
      <form action={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
                name="name" 
                defaultValue={product.name || ""}
                className="w-full border rounded p-2 text-sm font-medium"
                placeholder="Product Name"
            />
        </div>
        <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
                name="description" 
                defaultValue={product.description || ""}
                className="w-full border rounded p-2 text-sm"
                rows={2}
                placeholder="Add description..."
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input 
                type="number" 
                name="price" 
                step="0.01"
                defaultValue={product.price || ""}
                className="w-full border rounded p-2"
                placeholder="0.00"
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <input 
                type="number" 
                name="discountPercentage" 
                defaultValue={product.discountPercentage || 0}
                className="w-full border rounded p-2"
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input 
                type="number" 
                name="stock" 
                defaultValue={product.stock || 50}
                className="w-full border rounded p-2"
            />
        </div>
        <div className="flex items-end">
            <div className="flex w-full gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" disabled={loading} onClick={handleDelete}>
                  Delete
              </Button>
            </div>
        </div>
      </form>
    </div>
  )
}
