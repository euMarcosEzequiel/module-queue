import { Message } from "amqplib";
export declare class QueueService {
    private uri;
    private conn;
    private channel;
    private delay;
    private exchange;
    constructor();
    private createConnection;
    private createChannel;
    private closeConnection;
    private closeChannel;
    private setup;
    start(): Promise<void>;
    end(): Promise<void>;
    publishInQueue(queue: string, route: string, message: string, options?: any): Promise<void>;
    consumeQueue(queue: string, route: string, callback: (message: Message) => void): Promise<import("amqplib").Replies.Empty>;
    assertExchange(name: string, type: string, options?: any): Promise<import("amqplib").Replies.AssertExchange>;
    assertQueue(queue: string, options?: any): Promise<import("amqplib").Replies.AssertQueue>;
    bindQueueToExchange(exchange: string, queue: string, severity: string, args?: any): Promise<import("amqplib").Replies.Empty>;
    publishInExchange(exchange: string, routingKey: string, message: string, delay?: number): Promise<boolean>;
    get(queue: string): Promise<import("amqplib").GetMessage>;
    ack(message: Message): Promise<void>;
    nack(message: Message): Promise<void>;
}
