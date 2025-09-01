import { Injectable } from '@nestjs/common'
import { connect, Channel, Message } from "amqplib";
import { ExchangeType, QueueType } from './types';


@Injectable()
export class QueueService {
  private uri: string;
  private conn: Awaited<ReturnType<typeof connect>>;
  private channel: Channel;
  private delay = 5000;
  private exchange = 'exc.delay'

  constructor() {
    this.uri = `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_SERVER}:${process.env.RMQ_PORT}`
  }

  private async createConnection() {
    try {
      console.log('[RabbitMQ] Creating connection...');
      this.conn = await connect(this.uri);

      this.conn.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err.message);
        setTimeout(() => this.start(), this.delay);
      });
      this.conn.on('close', () => {
        console.warn('[RabbitMQ] Connection closed. Trying to reconnect...');
        setTimeout(() => this.start(), this.delay);
      });

      console.log('[RabbitMQ] Connection created')
    } catch (error) {
      console.error('[RabbitMQ]: Failed to create connection:', error.message)
      setTimeout(() => this.start(), this.delay);
    }
  }

  private async createChannel() {
    try {
      console.log('[RabbitMQ] Creating channel...');
      this.channel = await this.conn.createChannel();

      this.channel.on('error', (err) => {
        console.error('[RabbitMQ] Channel error:', err.message);
        setTimeout(() => this.start(), this.delay);
      });
      this.channel.on('close', () => {
        console.warn('[RabbitMQ] Channel closed. Trying to reconnect...');
        setTimeout(() => this.start(), this.delay);
      });

      console.log('[RabbitMQ] Channel created');
    } catch (error) {
      console.error('[RabbitMQ] Failed to create channel:', error.message);
      setTimeout(() => this.start(), this.delay);
    }
  }

  private async closeConnection() {
    try {
      console.log('[RabbitMQ] Closing connection...');

      await this.conn.close();

      console.log('[RabbitMQ] Connection closed');
    } catch (error) {
      console.error('[RabbitMQ] Error closing connection:', error.message);
    }
  }

  private async closeChannel() {
    try {
      console.log('[RabbitMQ] Closing channel...');

      await this.channel.close();

      console.log('[RabbitMQ] Channel closed');
    } catch (error) {
      console.error('[RabbitMQ] Error closing channel:', error.message);
    }
  }

  private async setup(queue: string, route: string) {
    console.log('[RabbitMQ] Configuring queue service...');

    await this.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-queue-type': QueueType.classic
      }
    });

    await this.assertExchange(this.exchange, ExchangeType.xDelayedMessage, {
      durable: true,
      arguments: {
        'x-delayed-type': ExchangeType.direct
      }
    });

    await this.bindQueueToExchange(this.exchange, queue, route);

    console.log('[RabbitMQ] Queue service configured');
  }

  async start() {
    try {
      console.log('[RabbitMQ] Starting the queue service...');

      await this.createConnection();
      await this.createChannel();

      console.log('[RabbitMQ] Queue service started');
    } catch (error) {
      console.error('[RabbitMQ] Failed to start the queue service:', error.message);
      setTimeout(() => this.start(), this.delay);
    }
  }

  async end() {
    try {
      console.log('[RabbitMQ] Terminating queue service...')

      await this.closeConnection();
      await this.closeChannel();

      console.log('[RabbitMQ] Queue service terminated');
    } catch (error) {
      console.error('[RabbitMQ] Error terminating the queue service:', error.message);
      setTimeout(() => this.end(), this.delay);
    }
  }

  async publishInQueue(queue: string, route: string, message: string, options?: any) {
    try {
      await this.setup(queue, route);

      console.log(`[RabbitMQ] Publishing to the queue ${queue}...`);

      this.channel.sendToQueue(queue, Buffer.from(message), options);

      console.log(`[RabbitMQ] Published to the queue ${queue}`)
    } catch (error) {
      console.error('[RabbitMQ] Error publishing to the queue:', error.message)
    }
  }

  async consumeQueue(queue: string, route: string, callback: (message: Message) => void) {
    await this.setup(queue, route);

    return this.channel.consume(queue, async (message) => {
      callback(message);
    }, { noAck: false });
  }

  async assertExchange(name: string, type: string, options?: any) {
    return await this.channel.assertExchange(name, type, options);
  }

  async assertQueue(queue: string, options?: any) {
    return await this.channel.assertQueue(queue, options);
  }

  async bindQueueToExchange(exchange: string, queue: string, severity: string, args?: any) {
    return await this.channel.bindQueue(queue, exchange, severity, args);
  }

  async publishInExchange(exchange: string, routingKey: string, message: string, delay: number = 0) {
    if (delay === 0) {
      return this.channel.publish(exchange, routingKey, Buffer.from(message));
    } else {
      return this.channel.publish(exchange, routingKey, Buffer.from(message), { headers: { 'x-delay': delay * 1000 * 60 } });
    }
  }

  async get(queue: string) {
    const data = await this.channel.get(queue);
    if (typeof data !== 'boolean') {
      return data;
    }
    return null;
  }

  async ack(message: Message) {
    return this.channel.ack(message, false);
  }

  async nack(message: Message) {
    return this.channel.nack(message, false);
  }
}