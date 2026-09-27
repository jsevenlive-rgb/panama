import { WinstonModule } from 'nest-winston';
import { Global, Module } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { inspect } from 'util';

const logLikeFormat = {
  transform(info: any) {
    info.project = process.env.PROJECT_NAME;
    return info;
  },
};

/** Pretty-формат для разработки: JSON для production (логирование в системы) */
const isPrettyConsole = () =>
  process.env.LOGGER_CONSOLE === 'true' || process.env.NODE_ENV !== 'production';

/** Формат для удобного чтения логов в терминале при разработке */
const developmentPrettyFormat = winston.format.printf((info) => {
  const levelColors: Record<string, string> = {
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    info: '\x1b[32m', // green
    http: '\x1b[36m', // cyan
    verbose: '\x1b[35m', // magenta
    debug: '\x1b[34m', // blue
    silly: '\x1b[90m', // gray
  };
  const reset = '\x1b[0m';
  const dim = '\x1b[2m';
  const color = levelColors[info.level] || reset;

  const timestamp = info.timestamp
    ? ` ${dim}${new Date(info.timestamp as string | number | Date).toLocaleTimeString()}${reset}`
    : '';
  const ms = info.ms ? ` ${dim}+${info.ms}${reset}` : '';
  const context = info.context ? ` ${dim}[${info.context}]${reset}` : '';
  const message = typeof info.message === 'object' ? inspect(info.message, { colors: true }) : info.message;

  const parts: string[] = [
    `${color}${info.level.toUpperCase().padEnd(5)}${reset}${timestamp}${ms}${context} ${message}`,
  ];

  // Pretty-print request, response, error, stack if present
  const keysToInspect = ['request', 'response', 'error', 'stack'];
  for (const key of keysToInspect) {
    const val = info[key];
    const hasContent =
      val !== undefined &&
      val !== null &&
      (typeof val === 'string' ? val.length > 0 : Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0);
    if (hasContent) {
      parts.push(`  ${dim}├─ ${key}:${reset}`);
      parts.push(
        inspect(val, { colors: true, depth: 4, breakLength: 80 })
          .split('\n')
          .map((l) => `  ${dim}│${reset}  ${l}`)
          .join('\n')
      );
    }
  }

  return parts.join('\n');
});

@Global() // Adding the Global decorator makes this module accessible globally
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            level: process.env.LOG_LEVEL,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              logLikeFormat,
              isPrettyConsole()
                ? developmentPrettyFormat
                : winston.format.json()
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [],
  providers: [],
})
export class WinstonLoggerModule {}
