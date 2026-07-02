import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';

describe('CartService', () => {
  const prisma = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  let service: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartService(prisma as any);
  });

  it('should reject quantities above available stock', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', items: [] });
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1', stock: 2 });
    prisma.cartItem.findFirst.mockResolvedValue({
      id: 'item-1',
      quantity: 1,
    });

    await expect(service.addItem('user-1', 'product-1', 2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should update item quantity when item already exists', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', items: [] });
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1', stock: 10 });
    prisma.cartItem.findFirst.mockResolvedValue({
      id: 'item-1',
      quantity: 2,
    });
    prisma.cartItem.update.mockResolvedValue({ id: 'item-1', quantity: 3 });

    await expect(service.addItem('user-1', 'product-1', 1)).resolves.toEqual({
      id: 'item-1',
      quantity: 3,
    });
  });

  it('should reject updates for missing items', async () => {
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1', items: [] });
    prisma.cartItem.findFirst.mockResolvedValue(null);

    await expect(service.updateItem('user-1', 'item-1', 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
