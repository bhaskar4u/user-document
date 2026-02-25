import { Controller, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { timeout } from 'rxjs';

@Controller('users')
export class ApiGatwayUserController {
  constructor(@Inject('user') private readonly userService: ClientProxy) {}

  @Post('register')
  async register(@Body() createUserDto: { username: string; email: string; password: string }) {
    if (!this.userService) {
      throw new Error('user service is not initialized');
    }
    return await lastValueFrom(
    this.userService.send('user.create', createUserDto),
  );
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return await  lastValueFrom(
      this.userService.send('user.login', loginDto).pipe(timeout(5000)),
    );
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await lastValueFrom(
      this.userService.send('user.profile', { userId: req.user.id }).pipe(timeout(5000)),
    );
  }
}
