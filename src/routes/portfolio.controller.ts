import CedeSDK from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Controller, Get, Header, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
type GetWithdrawableBalancesResponseV2 = ReturnType<CedeSDK['api']['getWithdrawableBalancesV2']>;
type GetBalancesResponseV2 = ReturnType<CedeSDK['api']['getBalancesV2']>;
type GetMainSubAccountsBalancesWithTokensResponseV2 = ReturnType<CedeSDK['api']['getMainSubAccountsBalancesWithTokensV2']>;
type GetBalancesWithTokensResponseV2 = ReturnType<CedeSDK['api']['getBalancesWithTokensV2']>;
@Route('portfolio')
@Tags('Portfolio')
export class PortfolioController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get withdrawable balances for an exchange.
   * Retrieves balances from a wallet used to initiate withdrawals.
   * 
   * If you have funds on other wallets, you'll first need to transfer these funds to the withdrawal wallet:
   * - you can retrieve withdrawal wallets using `/supported` endpoint (`sendWalletTypes` field)
   * 
   * The response includes balances grouped by wallet type.
   */
  @Get('withdrawable-balances')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getWithdrawableBalances(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetWithdrawableBalancesResponseV2> {
    return await this.sdk.api.getWithdrawableBalancesV2({
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
   * Get all balances for an exchange.
   * Retrieves all balances across different wallet types.
   * Uses a hydration system to deliver cached data instantly while fetching latest balances.
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
  public async getBalances(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetBalancesResponseV2> {
    return await this.sdk.api.getBalancesV2({
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
   * Get all balances with token metadata for an exchange.
   * Retrieves all balances across different wallet types and provides token metadata (e.g. token icon, contract address if available, etc.).
   */
  @Get('balances-with-tokens')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getBalancesWithTokens(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetBalancesWithTokensResponseV2> {
    return await this.sdk.api.getBalancesWithTokensV2({
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
   * Get all main and sub accounts balances with token metadata for an exchange.
   * Retrieves all balances across different wallet types and provides token metadata (e.g. token icon, contract address if available, etc.).
   */
   @Get('main-sub-accounts-balances-with-tokens')
   @Response<ErrorResponse>(401, 'Unauthorized')
   @Response<ErrorResponse>(403, 'Forbidden')
   @Response<ErrorResponse>(400, 'Bad Request')
   @Response<ErrorResponse>(404, 'Not Found')
   @Response<ErrorResponse>(408, 'Request Timeout')
   @Response<ErrorResponse>(429, 'Too Many Requests')
   @Response<ErrorResponse>(500, 'Internal Server Error')
   @Response<ErrorResponse>(503, 'Service Unavailable')
   public async getMainSubAccountsBalancesWithTokens(
     @Header('x-exchange-instance-id') exchangeInstanceId: string,
     @Header('x-exchange-id') exchangeId: string,
     @Header('x-exchange-api-key') apiKey: string,
     @Header('x-exchange-api-secret') secretKey: string,
     @Header('x-exchange-api-password') password?: string,
     @Header('x-exchange-api-uid') uid?: string
   ): Promise<GetMainSubAccountsBalancesWithTokensResponseV2> {
     return await this.sdk.api.getMainSubAccountsBalancesWithTokensV2({
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
}

export function portfolioRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new PortfolioController(sdk);

  router.get('/withdrawable-balances', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getWithdrawableBalances(
        auth.exchangeInstanceId,
        auth.exchangeId,
        auth.apiKey,
        auth.secretKey,
        auth.password as string | undefined,
        auth.uid as string | undefined
    );
    res.json(result);
  }));

  router.get('/balances', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getBalances(
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
        auth.password,
      auth.uid
    );
    res.json(result);
  }));

  router.get('/balances-with-tokens', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getBalancesWithTokens(
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
    );
    res.json(result);
  }));

  router.get('/main-sub-accounts-balances-with-tokens', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getMainSubAccountsBalancesWithTokens(
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