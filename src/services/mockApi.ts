import { delay, randomDelay } from './delay';

export interface SimulateRequestOptions<T> {
  delay?: number | [number, number];
  failRate?: number;
  data: T | (() => T);
}

export class MockApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockApiError';
  }
}

export async function simulateRequest<T>({
  delay: delayOption = [300, 800],
  failRate = 0.1,
  data,
}: SimulateRequestOptions<T>): Promise<T> {
  if (Array.isArray(delayOption)) {
    await randomDelay(delayOption[0], delayOption[1]);
  } else {
    await delay(delayOption);
  }

  if (Math.random() < failRate) {
    throw new MockApiError('Network error: Request failed');
  }

  const result = typeof data === 'function' ? (data as () => T)() : data;

  return structuredClone(result);
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginateArray<T>(
  array: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = array.slice(start, end);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function sortArray<T>(
  array: T[],
  field: keyof T,
  order: 'asc' | 'desc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
}

export function filterArray<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  return array.filter(predicate);
}
