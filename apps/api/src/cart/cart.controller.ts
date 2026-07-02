import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { AuthenticatedRequest } from '../auth/auth.types';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  addItem(@Req() req: AuthenticatedRequest, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(
      req.user.sub,
      body.productId,
      body.quantity,
    );
  }

  @Put('items/:id')
  updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.sub, id, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.sub, id);
  }

  @Delete()
  clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.sub);
  }
}
