"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdGenerator = void 0;
class IdGenerator {
    static next(entityName) {
        if (!this.counters[entityName]) {
            this.counters[entityName] = 1;
        }
        else {
            this.counters[entityName]++;
        }
        return this.counters[entityName].toString();
    }
}
exports.IdGenerator = IdGenerator;
IdGenerator.counters = {};
