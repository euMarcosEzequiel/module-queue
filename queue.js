"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const amqplib_1 = require("amqplib");
const types_1 = require("./types");
let QueueService = class QueueService {
    uri;
    conn;
    channel;
    delay = 5000;
    exchange = 'exc.delay';
    constructor() {
        this.uri = `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_SERVER}:${process.env.RMQ_PORT}`;
    }
    async createConnection() {
        try {
            console.log('[RabbitMQ] Creating connection...');
            this.conn = await (0, amqplib_1.connect)(this.uri);
            this.conn.on('error', (err) => {
                console.error('[RabbitMQ] Connection error:', err.message);
                setTimeout(() => this.start(), this.delay);
            });
            this.conn.on('close', () => {
                console.warn('[RabbitMQ] Connection closed. Trying to reconnect...');
                setTimeout(() => this.start(), this.delay);
            });
            console.log('[RabbitMQ] Connection created');
        }
        catch (error) {
            console.error('[RabbitMQ]: Failed to create connection:', error.message);
            setTimeout(() => this.start(), this.delay);
        }
    }
    async createChannel() {
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
        }
        catch (error) {
            console.error('[RabbitMQ] Failed to create channel:', error.message);
            setTimeout(() => this.start(), this.delay);
        }
    }
    async closeConnection() {
        try {
            console.log('[RabbitMQ] Closing connection...');
            await this.conn.close();
            console.log('[RabbitMQ] Connection closed');
        }
        catch (error) {
            console.error('[RabbitMQ] Error closing connection:', error.message);
        }
    }
    async closeChannel() {
        try {
            console.log('[RabbitMQ] Closing channel...');
            await this.channel.close();
            console.log('[RabbitMQ] Channel closed');
        }
        catch (error) {
            console.error('[RabbitMQ] Error closing channel:', error.message);
        }
    }
    async setup(queue, route) {
        console.log('[RabbitMQ] Configuring queue service...');
        await this.assertQueue(queue, {
            durable: true,
            arguments: {
                'x-queue-type': types_1.QueueType.classic
            }
        });
        await this.assertExchange(this.exchange, types_1.ExchangeType.xDelayedMessage, {
            durable: true,
            arguments: {
                'x-delayed-type': types_1.ExchangeType.direct
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
        }
        catch (error) {
            console.error('[RabbitMQ] Failed to start the queue service:', error.message);
            setTimeout(() => this.start(), this.delay);
        }
    }
    async end() {
        try {
            console.log('[RabbitMQ] Terminating queue service...');
            await this.closeConnection();
            await this.closeChannel();
            console.log('[RabbitMQ] Queue service terminated');
        }
        catch (error) {
            console.error('[RabbitMQ] Error terminating the queue service:', error.message);
            setTimeout(() => this.end(), this.delay);
        }
    }
    async publishInQueue(queue, route, message, options) {
        try {
            await this.setup(queue, route);
            console.log(`[RabbitMQ] Publishing to the queue ${queue}...`);
            this.channel.sendToQueue(queue, Buffer.from(message), options);
            console.log(`[RabbitMQ] Published to the queue ${queue}`);
        }
        catch (error) {
            console.error('[RabbitMQ] Error publishing to the queue:', error.message);
        }
    }
    async consumeQueue(queue, route, callback) {
        await this.setup(queue, route);
        const { consumerTag } = await this.channel.consume(queue, async (message) => {
            callback(message);
        }, { noAck: false });
        return await this.channel.cancel(consumerTag);
    }
    async assertExchange(name, type, options) {
        return await this.channel.assertExchange(name, type, options);
    }
    async assertQueue(queue, options) {
        return await this.channel.assertQueue(queue, options);
    }
    async bindQueueToExchange(exchange, queue, severity, args) {
        return await this.channel.bindQueue(queue, exchange, severity, args);
    }
    async publishInExchange(exchange, routingKey, message, delay = 0) {
        if (delay === 0) {
            return this.channel.publish(exchange, routingKey, Buffer.from(message));
        }
        else {
            return this.channel.publish(exchange, routingKey, Buffer.from(message), { headers: { 'x-delay': delay * 1000 * 60 } });
        }
    }
    async get(queue) {
        const data = await this.channel.get(queue);
        if (typeof data !== 'boolean') {
            return data;
        }
        return null;
    }
    async ack(message) {
        return this.channel.ack(message, false);
    }
    async nack(message) {
        return this.channel.nack(message, false);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueService);
//# sourceMappingURL=queue.js.map