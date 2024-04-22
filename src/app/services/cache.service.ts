//cache.service.ts
import { Injectable } from '@angular/core';

// Injectable decorator used to define that the CacheService is injectable
@Injectable({
  providedIn: 'root' // Specifies that this service should be provided at the root level
})
export class CacheService {
  // Private property to store cached data, initialized as an empty object
  private cache: { [key: string]: any } = {};

  constructor() {}

  // Method to set a value in the cache
  // Parameters:
  // - key: The key under which the value will be stored
  // - value: The value to be stored in the cache
  set(key: string, value: any): void {
    this.cache[key] = value; // Assigning the value to the cache with the provided key
  }

  // Method to retrieve a value from the cache
  // Parameter:
  // - key: The key of the value to be retrieved
  // Returns: The value associated with the provided key, or undefined if not found
  get(key: string): any {
    return this.cache[key]; // Returning the value associated with the provided key
  }

  // Method to clear all entries from the cache
  clear(): void {
    this.cache = {}; // Resetting the cache to an empty object
  }
}

