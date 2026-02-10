/**
 * Safe logger that only logs in development mode
 * Prevents sensitive information from appearing in production console
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
    /**
     * Log general information (only in development)
     */
    log: (...args: any[]) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    /**
     * Log errors (always shown, even in production)
     */
    error: (...args: any[]) => {
        console.error(...args);
    },

    /**
     * Log warnings (only in development)
     */
    warn: (...args: any[]) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    /**
     * Log sensitive data (NEVER logs actual data in production)
     * In production, only logs the message without the data
     */
    sensitive: (message: string, data?: any) => {
        if (isDevelopment) {
            console.log(`🔒 [SENSITIVE] ${message}`, data);
        } else {
            // In production, log only the message without data
            console.log(`🔒 ${message}`);
        }
    }
};
