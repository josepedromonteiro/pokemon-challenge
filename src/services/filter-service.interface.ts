import type {Query} from "@/composables/useListQuery.ts";

export interface FilterService<T> {
    list(query: Query): Promise<T>
}
