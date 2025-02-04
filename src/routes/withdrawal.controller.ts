import { Router } from 'express';
import { Body, Controller, Get, Header, Path, Post, Query, Route, Tags, Response } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError } from '@cedelabs-private/sdk';
import { AuthParams } from '../utils/typeUtils';
import { PrepareWithdrawalParams as OriginalPrepareWithdrawalParams } from '@cedelabs-private/sdk';
import { CreateWithdrawalParams as OriginalCreateWithdrawalParams } from '@cedelabs-private/sdk';
import { ErrorResponse } from '../types';

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
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Query('exchangeId') exchangeId: string,
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
    return await this.sdk.api.createWithdrawal(params);
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
    return await this.sdk.api.prepareWithdrawal(params);
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
    @Query() exchangeId: string,
    @Query() exchangeInstanceId: string,
    @Query() tokenSymbol: string,
    @Query() network: string,
    @Query() amount: number,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetWithdrawalFeeResponse> {
    return await this.sdk.api.getWithdrawalFee({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, tokenSymbol, network, amount });
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
    @Query() exchangeId: string,
    @Query() address: string,
    @Query() tokenSymbol: string,
    @Query() key: string,
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<CheckAddressIsWhitelistedResponse> {
    return await this.sdk.api.checkAddressIsWhitelisted({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, address, tokenSymbol, key });
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
    @Query() exchangeId: string,
    @Query() exchangeInstanceId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Query() tokenSymbol?: string,
    @Query() network?: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetWhitelistedAddressesResponse> {
    return await this.sdk.api.getWhitelistedAddresses({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid }, tokenSymbol, network });
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
    @Query() exchangeId: string,
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetKrakenWithdrawalMethodsResponse> {
    return await this.sdk.api.getKrakenWithdrawalMethods({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid } });
  }
}

// Express router wrapper
export function withdrawalRoutes(sdk: any) {
  const router = Router();
  const controller = new WithdrawalController(sdk);

  router.get('/:withdrawalId', async (req, res) => {
    try {
      const result = await controller.getWithdrawalById(
        req.params.withdrawalId,
        req.query.tokenSymbol as string,
        Number(req.query.timestamp),
        req.query.exchangeInstanceId as string,
        req.query.exchangeId as string,
        req.header('x-exchange-api-key') as string,
        req.header('x-exchange-api-secret') as string,
        req.header('x-exchange-api-password') as string,
        req.header('x-exchange-api-uid') as string
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const result = await controller.createWithdrawal(req.body);
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/prepare', async (req, res) => {
    try {
      const result = await controller.prepareWithdrawal(req.body);
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/fee', async (req, res) => {
    try {
      const result = await controller.getWithdrawalFee(
        req.query.exchangeId as string,
        req.query.exchangeInstanceId as string,
        req.query.tokenSymbol as string,
        req.query.network as string,
        Number(req.query.amount),
        req.header('x-exchange-api-key') as string,
        req.header('x-exchange-api-secret') as string,
        req.header('x-exchange-api-password') as string,
        req.header('x-exchange-api-uid') as string,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/whitelisted-addresses/check', async (req, res) => {
    try {
      const result = await controller.checkAddressIsWhitelisted(
        req.query.exchangeId as string,
        req.query.address as string,
        req.query.tokenSymbol as string,
        req.query.key as string,
        req.query.exchangeInstanceId as string,
        req.header('x-exchange-api-key') as string,
        req.header('x-exchange-api-secret') as string,
        req.header('x-exchange-api-password') as string,
        req.header('x-exchange-api-uid') as string,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/whitelisted-addresses', async (req, res) => {
    try {
      const result = await controller.getWhitelistedAddresses(
        req.query.exchangeId as string,
        req.query.exchangeInstanceId as string,
        req.header('x-exchange-api-key') as string,
        req.header('x-exchange-api-secret') as string,
        req.query.tokenSymbol as string,
        req.query.network as string,
        req.header('x-exchange-api-password') as string,
        req.header('x-exchange-api-uid') as string,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/kraken-methods', async (req, res) => {
    try {
      const result = await controller.getKrakenWithdrawalMethods(
        req.query.exchangeId as string,
        req.query.exchangeInstanceId as string,
        req.header('x-exchange-api-key') as string,
        req.header('x-exchange-api-secret') as string,
        req.header('x-exchange-api-password') as string,
        req.header('x-exchange-api-uid') as string,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  return router;
} 