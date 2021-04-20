import { readFileSync } from 'fs';
import { ConnectionOptions, KeyObject } from 'tls';
import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';

import { get } from 'config';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { IKafkaConfig } from '../model/kafkaConfig';
import {
  KafkaConnectionError,
  KafkaDisconnectError,
  KafkaSendError,
} from '../requests/errors/kafka';

@injectable()
export class KafkaManager {
  protected producer: Producer;
  protected kafkaConfig: IKafkaConfig;

  public constructor(private readonly logger: MCLogger) {
    this.kafkaConfig = get('kafka');

    logger.info(
      `Kafka manager created clientId=${this.kafkaConfig.clientId}, topic=${
        this.kafkaConfig.topic
      } brokers=${JSON.stringify(this.kafkaConfig.brokers)}`
    );

    const kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
      ssl: this.parseSSLOptions(),
    });

    this.producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  public async sendMessage(message: string): Promise<void> {
    this.logger.debug(`sendMessage to kafka: message=${message}`);
    try {
      await this.internalSendMessage(message);
    } catch (error) {
      this.logger.error(`Failed sending message to kafka, message=${message}`);
      throw error;
    }
  }

  protected async internalSendMessage(message: string): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      const err = error as Error;
      throw new KafkaConnectionError(err.message, err.stack);
    }

    try {
      await this.producer.send({
        topic: this.kafkaConfig.topic,
        messages: [
          {
            value: message,
          },
        ],
      });
    } catch (error) {
      const err = error as Error;
      throw new KafkaSendError(message, err.message, err.stack);
    }

    try {
      await this.producer.disconnect();
    } catch (error) {
      const err = error as Error;
      throw new KafkaDisconnectError(err.message, err.stack);
    }
  }

  private parseSSLOptions(): ConnectionOptions | undefined {
    let sslOptions: ConnectionOptions = {};

    if (this.kafkaConfig.ssl.ca) {
      sslOptions.rejectUnauthorized = this.kafkaConfig.ssl.rejectUnauthorized;
      sslOptions.ca = [readFileSync(this.kafkaConfig.ssl.ca, 'utf-8')];
    }

    if (this.kafkaConfig.ssl.cert) {
      sslOptions.cert = readFileSync(this.kafkaConfig.ssl.cert, 'utf-8');
    }

    if (this.kafkaConfig.ssl.key) {
      const key: KeyObject = {
        pem: readFileSync(this.kafkaConfig.ssl.key.pem, 'utf-8'),
        passphrase: this.kafkaConfig.ssl.key.password,
      };
      sslOptions.key = [key];
    }

    return Object.keys(sslOptions).length === 0 ? undefined : sslOptions;
  }
}
