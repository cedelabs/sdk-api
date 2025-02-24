import CedeSDK from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Controller, Get, Header, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';

type GetSupportedExchangesResponse = ReturnType<CedeSDK['api']['getSupportedExchanges']>;
type FetchExchangeStatusResponse = ReturnType<CedeSDK['api']['fetchExchangeStatus']>;

@Route('exchange')
@Tags('Exchange')
export class ExchangeController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get supported exchanges and their specific features. For example, 
   * which exchanges support deposits/withdrawals, which unified wallets are supported,
   * which exchanges require a password in addition to the public/secret api keys, etc.
   */
  @Get('supported')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getSupportedExchanges(): Promise<GetSupportedExchangesResponse> {
    return await this.sdk.api.getSupportedExchanges();
  }

  /** 
   * Get current operational status of the exchange by querying the exchange directly.
   * Includes information about trading, deposits, and withdrawals availability.
   * 
   * Note: Cede public data API polls exchanges periodically to get the latest status. You can either 
   * use the status data provided by the public API in `/supported` endpoint or use this endpoint to get the latest status.
   */
  @Get('status')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async fetchExchangeStatus(
    @Header('x-exchange-id') exchangeId: string 
  ): Promise<FetchExchangeStatusResponse> {
    return await this.sdk.api.fetchExchangeStatus({ 
      exchangeId    
    });
  }
}

export function exchangeRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new ExchangeController(sdk);

  router.get('/supported', errorHandler(async (req, res) => {
    const result = await controller.getSupportedExchanges();
    res.json(result);
  }));

  router.get('/status', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.fetchExchangeStatus(
      auth.exchangeId,
    );
    res.json(result);
  }));

  return router;
} 