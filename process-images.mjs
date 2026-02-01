import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('../../photos');
const DEST_DIR = path.resolve('public/products');
const DATA_FILE = path.resolve('lib/data/products.ts');

const CATEGORIES = ['Smartwatches', 'Smart Audio', 'Smart Glasses', 'Accessories'];

const ADJECTIVES = ['Premium', 'Ultra', 'Pro', 'Elite', 'Smart', 'Advanced', 'Sleek', 'Modern'];
const NOUNS = ['Watch', 'Buds', 'Glasses', 'Band', 'Speaker', 'Headphones', 'Tracker', 'Hub'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProductMetadata(index, filename, sourceFilename) {
  if (sourceFilename && sourceFilename.toLowerCase().includes('strape')) {
    return {
      id: `prod-${index + 1}`,
      name: `Premium Smart Strap ${String.fromCharCode(65 + (index % 5))}`,
      description: "Upgrade your wearable experience with our Premium Smart Strap. Engineered for comfort, durability, and style, this strap is the perfect companion for your active lifestyle.",
      price: 29.99,
      category: "Accessories",
      image: `/products/${filename}`,
      isNew: true,
      rating: "4.9",
      reviews: getRandomInt(10, 50),
      features: "Sweat-resistant, Quick Release, Premium Silicone, Universal Fit",
      originalPrice: 39.99,
      discount: 25,
      colors: ["#000000", "#FF4500", "#1E90FF"],
      soldOut: false
    };
  }

  const category = CATEGORIES[index % CATEGORIES.length];
  const adj = ADJECTIVES[index % ADJECTIVES.length];
  const noun = NOUNS[index % NOUNS.length];
  // Try to match noun to category slightly if possible, but random is safer than wrong
  let name = `${adj} ${noun} ${String.fromCharCode(65 + (index % 26))}${getRandomInt(10, 99)}`;
  
  // Simple heuristic adjustments
  if (category === 'Smartwatches') name = `${adj} Watch ${String.fromCharCode(65 + (index % 5))} Series`;
  if (category === 'Smart Audio') name = `${adj} Pods ${getRandomInt(100, 900)}`;
  if (category === 'Smart Glasses') name = `${adj} Vision ${getRandomInt(1, 5)}.0`;

  const price = getRandomInt(49, 299) + 0.99;
  
  return {
    id: `prod-${index + 1}`,
    name,
    description: `Experience the future with the ${name}. Featuring advanced connectivity, premium build quality, and all-day battery life. Perfect for the modern lifestyle.`,
    price,
    category,
    image: `/products/${filename}`,
    isNew: index < 4, // First few are "New"
    rating: (Math.random() * (5 - 4) + 4).toFixed(1), // 4.0 to 5.0
    reviews: getRandomInt(10, 500),
    features: "Advanced AI integration, 24/7 Health Monitoring, Water Resistant",
    originalPrice: parseFloat((price * 1.2).toFixed(2)),
    discount: 20,
    colors: ["#000000", "#1E3A8A", "#F5F5DC"],
    soldOut: Math.random() > 0.9 // 10% chance of being sold out
  };
}

async function processImages() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => /\.(jpe?g|png|webp)$/i.test(file))
    .filter(file => file.toLowerCase().includes('strape'));
  const products = [];

  console.log(`Found ${files.length} images. Processing...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourcePath = path.join(SOURCE_DIR, file);
    const destFilename = `product-${i + 1}.webp`;
    const destPath = path.join(DEST_DIR, destFilename);

    try {
      // Image Processing Pipeline
      // 1. Resize to square (1000x1000) with white background (contain)
      // 2. Modulate for "pop" (slight saturation/brightness boost)
      // 3. Convert to WebP
      await sharp(sourcePath)
        .resize(1000, 1000, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .modulate({
          brightness: 1.05,
          saturation: 1.1
        })
        .webp({ quality: 85 })
        .toFile(destPath);
      
      console.log(`Processed: ${file} -> ${destFilename}`);

      const metadata = generateProductMetadata(i, destFilename, file);
      products.push(metadata);

    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  // Generate Data File
  const fileContent = `export interface Product {
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

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, fileContent);
  console.log(`Generated metadata for ${products.length} products at ${DATA_FILE}`);
}

processImages();
