import type { Query } from '@/models/filters.ts';

export interface FilterService<T> {
  list(query: Query): Promise<T>;
}
