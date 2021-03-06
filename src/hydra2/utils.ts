import crypto from 'crypto';

/**
* @name Utils
* @return {undefined}
*/
export default class Utils {
  /**
  * @name md5Hash
  * @summary Hashes a key to produce an MD5 hash
  * @param {string} key - input key to hash
  * @return {string} hash - hashed value
  */
  static md5Hash(key: string): string {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  }

  /**
   * @name safeJSONStringify
   * @summary Safe JSON stringify
   * @param {object} obj - object to stringify
   * @return {string} string - stringified object.
   */
  static safeJSONStringify(obj: any): string {
    // replaceErrors below credited to Jonathan Lonowski via Stackoverflow:
    // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify

    // TODO: figure out how to correctly code this in typescript
    // @ts-ignore: Unreachable code error
    let replaceErrors = (key: string, value: any) => {
      if (value instanceof Error) {
        let error:any = {};
        Object.getOwnPropertyNames(value).forEach((key) => {
          error[key] = (value as any)[key];
        });
        return error;
      }
      return value;
    };
    return JSON.stringify(obj, replaceErrors);
  }

  /**
   * @name safeJSONParse
   * @summary Safe JSON parse
   * @private
   * @param {string} str - string which will be parsed
   * @return {object} obj - parsed object
   *   Returns undefined if string can't be parsed into an object
   */
  static safeJSONParse(str: string) {
    let data;
    try {
      data = JSON.parse(str);
    } catch (e) {
      data = undefined;
    }
    return data;
  }

  /**
   * @name stringHash
   * @summary returns a hash value for a supplied string
   * @see https://github.com/darkskyapp/string-hash
   * @param {object} str - string to hash
   * @return {number} hash - hash value
   */
  static stringHash(str: string) {
    let hash = 5381;
    let i = str.length;
    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
  }

  /**
  * @name shortID
  * @summary generate a random id composed of alphanumeric characters
  * @see https://en.wikipedia.org/wiki/Base36
  * @return {string} random string id
  */
  static shortID() {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(36);
  }

  /**
  * @name isUUID4
  * @summary determine whether a string is a valid UUID
  * @param {string} str - possible UUID
  * @return {undefined}
  */
  static isUUID4(str: string) {
    const uuidPattern = '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$';
    return (new RegExp(uuidPattern)).test(str);
  }

  /**
  * @name shuffeArray
  * @summary shuffle an array in place
  * @param {array} a - array elements may be numbers, string or objects.
  * @return {undefined}
  */
  static shuffleArray(a: any) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  /**
   * @name getTimeStamp
   * @summary Retrieve an ISO 8601 timestamp.
   * @return {string} timestamp - ISO 8601 timestamp
   */
   static getTimeStamp(): string {
    return new Date().toISOString();
  }  
}