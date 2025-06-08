import AppError from './AppError.js';

export default class NonFunctionalError extends AppError {
    constructor(message, statusCode = 500, code = null, details = null) {
        super(message, statusCode, 'NON_FUNCTIONAL', code, details);
    }
}

// Errores específicos técnicos/sistema
export class DatabaseError extends NonFunctionalError {
    constructor(operation, originalError = null) {
        super(`Database operation failed: ${operation}`, 500, 'DATABASE_ERROR', {
            operation,
            originalError: originalError?.message
        });
        this.originalError = originalError;
    }
}

export class ExternalServiceError extends NonFunctionalError {
    constructor(service, operation, statusCode = 502, originalError = null) {
        super(`External service '${service}' failed during '${operation}'`, statusCode, 'EXTERNAL_SERVICE_ERROR', {
            service,
            operation,
            originalError: originalError?.message
        });
        this.service = service;
        this.originalError = originalError;
    }
}

export class ConfigurationError extends NonFunctionalError {
    constructor(configKey, message = null) {
        const errorMessage = message || `Configuration error for '${configKey}'`;
        super(errorMessage, 500, 'CONFIGURATION_ERROR', { configKey });
    }
}

export class TimeoutError extends NonFunctionalError {
    constructor(operation, timeout) {
        super(`Operation '${operation}' timed out after ${timeout}ms`, 408, 'TIMEOUT_ERROR', {
            operation,
            timeout
        });
    }
}

export class RateLimitError extends NonFunctionalError {
    constructor(limit, window) {
        super(`Rate limit exceeded: ${limit} requests per ${window}`, 429, 'RATE_LIMIT_ERROR', {
            limit,
            window
        });
    }
}

export class InternalServerError extends NonFunctionalError {
    constructor(message = 'Internal server error', originalError = null) {
        super(message, 500, 'INTERNAL_SERVER_ERROR', {
            originalError: originalError?.message
        });
        this.originalError = originalError;
    }
}