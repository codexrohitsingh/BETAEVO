export interface Product {
  id: string;
  name: string;
  description: string;
  features: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  image: string;
  isNew: boolean;
  rating: string;
  reviews: number;
  colors: string[];
  soldOut: boolean;
}

export const products: Product[] = [
  {
    "id": "prod-1",
    "name": "ActiveFlex Silicone Straps 22m",
    "description": "Upgrade your wearable experience with our Premium Smart Strap. Engineered for comfort, durability, and style, this strap is the perfect companion for your active lifestyle.",
    "price": 299,
    "category": "Accessories",
    "image": "/products/product-1.webp",
    "isNew": true,
    "rating": "1.0",
    "reviews": 1,
    "features": "Silicone Material | 22 MM | Compatible with All Models",
    "originalPrice": 1299,
    "discount": 75,
    "colors": [
      "#000000",
      "#C0C0C0",
      "#FFC0CB",
      "#000080",
      "#800000",
      "#A0522D",
      "#556B2F"
    ],
    "soldOut": false
  },
  {
    "id": "prod-2",
    "name": "Premium Smart Strap B",
    "description": "Upgrade your wearable experience with our Premium Smart Strap. Engineered for comfort, durability, and style, this strap is the perfect companion for your active lifestyle.",
    "price": 29.99,
    "category": "Accessories",
    "image": "/products/product-2.webp",
    "isNew": true,
    "rating": "4.9",
    "reviews": 38,
    "features": "Sweat-resistant, Quick Release, Premium Silicone, Universal Fit",
    "originalPrice": 39.99,
    "discount": 25,
    "colors": [
      "#000000",
      "#FF4500",
      "#1E90FF"
    ],
    "soldOut": false
  },
  {
    "id": "prod-3",
    "name": "Premium Smart Strap C",
    "description": "Upgrade your wearable experience with our Premium Smart Strap. Engineered for comfort, durability, and style, this strap is the perfect companion for your active lifestyle.",
    "price": 29.99,
    "category": "Accessories",
    "image": "/products/product-3.webp",
    "isNew": true,
    "rating": "4.9",
    "reviews": 48,
    "features": "Sweat-resistant, Quick Release, Premium Silicone, Universal Fit",
    "originalPrice": 39.99,
    "discount": 25,
    "colors": [
      "#000000",
      "#FF4500",
      "#1E90FF"
    ],
    "soldOut": false
  },
  {
    "id": "prod-4",
    "name": "Premium Smart Strap D",
    "description": "Upgrade your wearable experience with our Premium Smart Strap. Engineered for comfort, durability, and style, this strap is the perfect companion for your active lifestyle.",
    "price": 29.99,
    "category": "Accessories",
    "image": "/products/product-4.webp",
    "isNew": true,
    "rating": "4.9",
    "reviews": 24,
    "features": "Sweat-resistant, Quick Release, Premium Silicone, Universal Fit",
    "originalPrice": 39.99,
    "discount": 25,
    "colors": [
      "#000000",
      "#FF4500",
      "#1E90FF"
    ],
    "soldOut": false
  }
];
