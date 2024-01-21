import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const cloud = {
  uploadSingle: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: 'single',
        })
        .then((result) => {
          if (result) {
            fs.unlinkSync(file);
            resolve({
              url: result.secure_url,
            });
          }
        });
    });
  },
  uploadMultiple: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: 'home',
        })
        .then((result) => {
          if (result) {
            fs.unlinkSync(file);
            resolve({
              url: result.secure_url,
              id: result.public_id,
              thumb1: cloud.reSizeImage(result.public_id, 200, 200),
              main: cloud.reSizeImage(result.public_id, 500, 500),
              thumb2: cloud.reSizeImage(result.public_id, 300, 300),
            });
          }
        });
    });
  },
  reSizeImage: (id, h, w) => {
    return cloudinary.url(id, {
      height: h,
      width: w,
      crop: 'scale',
      format: 'jpg',
    });
  },
};
