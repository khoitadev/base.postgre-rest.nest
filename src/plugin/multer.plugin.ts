import path from 'path';
import fs from 'fs';
import * as multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const generateFileName = (originalname: string) => {
  const c = originalname.lastIndexOf('.');
  let extension = originalname.slice(c + 1);
  let name = originalname.slice(0, c);
  name = name.replace(/\n|[^\w\s]/gi, '');
  extension = extension.toLowerCase();
  const unique = name.replaceAll(' ', '_').slice(0, 20) + '_' + Date.now();
  return `${unique}.${extension}`;
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const fileDir = path.join(__dirname, '.~/.~/upload');
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      cb(null, `${fileDir}`);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

export const multerOptions: multer.Options = {
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024,
    files: 10,
  },
};

export const cloud = cloudinary;
