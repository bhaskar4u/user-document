export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  timestamp: string;
  path: string;
}

export function buildErrorResponse(
  message: string,
  code: string,
  path: string,
): ErrorResponse {
  return {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
    path,
  };
}
