import { BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const tx = {
    cart: {
      findUnique: jest.fn(),
    },
    product: {
      updateMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
  };

  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    order: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  let service: OrdersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrdersService(prisma as any);
  });

  it('should reject checkout for empty carts', async () => {
    tx.cart.findUnique.mockResolvedValue({ id: 'cart-1', items: [] });

    await expect(service.create('user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should reject checkout when stock is insufficient', async () => {
    tx.cart.findUnique.mockResolvedValue({
      id: 'cart-1',
      items: [
        {
          quantity: 3,
          productId: 'product-1',
          product: {
            name: 'Notebook',
            price: 12,
            stock: 2,
          },
        },
      ],
    });

    await expect(service.create('user-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should create an order and clear the cart', async () => {
    tx.cart.findUnique.mockResolvedValue({
      id: 'cart-1',
      items: [
        {
          quantity: 2,
          productId: 'product-1',
          product: {
            name: 'Notebook',
            price: 100,
            stock: 5,
          },
        },
      ],
    });
    tx.product.updateMany.mockResolvedValue({ count: 1 });
    tx.order.create.mockResolvedValue({ id: 'order-1' });
    tx.cartItem.deleteMany.mockResolvedValue({ count: 1 });
    tx.order.findUniqueOrThrow.mockResolvedValue({
      id: 'order-1',
      total: 200,
      items: [],
    });

    await expect(service.create('user-1')).resolves.toEqual({
      id: 'order-1',
      total: 200,
      items: [],
    });
  });
});
