import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill')
export class GraphqlSkillResponse {
  @Field()
  name: string;
}
