import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HouseManifestService } from '../services/house-manifest.service';
import { UploadsService } from '../../uploads/uploads.service';
import { TenantContext } from '../../tenant/tenant.context';

@Controller('manifests/house/:id/attachments')
@UseGuards(AuthGuard('jwt'))
export class HouseManifestAttachmentsController {
  constructor(
    private houseManifestService: HouseManifestService,
    private uploadsService: UploadsService,
    private tenantContext: TenantContext,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadAttachments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: { user: { id: string } },
  ): Promise<any> {
    const orgName = this.tenantContext.getTenant();
    const uploadedFiles: { url: string; publicId: string; filename: string }[] =
      [];

    for (const file of files) {
      const result = await this.uploadsService.uploadImage(file, orgName);
      uploadedFiles.push({
        url: result.data.url,
        publicId: result.data.publicId,
        filename: file.originalname,
      });
    }

    return await this.houseManifestService.addAttachments(
      id,
      uploadedFiles,
      req.user.id,
    );
  }

  @Delete(':publicId')
  async removeAttachment(
    @Param('id') id: string,
    @Param('publicId') publicId: string,
    @Req() req: { user: { id: string } },
  ): Promise<any> {
    const decodedPublicId = decodeURIComponent(publicId);
    try {
      await this.uploadsService.deleteImage(decodedPublicId);
    } catch {
      // Ignore cloud deletion errors; still remove from DB
    }
    return await this.houseManifestService.removeAttachment(
      id,
      decodedPublicId,
      req.user.id,
    );
  }
}
