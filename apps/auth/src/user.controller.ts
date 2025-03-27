import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async createUser(@Payload() createUserDto: { username: string; email: string; password: string }) {    
    return this.userService.createUser(createUserDto)
  }

  @MessagePattern('user.login')
  async loginUser(@Payload() loginDto: { email: string; password: string }) {
    return this.userService.loginUser(loginDto);
  }

  @MessagePattern('user.profile')
  async getUserProfile(@Payload() { userId }: { userId: string }) {
    return this.userService.getUserProfile(userId);
  }
}
