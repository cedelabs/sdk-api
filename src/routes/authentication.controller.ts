import { Router } from 'express';
import { Body, Controller, Get, Post, Query, Route, Tags, Response } from 'tsoa';
import { processError } from '../utils/error';
import CedeSDK, { CedeSDKError, GetOAuthTokensParams, OAuthClientCredentialsParams, ApiPermissions, ApiKey } from '@cedelabs-private/sdk';
import { ErrorResponse } from '../types';

@Route('auth')
@Tags('Authentication')
export class AuthenticationController extends Controller {
  constructor(private sdk: CedeSDK) {
    super();
  }

  /**
   * Check OAuth permissions for an exchange.
   * Verifies if the OAuth token has the required permissions.
   */
  @Get('oauth/permissions')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(403, 'Forbidden')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  @Response<ErrorResponse>(408, 'Request Timeout')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  @Response<ErrorResponse>(503, 'Service Unavailable')
  public async checkOAuthPermissions(@Query() exchangeInstanceId: string, @Query() permissions: ApiPermissions[]): Promise<ReturnType<CedeSDK['api']['checkOAuthPermissions']>> {
    return await this.sdk.api.checkOAuthPermissions({ exchangeInstanceId, permissions });
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
    @Query() exchangeId: string,
    @Query() redirectUri: string,
    @Query() permissions: ApiPermissions[],
    @Query() deviceId?: string,
  ): Promise<ReturnType<CedeSDK['api']['getOAuthUrl']>> {
    return await this.sdk.api.getOAuthUrl({ exchangeId, redirectUri, permissions, deviceId });
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
  public async checkOAuthAndRefresh(@Body() params: { exchangeInstanceId: string; exchangeId: string }): Promise<void> {
    return await this.sdk.api.checkOAuthAndRefresh(params);
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
  public async revokeOAuth(@Body() params: { exchangeInstanceId: string; exchangeId: string }): Promise<void> {
    return await this.sdk.api.revokeOAuth(params);
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
    @Query() exchangeId: string,
    @Query() accessToken: string,
    @Query() permissions?: ApiPermissions[]
  ): Promise<ApiKey> {
    return await this.sdk.api.getFastApiKeys({ exchangeId, accessToken, permissions });
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
  public async setupOAuthClientCredentials(@Body() params: OAuthClientCredentialsParams): Promise<void> {
    return await this.sdk.api.setupOAuthClientCredentials(params);
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

// Express router wrapper
export function authenticationRoutes(sdk: any) {
  const router = Router();
  const controller = new AuthenticationController(sdk);

  router.get('/oauth/permissions', async (req, res) => {
    try {
      const result = await controller.checkOAuthPermissions(
        req.query.exchangeId as string,
        req.query.permissions as ApiPermissions[]
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/oauth/url', async (req, res) => {
    try {
      const result = await controller.getOAuthUrl(
        req.query.exchangeId as string,
        req.query.redirectUri as string,
        req.query.permissions as ApiPermissions[],
        req.query.deviceId as string
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

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

  router.post('/oauth/check-and-refresh', async (req, res) => {
    try {
      await controller.checkOAuthAndRefresh(req.body);
      res.json({ message: 'OAuth check and refresh completed successfully' });
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/oauth/revoke', async (req, res) => {
    try {
      await controller.revokeOAuth(req.body);
      res.json({ message: 'OAuth access revoked successfully' });
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/oauth/refresh', async (req, res) => {
    try {
      const result = await controller.refreshToken(req.body);
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.get('/fast-api-keys', async (req, res) => {
    try {
      const result = await controller.getFastApiKeys(
        req.query.exchangeId as string,
        req.query.accessToken as string,
        req.query.permissions as ApiPermissions[]
      );
      res.json(result);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/oauth/client-credentials', async (req, res) => {
    try {
      await controller.setupOAuthClientCredentials(req.body);
      res.json({ message: 'OAuth client credentials set up successfully' });
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  router.post('/check-credentials', async (req, res) => {
    try {
      console.log("REQ", req.body);
      const result = await controller.checkCredentials(req.body);
      console.log("RESULT", result);
      res.json(result);
    } catch (error) {
      console.log("ERROR", error);
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  });

  return router;
} 