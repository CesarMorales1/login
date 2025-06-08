export default class ErrorLogger {
    static log(error, context = {}) {
        const logData = {
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                type: error.type || 'UNKNOWN',
                statusCode: error.statusCode || 500,
                code: error.code,
                stack: error.stack
            },
            context,
            environment: process.env.NODE_ENV || 'development'
        };

        // Log según el tipo de error
        if (error.type === 'NON_FUNCTIONAL' || error.statusCode >= 500) {
            console.error('🔴 NON-FUNCTIONAL ERROR:', JSON.stringify(logData, null, 2));
            
            // Aquí podrías integrar servicios externos como:
            // - Sentry
            // - Winston
            // - CloudWatch
            // - etc.
            
        } else if (error.type === 'FUNCTIONAL') {
            console.warn('🟡 FUNCTIONAL ERROR:', JSON.stringify(logData, null, 2));
        } else {
            console.error('⚫ UNKNOWN ERROR:', JSON.stringify(logData, null, 2));
        }

        // En producción, podrías enviar a servicios de monitoreo
        if (process.env.NODE_ENV === 'production') {
            // this.sendToMonitoringService(logData);
        }
    }

    static sendToMonitoringService(logData) {
        // Implementar integración con servicios como Sentry, DataDog, etc.
        // Ejemplo:
        // Sentry.captureException(error, { extra: context });
    }
}