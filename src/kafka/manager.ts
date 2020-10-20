import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';

import { get } from 'config';
import { Kafka, Producer } from 'kafkajs';
import { IKafkaConfig } from '../model/kafkaConfig';
import {
  KafkaConnectionError,
  KafkaDisconnectError,
  KafkaSendError,
} from '../requests/errors/kafka';
import { HttpError } from '../requests/errors/errors';

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
    });
    this.producer = kafka.producer();
  }

  protected async internalSendMessage(message: string) {
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

  public async sendMessage(message: string) {
    this.logger.debug(`sendMessage to kafka: message=${message}`);
    try {
      await this.internalSendMessage(message);
    } catch (error) {
      if (error instanceof HttpError) {
        this.logger.error(`${error.toString()}, original message=${message}`);
      }
      throw error;
    }
  }
}
