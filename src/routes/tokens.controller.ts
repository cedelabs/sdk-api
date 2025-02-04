// sdk-api/src/routes/tokens.ts
import { Router } from 'express';
import { Controller, Get, Route, Tags, Query, Header, Response } from 'tsoa';
import CedeSDK from '@cedelabs-private/sdk';
import { ErrorResponse } from '../types';
import { errorHandler } from '../middleware/errorHandler';
import { extractAuthFromHeaders } from '../utils/auth';

type GetSupportedTokensResponse = ReturnType<CedeSDK['api']['getSupportedTokens']>;

@Route('tokens')
@Tags('Tokens')
export class TokensController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Get supported tokens with their networks
   */
  @Get('supported')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getSupportedTokens(
    @Header('x-exchange-instance-id') exchangeInstanceId: string,
    @Header('x-exchange-id') exchangeId: string,
    @Header('x-exchange-api-key') apiKey: string,
    @Header('x-exchange-api-secret') secretKey: string,
    @Header('x-exchange-api-password') password?: string,
    @Header('x-exchange-api-uid') uid?: string
  ): Promise<GetSupportedTokensResponse> {
    return await this.sdk.api.getSupportedTokens({
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

export function tokensRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new TokensController(sdk);

  router.get('/supported', errorHandler(async (req, res) => {
    const auth = extractAuthFromHeaders(req);
    const result = await controller.getSupportedTokens(
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