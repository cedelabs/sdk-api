import { CedeSDKError, SdkErrorCodes } from "@cedelabs-private/sdk";
export const sdkErrorToHttpStatus = new Map<string, number>([
  // 10xxx: Base / Validation errors
  [SdkErrorCodes.DEFAULT_ERROR.toString(), 500],
  [SdkErrorCodes.INVALID_PARAMS.toString(), 400],
  [SdkErrorCodes.INVALID_CACHE.toString(), 400],
  [SdkErrorCodes.INVALID_ADDRESS.toString(), 400],
  [SdkErrorCodes.FETCH_FROM_CACHE_ERROR.toString(), 500],

  // 11xxx: Internal and exchange ID errors
  [SdkErrorCodes.INTERNAL_ERROR.toString(), 500],
  [SdkErrorCodes.INVALID_EXCHANGE_ID.toString(), 400],
  [SdkErrorCodes.INVALID_EXCHANGE_INSTANCE_ID.toString(), 400],

  // 12xxx: Authentication errors
  [SdkErrorCodes.AUTHENTICATION_ERROR.toString(), 401],
  [SdkErrorCodes.INVALID_CREDENTIALS.toString(), 401],
  [SdkErrorCodes.AUTHENTICATION_FLOW_NOT_SUPPORTED.toString(), 400],
  [SdkErrorCodes.OAUTH_ACCESS_REVOKED.toString(), 401],

  // 13xxx: Withdrawal errors
  [SdkErrorCodes.WITHDRAWAL_ERROR.toString(), 500],
  [SdkErrorCodes.READONLY_EXCHANGE_NOT_PROVIDED_ERROR.toString(), 400],
  [SdkErrorCodes.TOKEN_SYMBOL_NOT_FOUND.toString(), 404],
  [SdkErrorCodes.WITHDRAWAL_NOT_FOUND.toString(), 404],
  [SdkErrorCodes.UNDER_WITHDRAW_MINIMUM.toString(), 400],
  [SdkErrorCodes.OVER_WITHDRAW_MAXIMUM.toString(), 400],
  [SdkErrorCodes.WHITELIST_CHECK_FAILED.toString(), 403],
  [SdkErrorCodes.WITHDRAWAL_FORBIDDEN.toString(), 403],

  // 14xxx: Trade errors
  [SdkErrorCodes.TRADE_ERROR.toString(), 400],
  [SdkErrorCodes.MARKET_ERROR.toString(), 400],
  [SdkErrorCodes.MARKET_NOT_FOUND.toString(), 404],
  [SdkErrorCodes.ORDER_NOT_FOUND.toString(), 404],
  [SdkErrorCodes.MARKET_NOT_LOADED.toString(), 503],
  [SdkErrorCodes.MARKET_TYPE_NOT_SUPPORTED.toString(), 400],
  [SdkErrorCodes.INVALID_OHLCV_FORMAT.toString(), 400],
  [SdkErrorCodes.CANNOT_PROVIDE_OHLCV.toString(), 400],

  // 15xxx: Portfolio errors
  [SdkErrorCodes.PORTFOLIO_ERROR.toString(), 500],
  [SdkErrorCodes.NOT_ENOUGH_BALANCE.toString(), 402],

  // 16xxx: Deposit errors
  [SdkErrorCodes.DEPOSIT_ERROR.toString(), 500],
  [SdkErrorCodes.GET_DEPOSIT_ADDRESS.toString(), 404],
  [SdkErrorCodes.CREATE_DEPOSIT_ADDRESS.toString(), 500],
  [SdkErrorCodes.DEPOSIT_NOT_FOUND.toString(), 404],

  // 17xxx: Network errors
  [SdkErrorCodes.NETWORK_ERROR.toString(), 500],
  [SdkErrorCodes.NETWORK_NOT_FOUND.toString(), 404],
  [SdkErrorCodes.NETWORK_NOT_FOUND_FOR_TOKEN_SYMBOL.toString(), 404],

  // 18xxx: API errors
  [SdkErrorCodes.API_ERROR.toString(), 500],
  [SdkErrorCodes.INVALID_API_REQUEST.toString(), 400],
  [SdkErrorCodes.INTERNAL_API_EXCEPTION.toString(), 500],

  // 19xxx: Exchange errors
  [SdkErrorCodes.EXCHANGE_ERROR.toString(), 500],
  [SdkErrorCodes.EXCHANGE_SERVER_DOWN.toString(), 503],
  [SdkErrorCodes.EXCHANGE_UNDER_MAINTENANCE.toString(), 503],
  [SdkErrorCodes.EXCHANGE_REQUEST_EXPIRED.toString(), 408],
  [SdkErrorCodes.EXCHANGE_INVALID_PERMISSION.toString(), 403],
  [SdkErrorCodes.EXCHANGE_TRANSFER_NOT_ALLOWED.toString(), 403],
  [SdkErrorCodes.EXCHANGE_TRANSFER_ERROR.toString(), 500],
  [SdkErrorCodes.EXCHANGE_DDOS_PROTECTION.toString(), 503],
  [SdkErrorCodes.EXCHANGE_RATE_LIMIT_EXCEEDED.toString(), 429],
  [SdkErrorCodes.EXCHANGE_INTERNAL_ERROR.toString(), 500],
  [SdkErrorCodes.EXCHANGE_UNKNOWN_ASSET.toString(), 400],
  [SdkErrorCodes.EXCHANGE_OPERATION_FAILED.toString(), 500],
  [SdkErrorCodes.EXCHANGE_ACCOUNT_SUSPENDED.toString(), 403],
  [SdkErrorCodes.EXCHANGE_NOT_ALLOWED_METHOD.toString(), 405],
  [SdkErrorCodes.EXCHANGE_NOT_AVAILABLE.toString(), 503],
  [SdkErrorCodes.EXCHANGE_INVALID_NONCE.toString(), 400],
  [SdkErrorCodes.EXCHANGE_UNAVAILABLE_IN_COUNTRY.toString(), 403],
  [SdkErrorCodes.EXCHANGE_WALLET_TYPE_NOT_SUPPORTED.toString(), 400],

  // 20xxx: Sub account errors
  [SdkErrorCodes.SUB_ACCOUNT_ERROR.toString(), 500],
  [SdkErrorCodes.SUB_ACCOUNT_NOT_FOUND_ERROR.toString(), 404],
]);

export function getHttpStatusFromError(errorCode: string): number {
  return sdkErrorToHttpStatus.get(errorCode) || 500;
}

export function processError(error: CedeSDKError) {
  const errorCode = error?.code?.toString();
  const status = getHttpStatusFromError(errorCode);
  return {
    status,
    error: {
      name: error.name,
      code: error.code,
      message: error.message,
      originalErrorMessage: error.originalErrorMessage,
    },
  };
}