import winston from 'winston';

export class LoggerService {
  private static instance: LoggerService;
  private logger: winston.Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'sdk-api' },
      transports: [
        new winston.transports.Console()
      ]
    });
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public log(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string | Error, meta?: any): void {
    if (message instanceof Error) {
      this.logger.error(message.message, { ...meta, error: message, stack: message.stack });
    } else {
      this.logger.error(message, meta);
    }
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

declare global {
  var logger: LoggerService;
}

global.logger = LoggerService.getInstance();

export const logger = global.logger; 