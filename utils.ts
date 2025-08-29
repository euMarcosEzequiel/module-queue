import { MessagePropertyHeaders } from "amqplib"

export class Utils {
  static getDelay(headers: MessagePropertyHeaders): number {
    let delay = 0
    try {
      const value = Number.parseInt(headers['x-delay'])
      delay = Math.abs(value)
    }
    catch (erro) {
      delay = 260000
    }

    return delay
  }
}