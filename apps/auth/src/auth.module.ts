import { Module } from '@nestjs/common';
import { DatabaseModule,RmqService,RmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Session } from './session.entity'; 
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  controllers: [AuthController], 
  imports: [DatabaseModule,RmqModule, TypeOrmModule.forFeature([User, Session]), JwtModule.registerAsync({
    imports: [ConfigModule], // ✅ Import ConfigModule for use
    inject: [ConfigService], // ✅ Inject ConfigService
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET', 'default-secret-key'), // ✅ Use ConfigService
      signOptions: { expiresIn: '1h' },
    }),
  })],
  providers: [JwtService,RmqService,AuthService],
})
export class AuthModule {}
