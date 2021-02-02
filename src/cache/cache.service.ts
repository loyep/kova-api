import { Injectable } from "@nestjs/common"
import { RedisService } from "nestjs-redis"
import type { Redis } from "ioredis"
import { LoggerService } from "@/common/logger.service"

type DefCallback<T> = null | T | (() => Promise<T> | T)

@Injectable()
export class CacheService {
  static readonly foreverTtl = 0
  private ttl = 600
  public store: Redis

  constructor(private readonly redisService: RedisService, private readonly logger: LoggerService) {
    this.getStore()
  }

  getStore(storeName: string = null) {
    this.store = this.redisService.getClient(storeName)
  }

  private isEmpty(value: unknown) {
    return value === null || value === undefined
  }

  _value<T>(callback: DefCallback<T>): Promise<T | null>
  async _value<T>(callback: unknown) {
    const value: T = callback instanceof Function ? await callback() : callback
    return value
  }

  async get<T = any>(key: string, def: DefCallback<T> = null): Promise<T | null> {
    const cached = await this.store.get(key)
    let value: T
    if (!this.isEmpty(cached)) {
      try {
        value = JSON.parse(cached)
      } catch (error) {
        this.logger.info({
          data: {
            error,
          },
        })
      }
      return value
    }

    if (def) {
      return await this._value(def)
    }
    return null
  }

  async pull<T = any>(key: string, def: DefCallback<T> = null): Promise<T> {
    const cached: T = await this.get(key)
    if (cached) {
      await this.forget(key)
    }
    if (def) {
      return await this._value(def)
    }
    return cached
  }

  forget(key: string): Promise<boolean> {
    return new Promise((resolve) =>
      this.store.del(key, (err) => {
        resolve(!err)
      }),
    )
  }

  async put<T>(key: string, value: T, ttl = this.ttl): Promise<boolean> {
    let res: "OK" | null
    if (ttl === 0) {
      res = await this.store.set(key, JSON.stringify(value))
    } else {
      res = await this.store.set(key, JSON.stringify(value), "EX", ttl)
    }
    return res !== null
  }

  async has<T>(key: string): Promise<boolean> {
    const cached: T = await this.get(key)
    return !this.isEmpty(cached)
  }

  async missing<T>(key: string): Promise<boolean> {
    return !(await this.has<T>(key))
  }

  async add<T>(key: string, value: T, ttl = this.ttl): Promise<T | boolean> {
    const exists = await this.has(key)
    if (!exists) {
      return await this.put(key, value, ttl)
    }
    return false
  }

  async remember<T>(key: string, callback: DefCallback<T>, ttl = this.ttl) {
    let value: T = await this.get(key)
    if (value) {
      return value
    }
    value = await this._value(callback)
    await this.put(key, value, ttl)
    return value
  }

  forever<T>(key: string, value: T) {
    return this.put(key, value, CacheService.foreverTtl)
  }

  /**
   * Get an item from the cache, or execute the given Closure and store the result forever.
   *
   * @param key
   * @param value
   */
  sear<T>(key: string, callback: DefCallback<T>) {
    return this.rememberForever(key, callback)
  }

  set<T>(key: string, value: T, ttl = this.ttl) {
    return this.put(key, value, ttl)
  }

  rememberForever<T>(key: string, callback: DefCallback<T>) {
    return this.remember(key, callback, CacheService.foreverTtl)
  }
}
