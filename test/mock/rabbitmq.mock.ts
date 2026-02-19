import { of } from 'rxjs';

export const mockClientProxy = {
  send: jest.fn().mockReturnValue(of({ status: 'success' })),
  emit: jest.fn(),
  connect: jest.fn(),
  close: jest.fn(),
};
