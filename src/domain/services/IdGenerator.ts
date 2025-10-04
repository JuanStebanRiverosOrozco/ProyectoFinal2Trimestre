export class IdGenerator {
  private static counters: Record<string, number> = {};

  static next(entityName: string): string {
    if (!this.counters[entityName]) {
      this.counters[entityName] = 1;
    } else {
      this.counters[entityName]++;
    }
    return this.counters[entityName].toString();
  }
}
