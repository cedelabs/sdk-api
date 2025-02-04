import { Router } from 'express';
import { Controller, Get, Header, Path, Query, Route, Tags, Response } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError } from '@cedelabs-private/sdk';
import { extractAuthFromHeaders } from '../utils/auth';
import { ErrorResponse } from '../types';


type GetNetworksResponse = ReturnType<CedeSDK['api']['getNetworks']>;
type GetAvailableNetworksResponse = ReturnType<CedeSDK['api']['getAvailableNetworks']>;

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
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Query('exchangeId') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
    @Query() tokenSymbol?: string,
    @Query() toDeposit?: boolean,
    @Query() toWithdraw?: boolean,
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
      tokenSymbol,
      opts: { toDeposit, toWithdraw, isInternalTransfer: false },
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

  router.get('/', async (req, res) => {
    try {
      const auth = extractAuthFromHeaders(req);
      const result = await controller.getNetworks(
        req.query.exchangeInstanceId as string,
        req.query.exchangeId as string,
        auth.apiKey,
        auth.secretKey,
        auth.password,
        auth.uid,
        req.query.tokenSymbol as string,
        Boolean(req.query.toDeposit),
        Boolean(req.query.toWithdraw),
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/available', async (req, res) => {
    try {
      const result = await controller.getAvailableNetworks(
        req.query.exchangeId as string,
        Boolean(req.query.toDeposit),
        Boolean(req.query.toWithdraw),
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError );
      res.status(status).json(errorResponse);
    }
  });

  return router;
} 