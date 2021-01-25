export interface IKafkaSSLOptions {
  rejectUnauthorized: boolean;
  ca: string;
  key: string;
  cert: string;
}

export interface IKafkaConfig {
  clientId: string;
  brokers: string[];
  topic: string;
  ssl: IKafkaSSLOptions;
}
