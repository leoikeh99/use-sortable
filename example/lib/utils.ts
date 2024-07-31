import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPromise<T>(data: T, duration: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), duration));
}
