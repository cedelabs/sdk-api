import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import { metricsMiddleware } from './metricsMiddleware';
import { MetricsService } from '../services/metrics';
import { describe, expect, test, Mock,  beforeEach, vi } from "vitest"

describe('metricsMiddleware', () => {
  let mockMetrics: {
    startMethodTimer: Mock;
    recordMethodCall: Mock;
  };
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.resetAllMocks();

    // Create a mock metrics service with spies on method timer and recordMethodCall.
    mockMetrics = {
      startMethodTimer: vi.fn(() => vi.fn()),
      recordMethodCall: vi.fn(),
    };

    // Override the MetricsService.getInstance() to return our mock
    vi.spyOn(MetricsService, 'getInstance').mockReturnValue(mockMetrics);

    // Create a fake next function
    next = vi.fn();

    // Create a fake Express response using EventEmitter so we can also simulate an "error" event.
    res = Object.assign(new EventEmitter(), {
      statusCode: 200,
      // Save the originalSend for later comparison (in middleware it is wrapped)
      json: vi.fn().mockImplementation(function (body) {
        return body;
      }),
    });
  });

  test('should record success call with canonical route from originalUrl and exchange IDs from headers', async () => {
    req = {
      headers: {
        'x-exchange-id': 'headerExchange',
        'x-exchange-instance-id': 'headerInstance',
      },
      query: {},
      body: {},
      originalUrl: '/orders/123',
    };

    const middleware = metricsMiddleware();

    await middleware(req as Request, res, next);
    expect(next).toHaveBeenCalled();

    // Simulate sending the response (statusCode < 400 should be a "success")
    res.statusCode = 200;
    const responsePayload = { data: 'test' };
    const result = res.json(responsePayload);
    // The canonical route should normalize '/orders/123' to '/orders/:id'
    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/orders/:id',
      'headerExchange',
      'headerInstance',
      'success'
    );
    expect(result).toEqual(responsePayload);
  });

  test('should extract exchange IDs from query if not provided in headers', async () => {
    req = {
      headers: {},
      query: { 
        exchangeId: 'queryExchange',
        exchangeInstanceId: 'queryInstance',
      },
      body: {},
      originalUrl: '/oauth/revoke',
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    res.statusCode = 200;
    const responsePayload = { success: true };
    res.json(responsePayload);

    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/oauth/revoke',
      'queryExchange',
      'queryInstance',
      'success'
    );
  });

  test('should extract exchange IDs from body if not provided in headers or query', async () => {
    req = {
      headers: {},
      query: {},
      body: {
        exchangeId: 'bodyExchange',
        exchangeInstanceId: 'bodyInstance',
      },
      originalUrl: '/deposit/address',
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    res.statusCode = 200;
    const responsePayload = { address: '0x123' };
    res.json(responsePayload);

    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/deposit/address',
      'bodyExchange',
      'bodyInstance',
      'success'
    );
  });

  test('should default exchange IDs to "unknown" when missing', async () => {
    req = {
      headers: {},
      query: {},
      body: {},
      originalUrl: '/trade/orders',
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    res.statusCode = 200;
    const responsePayload = { orders: [] };
    res.json(responsePayload);

    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/trade/orders',
      'unknown',
      'unknown',
      'success'
    );
  });

  test('should record an error status when statusCode >= 400', async () => {
    req = {
      headers: {
        'x-exchange-id': 'errorExchange',
        'x-exchange-instance-id': 'errorInstance',
      },
      query: {},
      body: {},
      originalUrl: '/subAccount/balances',
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    // Simulate an error status
    res.statusCode = 400;
    const responsePayload = { error: 'Bad Request' };
    res.json(responsePayload);

    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/subAccount/balances',
      'errorExchange',
      'errorInstance',
      'error'
    );
  });

  test('should normalize numeric path segments', async () => {
    req = {
      headers: {
        'x-exchange-id': 'numExchange',
        'x-exchange-instance-id': 'numInstance',
      },
      query: {},
      body: {},
      originalUrl: '/orders/98765/details',
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    res.statusCode = 200;
    const responsePayload = { details: 'info' };
    res.json(responsePayload);

    // The numeric segment "98765" should become ":id"
    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/orders/:id/details',
      'numExchange',
      'numInstance',
      'success'
    );
  });

  test('should use baseUrl and route.path when available for a canonical route', async () => {
    req = {
      headers: {
        'x-exchange-id': 'baseRouteExchange',
        'x-exchange-instance-id': 'baseRouteInstance',
      },
      query: {},
      body: {},
      baseUrl: '/auth',
      route: { path: '/oauth/tokens' },
      originalUrl: '/auth/oauth/tokens', // fallback if needed, but baseUrl+route.path takes precedence
    };

    const middleware = metricsMiddleware();
    await middleware(req as Request, res, next);

    res.statusCode = 200;
    const responsePayload = { token: 'abc' };
    res.json(responsePayload);

    // Expected combined path: '/auth/oauth/tokens'
    expect(mockMetrics.recordMethodCall).toHaveBeenCalledWith(
      '/auth/oauth/tokens',
      'baseRouteExchange',
      'baseRouteInstance',
      'success'
    );
  });
}); 