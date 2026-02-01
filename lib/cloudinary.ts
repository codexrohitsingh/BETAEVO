import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
// Note: keys match the provided .env file format
cloudinary.config({
  cloud_name: process.env.cloud || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.apikey || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.apisecret || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
