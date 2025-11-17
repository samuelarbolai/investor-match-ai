import { performance } from 'perf_hooks';

export interface MetricLabels {
  [key: string]: string | number | undefined;
}

export class MetricsService {
  private logMetric(event: string, payload: Record<string, unknown>) {
    if (process.env.METRICS_SILENT === 'true') {
      return;
    }
    console.info(`[Metric] ${event}`, payload);
  }

  increment(name: string, value: number = 1, labels: MetricLabels = {}) {
    this.logMetric(name, {
      type: 'counter',
      value,
      labels,
      timestamp: new Date().toISOString(),
    });
  }

  recordDuration(name: string, durationMs: number, labels: MetricLabels = {}) {
    this.logMetric(name, {
      type: 'duration',
      durationMs,
      labels,
      timestamp: new Date().toISOString(),
    });
  }

  async time<T>(
    name: string,
    labels: MetricLabels,
    callback: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    try {
      return await callback();
    } finally {
      const duration = performance.now() - start;
      this.recordDuration(name, duration, labels);
    }
  }
}

export const metricsService = new MetricsService();
