
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';

async function main() {
  const photosDir = path.join(process.cwd(), 'public', 'photos');
  const productsDir = path.join(process.cwd(), 'public', 'products');
  
  // Ensure products dir exists
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  const files = fs.readdirSync(photosDir).filter(file => file.startsWith('product-') && file.endsWith('.webp'));

  console.log(`Found ${files.length} images to process.`);

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const inputPath = path.join(photosDir, file);
    const outputPath = path.join(photosDir, file); // Overwrite
    const legacyPath = path.join(productsDir, file);

    try {
      // 1. Remove background
      // The library accepts file path or buffer. passing path is easiest.
      // Note: The library might return a blob.
      const blob = await removeBackground(inputPath);
      
      // 2. Convert Blob to Buffer
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Save back to file
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Saved transparent image to ${outputPath}`);

      // 4. Copy to legacy location
      fs.writeFileSync(legacyPath, buffer);
      console.log(`✅ Copied to ${legacyPath}`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
}

main().catch(console.error);
