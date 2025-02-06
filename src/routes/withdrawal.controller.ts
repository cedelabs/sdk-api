import CedeSDK, { CreateWithdrawalParams as OriginalCreateWithdrawalParams, PrepareWithdrawalParams as OriginalPrepareWithdrawalParams } from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Get, Header, Path, Post, Queries, Query, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
import { AuthParams } from '../utils/typeUtils';
/**
 * @remarks
 * We can't use generic types to avoid redundant replacements of parameters and adding `auth` to the params.
 * tsoa doesn't support this type inference and parses only auth params.
 */

type GetWithdrawalByIdResponse = ReturnType<CedeSDK['api']['getWithdrawalById']>;
type PrepareWithdrawalParams = Omit<OriginalPrepareWithdrawalParams, 'fromExchange' | 'toExchange' | 'readonlyExchange'> & {
  auth: AuthParams;
};
type CreateWithdrawalParams = Omit<OriginalCreateWithdrawalParams, 'fromExchange' | 'toExchange' | 'readonlyExchange'> & {
  auth: AuthParams;
};
type PrepareWithdrawalResponse = ReturnType<CedeSDK['api']['prepareWithdrawal']>;
type GetWithdrawalFeeResponse = ReturnType<CedeSDK['api']['getWithdrawalFee']>;
type CheckAddressIsWhitelistedResponse = ReturnType<CedeSDK['api']['checkAddressIsWhitelisted']>;
type GetWhitelistedAddressesResponse = ReturnType<CedeSDK['api']['getWhitelistedAddresses']>;
type GetKrakenWithdrawalMethodsResponse = ReturnType<CedeSDK['api']['getKrakenWithdrawalMethods']>;
type CreateWithdrawalResponse = ReturnType<CedeSDK['api']['createWithdrawal']>;
interface GetWithdrawalFeeParams {
  tokenSymbol: string;
  network: string;
  amount: number;
}
interface GetWhitelistedAddressesParams {
  tokenSymbol?: string;
  network?: string;
}
interface CheckAddressIsWhitelistedParams {
  address: string;
  tokenSymbol: string;
  key: string;
}
@Route('withdrawal')
@Tags('Withdrawal')
export class WithdrawalController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();    
  }

  /**
   * Get withdrawal by ID.
   * Retrieves details of a specific withdrawal transaction.
   * Includes status, amount, and network information.
   */
  @Get('{withdrawalId}')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getWithdrawalById(
    @Path() withdrawalId: string,
    @Query() tokenSymbol: string,
    @Query() timestamp: number,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetWithdrawalByIdResponse> {
    return await this.sdk.api.getWithdrawalById({
      exchangeInstanceId,
      auth: {
        exchangeId,
        apiKey,
        secretKey,
        password,
        uid,
      },
      withdrawalId,
      tokenSymbol,
      timestamp,
    });
  }

  /**
   * Create a new withdrawal.
   * Initiates a withdrawal transaction from the exchange.
   * Requires proper authentication and withdrawal address verification.
   */
  @Post()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  @Response<ErrorResponse>(402, 'Insufficient balance')
  public async createWithdrawal(@Body() params: CreateWithdrawalParams): Promise<CreateWithdrawalResponse> {
    const createWithdrawalParams = {
      ...params,
      fromExchangeInstanceId: params.auth.exchangeInstanceId,
    };
    return await this.sdk.api.createWithdrawal(createWithdrawalParams);
  }

  /**
   * Prepare withdrawal transaction.
   * Calculates fees and validates withdrawal parameters before execution.
   * Returns a prepared transaction object for confirmation.
   */
  @Post('prepare')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async prepareWithdrawal(@Body() params: PrepareWithdrawalParams): Promise<PrepareWithdrawalResponse> {
    const prepareWithdrawalParams = {
      ...params,
      fromExchangeInstanceId: params.auth.exchangeInstanceId,
    };
    return await this.sdk.api.prepareWithdrawal(prepareWithdrawalParams);
  }

  /**
   * Get withdrawal fee.
   * Calculates the network fee for a withdrawal transaction.
   * Fee varies based on token, network, and amount.
   */
  @Get('fee')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getWithdrawalFee(
    @Queries() params: GetWithdrawalFeeParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetWithdrawalFeeResponse> {
    return await this.sdk.api.getWithdrawalFee({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, ...params });
  }

  /**
   * Check if address is whitelisted.
   * Verifies if a withdrawal address is in the exchange's whitelist.
   * Required for exchanges with mandatory address whitelisting.
   */
  @Get('whitelisted-addresses/check')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async checkAddressIsWhitelisted(
    @Queries() params: CheckAddressIsWhitelistedParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<CheckAddressIsWhitelistedResponse> {
    return await this.sdk.api.checkAddressIsWhitelisted({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, ...params });
  }

  /**
   * Get whitelisted addresses.
   * Retrieves all whitelisted withdrawal addresses for an exchange.
   * Can be filtered by token and network.
   */
  @Get('whitelisted-addresses')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getWhitelistedAddresses(
    @Queries() params: GetWhitelistedAddressesParams,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetWhitelistedAddressesResponse> {
    return await this.sdk.api.getWhitelistedAddresses({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, ...params });
  }

  /**
   * Get Kraken withdrawal methods.
   * Retrieves available withdrawal methods specific to Kraken exchange.
   * Includes method IDs and associated fees.
   */
  @Get('kraken-methods')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getKrakenWithdrawalMethods(
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetKrakenWithdrawalMethodsResponse> {
    return await this.sdk.api.getKrakenWithdrawalMethods({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid } });
  }
}

export function withdrawalRoutes(sdk: any) {
  const router = Router();
  const controller = new WithdrawalController(sdk);

  router.get('/:withdrawalId', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getWithdrawalById(
      req.params.withdrawalId,
      req.query.tokenSymbol as string,
      Number(req.query.timestamp),
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
      );
    res.json(result);
  }));

  router.post('/', errorHandler(async (req, res) => {
    const result = await controller.createWithdrawal(req.body);
    res.json(result);
  }));

  router.post('/prepare', errorHandler(async (req, res) => {
    const result = await controller.prepareWithdrawal(req.body);
    res.json(result);
  }));


  router.get('/fee', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getWithdrawalFee(
        {
          tokenSymbol: req.query.tokenSymbol as string,
          network: req.query.network as string,
          amount: Number(req.query.amount),
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


  router.get('/whitelisted-addresses/check', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.checkAddressIsWhitelisted(
      {
        address: req.query.address as string,
        tokenSymbol: req.query.tokenSymbol as string,
        key: req.query.key as string,
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

  router.get('/whitelisted-addresses', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getWhitelistedAddresses(
        {
          tokenSymbol: req.query.tokenSymbol as string,
          network: req.query.network as string,
        },
        auth.exchangeId,
        auth.exchangeInstanceId,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
      );
      res.json(result);
  }));

  router.get('/kraken-methods', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getKrakenWithdrawalMethods(
        auth.exchangeId,
        auth.exchangeInstanceId,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
      );
      res.json(result);
  }));

  return router;
} 