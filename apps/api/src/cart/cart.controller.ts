import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';

class AddItemDto {
  productId: string;
  quantity: number;
}

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req: Request) {
    const userId = (req['user'] as any).sub;
    return this.cartService.getCart(userId);
  }

  @Post('items')
  addItem(@Req() req: Request, @Body() body: AddItemDto) {
    const userId = (req['user'] as any).sub;
    return this.cartService.addItem(userId, body.productId, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@Req() req: Request, @Param('id') id: string) {
    const userId = (req['user'] as any).sub;
    return this.cartService.removeItem(userId, id);
  }

  @Delete()
  clearCart(@Req() req: Request) {
    const userId = (req['user'] as any).sub;
    return this.cartService.clearCart(userId);
  }
}
