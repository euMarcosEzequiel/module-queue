"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static getDelay(headers) {
        let delay = 0;
        try {
            const value = Number.parseInt(headers['x-delay']);
            delay = Math.abs(value);
        }
        catch (erro) {
            delay = 260000;
        }
        return delay;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map