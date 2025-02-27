/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WithdrawalController } from './../src/routes/withdrawal.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TransferController } from './../src/routes/transfer.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TradeController } from './../src/routes/trade.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TokensController } from './../src/routes/tokens.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubAccountController } from './../src/routes/subAccount.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PricesController } from './../src/routes/prices.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PortfolioController } from './../src/routes/portfolio.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NetworksController } from './../src/routes/networks.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthenticationController } from './../src/routes/authentication.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DepositController } from './../src/routes/deposit.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ExchangeController } from './../src/routes/exchange.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../src/routes/health.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "WalletType": {
        "dataType": "refEnum",
        "enums": ["spot","funding","isolated_margin","cross_margin","usd_m_futures","usdt_m_futures","usdc_m_futures","coin_m_futures","coin_m_swap","options","earn","derivatives","futures","unified","unknown"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenSymbol": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Fee_2": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokenSymbol":{"ref":"TokenSymbol","required":true},"refAmount":{"dataType":"double"},"amount":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxStatus": {
        "dataType": "refEnum",
        "enums": ["pending","ok","cancelled","failed"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CefiTx": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"timestamp":{"dataType":"double","required":true},"status":{"ref":"TxStatus","required":true},"fee":{"ref":"Fee_2","required":true},"transactionId":{"dataType":"string","required":true},"tokenSymbol":{"ref":"TokenSymbol","required":true},"refAmount":{"dataType":"double"},"amount":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CefiInfoTx.Exclude_keyofCefiInfoTx.account__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"wallet":{"dataType":"nestedObjectLiteral","nestedProperties":{"walletType":{"ref":"WalletType","required":true},"depositAddress":{"dataType":"string","required":true}},"required":true},"transaction":{"ref":"CefiTx","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CefiInfoTx.account_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CefiInfoTx.Exclude_keyofCefiInfoTx.account__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExchangeAccount": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeInstanceId":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PureCefiInfoTx": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_CefiInfoTx.account_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeAccount":{"ref":"ExchangeAccount","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalChainId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefiInfoTx": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"transaction":{"dataType":"nestedObjectLiteral","nestedProperties":{"tokens":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true},"tokenSymbol":{"ref":"TokenSymbol","required":true},"refAmount":{"dataType":"double"},"amount":{"dataType":"double","required":true}}},"required":true},"timestamp":{"dataType":"double","required":true},"status":{"ref":"TxStatus","required":true},"fee":{"ref":"Fee_2","required":true},"transactionHash":{"dataType":"string","required":true}},"required":true},"account":{"dataType":"nestedObjectLiteral","nestedProperties":{"network":{"ref":"InternalChainId","required":true},"address":{"dataType":"string","required":true}},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["transfer"]},{"dataType":"enum","enums":["swap"]},{"dataType":"enum","enums":["deposit"]},{"dataType":"enum","enums":["withdrawal"]},{"dataType":"enum","enums":["order"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PureTransaction_PureCefiInfoTx.PureCefiInfoTx-or-DefiInfoTx_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"ref":"TxType","required":true},"to":{"dataType":"union","subSchemas":[{"ref":"PureCefiInfoTx"},{"ref":"DefiInfoTx"}],"required":true},"from":{"ref":"PureCefiInfoTx","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getWithdrawalById_93__": {
        "dataType": "refAlias",
        "type": {"ref":"PureTransaction_PureCefiInfoTx.PureCefiInfoTx-or-DefiInfoTx_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWithdrawalByIdResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getWithdrawalById_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "code": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
            "originalErrorMessage": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_createWithdrawal_93__": {
        "dataType": "refAlias",
        "type": {"ref":"PureTransaction_PureCefiInfoTx.PureCefiInfoTx-or-DefiInfoTx_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateWithdrawalResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_createWithdrawal_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_OriginalCreateWithdrawalParams.Exclude_keyofOriginalCreateWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokenSymbol":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"address":{"dataType":"string"},"network":{"dataType":"string","required":true},"totpCode":{"dataType":"string"},"withdrawalTag":{"dataType":"string"},"clientTxId":{"dataType":"string"},"isInternalTransfer":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_OriginalCreateWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_OriginalCreateWithdrawalParams.Exclude_keyofOriginalCreateWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthParams": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"uid":{"dataType":"string"},"password":{"dataType":"string"},"secretKey":{"dataType":"string","required":true},"apiKey":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true},"exchangeInstanceId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateWithdrawalParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_OriginalCreateWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"auth":{"ref":"AuthParams","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_prepareWithdrawal_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"void","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrepareWithdrawalResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_prepareWithdrawal_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_OriginalPrepareWithdrawalParams.Exclude_keyofOriginalPrepareWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokenSymbol":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"address":{"dataType":"string"},"network":{"dataType":"string"},"isInternalTransfer":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_OriginalPrepareWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_OriginalPrepareWithdrawalParams.Exclude_keyofOriginalPrepareWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrepareWithdrawalParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_OriginalPrepareWithdrawalParams.fromExchange-or-toExchange-or-readonlyExchange_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"auth":{"ref":"AuthParams","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Partial_Fee_2_.Exclude_keyofPartial_Fee_2_.refAmount__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokenSymbol":{"dataType":"string"},"amount":{"dataType":"double"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Partial_Fee_2_.refAmount_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Partial_Fee_2_.Exclude_keyofPartial_Fee_2_.refAmount__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWithdrawalFeeReturn": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Partial_Fee_2_.refAmount_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getWithdrawalFee_93__": {
        "dataType": "refAlias",
        "type": {"ref":"GetWithdrawalFeeReturn","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWithdrawalFeeResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getWithdrawalFee_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWithdrawalFeeParams": {
        "dataType": "refObject",
        "properties": {
            "tokenSymbol": {"dataType":"string","required":true},
            "network": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_checkAddressIsWhitelisted_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"boolean","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CheckAddressIsWhitelistedResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_checkAddressIsWhitelisted_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CheckAddressIsWhitelistedParams": {
        "dataType": "refObject",
        "properties": {
            "address": {"dataType":"string","required":true},
            "tokenSymbol": {"dataType":"string","required":true},
            "key": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WhitelistedAddresses": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"verified":{"dataType":"boolean","required":true},"tokenSymbol":{"ref":"TokenSymbol"},"network":{"ref":"InternalChainId","required":true},"key":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getWhitelistedAddresses_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"WhitelistedAddresses"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWhitelistedAddressesResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getWhitelistedAddresses_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWhitelistedAddressesParams": {
        "dataType": "refObject",
        "properties": {
            "tokenSymbol": {"dataType":"string"},
            "network": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_WalletType.WalletType-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_internalTransferRoutes_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Record_WalletType.WalletType-Array_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalTransferRoutesResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_internalTransferRoutes_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_internalTransfer_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalTransferResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_internalTransfer_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternalTransferParams": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"string","required":true},
            "tokenSymbol": {"dataType":"string","required":true},
            "fromWalletType": {"dataType":"string","required":true},
            "toWalletType": {"dataType":"string","required":true},
            "pairSymbolFrom": {"dataType":"string"},
            "pairSymbolTo": {"dataType":"string"},
            "auth": {"ref":"AuthParams","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_WalletType.string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getWalletTypeMapping_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Record_WalletType.string_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WalletTypeMappingResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getWalletTypeMapping_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PairSymbol": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MarketPair": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"precision":{"dataType":"nestedObjectLiteral","nestedProperties":{"quote":{"dataType":"double","required":true},"base":{"dataType":"double","required":true},"price":{"dataType":"double","required":true},"amount":{"dataType":"double","required":true}},"required":true},"active":{"dataType":"boolean","required":true},"maker":{"dataType":"double","required":true},"taker":{"dataType":"double","required":true},"type":{"ref":"WalletType","required":true},"quote":{"ref":"TokenSymbol","required":true},"base":{"ref":"TokenSymbol","required":true},"pairSymbol":{"ref":"PairSymbol","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getMarketPairs_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"MarketPair"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMarketPairsResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getMarketPairs_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MarketRate": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"ask":{"dataType":"string","required":true},"bid":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getMarketRate_93__": {
        "dataType": "refAlias",
        "type": {"ref":"MarketRate","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMarketRateResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getMarketRate_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MinAmounts": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"minPrice":{"dataType":"string","required":true},"minQuoteAmount":{"dataType":"string","required":true},"minBaseAmount":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getMinAmounts_93__": {
        "dataType": "refAlias",
        "type": {"ref":"MinAmounts","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMinAmountsResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getMinAmounts_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMinAmountsParams": {
        "dataType": "refObject",
        "properties": {
            "pairSymbol": {"dataType":"string","required":true},
            "orderSide": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["buy"]},{"dataType":"enum","enums":["sell"]}],"required":true},
            "price": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EstimatedFee": {
        "dataType": "refAlias",
        "type": {"ref":"Fee_2","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EstimatedFeeAndAmount": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"estimatedAmount":{"dataType":"string","required":true},"estimatedFee":{"ref":"EstimatedFee","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderSide": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["buy"]},{"dataType":"enum","enums":["sell"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderType": {
        "dataType": "refEnum",
        "enums": ["limit","market","unknown"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"metadata":{"dataType":"nestedObjectLiteral","nestedProperties":{"defiAddress":{"dataType":"string"},"tradeAndSend":{"dataType":"boolean"}}},"amount":{"dataType":"string","required":true},"price":{"dataType":"string","required":true},"orderType":{"ref":"OrderType","required":true},"orderSide":{"ref":"OrderSide","required":true},"pairSymbol":{"ref":"PairSymbol","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PreparedOrder": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"EstimatedFeeAndAmount"},{"dataType":"nestedObjectLiteral","nestedProperties":{"createOrderRequest":{"ref":"CreateOrderRequest","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_prepareOrder_93__": {
        "dataType": "refAlias",
        "type": {"ref":"PreparedOrder","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrepareOrderResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_prepareOrder_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_PrepareOrderParamsType.Exclude_keyofPrepareOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"string","required":true},"pairSymbol":{"dataType":"string","required":true},"orderSide":{"ref":"OrderSide","required":true},"price":{"dataType":"string","required":true},"orderType":{"ref":"OrderType","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_PrepareOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_PrepareOrderParamsType.Exclude_keyofPrepareOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrepareOrderParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_PrepareOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeInstanceId":{"dataType":"string","required":true},"auth":{"ref":"AuthParams","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderStatus": {
        "dataType": "refEnum",
        "enums": ["open","closed","canceled","unknown"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Order": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"clientOrderId":{"dataType":"string"},"fee":{"ref":"Fee_2","required":true},"filled":{"dataType":"double","required":true},"amount":{"dataType":"double","required":true},"price":{"dataType":"double","required":true},"side":{"ref":"OrderSide","required":true},"type":{"ref":"OrderType","required":true},"pairSymbol":{"ref":"PairSymbol","required":true},"status":{"ref":"OrderStatus","required":true},"timestamp":{"dataType":"double","required":true},"id":{"ref":"OrderId","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_createOrder_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Order","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_createOrder_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderStpTypes": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["cancel_maker"]},{"dataType":"enum","enums":["cancel_taker"]},{"dataType":"enum","enums":["cancel_both"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CreateOrderParamsType.Exclude_keyofCreateOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"string","required":true},"pairSymbol":{"dataType":"string","required":true},"orderSide":{"ref":"OrderSide","required":true},"price":{"dataType":"string","required":true},"orderType":{"ref":"OrderType","required":true},"metadata":{"dataType":"nestedObjectLiteral","nestedProperties":{"defiAddress":{"dataType":"string"},"tradeAndSend":{"dataType":"boolean"}}},"clientOrderId":{"dataType":"string"},"stp":{"ref":"OrderStpTypes"},"extraHeaders":{"ref":"Record_string.string_"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CreateOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CreateOrderParamsType.Exclude_keyofCreateOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_CreateOrderParamsType.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeInstanceId":{"dataType":"string","required":true},"auth":{"ref":"AuthParams","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getOrder_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Order","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOrderResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getOrder_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_UpdateOrderParamsType.Exclude_keyofUpdateOrderParamsType.exchange-or-orderId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"string"},"pairSymbol":{"dataType":"string","required":true},"orderSide":{"ref":"OrderSide"},"price":{"dataType":"string"},"orderType":{"ref":"OrderType"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_UpdateOrderParamsType.exchange-or-orderId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_UpdateOrderParamsType.Exclude_keyofUpdateOrderParamsType.exchange-or-orderId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateOrderParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_UpdateOrderParamsType.exchange-or-orderId_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeInstanceId":{"dataType":"string","required":true},"auth":{"ref":"AuthParams","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CancelOrderStatus": {
        "dataType": "refEnum",
        "enums": ["canceled","already_filled"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_cancelOrder_93__": {
        "dataType": "refAlias",
        "type": {"ref":"CancelOrderStatus","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CancelOrderResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_cancelOrder_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getOpenOrders_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"Order"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOpenOrdersResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getOpenOrders_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOpenOrdersParams": {
        "dataType": "refObject",
        "properties": {
            "pairSymbol": {"dataType":"string","required":true},
            "since": {"dataType":"double"},
            "limit": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MarketNetwork": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"iconUrl":{"dataType":"string","required":true},"chainId":{"dataType":"double"},"depositEnabled":{"dataType":"boolean","required":true},"withdrawalEnabled":{"dataType":"boolean","required":true},"withdrawMin":{"dataType":"string"},"withdrawMax":{"dataType":"string"},"withdrawFee":{"dataType":"string"},"network":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenWithMarketNetwork": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"contracts":{"ref":"Record_string.string_"},"precision":{"dataType":"double"},"networks":{"dataType":"array","array":{"dataType":"refAlias","ref":"MarketNetwork"},"required":true},"isWithdrawable":{"dataType":"boolean","required":true},"isDepositable":{"dataType":"boolean","required":true},"tokenIcon":{"dataType":"string"},"tokenSymbol":{"ref":"TokenSymbol","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getSupportedTokens_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"TokenWithMarketNetwork"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetSupportedTokensResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getSupportedTokens_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubAccount": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"uid":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getSubAccounts_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"SubAccount"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetSubAccountsResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getSubAccounts_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58_PortfolioBalanceEntry___": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getSubAccountBalancesV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58_PortfolioBalanceEntry___","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetSubAccountBalancesResponseV2": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getSubAccountBalancesV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubAccountTransferResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"transferId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CedeSDKSubAccountTransferParams.Exclude_keyofCedeSDKSubAccountTransferParams.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokenSymbol":{"dataType":"string","required":true},"amount":{"dataType":"string","required":true},"fromWalletType":{"ref":"WalletType"},"toWalletType":{"ref":"WalletType"},"fromUid":{"dataType":"string","required":true},"toUid":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CedeSDKSubAccountTransferParams.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CedeSDKSubAccountTransferParams.Exclude_keyofCedeSDKSubAccountTransferParams.fromExchange-or-toExchange-or-readonlyExchange-or-exchange__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubAccountTransferParams": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_CedeSDKSubAccountTransferParams.fromExchange-or-toExchange-or-readonlyExchange-or-exchange_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"auth":{"ref":"AuthParams","required":true},"exchangeInstanceId":{"dataType":"string","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PricesByTokenSymbol_string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getPricesV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"PricesByTokenSymbol_string_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetPricesResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getPricesV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FiatCurrencyMetadata": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"symbolNative":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"symbol":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getFiatCurrencies_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"FiatCurrencyMetadata"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetFiatCurrenciesResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getFiatCurrencies_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalanceV2": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"refFreeBalance":{"dataType":"string","required":true},"freeBalance":{"dataType":"string","required":true},"refTotalBalance":{"dataType":"string","required":true},"totalBalance":{"dataType":"string","required":true},"tokenName":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupedBalancesV2": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"ref":"TokenWithMarketNetwork","required":true},"balance":{"ref":"TokenBalanceV2","required":true}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getWithdrawableBalancesV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"GroupedBalancesV2","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetWithdrawableBalancesResponseV2": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getWithdrawableBalancesV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getBalancesV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58_PortfolioBalanceEntry___","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetBalancesResponseV2": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getBalancesV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58__balance-PortfolioBalanceEntry--token-TokenWithMarketNetwork____": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getBalancesWithTokensV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58__balance-PortfolioBalanceEntry--token-TokenWithMarketNetwork____","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetBalancesWithTokensResponseV2": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getBalancesWithTokensV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.SubAccountBalancesWithTokensV2_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58__balance-PortfolioBalanceEntry--token-TokenWithMarketNetwork____"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BalancesWithTokensV2": {
        "dataType": "refAlias",
        "type": {"ref":"Partial___91_walletType-string_93__58___91_tokenSymbol-string_93__58__balance-PortfolioBalanceEntry--token-TokenWithMarketNetwork____","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MainSubAccountsBalancesWithTokensResponseV2": {
        "dataType": "refObject",
        "properties": {
            "subAccounts": {"ref":"Record_string.SubAccountBalancesWithTokensV2_","required":true},
            "main": {"ref":"BalancesWithTokensV2","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getMainSubAccountsBalancesWithTokensV2_93__": {
        "dataType": "refAlias",
        "type": {"ref":"MainSubAccountsBalancesWithTokensResponseV2","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMainSubAccountsBalancesWithTokensResponseV2": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getMainSubAccountsBalancesWithTokensV2_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getNetworks_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"MarketNetwork"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetNetworksResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getNetworks_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetNetworksParams": {
        "dataType": "refObject",
        "properties": {
            "tokenSymbol": {"dataType":"string"},
            "toDeposit": {"dataType":"boolean"},
            "toWithdraw": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getAvailableNetworks_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"MarketNetwork"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAvailableNetworksResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getAvailableNetworks_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOAuthUrlResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"codeVerifier":{"dataType":"string"},"url":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getOAuthUrl_93__": {
        "dataType": "refAlias",
        "type": {"ref":"GetOAuthUrlResponse","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiPermissions": {
        "dataType": "refEnum",
        "enums": ["trade","read","withdraw"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOAuthUrlParams": {
        "dataType": "refObject",
        "properties": {
            "redirectUri": {"dataType":"string","required":true},
            "permissions": {"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"},"required":true},
            "deviceId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_OAuth2Tokens.Exclude_keyofOAuth2Tokens.refreshedAt-or-deviceId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true},"accessToken":{"dataType":"string","required":true},"expiresAt":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_OAuth2Tokens.refreshedAt-or-deviceId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_OAuth2Tokens.Exclude_keyofOAuth2Tokens.refreshedAt-or-deviceId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOAuthTokensResponse": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_OAuth2Tokens.refreshedAt-or-deviceId_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getOAuthTokens_93__": {
        "dataType": "refAlias",
        "type": {"ref":"GetOAuthTokensResponse","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOAuthTokensParams": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"deviceId":{"dataType":"string"},"codeVerifier":{"dataType":"string"},"redirectUriWithCode":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_refreshToken_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"void","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StorageType": {
        "dataType": "refEnum",
        "enums": ["browser","phone","ledger","server"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PublicApiKey": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"uid":{"dataType":"string"},"apiPublic":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiKey": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"storage":{"ref":"StorageType","required":true},"passphrase":{"dataType":"string"},"apiSecret":{"dataType":"string","required":true}}},{"ref":"PublicApiKey"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetFastApiKeysParams": {
        "dataType": "refObject",
        "properties": {
            "accessToken": {"dataType":"string","required":true},
            "permissions": {"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OAuthClientCredentialsParams": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"clientSecret":{"dataType":"string"},"clientId":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_checkCredentials_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"isValid":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepositAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"contract":{"dataType":"string"},"tag":{"dataType":"string"},"network":{"ref":"InternalChainId","required":true},"address":{"dataType":"string","required":true},"tokenSymbol":{"ref":"TokenSymbol","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getDepositAddress_93__": {
        "dataType": "refAlias",
        "type": {"ref":"DepositAddress","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetDepositAddressResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getDepositAddress_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetDepositAddressParams": {
        "dataType": "refObject",
        "properties": {
            "tokenSymbol": {"dataType":"string","required":true},
            "network": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PureTransaction_PureCefiInfoTx-or-DefiInfoTx.PureCefiInfoTx-or-DefiInfoTx_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"ref":"TxType","required":true},"to":{"dataType":"union","subSchemas":[{"ref":"PureCefiInfoTx"},{"ref":"DefiInfoTx"}],"required":true},"from":{"dataType":"union","subSchemas":[{"ref":"PureCefiInfoTx"},{"ref":"DefiInfoTx"}],"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_retrieveDeposit_93__": {
        "dataType": "refAlias",
        "type": {"ref":"PureTransaction_PureCefiInfoTx-or-DefiInfoTx.PureCefiInfoTx-or-DefiInfoTx_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RetrieveDepositResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_retrieveDeposit_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RetrieveDepositParams": {
        "dataType": "refObject",
        "properties": {
            "txHash": {"dataType":"string","required":true},
            "tokenSymbol": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OnDepositParams": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"callbackHeaders":{"ref":"Record_string.string_"},"callbackUrl":{"dataType":"string","required":true},"txStatus":{"ref":"TxStatus"},"intervalMs":{"dataType":"double"},"maxDuration":{"dataType":"double"},"tokenSymbol":{"dataType":"string","required":true},"txHash":{"dataType":"string","required":true},"auth":{"ref":"AuthParams","required":true},"exchangeInstanceId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepositableToken": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"networks":{"dataType":"array","array":{"dataType":"refAlias","ref":"MarketNetwork"}},"tokenSymbol":{"ref":"TokenSymbol","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getDepositableTokens_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"DepositableToken"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetDepositableTokensResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getDepositableTokens_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExchangeStatus": {
        "dataType": "refEnum",
        "enums": ["ok","shutdown","error","maintenance","unknown"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Record_ApiPermissions.ApiPermissions-Array__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"trade":{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"}},"read":{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"}},"withdraw":{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExchangeInfo": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"supportVerifyKYC":{"dataType":"boolean","required":true},"websiteHomelinkIdentifier":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"notConnectedIdentifier":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"transferWalletTypes":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refEnum","ref":"WalletType"}},{"dataType":"undefined"}],"required":true},"sendWalletType":{"dataType":"union","subSchemas":[{"ref":"WalletType"},{"dataType":"undefined"}],"required":true},"inducedPermissions":{"dataType":"union","subSchemas":[{"ref":"Partial_Record_ApiPermissions.ApiPermissions-Array__"},{"dataType":"undefined"}],"required":true},"requiresTwoKeys":{"dataType":"boolean","required":true},"requiresPassword":{"dataType":"boolean","required":true},"requiresUid":{"dataType":"boolean","required":true},"oauthAuthentication":{"dataType":"nestedObjectLiteral","nestedProperties":{"isUsingFastApi":{"dataType":"boolean","required":true},"hasPkceFlow":{"dataType":"boolean","required":true},"isOauthLoginSupported":{"dataType":"boolean","required":true}},"required":true},"hybridAuthentication":{"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"api_keys":{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"},"required":true},"oauth":{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"},"required":true}}},{"dataType":"undefined"}],"required":true},"affiliationLink":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"addressManagementUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"apiManagementLink":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"featuresUnderMaintenance":{"dataType":"nestedObjectLiteral","nestedProperties":{"limit_trade":{"dataType":"boolean","required":true},"trade_and_send":{"dataType":"boolean","required":true},"receive":{"dataType":"boolean","required":true},"trade":{"dataType":"boolean","required":true},"send":{"dataType":"boolean","required":true}},"required":true},"whitelistScopes":{"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refEnum","ref":"ApiPermissions"}},{"dataType":"undefined"}],"required":true},"ipWhitelistAddresses":{"dataType":"array","array":{"dataType":"string"},"required":true},"provideWhitelistedAddresses":{"dataType":"boolean","required":true},"shouldCheckWhitelist":{"dataType":"boolean","required":true},"isRequiringAddressWhitelisting":{"dataType":"boolean","required":true},"minimumDepositUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"minimumWithdrawalUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},"isRequiringEmailConfirmation":{"dataType":"boolean","required":true},"authenticationMethod":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["oauth"]},{"dataType":"enum","enums":["apiKeys"]}],"required":true},"supportedFeatures":{"dataType":"array","array":{"dataType":"string"},"required":true},"supportedWalletTypes":{"dataType":"array","array":{"dataType":"string"},"required":true},"status":{"ref":"ExchangeStatus","required":true},"logo":{"dataType":"string","required":true},"id":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_getSupportedExchanges_93__": {
        "dataType": "refAlias",
        "type": {"dataType":"array","array":{"dataType":"refAlias","ref":"ExchangeInfo"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetSupportedExchangesResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_getSupportedExchanges_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReturnType_CedeSDK-at-api_91_fetchExchangeStatus_93__": {
        "dataType": "refAlias",
        "type": {"ref":"ExchangeStatus","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FetchExchangeStatusResponse": {
        "dataType": "refAlias",
        "type": {"ref":"ReturnType_CedeSDK-at-api_91_fetchExchangeStatus_93__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HealthResponse": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"enum","enums":["ok"],"required":true},
            "timestamp": {"dataType":"string","required":true},
            "version": {"dataType":"string","required":true},
            "apiVersion": {"dataType":"string","required":true},
            "sdkVersion": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsWithdrawalController_getWithdrawalById: Record<string, TsoaRoute.ParameterSchema> = {
                withdrawalId: {"in":"path","name":"withdrawalId","required":true,"dataType":"string"},
                tokenSymbol: {"in":"query","name":"tokenSymbol","required":true,"dataType":"string"},
                timestamp: {"in":"query","name":"timestamp","required":true,"dataType":"double"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/withdrawal/:withdrawalId',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.getWithdrawalById)),

            async function WithdrawalController_getWithdrawalById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_getWithdrawalById, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'getWithdrawalById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWithdrawalController_createWithdrawal: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"CreateWithdrawalParams"},
        };
        app.post('/withdrawal',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.createWithdrawal)),

            async function WithdrawalController_createWithdrawal(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_createWithdrawal, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'createWithdrawal',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWithdrawalController_prepareWithdrawal: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"PrepareWithdrawalParams"},
        };
        app.post('/withdrawal/prepare',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.prepareWithdrawal)),

            async function WithdrawalController_prepareWithdrawal(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_prepareWithdrawal, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'prepareWithdrawal',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWithdrawalController_getWithdrawalFee: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetWithdrawalFeeParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/withdrawal/fee',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.getWithdrawalFee)),

            async function WithdrawalController_getWithdrawalFee(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_getWithdrawalFee, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'getWithdrawalFee',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWithdrawalController_checkAddressIsWhitelisted: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"CheckAddressIsWhitelistedParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/withdrawal/whitelisted-addresses/check',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.checkAddressIsWhitelisted)),

            async function WithdrawalController_checkAddressIsWhitelisted(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_checkAddressIsWhitelisted, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'checkAddressIsWhitelisted',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWithdrawalController_getWhitelistedAddresses: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetWhitelistedAddressesParams"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/withdrawal/whitelisted-addresses',
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController)),
            ...(fetchMiddlewares<RequestHandler>(WithdrawalController.prototype.getWhitelistedAddresses)),

            async function WithdrawalController_getWhitelistedAddresses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWithdrawalController_getWhitelistedAddresses, request, response });

                const controller = new WithdrawalController();

              await templateService.apiHandler({
                methodName: 'getWhitelistedAddresses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransferController_getInternalTransferRoutes: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/transfer/routes',
            ...(fetchMiddlewares<RequestHandler>(TransferController)),
            ...(fetchMiddlewares<RequestHandler>(TransferController.prototype.getInternalTransferRoutes)),

            async function TransferController_getInternalTransferRoutes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransferController_getInternalTransferRoutes, request, response });

                const controller = new TransferController();

              await templateService.apiHandler({
                methodName: 'getInternalTransferRoutes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransferController_internalTransfer: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"InternalTransferParams"},
        };
        app.post('/transfer',
            ...(fetchMiddlewares<RequestHandler>(TransferController)),
            ...(fetchMiddlewares<RequestHandler>(TransferController.prototype.internalTransfer)),

            async function TransferController_internalTransfer(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransferController_internalTransfer, request, response });

                const controller = new TransferController();

              await templateService.apiHandler({
                methodName: 'internalTransfer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransferController_getWalletTypeMapping: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/transfer/wallet-type-mapping',
            ...(fetchMiddlewares<RequestHandler>(TransferController)),
            ...(fetchMiddlewares<RequestHandler>(TransferController.prototype.getWalletTypeMapping)),

            async function TransferController_getWalletTypeMapping(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransferController_getWalletTypeMapping, request, response });

                const controller = new TransferController();

              await templateService.apiHandler({
                methodName: 'getWalletTypeMapping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_getMarketPairs: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/trade/market-pairs',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.getMarketPairs)),

            async function TradeController_getMarketPairs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_getMarketPairs, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'getMarketPairs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_getMarketRate: Record<string, TsoaRoute.ParameterSchema> = {
                pairSymbol: {"in":"query","name":"pairSymbol","required":true,"dataType":"string"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/trade/market-rate',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.getMarketRate)),

            async function TradeController_getMarketRate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_getMarketRate, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'getMarketRate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_getMinAmounts: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetMinAmountsParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/trade/min-amounts',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.getMinAmounts)),

            async function TradeController_getMinAmounts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_getMinAmounts, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'getMinAmounts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_prepareOrder: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"PrepareOrderParams"},
        };
        app.post('/trade/orders/prepare',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.prepareOrder)),

            async function TradeController_prepareOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_prepareOrder, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'prepareOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_createOrder: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"CreateOrderParams"},
        };
        app.post('/trade/orders',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.createOrder)),

            async function TradeController_createOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_createOrder, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'createOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_getOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                pairSymbol: {"in":"query","name":"pairSymbol","required":true,"dataType":"string"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/trade/orders/:orderId',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.getOrder)),

            async function TradeController_getOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_getOrder, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'getOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_updateOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                params: {"in":"body","name":"params","required":true,"ref":"UpdateOrderParams"},
        };
        app.put('/trade/orders/:orderId',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.updateOrder)),

            async function TradeController_updateOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_updateOrder, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'updateOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_cancelOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                pairSymbol: {"in":"query","name":"pairSymbol","required":true,"dataType":"string"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.delete('/trade/orders/:orderId',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.cancelOrder)),

            async function TradeController_cancelOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_cancelOrder, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'cancelOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTradeController_getOpenOrders: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetOpenOrdersParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/trade/orders',
            ...(fetchMiddlewares<RequestHandler>(TradeController)),
            ...(fetchMiddlewares<RequestHandler>(TradeController.prototype.getOpenOrders)),

            async function TradeController_getOpenOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTradeController_getOpenOrders, request, response });

                const controller = new TradeController();

              await templateService.apiHandler({
                methodName: 'getOpenOrders',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTokensController_getSupportedTokens: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/tokens/supported',
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getSupportedTokens)),

            async function TokensController_getSupportedTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTokensController_getSupportedTokens, request, response });

                const controller = new TokensController();

              await templateService.apiHandler({
                methodName: 'getSupportedTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubAccountController_getSubAccounts: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/subAccount',
            ...(fetchMiddlewares<RequestHandler>(SubAccountController)),
            ...(fetchMiddlewares<RequestHandler>(SubAccountController.prototype.getSubAccounts)),

            async function SubAccountController_getSubAccounts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubAccountController_getSubAccounts, request, response });

                const controller = new SubAccountController();

              await templateService.apiHandler({
                methodName: 'getSubAccounts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubAccountController_getSubAccountBalances: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                authUid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/subAccount/balances',
            ...(fetchMiddlewares<RequestHandler>(SubAccountController)),
            ...(fetchMiddlewares<RequestHandler>(SubAccountController.prototype.getSubAccountBalances)),

            async function SubAccountController_getSubAccountBalances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubAccountController_getSubAccountBalances, request, response });

                const controller = new SubAccountController();

              await templateService.apiHandler({
                methodName: 'getSubAccountBalances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubAccountController_subAccountTransfer: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"SubAccountTransferParams"},
        };
        app.post('/subAccount/transfer',
            ...(fetchMiddlewares<RequestHandler>(SubAccountController)),
            ...(fetchMiddlewares<RequestHandler>(SubAccountController.prototype.subAccountTransfer)),

            async function SubAccountController_subAccountTransfer(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubAccountController_subAccountTransfer, request, response });

                const controller = new SubAccountController();

              await templateService.apiHandler({
                methodName: 'subAccountTransfer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPricesController_getPrices: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeId: {"in":"query","name":"exchangeId","dataType":"string"},
        };
        app.get('/prices',
            ...(fetchMiddlewares<RequestHandler>(PricesController)),
            ...(fetchMiddlewares<RequestHandler>(PricesController.prototype.getPrices)),

            async function PricesController_getPrices(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPricesController_getPrices, request, response });

                const controller = new PricesController();

              await templateService.apiHandler({
                methodName: 'getPrices',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPricesController_getFiatCurrencies: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/prices/fiat-currencies',
            ...(fetchMiddlewares<RequestHandler>(PricesController)),
            ...(fetchMiddlewares<RequestHandler>(PricesController.prototype.getFiatCurrencies)),

            async function PricesController_getFiatCurrencies(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPricesController_getFiatCurrencies, request, response });

                const controller = new PricesController();

              await templateService.apiHandler({
                methodName: 'getFiatCurrencies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPortfolioController_getWithdrawableBalances: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/portfolio/withdrawable-balances',
            ...(fetchMiddlewares<RequestHandler>(PortfolioController)),
            ...(fetchMiddlewares<RequestHandler>(PortfolioController.prototype.getWithdrawableBalances)),

            async function PortfolioController_getWithdrawableBalances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPortfolioController_getWithdrawableBalances, request, response });

                const controller = new PortfolioController();

              await templateService.apiHandler({
                methodName: 'getWithdrawableBalances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPortfolioController_getBalances: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/portfolio/balances',
            ...(fetchMiddlewares<RequestHandler>(PortfolioController)),
            ...(fetchMiddlewares<RequestHandler>(PortfolioController.prototype.getBalances)),

            async function PortfolioController_getBalances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPortfolioController_getBalances, request, response });

                const controller = new PortfolioController();

              await templateService.apiHandler({
                methodName: 'getBalances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPortfolioController_getBalancesWithTokens: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/portfolio/balances-with-tokens',
            ...(fetchMiddlewares<RequestHandler>(PortfolioController)),
            ...(fetchMiddlewares<RequestHandler>(PortfolioController.prototype.getBalancesWithTokens)),

            async function PortfolioController_getBalancesWithTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPortfolioController_getBalancesWithTokens, request, response });

                const controller = new PortfolioController();

              await templateService.apiHandler({
                methodName: 'getBalancesWithTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPortfolioController_getMainSubAccountsBalancesWithTokens: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/portfolio/main-sub-accounts-balances-with-tokens',
            ...(fetchMiddlewares<RequestHandler>(PortfolioController)),
            ...(fetchMiddlewares<RequestHandler>(PortfolioController.prototype.getMainSubAccountsBalancesWithTokens)),

            async function PortfolioController_getMainSubAccountsBalancesWithTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPortfolioController_getMainSubAccountsBalancesWithTokens, request, response });

                const controller = new PortfolioController();

              await templateService.apiHandler({
                methodName: 'getMainSubAccountsBalancesWithTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNetworksController_getNetworks: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetNetworksParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/networks',
            ...(fetchMiddlewares<RequestHandler>(NetworksController)),
            ...(fetchMiddlewares<RequestHandler>(NetworksController.prototype.getNetworks)),

            async function NetworksController_getNetworks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNetworksController_getNetworks, request, response });

                const controller = new NetworksController();

              await templateService.apiHandler({
                methodName: 'getNetworks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNetworksController_getAvailableNetworks: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeId: {"in":"query","name":"exchangeId","required":true,"dataType":"string"},
                toDeposit: {"in":"query","name":"toDeposit","dataType":"boolean"},
                toWithdraw: {"in":"query","name":"toWithdraw","dataType":"boolean"},
        };
        app.get('/networks/available',
            ...(fetchMiddlewares<RequestHandler>(NetworksController)),
            ...(fetchMiddlewares<RequestHandler>(NetworksController.prototype.getAvailableNetworks)),

            async function NetworksController_getAvailableNetworks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNetworksController_getAvailableNetworks, request, response });

                const controller = new NetworksController();

              await templateService.apiHandler({
                methodName: 'getAvailableNetworks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_getOAuthUrl: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetOAuthUrlParams"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
        };
        app.get('/auth/oauth/url',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.getOAuthUrl)),

            async function AuthenticationController_getOAuthUrl(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_getOAuthUrl, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'getOAuthUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_getOAuthTokens: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"GetOAuthTokensParams"},
        };
        app.post('/auth/oauth/tokens',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.getOAuthTokens)),

            async function AuthenticationController_getOAuthTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_getOAuthTokens, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'getOAuthTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_checkOAuthAndRefresh: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeId":{"dataType":"string","required":true},"exchangeInstanceId":{"dataType":"string","required":true}}},
        };
        app.post('/auth/oauth/check-and-refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.checkOAuthAndRefresh)),

            async function AuthenticationController_checkOAuthAndRefresh(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_checkOAuthAndRefresh, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'checkOAuthAndRefresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_revokeOAuth: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"exchangeId":{"dataType":"string","required":true},"exchangeInstanceId":{"dataType":"string","required":true}}},
        };
        app.post('/auth/oauth/revoke',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.revokeOAuth)),

            async function AuthenticationController_revokeOAuth(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_revokeOAuth, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'revokeOAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true},"exchangeInstanceId":{"dataType":"string","required":true}}},
        };
        app.post('/auth/oauth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.refreshToken)),

            async function AuthenticationController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_refreshToken, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_getFastApiKeys: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetFastApiKeysParams"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
        };
        app.get('/auth/fast-api-keys',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.getFastApiKeys)),

            async function AuthenticationController_getFastApiKeys(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_getFastApiKeys, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'getFastApiKeys',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_setupOAuthClientCredentials: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"OAuthClientCredentialsParams"},
        };
        app.post('/auth/oauth/client-credentials',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.setupOAuthClientCredentials)),

            async function AuthenticationController_setupOAuthClientCredentials(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_setupOAuthClientCredentials, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'setupOAuthClientCredentials',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthenticationController_checkCredentials: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"uid":{"dataType":"string"},"password":{"dataType":"string"},"secretKey":{"dataType":"string","required":true},"apiKey":{"dataType":"string","required":true},"exchangeId":{"dataType":"string","required":true},"exchangeInstanceId":{"dataType":"string","required":true}}},
        };
        app.post('/auth/check-credentials',
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController)),
            ...(fetchMiddlewares<RequestHandler>(AuthenticationController.prototype.checkCredentials)),

            async function AuthenticationController_checkCredentials(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthenticationController_checkCredentials, request, response });

                const controller = new AuthenticationController();

              await templateService.apiHandler({
                methodName: 'checkCredentials',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepositController_getDepositAddress: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"GetDepositAddressParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/deposit/address',
            ...(fetchMiddlewares<RequestHandler>(DepositController)),
            ...(fetchMiddlewares<RequestHandler>(DepositController.prototype.getDepositAddress)),

            async function DepositController_getDepositAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepositController_getDepositAddress, request, response });

                const controller = new DepositController();

              await templateService.apiHandler({
                methodName: 'getDepositAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepositController_retrieveDeposit: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"RetrieveDepositParams"},
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/deposit/retrieve',
            ...(fetchMiddlewares<RequestHandler>(DepositController)),
            ...(fetchMiddlewares<RequestHandler>(DepositController.prototype.retrieveDeposit)),

            async function DepositController_retrieveDeposit(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepositController_retrieveDeposit, request, response });

                const controller = new DepositController();

              await templateService.apiHandler({
                methodName: 'retrieveDeposit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepositController_onDeposit: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"OnDepositParams"},
        };
        app.post('/deposit/on-deposit',
            ...(fetchMiddlewares<RequestHandler>(DepositController)),
            ...(fetchMiddlewares<RequestHandler>(DepositController.prototype.onDeposit)),

            async function DepositController_onDeposit(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepositController_onDeposit, request, response });

                const controller = new DepositController();

              await templateService.apiHandler({
                methodName: 'onDeposit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepositController_getDepositableTokens: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeInstanceId: {"in":"header","name":"x-exchange-instance-id","required":true,"dataType":"string"},
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
                apiKey: {"in":"header","name":"x-exchange-api-key","required":true,"dataType":"string"},
                secretKey: {"in":"header","name":"x-exchange-api-secret","required":true,"dataType":"string"},
                password: {"in":"header","name":"x-exchange-api-password","dataType":"string"},
                uid: {"in":"header","name":"x-exchange-api-uid","dataType":"string"},
        };
        app.get('/deposit/tokens',
            ...(fetchMiddlewares<RequestHandler>(DepositController)),
            ...(fetchMiddlewares<RequestHandler>(DepositController.prototype.getDepositableTokens)),

            async function DepositController_getDepositableTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepositController_getDepositableTokens, request, response });

                const controller = new DepositController();

              await templateService.apiHandler({
                methodName: 'getDepositableTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExchangeController_getSupportedExchanges: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/exchange/supported',
            ...(fetchMiddlewares<RequestHandler>(ExchangeController)),
            ...(fetchMiddlewares<RequestHandler>(ExchangeController.prototype.getSupportedExchanges)),

            async function ExchangeController_getSupportedExchanges(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExchangeController_getSupportedExchanges, request, response });

                const controller = new ExchangeController();

              await templateService.apiHandler({
                methodName: 'getSupportedExchanges',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExchangeController_fetchExchangeStatus: Record<string, TsoaRoute.ParameterSchema> = {
                exchangeId: {"in":"header","name":"x-exchange-id","required":true,"dataType":"string"},
        };
        app.get('/exchange/status',
            ...(fetchMiddlewares<RequestHandler>(ExchangeController)),
            ...(fetchMiddlewares<RequestHandler>(ExchangeController.prototype.fetchExchangeStatus)),

            async function ExchangeController_fetchExchangeStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExchangeController_fetchExchangeStatus, request, response });

                const controller = new ExchangeController();

              await templateService.apiHandler({
                methodName: 'fetchExchangeStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsHealthController_getHealth: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getHealth)),

            async function HealthController_getHealth(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_getHealth, request, response });

                const controller = new HealthController();

              await templateService.apiHandler({
                methodName: 'getHealth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
