// Define the structure of mock values for individual endpoints
export interface MockValue {
  method?: string; // HTTP method (GET, POST, PUT, DELETE)
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>; // For path parameters
}

// Configuration for a specific controller's endpoints
type EndpointMockConfig = Record<string, MockValue>;

// Configuration for all controllers in the API
interface ControllerMockConfig {
  [controller: string]: EndpointMockConfig;
}

/**
 * Mock configuration for all API endpoints
 * 
 * Structure:
 * {
 *   [controller]: {
 *     [endpoint]: {
 *       method: 'GET|POST|PUT|DELETE',
 *       headers: { ... },
 *       query: { ... },
 *       body: { ... },
 *       params: { ... }
 *     }
 *   }
 * }
 */
export const mockConfig: ControllerMockConfig = {
  auth: {
    'oauth/url': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance'
      },
      query: {
        redirectUri: 'http://localhost:3000/callback',
        permissions: 'read,trade,withdraw'
      }
    },
    'oauth/tokens': {
      method: 'POST',
      body: {
        exchangeId: 'binance',
        redirectUriWithCode: 'http://localhost:3000/callback?code=demo-code',
        codeVerifier: 'demo-code-verifier'
      }
    },
    'oauth/client-credentials': {
      method: 'POST',
      body: {
        clientId: 'demo-client-id',
        clientSecret: 'demo-client-secret',
        exchangeId: 'binance'
      }
    },
    'check-credentials': {
      method: 'POST',
      body: {
        exchangeId: 'binance',
        exchangeInstanceId: 'binance-1',
        apiKey: 'demo-api-key',
        secretKey: 'demo-secret-key'
      }
    }
  },
  deposit: {
    'address': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        tokenSymbol: 'BTC',
        network: 'BTC'
      }
    },
    'retrieve': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        txHash: 'demo-tx-hash',
        tokenSymbol: 'BTC'
      }
    },
    'on-deposit': {
      method: 'POST',
      body: {
        auth: {
          exchangeInstanceId: 'binance-1',
          exchangeId: 'binance',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        callbackUrl: 'http://localhost:3000/callback',
        tokenSymbol: 'ETH',
        network: 'ethereum',
        amount: '1.0',
        address: 'demo-deposit-address',
        txHash: '0x1234567890abcdef',
        callbackHeaders: {
          'Authorization': 'Bearer demo-token'
        }
      }
    },
    'tokens': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    }
  },
  exchange: {
    'supported': {
      method: 'GET'
    },
    'status': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance'
      }
    }
  },
  health: {
    '': {
      method: 'GET'
    }
  },
  networks: {
    '': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        tokenSymbol: 'BTC',
        toDeposit: 'true',
        toWithdraw: 'true'
      }
    },
    'available': {
      method: 'GET',
      query: {
        exchangeId: 'binance',
        toDeposit: 'true',
        toWithdraw: 'true'
      }
    }
  },
  portfolio: {
    'withdrawable-balances': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    'balances': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    'balances-with-tokens': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    'main-sub-accounts-balances-with-tokens': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    }
  },
  prices: {
    '': {
      method: 'GET',
      query: {
        exchangeId: 'binance'
      }
    },
    'fiat-currencies': {
      method: 'GET'
    }
  },
  subAccount: {
    '': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    'balances': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        uid: 'demo-sub-account-uid'
      }
    },
    'transfer': {
      method: 'POST',
      body: {
        auth: {
          exchangeInstanceId: 'binance-1',
          exchangeId: 'binance',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        amount: '1.0',
        tokenSymbol: 'BTC',
        fromUid: 'demo-from-uid',
        toUid: 'demo-to-uid'
      }
    }
  },
  tokens: {
    'supported': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    }
  },
  trade: {
    'market-pairs': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    'market-rate': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        pairSymbol: 'BTC/USDT'
      }
    },
    'min-amounts': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        pairSymbol: 'BTC/USDT',
        orderSide: 'buy',
        price: '50000'
      }
    },
    'orders/prepare': {
      method: 'POST',
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        pairSymbol: 'BTC/USDT',
        orderSide: 'buy',
        orderType: 'limit',
        amount: '1.0',
        price: '50000'
      }
    },
    'orders-get': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        pairSymbol: 'BTC/USDT',
        limit: '10',
        since: '0'
      }
    },
    'orders-post': {
      method: 'POST',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        pairSymbol: 'BTC/USDT',
        orderSide: 'buy',
        orderType: 'limit',
        amount: '1.0',
        price: '50000',
        createOrderRequest: {
          id: 'demo-order-id',
          pairSymbol: 'BTC/USDT',
          side: 'buy',
          type: 'limit',
          amount: 1.0,
          price: 50000,
          timestamp: Date.now()
        }
      }
    },
    'orders/demo-order-id': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        pairSymbol: 'BTC/USDT'
      },
      params: {
        id: 'demo-order-id',
        orderId: 'demo-order-id'
      }
    },
    'orders/demo-order-id-put': {
      method: 'PUT',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      params: {
        id: 'demo-order-id',
        orderId: 'demo-order-id'
      },
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        pairSymbol: 'BTC/USDT',
        price: '52000',
        amount: '1.2'
      }
    },
    'orders/demo-order-id-delete': {
      method: 'DELETE',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      params: {
        id: 'demo-order-id',
        orderId: 'demo-order-id'
      },
      query: {
        pairSymbol: 'BTC/USDT'
      }
    }
  },
  transfer: {
    'routes': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    },
    '': {
      method: 'POST',
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        amount: '1.0',
        tokenSymbol: 'BTC',
        fromWalletType: 'spot',
        toWalletType: 'funding'
      }
    },
    'wallet-type-mapping': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      }
    }
  },
  withdrawal: {
    '': {
      method: 'POST',
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        tokenSymbol: 'BTC',
        network: 'BTC',
        address: 'demo-address',
        amount: '1.0'
      }
    },
    'prepare': {
      method: 'POST',
      body: {
        auth: {
          exchangeId: 'binance',
          exchangeInstanceId: 'binance-1',
          apiKey: 'demo-api-key',
          secretKey: 'demo-secret-key'
        },
        tokenSymbol: 'BTC',
        network: 'BTC',
        address: 'demo-address',
        amount: '1.0'
      }
    },
    'fee': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        tokenSymbol: 'BTC',
        network: 'BTC',
        amount: '1.0'
      }
    },
    'whitelisted-addresses': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        network: 'ethereum'
      }
    },
    'whitelisted-addresses/check': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      query: {
        tokenSymbol: 'BTC',
        network: 'BTC',
        address: 'demo-address'
      }
    },
    'kraken-methods': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'kraken',
        'x-exchange-instance-id': 'kraken-1',
        'x-exchange-api-key': 'demo-kraken-api-key',
        'x-exchange-api-secret': 'demo-kraken-secret-key'
      },
      query: {
        tokenSymbol: 'BTC'
      }
    },
    'demo-withdrawal-id': {
      method: 'GET',
      headers: {
        'x-exchange-id': 'binance',
        'x-exchange-instance-id': 'binance-1',
        'x-exchange-api-key': 'demo-api-key',
        'x-exchange-api-secret': 'demo-secret-key'
      },
      params: {
        withdrawalId: 'demo-withdrawal-id'
      },
      query: {
        tokenSymbol: 'BTC',
        timestamp: '1620000000000'
      }
    }
  }
}; 