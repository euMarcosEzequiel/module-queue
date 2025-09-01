"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverFlowBehaviorOptions = exports.QueueArguments = exports.QueueDurability = exports.QueueType = exports.QueueArgs = exports.ExchangeType = void 0;
exports.ExchangeType = {
    direct: 'direct',
    fanout: 'fanout',
    headers: 'headers',
    topic: 'topic',
    xDelayedMessage: 'x-delayed-message'
};
exports.QueueArgs = {
    type: 'x-queue-type',
    durable: 'durable',
};
exports.QueueType = {
    classic: 'classic',
    quorum: 'quorum',
    stream: 'stream'
};
exports.QueueDurability = {
    Durable: 'Durable',
    Transient: 'Transient',
};
exports.QueueArguments = {
    MessageTTL: 'x-message-ttl',
    AutoExpirte: 'x-expires',
    OverFlowBehavior: 'overflow'
};
exports.OverFlowBehaviorOptions = {
    RejectPublish: 'reject-publish',
    RejectPublishDlx: 'reject-publish-dlx'
};
//# sourceMappingURL=types.js.map