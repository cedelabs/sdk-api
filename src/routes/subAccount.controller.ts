import CedeSDK, { SubAccountTransferParams as CedeSDKSubAccountTransferParams, SubAccountTransferResponse } from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Query, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
import { AuthParams } from '../utils/typeUtils';

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
   * Get all sub accounts of the master account. The response is an array of sub-account UIDs.
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
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
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
   * Get sub account balances for a specific sub account UID.
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
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') authUid?: string,
  ): Promise<GetSubAccountBalancesResponse> {
    return await this.sdk.api.getSubAccountBalances({ exchangeInstanceId, auth: { exchangeId, apiKey, secretKey, password, uid: authUid }, uid });
  }

  /**
   * Transfer funds between sub-account and master account.
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

export function subAccountRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new SubAccountController(sdk);

  router.get('/', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getSubAccounts(
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey
    );
    res.json(result);
  }));

  router.get('/balances', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const uid = req.query.uid as string;
    const decodedUid = decodeURIComponent(uid);
    const result = await controller.getSubAccountBalances(
      decodedUid,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  router.post('/transfer', errorHandler(async (req, res) => {
    const result = await controller.subAccountTransfer(req.body);
    res.json(result);
  }));


  return router;
} 