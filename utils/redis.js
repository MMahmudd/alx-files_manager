import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents_a_Redis_client.
 */
class RedisClient {
  /**
   * Creates_a_new RedisClient_instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * checks_if_this_client's_connection_to_the_Redis_server_is_active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * retrieves_the_value_of_a_given_key.
   * @param _{String} key_The_key_of_the_item_to_retrieve.
   * @returns _{String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a_key_and_its_value_along_with_an expiration_time.
   * @param  _{String}_key The_key of_the_item_to_store.
   * @param  _{String | Number | Boolean}_value_The_item_to_store.
   * @param  _{Number} duration_The_expiration_time_of_the_item_in_seconds.
   * @returns _{Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes _the_value_of_a_given_key.
   * @param _{String}_key_The_key_of_the_item_to_remove.
   * @returns _{Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
