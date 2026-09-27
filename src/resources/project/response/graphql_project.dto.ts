import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Project')
export class GraphqlProjectResponse {
  @Field()
  name: string;
}
