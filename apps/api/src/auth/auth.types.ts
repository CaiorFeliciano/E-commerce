import { Role } from '@prisma/client';
import { Request } from 'express';

export interface JwtUser {
  sub: string;
  email: string;
  role: Role;
}

export type AuthenticatedRequest = Request & {
  user: JwtUser;
};
