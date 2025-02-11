import { Registry, collectDefaultMetrics, Histogram, Counter, Gauge } from 'prom-client';
import { CustomThrottlePriority, CEDE_CEXS } from '@cedelabs-private/sdk';

export class MetricsService {
  private static instance: MetricsService;
  private registry: Registry;
  
  private methodDuration: Histogram;
  private endpointDuration: Histogram;
  private methodCalls: Counter;
  private endpointCalls: Counter;
  private throttlerQueueSize: Gauge;
  // Keep track of max values between scrapes
  private maxQueueSizes: Map<string, number> = new Map();

  private constructor() {
    this.registry = new Registry();
    
    // Add default metrics (CPU, memory, event loop lag)
    collectDefaultMetrics({ register: this.registry });
    
    this.methodDuration = new Histogram({
      name: 'sdk_method_duration_seconds',
      help: 'Duration of SDK method calls',
      labelNames: ['method', 'exchange_id', 'exchange_instance_id'],
      buckets: [0.1, 0.5, 1, 2, 5], // adjust buckets as needed
      registers: [this.registry]
    });

    this.methodCalls = new Counter({
      name: 'sdk_method_calls_total',
      help: 'Total number of SDK method calls',
      labelNames: ['method', 'exchange_id', 'exchange_instance_id', 'status'],
      registers: [this.registry]
    });

    this.endpointCalls = new Counter({
      name: 'exchange_endpoint_calls_total',
      help: 'Total number of exchange endpoint calls',
      labelNames: ['path', 'method', 'exchange_id', 'status'],
      registers: [this.registry]
    });

    this.throttlerQueueSize = new Gauge({
      name: 'sdk_throttler_queue_size',
      help: 'Maximum size of the throttler queue per exchange and endpoint between scrapes',
      labelNames: ['exchange_id', 'endpoint'],
      registers: [this.registry]
    });

    this.endpointDuration = new Histogram({
      name: 'exchange_endpoint_duration_milliseconds',
      help: 'Duration of exchange endpoint calls in milliseconds',
      labelNames: ['path', 'method', 'exchange_id', 'status'],
      buckets: [100, 500, 1000, 2000, 5000, 10000],
      registers: [this.registry]
    });
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public startMethodTimer() {
    return this.methodDuration.startTimer();
  }

  public recordMethodCall(method: string, exchangeId: string, exchangeInstanceId: string, status: 'success' | 'error') {
    this.methodCalls.labels(method, exchangeId, exchangeInstanceId, status).inc();
  }

  public recordEndpointCall(path: string, method: string, exchangeId: string, status: number, durationMs: number) {
    this.endpointCalls.labels(path, method, exchangeId, status?.toString?.()).inc();
    this.endpointDuration.labels(path, method, exchangeId, status?.toString?.()).observe(durationMs);
  }

  public recordThrottlerQueues(queues: { exchangeId: string; queuesSize: Record<string, number> }[]) {
    const reportedQueues = new Map(
      queues.map(({ exchangeId, queuesSize }) => [exchangeId, queuesSize])
    );

    for (const exchangeId of Object.values(CEDE_CEXS)) {
      const queueSizes = reportedQueues.get(exchangeId) || {};
      
      for (const priority of [
        CustomThrottlePriority.HIGH,
        CustomThrottlePriority.MEDIUM,
        CustomThrottlePriority.LOW
      ]) {
        console.log("setting max", exchangeId, priority, queueSizes[priority])
        const key = `${exchangeId}:${priority}`;
        const size = queueSizes[priority] || 0;
        const currentMax = this.maxQueueSizes.get(key) || 0;
        this.maxQueueSizes.set(key, Math.max(currentMax, size));
      }
    }
  }

  public updateGauges() {
    this.throttlerQueueSize.reset();
    
    for (const [key, maxSize] of this.maxQueueSizes.entries()) {
      const [exchangeId, priority] = key.split(':');
      this.throttlerQueueSize.labels(exchangeId, priority).set(maxSize);
    }

    this.maxQueueSizes.clear();
  }

  public async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
}