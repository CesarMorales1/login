export default class AppError extends Error {
    constructor(message, statusCode, type = 'FUNCTIONAL', code = null, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.type = type; // 'FUNCTIONAL' or 'NON_FUNCTIONAL'
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            type: this.type,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp,
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
        };
    }
}