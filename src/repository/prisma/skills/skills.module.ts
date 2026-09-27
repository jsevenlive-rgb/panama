import { Module } from '@nestjs/common';
import { SkillsRepository } from './skills.repository';

@Module({
  providers: [SkillsRepository],
  exports: [SkillsRepository],
})
export class SkillsRepositoryModule {}
