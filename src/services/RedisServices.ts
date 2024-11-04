import { createClient, RedisClientType } from 'redis';
import { promisify } from 'util';

class RedisService {
  /**
   * Handles all redis operations like getting setting and updating of information within
   * the Redis storage
  */
  client: RedisClientType;
  getAsync: Function;

  constructor() {
    this.client = createClient();

    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });
  }

  /**
   * Checks if the Redis client is ready for interactions
   * @return {boolean} true if connection is alive and false if its not
   */
  isAlive() {
    return this.client.isReady;
  }

  /**
   * Gets the value with the corresponding value of the key in redis
   * @key {string} key to search for in redis
   * @return {any} value of key
   */
  async get(key: string) {
    if (this.isAlive()) {
      const value: any = await this.getAsync(key);
      console.log("redis get successful")
      return value;
    }
    throw new Error("Redis client not connected");
  }

  /**
   * Sets a value with a specific key in Redis with a TTL
   * @key {string} set this key as key in Redis
   * @value {any} value to be assigned to the key
   * @duration {number} TTL of the key
   * @return {undefined} no return 
   */
  async set(key: string, value: any, duration: number) {
    if (this.isAlive()) {
      await this.client.setEx(key, duration, value);
      console.log("redis set successful")
    }
    throw new Error("Redis client not connected");
  }

  /**
   * Deletes the key in redis
   * @key {string} key to be deleted
   * @return {undefined} No return
   */
  async del(key: string) {
    if (this.isAlive()) {
      await this.client.del(key);
      console.log("redis delete successful");
    }
    throw new Error("Redis client not connected");
  }
}

const redisClient = new RedisService();

export default redisClient;
