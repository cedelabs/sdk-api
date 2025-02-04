import { Router } from 'express';
import { Controller, Get, Header, Path, Query, Route, Tags, Response, Queries } from 'tsoa';
import CedeSDK from '@cedelabs-private/sdk';
import { extractAuthFromHeaders } from '../utils/auth';
import { ErrorResponse } from '../types';
import { errorHandler } from '../middleware/errorHandler';


type GetNetworksResponse = ReturnType<CedeSDK['api']['getNetworks']>;
type GetAvailableNetworksResponse = ReturnType<CedeSDK['api']['getAvailableNetworks']>;
type GetNetworksParams = {
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
   * Get all available networks.
   * Retrieves supported blockchain networks for a specific exchange.
   * Includes network status and configuration details.
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
   * Get networks with active status.
   * Retrieves only currently operational blockchain networks.
   * Filters networks based on deposit and withdrawal availability.
   */
  @Get('available')
  public async getAvailableNetworks(@Query() exchangeId: string, @Query() toDeposit?: boolean, @Query() toWithdraw?: boolean): Promise<GetAvailableNetworksResponse> {
    return await this.sdk.api.getAvailableNetworks({ exchangeId, opts: { toDeposit, toWithdraw } });
  }
}

// Express router wrapper
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