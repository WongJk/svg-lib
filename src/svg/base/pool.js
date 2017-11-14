/**
 * 一个池子父类
 * @type {Object}
 */
class Pool {
  constructor() {
    this.pool = {
      // id: instance
    };
  }

  add(key, slot) {
    this.pool[key] = slot;
    return this;
  }

  get(key) {
    if (!key) {
      return this.pool;
    }
    return this.pool[key];
  }

  // 软删除
  softRemove(key) {
    this.pool[key] = false;
    return this;
  }
}

export default Pool;
