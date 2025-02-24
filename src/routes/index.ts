import { Router } from 'express';
import { authenticationRoutes } from './authentication.controller';
import { depositRoutes } from './deposit.controller';
import { exchangeRoutes } from './exchange.controller';
import { networksRoutes } from './networks.controller';
import { portfolioRoutes } from './portfolio.controller';
import { pricesRoutes } from './prices.controller';
import { subAccountRoutes } from './subAccount.controller';
import { tokensRoutes } from './tokens.controller';
import { tradeRoutes } from './trade.controller';
import { withdrawalRoutes } from './withdrawal.controller';
import { healthRoutes } from './health.controller';
import { transferRoutes } from './transfer.controller';
export function setupRoutes(sdk: any) {
    const router = Router();
  
    router.use('/portfolio', portfolioRoutes(sdk));
    router.use('/withdrawal', withdrawalRoutes(sdk));
    router.use('/networks', networksRoutes(sdk));
    router.use('/deposit', depositRoutes(sdk));
    router.use('/exchange', exchangeRoutes(sdk));
    router.use('/auth', authenticationRoutes(sdk));
    router.use('/prices', pricesRoutes(sdk));
    router.use('/trade', tradeRoutes(sdk));
    router.use('/tokens', tokensRoutes(sdk));
    router.use('/subAccount', subAccountRoutes(sdk));
    router.use('/transfer', transferRoutes(sdk));
    router.use('/health', healthRoutes());
   
    return router;
  }