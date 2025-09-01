export declare const ExchangeType: {
    direct: string;
    fanout: string;
    headers: string;
    topic: string;
    xDelayedMessage: string;
};
export declare const QueueArgs: {
    type: string;
    durable: string;
};
export declare const QueueType: {
    classic: string;
    quorum: string;
    stream: string;
};
export declare const QueueDurability: {
    Durable: string;
    Transient: string;
};
export declare const QueueArguments: {
    MessageTTL: string;
    AutoExpirte: string;
    OverFlowBehavior: string;
};
export declare const OverFlowBehaviorOptions: {
    RejectPublish: string;
    RejectPublishDlx: string;
};
