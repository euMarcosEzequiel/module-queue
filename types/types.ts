export const ExchangeType = {
  direct: 'direct',
  fanout: 'fanout',
  headers: 'headers',
  topic: 'topic',
  xDelayedMessage: 'x-delayed-message'
}

export const QueueArgs = {
  type: 'x-queue-type',
  durable: 'durable',
}

export const QueueType = {
  classic: 'classic',
  quorum: 'quorum',
  stream: 'stream'
}

export const QueueDurability = {
  Durable: 'Durable',
  Transient: 'Transient',
}

export const QueueArguments = {
  MessageTTL: 'x-message-ttl',
  AutoExpirte: 'x-expires',
  OverFlowBehavior: 'overflow'
}

export const OverFlowBehaviorOptions = {
  RejectPublish: 'reject-publish',
  RejectPublishDlx: 'reject-publish-dlx'
}