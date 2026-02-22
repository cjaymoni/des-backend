import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

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
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  }
}
