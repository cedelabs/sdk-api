import CedeSDK, { PureTransaction } from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Queries, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { OnDepositParams } from '../types/types';
import { extractAuthFromHeaders } from '../utils/auth';

type GetDepositAddressResponse = ReturnType<CedeSDK['api']['getDepositAddress']>;
type RetrieveDepositResponse = ReturnType<CedeSDK['api']['retrieveDeposit']>;
type GetDepositableTokensResponse = ReturnType<CedeSDK['api']['getDepositableTokens']>;

interface GetDepositAddressParams {
  tokenSymbol: string;
  network: string;
}

interface RetrieveDepositParams {
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
   * Retrieves the deposit address for a specific token and network on an exchange.
   * 
   * The SDK returns the deposit address provided by the exchange, it's unique
   * for each user.
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
   * Retrieve deposit information by the tx hash. 
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
   * The callbackHeaders parameter allows you to specify custom headers that will be included
   * in every webhook request. This is particularly useful for:
   * - Adding authentication tokens to secure webhook endpoint
   * - Including custom tracking or correlation IDs
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
   * Get all tokens that can be deposited on the exchange.
   * The response includes network information for most of the exchanges allowing
   * to retrieve it without querying per token. For the exchanges that don't 
   * networks in depositable tokens, please use `/networks` endpoint with `toDeposit: true` flag.
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