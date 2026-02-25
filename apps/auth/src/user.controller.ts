import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async createUser(
    @Payload() dto: { username: string; email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.userService.createUser(dto);

      channel.ack(message);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      channel.ack(message);
      return {
        success: false,
        message: err.message,
      };
    }
  }

  @MessagePattern('user.login')
  async loginUser(
    @Payload() dto: { email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.userService.loginUser(dto);

      channel.ack(message);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      channel.ack(message);
      return {
        success: false,
        message: err.message,
      };
    }
  }

  @MessagePattern('user.profile')
  async getUserProfile(
    @Payload() payload: { userId: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.userService.getUserProfile(
        Number(payload.userId),
      );

      channel.ack(message);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      channel.ack(message);
      return {
        success: false,
        message: err.message,
      };
    }
  }
}