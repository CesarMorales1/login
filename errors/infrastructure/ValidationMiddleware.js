import { ValidationError } from '../domain/FunctionalError.js';

export default class ValidationMiddleware {
    static validateBody(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.body, { 
                    abortEarly: false,
                    stripUnknown: true 
                });

                if (error) {
                    const details = error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message,
                        value: detail.context?.value
                    }));

                    throw new ValidationError(
                        'request body',
                        'Validation failed',
                        details
                    );
                }

                req.body = value;
                next();
            } catch (err) {
                next(err);
            }
        };
    }

    static validateParams(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.params);

                if (error) {
                    throw new ValidationError(
                        'request params',
                        error.details[0].message
                    );
                }

                req.params = value;
                next();
            } catch (err) {
                next(err);
            }
        };
    }

    static validateQuery(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.query);

                if (error) {
                    throw new ValidationError(
                        'query parameters',
                        error.details[0].message
                    );
                }

                req.query = value;
                next();
            } catch (err) {
                next(err);
            }
        };
    }
}