import CedeSDK, {
  CedeSDKError,
  CreateOrderParams as CreateOrderParamsType,
  PrepareOrderParams as PrepareOrderParamsType,
  UpdateOrderParams as UpdateOrderParamsType
} from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Delete, Get, Header, Path, Post, Put, Queries, Query, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
import { processError } from '../utils/error';
import { AuthParams } from '../utils/typeUtils';

type PrepareOrderParams = Omit<PrepareOrderParamsType, 'fromExchange' | 'toExchange' | 'readonlyExchange' | 'exchange'> & {
  auth: AuthParams;
};
type UpdateOrderParams = Omit<UpdateOrderParamsType, 'exchange' | 'orderId'> & {
  auth: AuthParams;
};
type CreateOrderParams = Omit<CreateOrderParamsType, 'fromExchange' | 'toExchange' | 'readonlyExchange' | 'exchange'> & {
  auth: AuthParams;
};
type GetMarketPairsResponse = ReturnType<CedeSDK['api']['getMarketPairs']>;
type GetMarketRateResponse = ReturnType<CedeSDK['api']['getMarketRate']>;
type PrepareOrderResponse = ReturnType<CedeSDK['api']['prepareOrder']>;
type CreateOrderResponse = ReturnType<CedeSDK['api']['createOrder']>;
type GetOrderResponse = ReturnType<CedeSDK['api']['getOrder']>;
type GetOpenOrdersResponse = ReturnType<CedeSDK['api']['getOpenOrders']>;
type GetMinAmountsResponse = ReturnType<CedeSDK['api']['getMinAmounts']>;
type CancelOrderResponse = ReturnType<CedeSDK['api']['cancelOrder']>;
interface GetOpenOrdersParams {
  pairSymbol: string;
  since?: number;
  limit?: number;
}
interface GetMinAmountsParams {
  pairSymbol: string;
  orderSide: "buy" | "sell";
  price: string;
}

@Route('trade')
@Tags('Trade')
export class TradeController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get all available market pairs.
   * Retrieves trading pairs supported by the exchange.
   * Includes information about base/quote currencies and trading status.
   */
  @Get('market-pairs')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getMarketPairs(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetMarketPairsResponse> {
    return await this.sdk.api.getMarketPairs({
      exchangeInstanceId,
      auth: {
        exchangeId,
        apiKey,
        secretKey,
        password,
        uid,
      },
    });
  }
  /**
   * Get current market rate.
   * Retrieves best bid (highest buy) and ask (lowest sell) rates for a trading pair.
   * @param pairSymbol Trading pair in format base/quote (e.g. BTC/USDC)
   */
  @Get('market-rate')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getMarketRate(
    @Query() pairSymbol: string,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetMarketRateResponse> {
    return await this.sdk.api.getMarketRate({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, pairSymbol });
  }

  /**
   * Get minimum trading amounts.
   * Retrieves the minimum required amounts for trading on a specific pair.
   * This helps ensure orders meet exchange requirements before submission.
   */
  @Get('min-amounts')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getMinAmounts(
    @Queries() params: GetMinAmountsParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetMinAmountsResponse> {
    return await this.sdk.api.getMinAmounts({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, ...params });
  }

  /**
   * Prepare order details.
   * Calculates estimated amounts and fees before placing an order.
   * Returns createOrderRequest object needed for actual order creation.
   */
  @Post('orders/prepare')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async prepareOrder(@Body() params: PrepareOrderParams): Promise<PrepareOrderResponse> {
    const prepareOrderParams = {
      ...params,
      exchangeInstanceId: params.auth.exchangeInstanceId,
    };
    return await this.sdk.api.prepareOrder(prepareOrderParams);
  }

  /**
   * Create new order.
   * Places a new order on the exchange using prepared order details.
   */
  @Post('orders')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  @Response<ErrorResponse>(402, 'Insufficient balance')
  public async createOrder(@Body() params: CreateOrderParams): Promise<CreateOrderResponse> {
    const createOrderParams = {
      ...params,
      exchangeInstanceId: params.auth.exchangeInstanceId,
    };
    return await this.sdk.api.createOrder(createOrderParams);
  }

  /**
   * Get order by ID.
   * Retrieves details of a specific order.
   */
  @Get('orders/{orderId}')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getOrder(
    @Path() orderId: string,
    @Query() pairSymbol: string,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetOrderResponse> {
    return await this.sdk.api.getOrder({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, orderId, pairSymbol });
  }

  /**
   * Update an existing order.
   * Modifies parameters of an open order such as price or amount.
   * Not all exchanges support order updates.
   */
  @Put('orders/{orderId}')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async updateOrder(
    @Path() orderId: string,    
    @Body() params: UpdateOrderParams
  ): Promise<GetOrderResponse> {
    const updateOrderParams = {
      ...params,
      orderId,
      exchangeInstanceId: params.auth.exchangeInstanceId,
    };
    return await this.sdk.api.updateOrder(updateOrderParams);
  }

  /**
   * Cancel existing order.
   * Cancels an open order on the exchange.
   * Returns "canceled" or "already_filled".
   */
  @Delete('orders/{orderId}')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async cancelOrder(
    @Path() orderId: string,
    @Query() pairSymbol: string,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<CancelOrderResponse> {
    return await this.sdk.api.cancelOrder({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, orderId, pairSymbol });
  }

  /**
   * Get all open orders.
   * Retrieves all currently active orders on the exchange.
   * Orders are sorted by timestamp in descending order.
   */
  @Get('orders')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getOpenOrders(
    @Queries() params: GetOpenOrdersParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetOpenOrdersResponse> {
    return await this.sdk.api.getOpenOrders({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, ...params });
  }
}

export function tradeRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new TradeController(sdk);

  router.get('/market-pairs', async (req, res) => {
    try {
      const auth = extractAuthFromHeaders(req);
      const result = await controller.getMarketPairs(
        auth.exchangeInstanceId,
        auth.exchangeId,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });


  router.get('/market-rate', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getMarketRate( 
      req.query.pairSymbol as string,
      auth.exchangeInstanceId, 
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  router.get('/min-amounts', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
      const result = await controller.getMinAmounts(
        {
          pairSymbol: req.query.pairSymbol as string,
          orderSide: req.query.orderSide as "buy" | "sell",
          price: req.query.price as string,
        },
        auth.exchangeInstanceId,
        auth.exchangeId,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
      );
      res.json(result);
  }));

  router.post('/orders/prepare', errorHandler(async (req, res) => {
    const result = await controller.prepareOrder(req.body);
    res.json(result);
  }));

  router.post('/orders', errorHandler(async (req, res) => {
    const result = await controller.createOrder(req.body);
    res.json(result);
  }));

  router.get('/orders/:id', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getOrder(
      req.params.id,
      req.query.pairSymbol as string,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  router.put('/orders/:orderId', errorHandler(async (req, res) => {
    const result = await controller.updateOrder(req.params.orderId, req.body);
    res.json(result);
  }));

  router.delete('/orders/:id', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.cancelOrder(
      req.params.id,
      req.query.pairSymbol as string,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  router.get('/orders', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getOpenOrders(
      {
        pairSymbol: req.query.pairSymbol as string,
        since: req.query.since as number | undefined,
        limit: req.query.limit as number | undefined,
      },
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  return router;
}