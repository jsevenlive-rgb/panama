import { Module } from '@nestjs/common';
import { ProjectService } from './service/project.service';
import { SiteProjectController } from './controller/site_project.controller';
import { ProjectsRepositoryModule } from '../../repository/prisma/projects/projects.module';

@Module({
  imports: [ProjectsRepositoryModule],
  exports: [ProjectService],
  providers: [ProjectService],
  controllers: [SiteProjectController],
})
export class ProjectModule {}
