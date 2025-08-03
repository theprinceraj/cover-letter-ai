import { configDotenv } from 'dotenv';
import { Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';

configDotenv({
  path: '../../.env',
});

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID as string,
    oAuthClientSecret: process.env.PAYPAL_SECRET as string,
  },
  timeout: 0,
  environment: process.env.ENVIRONMENT === 'development' ? Environment.Sandbox : Environment.Production,
  logging: {
    logLevel: LogLevel.Warn,
    logRequest: {
      logBody: true,
    },
  },
});

export const ordersController = new OrdersController(client);
