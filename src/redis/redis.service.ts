import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  /**
   *
   * @param key 键
   * @param value 值
   * @param ttl 键生存时间
   */
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl); // 设置生存时间
    }
  }
}
