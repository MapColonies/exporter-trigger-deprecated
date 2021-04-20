interface IKafkaKeyOptions {
  pem: string;
  password: string;
}

export interface IKafkaSSLOptions {
  rejectUnauthorized: boolean;
  ca: string;
  key: IKafkaKeyOptions;
  cert: string;
}

export interface IKafkaConfig {
  clientId: string;
  brokers: string[];
  topic: string;
  ssl: IKafkaSSLOptions;
}
