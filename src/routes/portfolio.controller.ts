import CedeSDK from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Controller, Get, Header, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
type GetWithdrawableBalancesResponse = ReturnType<CedeSDK['api']['getWithdrawableBalances']>;
type GetBalancesResponse = ReturnType<CedeSDK['api']['getBalances']>;

@Route('portfolio')
@Tags('Portfolio')
export class PortfolioController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get withdrawable balances for an exchange.
   * Retrieves balances that can be withdrawn from the exchange.
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
  ): Promise<GetWithdrawableBalancesResponse> {
    return await this.sdk.api.getWithdrawableBalances({
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
  ): Promise<GetBalancesResponse> {
    return await this.sdk.api.getBalances({
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

  return router;
} 