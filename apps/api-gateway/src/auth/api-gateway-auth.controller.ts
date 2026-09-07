import { Controller, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../authLogic/jwt-auth.guard';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { timeout } from 'rxjs';

@Controller('auth')
export class ApiGatwayAuthController {
  constructor(@Inject('auth') private readonly authService: ClientProxy) {}

  @Post('register')
  async register(@Body() createUserDto: { username: string; email: string; password: string }) {
    if (!this.authService) {
      throw new Error('auth service is not initialized');
    }
    return await lastValueFrom(
    this.authService.send('auth.register', createUserDto),
  );
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return await  lastValueFrom(
      this.authService.send('auth.login', loginDto).pipe(timeout(5000)),
    );
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await lastValueFrom(
      this.authService.send('auth.profile', { userId: req.user.id }).pipe(timeout(5000)),
    );
  }
}
