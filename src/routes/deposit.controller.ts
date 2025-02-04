import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Query, Route, Tags, Response, Queries } from 'tsoa';
import CedeSDK, { PureTransaction } from '@cedelabs-private/sdk';
import { extractAuthFromHeaders } from '../utils/auth';
import { OnDepositParams } from '../types/types';
import { ErrorResponse } from '../types';
import { errorHandler } from '../middleware/errorHandler';

type GetDepositAddressResponse = ReturnType<CedeSDK['api']['getDepositAddress']>;
type RetrieveDepositResponse = ReturnType<CedeSDK['api']['retrieveDeposit']>;
type GetDepositableTokensResponse = ReturnType<CedeSDK['api']['getDepositableTokens']>;

type GetDepositAddressParams = {
  tokenSymbol: string;
  network: string;
}

type RetrieveDepositParams = {
  txHash: string;
  tokenSymbol: string;
}

@Route('deposit')
@Tags('Deposit')
export class DepositController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get deposit address for a token.
   * Retrieves the deposit address for a specific token and network on an exchange.
   */
  @Get('address')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getDepositAddress(
    @Queries() params: GetDepositAddressParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetDepositAddressResponse> {
    return await this.sdk.api.getDepositAddress({
      exchangeInstanceId,
      auth: {
        exchangeId,
        apiKey,
        secretKey,
        password,
        uid,
      },
      ...params,
    });
  }

  /**
   * Retrieve deposit information
   */
  @Get('retrieve')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async retrieveDeposit(
    @Queries() params: RetrieveDepositParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<RetrieveDepositResponse> {
    return await this.sdk.api.retrieveDeposit({ 
      exchangeInstanceId, 
      auth: { exchangeId, apiKey, secretKey, password, uid }, 
      ...params 
    });
  }

  /**
   * Handle deposit event.
   * Monitors for deposit completion and triggers webhook when detected.
   * 
   * @example
   * ```typescript
   * // Example with callback headers for webhook authentication
   * await api.deposit.onDeposit({
   *   webhook: "https://your-server.com/webhook",
   *   callbackHeaders: {
   *     "Authorization": "Bearer your-secret-token",
   *     "X-Custom-Header": "custom-value"
   *   }
   * })
   * ```
   * 
   * @description
   * The callbackHeaders parameter allows you to specify custom headers that will be included
   * in every webhook request. This is particularly useful for:
   * - Adding authentication tokens to secure webhook endpoints
   * - Including custom tracking or correlation IDs
   * - Setting up webhook signature verification
   * 
   * When the service detects a deposit, it will make a POST request to your webhook URL
   * including these headers in the request.
   */
  @Post('on-deposit')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async onDeposit(@Body() params: OnDepositParams): Promise<void> {
    const callback = async (tx: PureTransaction | null) => {
      try {
        await fetch(params.callbackUrl, {
          method: 'POST',
          body: JSON.stringify(tx),
          headers: params.callbackHeaders || {}
        });
      } catch (error) {
        console.error('Error calling callback URL:', error);
      }
    };

    return await this.sdk.api.onDeposit({ ...params, callback });
  }

  /**
   * Get depositable tokens.
   * Retrieves all tokens that can be deposited on the exchange.
   * The response includes network information and deposit status for each token.
   */
  @Get('tokens')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getDepositableTokens(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetDepositableTokensResponse> {
    return await this.sdk.api.getDepositableTokens({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid } });
  }
}

// Express router wrapper
export function depositRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new DepositController(sdk);

  router.get('/address', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const params: GetDepositAddressParams = {
      tokenSymbol: req.query.tokenSymbol as string,
      network: req.query.network as string
    };
    const result = await controller.getDepositAddress(
      params,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
    );
    res.json(result);
  }));

  router.get('/retrieve', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const params: RetrieveDepositParams = {
      txHash: req.query.txHash as string,
      tokenSymbol: req.query.tokenSymbol as string
    };
    const result = await controller.retrieveDeposit(
      params,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
    );
    res.json(result);
  }));

  router.post('/on-deposit', errorHandler(async (req, res) => {
    const result = await controller.onDeposit(req.body);
    res.json(result);
  }));

  router.get('/tokens', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getDepositableTokens(
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
    );
    res.json(result);
  }));

  return router;
} 