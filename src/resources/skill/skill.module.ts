import { Module } from '@nestjs/common';
import { SkillService } from './service/skill.service';
import { SiteSkillController } from './controller/site_skill.controller';
import { SkillsRepositoryModule } from '../../repository/prisma/skills/skills.module';

@Module({
  imports: [SkillsRepositoryModule],
  exports: [SkillService],
  providers: [SkillService],
  controllers: [SiteSkillController],
})
export class SkillModule {}
