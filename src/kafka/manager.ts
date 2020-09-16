import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';

import { get } from 'config';
import { Kafka, Producer } from 'kafkajs';

@injectable()
export class KafkaManager {
  protected producer: Producer;
  protected kafkaConfig: {
    clientId: string;
    brokers: [];
    topic: string;
  };

  public constructor(private readonly logger: MCLogger) {
    this.kafkaConfig = get('kafka');

    logger.info(`Kafka manager created clientId=${ this.kafkaConfig.clientId }, topic=${ this.kafkaConfig.topic } brokers=${ JSON.stringify(this.kafkaConfig.brokers) }`);
    const kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
    });
    this.producer = kafka.producer();
  }

  protected async internalSendMessage(message: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: this.kafkaConfig.topic,
      messages: [
        {
          value: message,
        },
      ],
    });
    await this.producer.disconnect();
  }

  public async sendMessage(message: string) {
    this.logger.debug(`sendMessage to kafka: message=${ message }`);
    return this.internalSendMessage(message).catch((error) => {
      this.logger.error(`Failed to send to kafka error=${ JSON.stringify(error) }, original message=${ message }`);
    });
  }
}
