import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOverview() {
    return {
      name: 'E-commerce API',
      status: 'ok',
      modules: ['auth', 'products', 'cart', 'orders'],
    };
  }
}
