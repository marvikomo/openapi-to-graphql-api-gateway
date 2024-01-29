import di from './service-locator';

//Services
import { UserService } from '../services/UserService/user.service';
import { LoggerService } from '../services/logger.service';

// logger
di.register('logger', () => {
  return new LoggerService();
});

// user service
di.register('user', () => {
  return new UserService();
});

export default di;
