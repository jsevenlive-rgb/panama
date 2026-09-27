import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap()
  .then(async (app) => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  });
