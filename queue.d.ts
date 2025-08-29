import { Message } from "amqplib";
export declare class QueueService {
    uri: string;
    private conn;
    private channel;
    private delay;
    constructor();
    private createConnection;
    private createChannel;
    private closeConnection;
    private closeChannel;
    start(): Promise<void>;
    end(): Promise<void>;
    publishInQueue(queue: string, message: string, options?: any): Promise<void>;
    consumeQueue(queue: string, callback: (message: Message) => void): Promise<import("amqplib").Replies.Consume>;
    assertExchange(name: string, type: string, options?: any): Promise<import("amqplib").Replies.AssertExchange>;
    assertQueue(queue: string, options?: any): Promise<import("amqplib").Replies.AssertQueue>;
    bindQueueToExchange(exchange: string, queue: string, severity: string, args?: any): Promise<import("amqplib").Replies.Empty>;
    publishInExchange(exchange: string, routingKey: string, message: string, delay?: number): Promise<boolean>;
    get(queue: string): Promise<import("amqplib").GetMessage>;
    ack(message: Message): Promise<void>;
    nack(message: Message): Promise<void>;
}
