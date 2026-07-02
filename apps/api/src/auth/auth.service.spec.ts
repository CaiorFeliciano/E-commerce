import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService as any, jwtService);
  });

  it('should register a new user and return token + profile', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue({
      id: 'user-1',
      email: 'john@example.com',
      role: Role.CUSTOMER,
    });
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    await expect(
      service.register('john@example.com', '12345678'),
    ).resolves.toEqual({
      access_token: 'token',
      user: {
        id: 'user-1',
        email: 'john@example.com',
        role: Role.CUSTOMER,
      },
    });
  });

  it('should reject duplicate registration', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 'existing' });

    await expect(
      service.register('john@example.com', '12345678'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should reject invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('john@example.com', '12345678'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should login and return token + profile', async () => {
    const hashed = await bcrypt.hash('12345678', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'john@example.com',
      role: Role.ADMIN,
      password: hashed,
    });
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    await expect(
      service.login('john@example.com', '12345678'),
    ).resolves.toEqual({
      access_token: 'token',
      user: {
        id: 'user-1',
        email: 'john@example.com',
        role: Role.ADMIN,
      },
    });
  });
});
