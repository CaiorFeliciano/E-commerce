import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductsService,
  UpdateProductDto,
} from './products.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Put('id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Delete('id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
