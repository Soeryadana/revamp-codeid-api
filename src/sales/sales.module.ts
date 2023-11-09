import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MulterModule } from '@nestjs/platform-express';
import { UploadMulter } from 'src/multer/multer';

import { ProgramsController } from './programs/programs.controller';
import { ProgramsService } from './programs/programs.service';
import { ProgramEntity } from 'output/entities/ProgramEntity';
import { ProgramEntityDescription } from 'output/entities/ProgramEntityDescription';
import { Sections } from 'output/entities/Sections';
import { SectionDetail } from 'output/entities/SectionDetail';
import { ProgramReviews } from 'output/entities/ProgramReviews';
import { City } from 'output/entities/City';
import { Batch } from 'output/entities/Batch';
import { InstructorPrograms } from 'output/entities/InstructorPrograms';
import { ProgramApplyProgress } from 'output/entities/ProgramApplyProgress';
import { ProgramApply } from 'output/entities/ProgramApply';
import { Users } from 'output/entities/Users';
import { UsersEducation } from 'output/entities/UsersEducation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProgramEntity,
      ProgramEntityDescription,
      Sections,
      SectionDetail,
      ProgramReviews,
      City,
      Batch,
      InstructorPrograms,
      ProgramApplyProgress,
      ProgramApply,
      Users,
      UsersEducation,
    ]),
    MulterModule.register(UploadMulter.MulterOption()),
  ],
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class SalesModule {}
