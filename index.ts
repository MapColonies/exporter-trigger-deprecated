//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { config as initDotEnv } from 'dotenv';
import { Probe } from '@map-colonies/mc-probe';
import { container } from 'tsyringe';
import { getApp } from './src/app';

async function main(): Promise<void> {
  initDotEnv();
  const defaultPort = 80;
  const port =
    process.env.SERVER_PORT != null ? parseInt(process.env.SERVER_PORT) : defaultPort;
  const app = await getApp();
  const probe = container.resolve(Probe);
  await probe.start(app, port);
  probe.readyFlag = true;
}

main();
