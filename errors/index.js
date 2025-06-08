// Exportar todas las clases de error
export { default as AppError } from './domain/AppError.js';
export { default as FunctionalError, ValidationError, BusinessRuleError, NotFoundError, DuplicateError, UnauthorizedError, ForbiddenError } from './domain/FunctionalError.js';
export { default as NonFunctionalError, DatabaseError, ExternalServiceError, ConfigurationError, TimeoutError, RateLimitError, InternalServerError } from './domain/NonFunctionalError.js';

// Exportar infraestructura
export { default as ErrorHandler } from './infrastructure/ErrorHandler.js';
export { default as ErrorLogger } from './infrastructure/ErrorLogger.js';
export { default as ValidationMiddleware } from './infrastructure/ValidationMiddleware.js';