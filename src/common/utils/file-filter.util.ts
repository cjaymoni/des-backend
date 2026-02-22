import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `File type '${file.mimetype}' is not allowed. Allowed: jpeg, png, webp, gif, pdf`,
      ),
      false,
    );
  }
  cb(null, true);
};
