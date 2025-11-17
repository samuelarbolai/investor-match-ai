import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../observability/metrics.service';

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  // Log request start
  console.log(`→ ${req.method} ${req.url}`, {
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    contentType: req.get('Content-Type')
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    
    console.log(`← ${req.method} ${req.url} ${res.statusCode}`, {
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      responseSize: JSON.stringify(body).length
    });
    
    const labels = {
      path: req.path,
      method: req.method,
      status: res.statusCode,
    };
    metricsService.increment('api.request.count', 1, labels);
    metricsService.recordDuration('api.request.duration', duration, labels);
    if (res.statusCode >= 500) {
      metricsService.increment('api.request.errors', 1, labels);
    }
    return originalJson.call(this, body);
  };

  next();
}

/**
 * Performance monitoring middleware
 */
export function performanceLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    if (duration > 1000) { // Log slow requests (>1s)
      console.warn('Slow request detected:', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      });
      metricsService.increment('api.request.slow', 1, {
        path: req.path,
        method: req.method,
        status: res.statusCode,
      });
    }
  });
  
  next();
}
