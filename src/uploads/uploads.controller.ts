import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from '../common/utils/file-filter.util';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';
import { TenantContext } from '../tenant/tenant.context';

@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly tenantContext: TenantContext,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { fileFilter }))
  async uploadImage(@UploadedFile() file: any) {
    const orgName = this.tenantContext.getTenant();
    return this.uploadsService.uploadImage(file, orgName);
  }

  @Delete('image')
  async deleteImage(@Body('publicId') publicId: string) {
    const orgName = this.tenantContext.getTenant();
    if (!publicId?.startsWith(`des/${orgName}/`)) {
      throw new ForbiddenException('You do not have permission to delete this file');
    }
    return this.uploadsService.deleteImage(publicId);
  }
}
