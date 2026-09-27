import prod from './prod';
import dev from './dev';
import local from './local';

type Config = {
  cors: string[];
};

export default (): Config => {
  switch (process.env.ENVIRONMENT) {
    case 'PRODUCTION':
      return prod();
    case 'DEV':
      return dev();
    default:
      return local();
  }
};
