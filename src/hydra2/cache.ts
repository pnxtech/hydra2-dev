/**
* @name Cache
* @summary Internal cache helper
*/

interface IHydraCacheHash {
  [name: string]: any
};

export class Cache {
  private data: IHydraCacheHash = {};

  /**
  * @name constructor
  * @summary constructor
  * @return {undefined}
  */
  constructor() {
  }

  /**
  * @name put
  * @summary put a value in the cache
  * @param {string} key - key for value
  * @param {any} value - value associated with key
  * @param {number} expiration - expiration in seconds
  * @return {undefined}
  */
  put(key: string, value: any, expiration: number = 0): void {
    this.data[key] = {
      value,
      ts: Date.now() / 1000,
      expiration
    };
  }

  /**
  * @name get
  * @summary get a value based on key
  * @param {string} key - key for value
  * @return {any} value - value associated with key or undefined if missing or expired
  */
  get(key: string): any {
    let item = this.data[key];
    if (item) {
      let current = Date.now() / 1000;
      if (current > (item.ts + item.expiration)) {
        this.data[key] = item = undefined;
      }
    }
    return item ? item.value : undefined;
  }
}

