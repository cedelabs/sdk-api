import { Router } from 'express';
import { Body, Controller, Get, Post, Route, Tags, Response, Queries, Header } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError, GetOAuthTokensParams, OAuthClientCredentialsParams, ApiPermissions, ApiKey } from '@cedelabs-private/sdk';
import { ErrorResponse } from '../types';
import { errorHandler } from '../middleware/errorHandler';

type GetOAuthUrlParams = {
  redirectUri: string;
  permissions: ApiPermissions[];
  deviceId?: string;
}

type GetFastApiKeysParams = {
  accessToken: string;
  permissions?: ApiPermissions[];
}

@Route('auth')
@Tags('Authentication')
export class AuthenticationController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
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
    return await this.sdk.api.getOAuthUrl({ 
      exchangeId, 
      ...params 
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

  /**
   * Check and refresh OAuth tokens if needed.
   * Automatically refreshes expired OAuth tokens and returns the updated tokens.
   */
  @Post('oauth/check-and-refresh')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async checkOAuthAndRefresh(@Body() params: { exchangeInstanceId: string; exchangeId: string }): Promise<{
    message: string;
  }> {
    await this.sdk.api.checkOAuthAndRefresh(params);
    return { message: 'OAuth check and refresh completed successfully' };
  }

  /**
   * Revoke OAuth access
   */
  @Post('oauth/revoke')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async revokeOAuth(@Body() params: { exchangeInstanceId: string; exchangeId: string }): Promise<{
    message: string;
  }> {
    await this.sdk.api.revokeOAuth(params);
    return { message: 'OAuth access revoked successfully' };
  }

  /**
   * Refresh OAuth token
   */
  @Post('oauth/refresh')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async refreshToken(@Body() params: { exchangeInstanceId: string; exchangeId: string; refreshToken: string }): Promise<ReturnType<CedeSDK['api']['refreshToken']>> {
    return await this.sdk.api.refreshToken(params);
  }

  /**
   * Get fast API keys for an exchange.
   * Retrieves API keys with specified permissions for rapid access.
   */
  @Get('fast-api-keys')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async getFastApiKeys(
    @Queries() params: GetFastApiKeysParams,
    @Header('x-exchange-id') exchangeId: string,
  ): Promise<ApiKey> {
    return await this.sdk.api.getFastApiKeys({ 
      exchangeId, 
      ...params 
    });
  }

  /**
   * Setup OAuth client credentials
   */
  @Post('oauth/client-credentials')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async setupOAuthClientCredentials(@Body() params: OAuthClientCredentialsParams): Promise<{
    message: string;
  }> {
    await this.sdk.api.setupOAuthClientCredentials(params);
    return { message: 'OAuth client credentials set up successfully' };
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

  router.post('/oauth/check-and-refresh', errorHandler(async (req, res) => {
    const result = await controller.checkOAuthAndRefresh(req.body);
    res.json(result);
  }));


  router.post('/oauth/revoke', errorHandler(async (req, res) => {
    const result = await controller.revokeOAuth(req.body);
    res.json(result);
  }));

  router.post('/oauth/refresh', errorHandler(async (req, res) => {
    const result = await controller.refreshToken(req.body);
    res.json(result);
  }));

  router.get('/fast-api-keys', errorHandler(async (req, res) => {
    const params: GetFastApiKeysParams = {
      accessToken: req.query.accessToken as string,
      permissions: req.query.permissions as ApiPermissions[]
    };
    const result = await controller.getFastApiKeys(
      params,
      req.headers['x-exchange-id'] as string
    );
    res.json(result);
  }));

  router.post('/oauth/client-credentials', errorHandler(async (req, res) => {
    const result = await controller.setupOAuthClientCredentials(req.body);
    res.json(result);
  }));

  router.post('/check-credentials', errorHandler(async (req, res) => {
    const result = await controller.checkCredentials(req.body);
    res.json(result);
  }));

  return router;
} 