import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { fileFilter } from '../../common/utils/file-filter.util';
import { HouseManifestService } from '../services/house-manifest.service';
import { UploadsService } from '../../uploads/uploads.service';
import {
  CreateHouseManifestDto,
  UpdateHouseManifestDto,
  SearchHouseManifestDto,
} from '../dto/house/house-manifest.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { HouseManifest } from '../entities/house-manifest.entity';

import { TenantContext } from '../../tenant/tenant.context';

@Controller('manifests/house')
@UseGuards(AuthGuard('jwt'))
export class HouseManifestController {
  constructor(
    private service: HouseManifestService,
    private uploadsService: UploadsService,
    private tenantContext: TenantContext,
  ) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchHouseManifestDto,
  ): Promise<PaginatedResult<HouseManifest>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<HouseManifest> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './temp-uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter,
    }),
  )
  async create(
    @Body() data: CreateHouseManifestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: { user: { id: string } },
  ): Promise<HouseManifest> {
    let attachments: { url: string; publicId: string; filename: string }[] = [];

    if (files && files.length > 0) {
      const orgName = this.tenantContext.getTenant();
      try {
        for (const file of files) {
          const result = await this.uploadsService.uploadImage(file, orgName);
          attachments.push({
            url: result.data.url,
            publicId: result.data.publicId,
            filename: file.originalname,
          });
        }
      } catch (err) {
        // Clean up any temp files not yet processed by uploadImage
        for (const file of files) {
          try {
            unlinkSync(file.path);
          } catch {
            /* already deleted */
          }
        }
        throw err;
      }
    }

    return this.service.create({ ...data, attachments }, req.user.id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './temp-uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter,
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHouseManifestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ): Promise<HouseManifest> {
    if (files && files.length > 0) {
      const orgName = this.tenantContext.getTenant();
      const attachments: { url: string; publicId: string; filename: string }[] = [];
      try {
        for (const file of files) {
          const result = await this.uploadsService.uploadImage(file, orgName);
          attachments.push({
            url: result.data.url,
            publicId: result.data.publicId,
            filename: file.originalname,
          });
        }
      } catch (err) {
        for (const file of files) {
          try { unlinkSync(file.path); } catch { /* already deleted */ }
        }
        throw err;
      }
      return this.service.addAttachments(id, attachments, req.user.id);
    }
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
