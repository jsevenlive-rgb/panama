import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';
import { LanguageListISO } from '../constant/main.constant';

@Injectable()
export class CustomResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

  private logger = new Logger(CustomResolver.name);

  resolve(context: ExecutionContext) {
    let lang = LanguageListISO.en;

    switch (context.getType() as string) {
      case 'rpc':
        if (
          context.switchToRpc().getContext().args[0].properties &&
          context.switchToRpc().getContext().args[0].properties.headers &&
          context.switchToRpc().getContext().args[0].properties.headers.language &&
          LanguageListISO[context.switchToRpc().getContext().args[0].properties.headers.language]
        )
          lang = context.switchToRpc().getContext().args[0].properties.headers.language;
        break;
      case 'http':
        const request = context.switchToHttp().getRequest();

        if (request.body && request.body.language && LanguageListISO[request.body.language]) {
          lang = request.body.language;
        } else if (request.headers && request.headers.language && LanguageListISO[request.headers.language]) {
          lang = request.headers.language;
        } else if (request.headers && request.headers['accept-language']) {
          try {
            const acceptLang = request.headers['accept-language'].split(',')[0].split('-')[0];
            if (LanguageListISO[acceptLang]) {
              lang = acceptLang;
            }
          } catch (error) {
            this.logger.error('Error in i18n resolver middleware', error);
          }
        }
        break;
    }

    return lang;
  }
}
