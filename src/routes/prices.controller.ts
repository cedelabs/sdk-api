import { Router } from 'express';
import { Controller, Get, Query, Route, Tags } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError } from '@cedelabs-private/sdk';

type GetPricesResponse = ReturnType<CedeSDK['api']['getPrices']>;
type GetFiatCurrenciesResponse = ReturnType<CedeSDK['api']['getFiatCurrencies']>;

@Route('prices')
@Tags('Prices')
export class PricesController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get current prices for tokens.
   * Retrieves real-time pricing data for cryptocurrencies.
   * Prices are sourced from the specified exchange or a default source.
   */
  @Get()
  public async getPrices(
    @Query() exchangeId?: string,
  ): Promise<GetPricesResponse> {
    return await this.sdk.api.getPrices({
      exchangeId,
    });
  }

  /**
   * Get available fiat currencies.
   * Retrieves list of supported fiat currencies for price conversion.
   * Includes currency codes and display information.
   */
  @Get('fiat-currencies')
  public async getFiatCurrencies(): Promise<GetFiatCurrenciesResponse> {
    return await this.sdk.api.getFiatCurrencies();
  }
}

export function pricesRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new PricesController(sdk);

  router.get('/', async (req, res) => {
    try {
      const result = await controller.getPrices(
        req.query.exchangeId as string || undefined
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/fiat-currencies', async (req, res) => {
    try {
      const result = await controller.getFiatCurrencies();
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  return router;
} 