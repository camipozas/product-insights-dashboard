import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[INFO]');
      expect(logCall).toContain('Test info message');
    });

    it('should log info with context', () => {
      logger.info('User action', { userId: 123, action: 'login' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[INFO]');
      expect(logCall).toContain('User action');
      expect(logCall).toContain('"userId":123');
      expect(logCall).toContain('"action":"login"');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleWarnSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[WARN]');
      expect(logCall).toContain('Test warning');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[ERROR]');
      expect(logCall).toContain('Test error');
    });

    it('should log errors with Error object', () => {
      const error = new Error('Something went wrong');
      logger.error('Failed operation', error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[ERROR]');
      expect(logCall).toContain('Failed operation');
      expect(logCall).toContain('Something went wrong');
      expect(logCall).toContain('"name":"Error"');
    });

    it('should log errors with context', () => {
      const error = new Error('Database error');
      logger.error('DB operation failed', error, { query: 'SELECT *', table: 'users' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[ERROR]');
      expect(logCall).toContain('"query":"SELECT *"');
      expect(logCall).toContain('"table":"users"');
    });
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.debug('Debug info');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleDebugSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[DEBUG]');
      expect(logCall).toContain('Debug info');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.debug('Debug info');

      expect(consoleDebugSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('apiRequest', () => {
    it('should log API requests with duration', () => {
      logger.apiRequest('GET', '/api/products', 250, { count: 10 });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[INFO]');
      expect(logCall).toContain('API GET /api/products');
      expect(logCall).toContain('"duration":"250ms"');
      expect(logCall).toContain('"count":10');
    });

    it('should log API requests without duration', () => {
      logger.apiRequest('POST', '/api/users');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('API POST /api/users');
      expect(logCall).not.toContain('duration');
    });
  });

  describe('apiError', () => {
    it('should log API errors with status code', () => {
      const error = new Error('Not found');
      logger.apiError('GET', '/api/products/999', 404, error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('[ERROR]');
      expect(logCall).toContain('API GET /api/products/999 failed');
      expect(logCall).toContain('"statusCode":404');
      expect(logCall).toContain('Not found');
    });

    it('should log API errors with additional context', () => {
      logger.apiError('DELETE', '/api/products/1', 500, new Error('DB error'), {
        userId: 'admin',
        duration: 1500,
      });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0][0] as string;
      expect(logCall).toContain('"statusCode":500');
      expect(logCall).toContain('"userId":"admin"');
      expect(logCall).toContain('"duration":1500');
    });
  });

  describe('timestamp format', () => {
    it('should include ISO timestamp in all logs', () => {
      logger.info('Test');

      const logCall = consoleLogSpy.mock.calls[0][0] as string;
      // Check for ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });
  });
});
