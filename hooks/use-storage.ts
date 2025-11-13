// hooks/use-storage.ts
import { useState, useEffect } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

export function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = 'localStorage'
): [T, (value: T | ((val: T) => T)) => void] {
  const isClient = typeof window !== 'undefined';

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return initialValue;

    try {
      const storage = window[type];
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${type} key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect to update storage when the state changes
  useEffect(() => {
    if (isClient) {
      try {
        const storage = window[type];
        storage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error writing to ${type} key “${key}”:`, error);
      }
    }
  }, [key, storedValue, type, isClient]);

  return [storedValue, setStoredValue];
}