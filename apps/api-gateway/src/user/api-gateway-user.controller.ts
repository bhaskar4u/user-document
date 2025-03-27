import { Controller, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class ApiGatwayUserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Post('register')
  async register(@Body() createUserDto: { username: string; email: string; password: string }) {
    
     // Debugging
    // console.log('USER_SERVICE:', this.userService);

    if (!this.userService) {
      throw new Error('USER_SERVICE is not initialized');
    }

    return this.userService.send('user.create', createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.userService.send('user.login', loginDto);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.send('user.profile', { userId: req.user.id });
  }
}
