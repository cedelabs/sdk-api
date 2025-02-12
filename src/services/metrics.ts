import { Registry, collectDefaultMetrics, Histogram, Counter, Gauge } from 'prom-client';
import { CustomThrottlePriority, CEDE_CEXS } from '@cedelabs-private/sdk';

export class MetricsService {
  private static instance: MetricsService;
  private registry: Registry;
  
  /**
   * @description
   * Histogram to record the duration of a method call.
   */
  private methodDuration: Histogram;
  /**
   * @description
   * Histogram to record the duration of an exchange endpoint call.
   */
  private endpointDuration: Histogram;
  /**
   * @description
   * Counter to record the number of times a method is called.
   */
  private methodCalls: Counter;
  /**
   * @description
   * Counter to record the number of times an exchange endpoint is called.
   */
  private endpointCalls: Counter;
  /**
   * @description
   * Gauge to record the size of the throttler queues for each exchange and priority.
   */
  private throttlerQueueSize: Gauge;
  /**
   * @description
   * Keep track of max values between scrapes
   */
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

  /**
   * @description
   * Start a timer for a method call.
   * Used to record the duration of a method call, for example, to retrieve the balances.
   */
  public startMethodTimer() {
    return this.methodDuration.startTimer();
  }

  /**
   * @description
   * Record the number of times a method is called.
   */
  public recordMethodCall({
    method,
    exchangeId,
    exchangeInstanceId,
    status
  }: {
    method: string, exchangeId: string, exchangeInstanceId: string, status: 'success' | 'error'
  }) {
    this.methodCalls.labels(method, exchangeId, exchangeInstanceId, status).inc();
  }

  /**
   * @description
   * Record the number of times an exchange endpoint is called and the duration of the call.
   */
  public recordEndpointCall({
    path,
    method,
    exchangeId,
    status,
    durationMs
  }: {
    path: string, method: string, exchangeId: string, status: number, durationMs: number
  }) {
    this.endpointCalls.labels(path, method, exchangeId, status?.toString?.()).inc();
    this.endpointDuration.labels(path, method, exchangeId, status?.toString?.()).observe(durationMs);
  }

  /**
   * @description
   * Used to track the max size of the throttler queues for each exchange and priority.
   * As it updates very frequently, we record the highest value between scrapes.
   */
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
        const key = `${exchangeId}:${priority}`;
        const size = queueSizes[priority] || 0;
        const currentMax = this.maxQueueSizes.get(key) || 0;
        this.maxQueueSizes.set(key, Math.max(currentMax, size));
      }
    }
  }

   /**
   * @description
   * Record the size of the throttler queues for each exchange and priority.
   * The throttler is used to limit the number of requests to exchanges.
   * We update the gauges with the max size of the queues between scrapes.
   */
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