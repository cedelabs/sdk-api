import { TxStatus } from '@cedelabs-private/sdk';
import { AuthParams } from "../utils/typeUtils";


export type OnDepositParams = {
    exchangeInstanceId: string;
    auth: AuthParams;   
    txHash: string;
    tokenSymbol: string;
    maxDuration?: number;
    intervalMs?: number;
    txStatus?: TxStatus;
    callbackUrl: string;
    callbackHeaders?: Record<string, string>;
};

export type CreateWithdrawalParams = {
    exchangeInstanceId: string;
    auth: AuthParams;
    amount: string;
    tokenSymbol: string;
    network: string;
};