import { Request } from 'express';
import { logger } from '../services/logger';
import { mockConfig } from './mockConfig';

// Define the MockValue interface to match the one in mockConfig.ts
export interface MockValue {
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
}

// Extend the Express Request interface to include our custom property
declare global {
  namespace Express {
    interface Request {
      mockParams?: Record<string, string>;
    }
  }
}

/**
 * Injects mock values (headers, query params, body, path params) into the request
 * based on the configuration defined in mockConfig.
 * 
 * This is used when the SDK is running in MOCK mode to automatically provide
 * default values for all parameters that aren't explicitly specified in the request.
 */
export function injectMockValues(req: Request): void {
  // Extract the controller and endpoint from the path
  const pathParts = req.path.split('/api/v1/')[1]?.split('/');
  if (!pathParts || pathParts.length === 0) return;

  const controller = pathParts[0];
  const controllerConfig = mockConfig[controller];
  if (!controllerConfig) return;

  // Build the endpoint path without the controller prefix
  const endpoint = pathParts.slice(1).join('/');
  
  // Special handling for order and withdrawal IDs
  let mockValue: MockValue | undefined;

  logger.info(`pathParts: ${pathParts}`);
  
  // First check if the exact endpoint exists in the config
  const exactEndpointExists = !!controllerConfig[endpoint];
  
  // Then check if the method-specific endpoint exists
  const methodSuffix = req.method.toLowerCase();
  const methodSpecificEndpoint = `${endpoint}-${methodSuffix}`;
  const methodSpecificEndpointExists = !!controllerConfig[methodSpecificEndpoint];
  
  // Check for order ID pattern - only if the exact path doesn't exist in config
  if (pathParts.length > 2 && pathParts[1] === 'orders' && pathParts[2] && !exactEndpointExists && !methodSpecificEndpointExists) {
    // The endpoint doesn't exist directly in config, so treat it as a dynamic ID
    const orderId = pathParts[2];
    mockValue = controllerConfig['orders/demo-order-id'];
    if (mockValue && (!mockValue.method || mockValue.method === req.method)) {
      // Create a copy of the mock params
      const mockParams = { ...(mockValue.params || {}) };
      // Add the actual order ID
      mockParams.id = orderId;
      mockParams.orderId = orderId;
      // Replace the params with our updated version
      mockValue = { ...mockValue, params: mockParams };
    }
  } 
  // Check for withdrawal ID pattern - only if the exact path doesn't exist in config
  else if (controller === 'withdrawal' && pathParts.length > 1 && pathParts[1] && !exactEndpointExists && !methodSpecificEndpointExists) {
    // The endpoint doesn't exist directly in config, so treat it as a dynamic ID
    const withdrawalId = pathParts[1];
    mockValue = controllerConfig['demo-withdrawal-id'];
    if (mockValue && (!mockValue.method || mockValue.method === req.method)) {
      // Create a copy of the mock params
      const mockParams = { ...(mockValue.params || {}) };
      // Add the actual withdrawal ID
      mockParams.withdrawalId = withdrawalId;
      // Replace the params with our updated version
      mockValue = { ...mockValue, params: mockParams };
    }
  }
  
  // If no special case match, try exact match
  if (!mockValue) {
    mockValue = controllerConfig[endpoint];
  }
  
  // If no exact match, try method-specific endpoint
  if (!mockValue) {
    mockValue = controllerConfig[methodSpecificEndpoint];
  }
  
  // If still no match, try root endpoint
  if (!mockValue) {
    mockValue = controllerConfig[''];
  }
  
  // Log what endpoint we matched to help with debugging
  logger.info(`Mock values for ${req.path}: matched to ${endpoint || 'root endpoint'}`);
  
  // If we found a mock value and either it doesn't specify a method or it matches our method
  if (mockValue && (!mockValue.method || mockValue.method === req.method)) {
    // Inject headers
    if (mockValue.headers) {
      Object.entries(mockValue.headers).forEach(([key, value]) => {
        if (!req.headers[key]) {
          req.headers[key] = value;
          logger.info(`Injected ${key} header for ${req.path}`);
        }
      });
    }
    
    // Inject query parameters
    if (mockValue.query) {
      Object.entries(mockValue.query).forEach(([key, value]) => {
        // Check if the parameter is undefined or an empty string
        if (req.query[key] === undefined || req.query[key] === '') {
          req.query[key] = value;
          logger.info(`Injected ${key} query parameter for ${req.path} with value ${value}`);
        }
      });
    }
    
    // Store mock params
    if (mockValue.params) {
      req.mockParams = { ...mockValue.params };
      
      // Extract path parameters if needed
      const endpointParts = endpoint.split('/');
      for (let i = 0; i < endpointParts.length; i++) {
        const part = pathParts[i + 1]; // +1 to skip controller
        if (part && part !== endpointParts[i]) {
          // This is likely a path parameter, store its value
          if (req.mockParams) {
            req.mockParams[endpointParts[i]] = part;
          }
        }
      }
      
      logger.info(`Stored mock params for ${req.path}`);
    }
    
    // Inject body for POST and PUT requests
    if (mockValue.body && (req.method === 'POST' || req.method === 'PUT')) {
      req.body = req.body || {};
      
      // Simple merge of body values
      Object.entries(mockValue.body).forEach(([key, value]) => {
        if (req.body[key] === undefined) {
          req.body[key] = value;
          logger.info(`Injected ${key} in request body for ${req.path}`);
        }
      });
    }
  } else {
    // No mock values found or method mismatch
    logger.info(`No matching mock config found for ${req.path} (${req.method})`);
  }
} 