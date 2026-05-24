import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  email: string;
  password: string;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(String(body.email), String(body.password));
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(String(body.email), String(body.password));
  }
}
