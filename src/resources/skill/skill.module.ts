import { Module } from '@nestjs/common';
import { SkillService } from './service/skill.service';
import { SkillsRepositoryModule } from '../../repository/prisma/skills/skills.module';

@Module({
  imports: [SkillsRepositoryModule],
  exports: [SkillService],
  providers: [SkillService],
})
export class SkillModule {}
