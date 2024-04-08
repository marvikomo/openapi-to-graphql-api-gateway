import di from './service-locator';

//Services
import { LoggerService } from '../services/logger.service';

// logger
di.register('logger', () => {
  return new LoggerService();
});

export default di;
