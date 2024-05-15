interface ResponseService {
  statusCodes: {
    ok: number;
    created: number;
    accepted: number;
    noContent: number;
    badRequest: number;
    unauthorized: number;
    forbidden: number;
    notFound: number;
    internalServerError: number;
    serviceUnavailable: number;
  };

  success(message: string, data?: any): ApiResponse;
  error(message: string, error?: any): ApiResponse;
  unauthorizedError(message: string): ApiResponse;
  forbiddenError(message: string): ApiResponse;
  notFoundError(message: string): ApiResponse;
  internalServerError(message: string): ApiResponse;
  serviceUnavailableError(message: string): ApiResponse;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  status: number;
}

const ResponseApi: ResponseService = {
  statusCodes: {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
    serviceUnavailable: 503
  },

  success(message: string, data?: any): ApiResponse {
    return {
      success: true,
      message,
      data,
      status: this.statusCodes.ok
    };
  },

  error(message: string, error?: any): ApiResponse {
    return {
      success: false,
      message,
      error,
      status: this.statusCodes.badRequest
    };
  },

  unauthorizedError(message: string): ApiResponse {
    return {
      success: false,
      message,
      error: 'Unauthorized',
      status: this.statusCodes.unauthorized
    };
  },

  forbiddenError(message: string): ApiResponse {
    return {
      success: false,
      message,
      error: 'Forbidden',
      status: this.statusCodes.forbidden
    };
  },

  notFoundError(message: string): ApiResponse {
    return {
      success: false,
      message,
      error: 'Not Found',
      status: this.statusCodes.notFound
    };
  },

  internalServerError(message: string): ApiResponse {
    return {
      success: false,
      message,
      error: 'Internal Server Error',
      status: this.statusCodes.internalServerError
    };
  },

  serviceUnavailableError(message: string): ApiResponse {
    return {
      success: false,
      message,
      error: 'Service Unavailable',
      status: this.statusCodes.serviceUnavailable
    };
  }
};

export default ResponseApi;
