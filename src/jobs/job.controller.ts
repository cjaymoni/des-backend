import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobService, JobTrackingService, CreateJobTrackingDto, UpdateJobTrackingDto } from './job.service';
import { CreateJobDto, UpdateJobDto, SearchJobDto } from './job.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Job } from './job.entity';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobController {
  constructor(private service: JobService) {}

  @Get('next-number')
  nextNumber(
    @Query('transType') transType: string,
    @Query('a2IdfNo') a2IdfNo: string,
    @Query('finType') finType: string,
  ): Promise<string> {
    return this.service.nextNumber(transType, a2IdfNo, finType);
  }

  @Get('debit-notes')
  getAllDebitNotes() {
    return this.service.getAllDebitNotes();
  }

  @Get('debit-note/:jobNo')
  getDebitNote(@Param('jobNo') jobNo: string) {
    return this.service.getDebitNote(jobNo);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchJobDto,
  ): Promise<PaginatedResult<Job>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Job> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<Job> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<Job> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

@Controller('job-tracking')
@UseGuards(AuthGuard('jwt'))
export class JobTrackingController {
  constructor(private service: JobTrackingService) {}

  @Get(':jobNo')
  findByJob(@Param('jobNo') jobNo: string) {
    return this.service.findByJob(jobNo);
  }

  @Post()
  create(@Body() data: CreateJobTrackingDto, @Req() req) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateJobTrackingDto, @Req() req) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
