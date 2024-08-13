import di from './service-locator';

//Services
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';
import { ProductService } from '../services/product.service';

// logger
di.register('logger', () => {
  return new LoggerService();
});

// user service
di.register('user', () => {
  return new UserService();
});

// product service
di.register('product', () => {
  return new ProductService();
});

export default di;
