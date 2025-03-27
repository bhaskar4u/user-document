import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User ,UserRole} from './user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private ConfigService: ConfigService
  ) {}

  async createUser(createUserDto: { username: string; email: string; password: string }) {
    const userExist = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (userExist) return { message: "User already exist" }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    await this.userRepository.save(user);
    return { message: 'User created successfully' };


  }

    async loginUser(loginDto: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { secret: this.ConfigService.get<string>('JWT_SECRET') } // ✅ Use ConfigService
    );

    return { access_token: token };
  }


  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { } });
    if (!user) throw new Error('User not found');
    return { id: user.id, username: user.username, email: user.email };
  }
}
