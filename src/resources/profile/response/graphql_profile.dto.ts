import { Field, ObjectType } from '@nestjs/graphql';
import { GraphqlExperienceResponse } from '../../experience/response/graphql_experience.dto';
import { GraphqlProjectResponse } from '../../project/response/graphql_project.dto';
import { GraphqlSkillResponse } from '../../skill/response/graphql_skill.dto';

@ObjectType('Profile')
export class GraphqlProfileResponse {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [GraphqlSkillResponse])
  skills: GraphqlSkillResponse[];

  @Field(() => [GraphqlExperienceResponse])
  experience: GraphqlExperienceResponse[];

  @Field(() => [GraphqlProjectResponse])
  projects: GraphqlProjectResponse[];
}
