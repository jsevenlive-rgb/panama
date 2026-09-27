import { Module } from '@nestjs/common';
import { ProfileService } from './service/profile.service';
import { SiteProfileController } from './controller/site_profile.controller';
import { ProfilesRepositoryModule } from '../../repository/prisma/profiles/profiles.module';
import { ProfileResolver } from './resolver/profile.resolver';

@Module({
  imports: [ProfilesRepositoryModule],
  exports: [ProfileService],
  providers: [ProfileService, ProfileResolver],
  controllers: [SiteProfileController],
})
export class ProfileModule {}
