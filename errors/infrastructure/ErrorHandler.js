import ErrorLogger from './ErrorLogger.js';
import AppError from '../domain/AppError.js';
import { InternalServerError } from '../domain/NonFunctionalError.js';

export default class ErrorHandler {
    static handle(error, req, res, next) {
        let processedError = error;

        // Si no es un AppError, convertirlo
        if (!(error instanceof AppError)) {
            processedError = ErrorHandler.convertToAppError(error);
        }

        // Log del error con contexto
        const context = {
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            userId: req.user?.id || null,
            requestId: req.id || null,
            body: ErrorHandler.sanitizeBody(req.body),
            params: req.params,
            query: req.query
        };

        ErrorLogger.log(processedError, context);

        // Respuesta al cliente
        const response = ErrorHandler.buildErrorResponse(processedError);
        
        res.status(processedError.statusCode || 500).json(response);
    }

    static convertToAppError(error) {
        // Errores de Prisma
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'field';
            return new (await import('../domain/FunctionalError.js')).DuplicateError(
                'Resource', 
                field, 
                'value'
            );
        }

        if (error.code === 'P2025') {
            return new (await import('../domain/FunctionalError.js')).NotFoundError('Resource');
        }

        // Errores de validación de Express
        if (error.type === 'entity.parse.failed') {
            return new (await import('../domain/FunctionalError.js')).ValidationError(
                'body', 
                'Invalid JSON format'
            );
        }

        // Error genérico del sistema
        return new InternalServerError(
            process.env.NODE_ENV === 'production' 
                ? 'Internal server error' 
                : error.message,
            error
        );
    }

    static buildErrorResponse(error) {
        const baseResponse = {
            success: false,
            error: {
                type: error.type,
                code: error.code,
                message: error.message,
                timestamp: error.timestamp
            }
        };

        // Agregar detalles según el tipo de error
        if (error.type === 'FUNCTIONAL') {
            baseResponse.error.details = error.details;
            
            // Para errores de validación, incluir el campo
            if (error.field) {
                baseResponse.error.field = error.field;
            }
        }

        // En desarrollo, incluir más información
        if (process.env.NODE_ENV === 'development') {
            baseResponse.error.stack = error.stack;
            baseResponse.error.statusCode = error.statusCode;
        }

        return baseResponse;
    }

    static sanitizeBody(body) {
        if (!body || typeof body !== 'object') return body;
        
        const sanitized = { ...body };
        
        // Remover campos sensibles
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }

    // Middleware para errores no capturados
    static handleUncaughtException(error) {
        ErrorLogger.log(new InternalServerError('Uncaught Exception', error), {
            type: 'UNCAUGHT_EXCEPTION'
        });
        
        console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
        process.exit(1);
    }

    static handleUnhandledRejection(reason, promise) {
        ErrorLogger.log(new InternalServerError('Unhandled Promise Rejection', reason), {
            type: 'UNHANDLED_REJECTION',
            promise: promise.toString()
        });
        
        console.error('💥 UNHANDLED REJECTION! Shutting down...');
        process.exit(1);
    }
}