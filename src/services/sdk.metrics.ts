import { MetricsService } from './metrics';
import CedeSDK from "@cedelabs-private/sdk";

const METRICS_CHECK_INTERVAL = 1000;
const GAUGE_UPDATE_INTERVAL = 30000; // Update gauges every 30 seconds (2x the scrape interval)

export const setupMetrics = (sdk: CedeSDK) => {
    const metricsService = MetricsService.getInstance();

    setInterval(async () => {
        try {
            const metrics = await sdk.api.getThrottlerMetrics();
            metricsService.recordThrottlerQueues(metrics);
        } catch (error) {
            console.error('Failed to collect throttler metrics:', error);
        }
    }, METRICS_CHECK_INTERVAL);

    setInterval(() => {
        metricsService.updateGauges();
    }, GAUGE_UPDATE_INTERVAL);
}