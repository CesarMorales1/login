import AppError from './AppError.js';

export default class FunctionalError extends AppError {
    constructor(message, statusCode = 400, code = null, details = null) {
        super(message, statusCode, 'FUNCTIONAL', code, details);
    }
}

// Errores específicos de negocio
export class ValidationError extends FunctionalError {
    constructor(field, message, details = null) {
        super(`Validation failed for ${field}: ${message}`, 400, 'VALIDATION_ERROR', details);
        this.field = field;
    }
}

export class BusinessRuleError extends FunctionalError {
    constructor(rule, message, details = null) {
        super(message, 422, 'BUSINESS_RULE_ERROR', details);
        this.rule = rule;
    }
}

export class NotFoundError extends FunctionalError {
    constructor(resource, identifier = null) {
        const message = identifier 
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, 404, 'NOT_FOUND_ERROR', { resource, identifier });
    }
}

export class DuplicateError extends FunctionalError {
    constructor(resource, field, value) {
        super(`${resource} with ${field} '${value}' already exists`, 409, 'DUPLICATE_ERROR', {
            resource,
            field,
            value
        });
    }
}

export class UnauthorizedError extends FunctionalError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED_ERROR');
    }
}

export class ForbiddenError extends FunctionalError {
    constructor(message = 'Access forbidden') {
        super(message, 403, 'FORBIDDEN_ERROR');
    }
}