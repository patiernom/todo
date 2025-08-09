import * as dotenv from 'dotenv';
dotenv.config();

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.HOST || '0.0.0.0';
export const ROUTE_PREFIX = process.env.ROUTE_PREFIX;
