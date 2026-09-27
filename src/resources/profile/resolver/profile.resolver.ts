import { Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../service/profile.service';
import { GraphqlProfileResponse } from '../response/graphql_profile.dto';

@Resolver(() => GraphqlProfileResponse)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => GraphqlProfileResponse, { name: 'profile', nullable: true })
  profile(): Promise<GraphqlProfileResponse | null> {
    return this.profileService.getGraphqlProfile();
  }
}
