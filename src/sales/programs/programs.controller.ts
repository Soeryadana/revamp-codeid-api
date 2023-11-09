import {
  UseGuards,
  UseInterceptors,
  StreamableFile,
  Controller,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Header,
  Param,
  Body,
  Get,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { UsersDto } from './dto/programs-user.dto';
import { UsersEducationDto } from './dto/programs-user-education.dto';

@Controller('api/revamp-codeid/programs')
export class ProgramsController {
  constructor(private Services: ProgramsService) {}

  @Get('/')
  public async getPrograms(
    @Query('orderBy', new DefaultValuePipe('Popular')) orderBy: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe(null)) search: string,
  ) {
    return this.Services.getPrograms(orderBy, search, {
      page: page,
      limit: limit,
    });
  }

  @Get('view')
  public async viewDetail(
    @Query('progEntityId', ParseIntPipe) progEntityId: number,
  ) {
    return this.Services.viewDetail(progEntityId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('apply-progress')
  public async getApplyProgress(
    @Query('userEntityId') userEntityId: number,
    @Query('progEntityId') progEntityId: number,
  ) {
    return this.Services.getApplyProgress(userEntityId, progEntityId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('apply-regular')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
  )
  public async applyRegularBootcamp(
    @Query('userEntityId', ParseIntPipe) userEntityId: number,
    @Query('progEntityId', ParseIntPipe) progEntityId: number,
    @Body() user: UsersDto,
    @Body() education: UsersEducationDto,
    @UploadedFiles()
    files: any,
  ) {
    return this.Services.applyRegularBootcamp(
      userEntityId,
      progEntityId,
      user,
      education,
      files,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard')
  public async getDashboard(
    @Query('userEntityId', ParseIntPipe) userEntityId: number,
  ) {
    return this.Services.getDashboard(userEntityId);
  }

  @Get('image/:name')
  @Header('Content-Type', `image/${'png' || 'jpg' || 'jpeg'}`)
  @Header('Content-Disposition', 'attachment')
  getStaticFile(@Param('name') name: string): StreamableFile {
    const file = createReadStream(join(`${process.cwd()}/uploads/`, name));
    return new StreamableFile(file);
  }
}
