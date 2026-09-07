import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatwayAuthController } from './api-gateway-auth.controller';
import { of } from 'rxjs';

describe('ApiGatwayAuthController', () => {
  let controller: ApiGatwayAuthController;
  let mockUserService: { send: jest.Mock };

  beforeEach(async () => {
    mockUserService = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatwayAuthController],
      providers: [
        {
          provide: 'auth', // Ensure this matches your injection token
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<ApiGatwayAuthController>(
      ApiGatwayAuthController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('register should send user registration request', async () => {
    mockUserService.send.mockReturnValue(of({ success: true }));

    const result = await controller.register({
      username: 'testuser',
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toEqual({ success: true });
    expect(mockUserService.send).toHaveBeenCalledWith(
      'auth.register',
      expect.any(Object),
    );
  });

  it('login should send login request', async () => {
    mockUserService.send.mockReturnValue(of({ token: 'abc' }));

    const result = await controller.login({
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toEqual({ token: 'abc' });
    expect(mockUserService.send).toHaveBeenCalledWith(
      'auth.login',
      expect.any(Object),
    );
  });

  it('getProfile should send request to get user profile', async () => {
    mockUserService.send.mockReturnValue(of({ id: 1 }));

    const result = await controller.getProfile({
      user: { id: 1 },
    });

    expect(result).toEqual({ id: 1 });
    expect(mockUserService.send).toHaveBeenCalledWith(
      'auth.profile',
      { userId: 1 },
    );
  });
});