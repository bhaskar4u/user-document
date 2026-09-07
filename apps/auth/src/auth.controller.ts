import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(
    @Payload() dto: { username: string; email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.authService.register(dto);

      channel.ack(message);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      channel.ack(message);
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  }

  @MessagePattern('auth.login')
  async login(
    @Payload() dto: { email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.authService.login(dto);

      channel.ack(message);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      channel.ack(message);
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  }

  @MessagePattern('auth.profile')
  async getUserProfile(
    @Payload() payload: { uuid: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.authService.getUserProfile(
        payload.uuid,
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
        message: (err as Error).message,
      };
    }
  }
}