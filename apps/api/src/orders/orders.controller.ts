import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Req() req: Request) {
    const userId = (req['user'] as any).sub;
    return this.ordersService.create(userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req['user'] as any).sub;
    return this.ordersService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req['user'] as any).sub;
    return this.ordersService.findOne(userId, id);
  }
}
