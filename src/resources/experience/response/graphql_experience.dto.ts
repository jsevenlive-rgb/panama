import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class GraphqlExperienceResponse {
  @Field()
  company: string;

  @Field()
  position: string;
}
