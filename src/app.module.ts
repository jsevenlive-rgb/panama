import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule, AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import * as fs from 'fs';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import configuration from './config/configuration';
import { WinstonLoggerModule } from './module/winston_logger';
import { GlobalExceptionFilter } from './service/global_exception_filter.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CustomResolver } from './middleware/i18nresolver.middleware';
import { ProfileModule } from './resources/profile/profile.module';
import { SkillModule } from './resources/skill/skill.module';
import { ExperienceModule } from './resources/experience/experience.module';
import { ProjectModule } from './resources/project/project.module';
import { PrismaModule } from './repository/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

function resolveI18nDir(): string {
  const fromSrc = path.join(process.cwd(), 'src', 'i18n');
  if (fs.existsSync(fromSrc)) {
    return fromSrc;
  }
  const fromDist = path.join(__dirname, 'i18n');
  if (fs.existsSync(fromDist)) {
    return fromDist;
  }
  return fromDist;
}

@Module({
  imports: [
    WinstonLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    I18nModule.forRootAsync({
      useExisting: undefined,
      useFactory: (_configService: ConfigService) => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: resolveI18nDir(),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: ['language'] }, CustomResolver, AcceptLanguageResolver],
      inject: [ConfigService],
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
