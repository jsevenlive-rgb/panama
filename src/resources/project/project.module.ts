import { Module } from '@nestjs/common';
import { ProjectService } from './service/project.service';
import { ProjectsRepositoryModule } from '../../repository/prisma/projects/projects.module';

@Module({
  imports: [ProjectsRepositoryModule],
  exports: [ProjectService],
  providers: [ProjectService],
})
export class ProjectModule {}
