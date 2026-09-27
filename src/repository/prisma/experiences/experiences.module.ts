import { Module } from '@nestjs/common';
import { ExperiencesRepository } from './experiences.repository';

@Module({
  providers: [ExperiencesRepository],
  exports: [ExperiencesRepository],
})
export class ExperiencesRepositoryModule {}
