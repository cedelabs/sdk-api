import CedeSDK from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Controller, Get, Header, Queries, Query, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';


type GetNetworksResponse = ReturnType<CedeSDK['api']['getNetworks']>;
type GetAvailableNetworksResponse = ReturnType<CedeSDK['api']['getAvailableNetworks']>;
interface GetNetworksParams {
  tokenSymbol?: string;
  toDeposit?: boolean;
  toWithdraw?: boolean;
}
@Route('networks')
@Tags('Networks')
export class NetworksController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get all available networks for a specific exchange.
   * Use this endpoint to retrieve networks to deposit or withdraw from.
   * This endpoint requires an authentication.
   * 
   * If you need to display all networks without authentication, use the `/networks/available` endpoint.
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
  public async getNetworks(
    @Queries() params: GetNetworksParams,
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<GetNetworksResponse> {
    return await this.sdk.api.getNetworks({
      exchangeInstanceId,
      auth: {
        exchangeId,
        apiKey,
        secretKey,
        password,
        uid,
      },
      tokenSymbol: params.tokenSymbol,
      opts: { toDeposit: params.toDeposit, toWithdraw: params.toWithdraw, isInternalTransfer: false },
    });
  }

  /**
   * Retrieves all networks available for a specific exchange.
   * This endpoint does not require authentication, it's useful to display all networks to the user before he adds an account.
   * 
   * However, we recommend using the `/networks` endpoint to get the most relevant networks based on the user's country (exchanges might not allow using specific networks/tokens from certain countries).
   */
  @Get('available')
  public async getAvailableNetworks(@Query() exchangeId: string, @Query() toDeposit?: boolean, @Query() toWithdraw?: boolean): Promise<GetAvailableNetworksResponse> {
    return await this.sdk.api.getAvailableNetworks({ exchangeId, opts: { toDeposit, toWithdraw } });
  }
}

export function networksRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new NetworksController(sdk);

  router.get('/', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const params: GetNetworksParams = {
      tokenSymbol: req.query.tokenSymbol as string,
      toDeposit: Boolean(req.query.toDeposit),
      toWithdraw: Boolean(req.query.toWithdraw),
    }
    const result = await controller.getNetworks(
      params,
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid,
    );
    res.json(result);
  }));

  router.get('/available', errorHandler(async (req, res) => {
    const result = await controller.getAvailableNetworks(
      req.query.exchangeId as string,
        Boolean(req.query.toDeposit),
        Boolean(req.query.toWithdraw),
      );
      res.json(result);
  }));

  return router;
} 