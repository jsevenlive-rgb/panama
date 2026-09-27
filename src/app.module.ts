import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import configuration from './config/configuration';
import { WinstonLoggerModule } from './module/winston_logger';
import { GlobalExceptionFilter } from './service/global_exception_filter.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProfileModule } from './resources/profile/profile.module';
import { SkillModule } from './resources/skill/skill.module';
import { ExperienceModule } from './resources/experience/experience.module';
import { ProjectModule } from './resources/project/project.module';
import { PrismaModule } from './repository/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    WinstonLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      path: '/graphql',
    }),
    ProfileModule,
    SkillModule,
    ExperienceModule,
    ProjectModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
