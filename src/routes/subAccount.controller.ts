import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Query, Route, Tags, Response } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError, SubAccountTransferResponse, SubAccountTransferParams as CedeSDKSubAccountTransferParams } from '@cedelabs-private/sdk';
import { AuthParams } from '../utils/typeUtils';
import { extractAuthFromHeaders } from '../utils/auth';
import { ErrorResponse } from '../types';

type GetSubAccountsResponse = ReturnType<CedeSDK['api']['getSubAccounts']>;
type GetSubAccountBalancesResponse = ReturnType<CedeSDK['api']['getSubAccountBalances']>;
type SubAccountTransferParams =Omit<CedeSDKSubAccountTransferParams, 'fromExchange' | 'toExchange' | 'readonlyExchange' | 'exchange'> & {
  exchangeInstanceId: string;
  auth: AuthParams;
};

@Route('subAccount')
@Tags('Sub Accounts')
export class SubAccountController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get all sub accounts
   */
  @Get()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getSubAccounts(
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Query('exchangeId') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetSubAccountsResponse> {
    return await this.sdk.api.getSubAccounts({
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
   * Get sub account balances
   * @summary Retrieves the balances for a specific sub account
   * @remarks Make sure to URI encode the uid parameter to handle special characters properly
   */
  @Get('balances')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getSubAccountBalances(
    @Query() uid: string,
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Query('exchangeId') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') authUid?: string,
  ): Promise<GetSubAccountBalancesResponse> {
    return await this.sdk.api.getSubAccountBalances({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid: authUid }, uid });
  }

  /**
   * Transfer between sub accounts
   */
  @Post('transfer')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async subAccountTransfer(
    @Body() params: SubAccountTransferParams,
  ): Promise<SubAccountTransferResponse> {
    return await this.sdk.api.subAccountTransfer(params);
  }
}

// Express router wrapper
export function subAccountRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new SubAccountController(sdk);

  router.get('/', async (req, res) => {
    try {
      const auth = extractAuthFromHeaders(req);
      const result = await controller.getSubAccounts(
        req.query.exchangeInstanceId as string,
        req.query.exchangeId as string,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/balances', async (req, res) => {
    try {
      const auth = extractAuthFromHeaders(req);
      const uid = req.query.uid as string;
      const decodedUid = decodeURIComponent(uid);
      const result = await controller.getSubAccountBalances(
        decodedUid,
        req.query.exchangeInstanceId as string,
        req.query.exchangeId as string,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/transfer', async (req, res) => {
    try {
      const result = await controller.subAccountTransfer(req.body);
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  return router;
} 