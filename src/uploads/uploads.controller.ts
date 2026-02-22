import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any, @Request() req) {
    const orgName = req.headers['x-org-name'] || 'default';
    return this.uploadsService.uploadImage(file, orgName);
  }

  @Delete('image')
  async deleteImage(@Body('publicId') publicId: string) {
    return this.uploadsService.deleteImage(publicId);
  }
}
