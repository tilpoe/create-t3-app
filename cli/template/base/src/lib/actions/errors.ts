import { TRPCError } from "@trpc/server";

export const TRPC_ERROR_CODES_BY_KEY = {
  /**
   * Invalid JSON was received by the server. An error occurred on the server while parsing the JSON
   * text.
   */
  PARSE_ERROR: -32700,
  /** The JSON sent is not a valid Request object. */
  BAD_REQUEST: -32600, // 400

  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603, // 500
  NOT_IMPLEMENTED: -32603, // 501
  BAD_GATEWAY: -32603, // 502
  SERVICE_UNAVAILABLE: -32603, // 503
  GATEWAY_TIMEOUT: -32603, // 504

  // Implementation specific errors
  UNAUTHORIZED: -32001, // 401
  FORBIDDEN: -32003, // 403
  NOT_FOUND: -32004, // 404
  METHOD_NOT_SUPPORTED: -32005, // 405
  TIMEOUT: -32008, // 408
  CONFLICT: -32009, // 409
  PRECONDITION_FAILED: -32012, // 412
  PAYLOAD_TOO_LARGE: -32013, // 413
  UNSUPPORTED_MEDIA_TYPE: -32015, // 415
  UNPROCESSABLE_CONTENT: -32022, // 422
  TOO_MANY_REQUESTS: -32029, // 429
  CLIENT_CLOSED_REQUEST: -32099, // 499
} as const;

type TRPC_ERROR_CODE_KEY = keyof typeof TRPC_ERROR_CODES_BY_KEY;

export class ActionError extends TRPCError {
  constructor(opts: {
    message?: string;
    code: TRPC_ERROR_CODE_KEY;
    cause?: unknown;
  }) {
    super({
      message: opts.message,
      code: opts.code,
      cause: opts.cause,
    });
  }
}
