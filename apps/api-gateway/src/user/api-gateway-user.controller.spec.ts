import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatwayUserController } from './api-gateway-user.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ApiGatwayUserController', () => {
  let controller: ApiGatwayUserController;
  let userService: ClientProxy;

  const mockUserService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatwayUserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JWT Guard
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    controller = module.get<ApiGatwayUserController>(ApiGatwayUserController);
    userService = module.get<ClientProxy>('USER_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should send user registration request', async () => {
      const mockUserDto = { username: 'JohnDoe', email: 'john@example.com', password: 'securepassword' };
      const mockResponse = { id: 1, username: 'JohnDoe', email: 'john@example.com' };

      mockUserService.send.mockResolvedValue(mockResponse);

      const result = await controller.register(mockUserDto);

      expect(userService.send).toHaveBeenCalledWith('user.create', mockUserDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should send login request', async () => {
      const mockLoginDto = { email: 'john@example.com', password: 'securepassword' };
      const mockResponse = { access_token: 'jwt_token', expires_in: 3600 };

      mockUserService.send.mockResolvedValue(mockResponse);

      const result = await controller.login(mockLoginDto);

      expect(userService.send).toHaveBeenCalledWith('user.login', mockLoginDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProfile', () => {
    it('should send request to get user profile', async () => {
      const mockRequest = { user: { id: 1 } };
      const mockResponse = { id: 1, username: 'JohnDoe', email: 'john@example.com' };

      mockUserService.send.mockResolvedValue(mockResponse);

      const result = await controller.getProfile(mockRequest);

      expect(userService.send).toHaveBeenCalledWith('user.profile', { userId: 1 });
      expect(result).toEqual(mockResponse);
    });
  });
});
