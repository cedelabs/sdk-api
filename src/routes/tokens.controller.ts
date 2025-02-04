// sdk-api/src/routes/tokens.ts
import { Router } from 'express';
import { Controller, Get, Route, Tags, Query, Header, Response } from 'tsoa';
import {  processError } from '../utils/error';
import CedeSDK, { CedeSDKError } from '@cedelabs-private/sdk';
import { ErrorResponse } from '../types';

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
    @Query('exchangeInstanceId') exchangeInstanceId: string,
    @Query('exchangeId') exchangeId: string,
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

// Express router wrapper
export function tokensRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new TokensController(sdk);

  router.get('/supported', async (req, res) => {
    try {
      const result = await controller.getSupportedTokens(
        req.query.exchangeInstanceId as string,
        req.query.exchangeId as string,
        req.headers['x-exchange-api-key'] as string,
        req.headers['x-exchange-api-secret'] as string,
        req.headers['x-exchange-api-password'] as string,
        req.headers['x-exchange-api-uid'] as string
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  return router;
}