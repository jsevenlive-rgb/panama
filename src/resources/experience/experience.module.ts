import { Module } from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { ExperiencesRepositoryModule } from '../../repository/prisma/experiences/experiences.module';

@Module({
  imports: [ExperiencesRepositoryModule],
  exports: [ExperienceService],
  providers: [ExperienceService],
})
export class ExperienceModule {}
