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
   * Get supported exchanges.
   * Retrieves a list of all supported cryptocurrency exchanges.
   * Includes information about exchange features and capabilities.
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
   * Get exchange status.
   * Retrieves current operational status of the exchange.
   * Includes information about trading, deposits, and withdrawals availability.
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