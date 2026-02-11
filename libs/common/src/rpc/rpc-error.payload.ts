export interface RpcErrorPayload {
  code: string;
  message: string;
  isOperational: boolean;
  details?: unknown;
}
