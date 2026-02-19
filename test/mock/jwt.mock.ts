export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ sub: 1 }),
  decode: jest.fn().mockReturnValue({ sub: 1 }),
};
