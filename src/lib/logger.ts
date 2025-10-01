/* eslint-disable no-console */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Simple logging utility for API routes
 * In production, you can see it in the Vercel logs. Or you can replace it with a service like DataDog, Sentry, or New Relic
 */
class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };
    console.error(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Log API request with timing
   */
  apiRequest(method: string, path: string, duration?: number, context?: LogContext): void {
    this.info(`API ${method} ${path}`, {
      method,
      path,
      duration: duration ? `${duration}ms` : undefined,
      ...context,
    });
  }

  /**
   * Log API error with status code
   */
  apiError(method: string, path: string, statusCode: number, error?: Error | unknown, context?: LogContext): void {
    this.error(`API ${method} ${path} failed`, error, {
      method,
      path,
      statusCode,
      ...context,
    });
  }
}

export const logger = new Logger();

