import { Module } from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { SiteExperienceController } from './controller/site_experience.controller';
import { ExperiencesRepositoryModule } from '../../repository/prisma/experiences/experiences.module';

@Module({
  imports: [ExperiencesRepositoryModule],
  exports: [ExperienceService],
  providers: [ExperienceService],
  controllers: [SiteExperienceController],
})
export class ExperienceModule {}
