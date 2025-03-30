import CedeSDK, { ApiPermissions, CedeSDKError, GetOAuthTokensParams } from '@cedelabs-private/sdk';
import { Router } from 'express';
import { Body, Controller, Get, Header, Post, Queries, Response, Route, Tags } from 'tsoa';
import { errorHandler } from '../middleware/errorHandler';
import { ErrorResponse } from '../types';
import { processError } from '../utils/error';

interface GetOAuthUrlParams {
  redirectUri: string;
  permissions: string;
  deviceId?: string;
}

@Route('auth')
@Tags('Authentication')
export class AuthenticationController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Check credentials validity
   */
  @Post('check-credentials')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async checkCredentials(@Body() params: { exchangeInstanceId: string; exchangeId: string; apiKey: string; secretKey: string; password?: string; uid?: string }): Promise<ReturnType<CedeSDK['api']['checkCredentials']>> {
    return await this.sdk.api.checkCredentials({
      exchangeInstanceId: params.exchangeInstanceId,
      auth: {
        exchangeId: params.exchangeId,
        apiKey: params.apiKey,
        secretKey: params.secretKey,
        password: params.password,
        uid: params.uid,
      },
    });
  }

  /**
   * Get OAuth URL for authorization
   */
  @Get('oauth/url')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getOAuthUrl(
    @Queries() params: GetOAuthUrlParams,
    @Header('x-exchange-id') exchangeId: string,
  ): Promise<ReturnType<CedeSDK['api']['getOAuthUrl']>> {
    const permissions = params.permissions.split(',') as ApiPermissions[];    
    return await this.sdk.api.getOAuthUrl({ 
      exchangeId, 
      ...params,
      permissions,
    });
  }

  /**
   * Get OAuth tokens using authorization code
   */
  @Post('oauth/tokens')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getOAuthTokens(@Body() params: GetOAuthTokensParams): Promise<ReturnType<CedeSDK['api']['getOAuthTokens']>> {
    return await this.sdk.api.getOAuthTokens(params);
  }
}

export function authenticationRoutes(sdk: CedeSDK) {
  const router = Router();
  const controller = new AuthenticationController(sdk);

  router.get('/oauth/url', errorHandler(async (req, res) => {
    const params: GetOAuthUrlParams = {
      redirectUri: req.query.redirectUri as string,
      permissions: req.query.permissions as ApiPermissions[],
      deviceId: req.query.deviceId as string
    };
    const result = await controller.getOAuthUrl(
      params,
      req.headers['x-exchange-id'] as string
    );
    res.json(result);
  }));

  router.post('/oauth/tokens', async (req, res) => {
    try {
      const result = await controller.getOAuthTokens({
        exchangeId: req.body.exchangeId,
        redirectUriWithCode: req.body.redirectUriWithCode,
        codeVerifier: req.body.codeVerifier,
        deviceId: req.body.deviceId,
      });
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError );
      res.status(status).json(errorResponse);
    }
  });

  router.post('/check-credentials', errorHandler(async (req, res) => {
    const result = await controller.checkCredentials(req.body);
    res.json(result);
  }));

  return router;
} 