import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getCache } from '@app/common/redis/cache';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  async canActivate(context: ExecutionContext) {
    const canActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    const storedToken = await getCache<string>(
      `auth:token:${user.id}`,
    );

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Token expired or invalidated');
    }

    return canActivate;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}