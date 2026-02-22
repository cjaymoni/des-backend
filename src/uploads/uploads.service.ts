import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs';

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: any, orgName: string) {
    if (!file || !file.path) {
      throw new Error('No file provided');
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `des/${orgName}`,
        resource_type: 'auto',
      });

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } finally {
      try {
        unlinkSync(file.path);
      } catch {
        /* already deleted or never written */
      }
    }
  }

  async deleteImage(publicId: string) {
    console.log('Attempting to delete from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    console.log('Cloudinary delete response:', result);
    return { success: true, result };
  }
}
