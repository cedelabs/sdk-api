import CedeSDK, { WalletType } from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { extractAuthFromHeaders } from '../utils/auth';
import { AuthParams } from '../utils/typeUtils';

type InternalTransferRoutesResponse = ReturnType<CedeSDK['api']['internalTransferRoutes']>;
type WalletTypeMappingResponse = ReturnType<CedeSDK['api']['getWalletTypeMapping']>;
type InternalTransferResponse = ReturnType<CedeSDK['api']['internalTransfer']>;

interface InternalTransferParams {
  amount: string;
  tokenSymbol: string;
  fromWalletType: string;
  toWalletType: string;
  pairSymbolFrom?: string;
  pairSymbolTo?: string;
  auth: AuthParams;
}

@Route('transfer')
@Tags('Transfer')
export class TransferController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get internal transfer routes.
   * Retrieves all possible transfer routes between different wallet types.
   * Returns a mapping of source wallet types to allowed destination wallet types.
   */
  @Get('routes')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getInternalTransferRoutes(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<InternalTransferRoutesResponse> {
    return await this.sdk.api.internalTransferRoutes({
      exchangeInstanceId,
      auth: { exchangeId, apiKey, secretKey, password, uid }
    });
  }

  /**
   * Execute internal transfer.
   * Transfers assets between different wallet types within the same exchange.
   * Supports optional pair symbols for isolated margin transfers.
   */
  @Post()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async internalTransfer(@Body() params: InternalTransferParams): Promise<InternalTransferResponse> {
    return await this.sdk.api.internalTransfer({
      exchangeInstanceId: params.auth.exchangeInstanceId,
      auth: {
        exchangeId: params.auth.exchangeId,
        apiKey: params.auth.apiKey,
        secretKey: params.auth.secretKey,
        password: params.auth.password,
        uid: params.auth.uid
      },
      amount: Number(params.amount),
      tokenSymbol: params.tokenSymbol,
      fromWalletType: params.fromWalletType as WalletType,
      toWalletType: params.toWalletType as WalletType,
      pairSymbolFrom: params.pairSymbolFrom,
      pairSymbolTo: params.pairSymbolTo
    });
  }

  /**
   * Get wallet type mapping.
   * Retrieves the mapping between Cede unified wallet types and exchange-specific wallet types.
   * Helps understand the correspondence between different naming conventions.
   */
  @Get('wallet-type-mapping')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getWalletTypeMapping(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string,
  ): Promise<WalletTypeMappingResponse> {
    return await this.sdk.api.getWalletTypeMapping({
      exchangeInstanceId,
      auth: { exchangeId, apiKey, secretKey, password, uid }
    });
  }
}

export function transferRoutes(sdk: any) {
  const router = Router();
  const controller = new TransferController(sdk);

  router.get('/routes', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getInternalTransferRoutes(
      auth.exchangeInstanceId,
      auth.exchangeId,
      auth.apiKey,
      auth.secretKey,
      auth.password,
      auth.uid
    );
    res.json(result);
  }));

  router.post('/', errorHandler(async (req, res) => {
    const result = await controller.internalTransfer(req.body);
    res.json(result);
  }));

  router.get('/wallet-type-mapping', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getWalletTypeMapping(
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
