// TODO - Make it more generic so it can be reused for other pages (e.g., home) and not only for Pokédex.
import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

type FilterMap = Partial<Record<string, string | string[]>>;

export type OrderBy = 'height-asc' | 'height-desc' | 'oldest' | 'newest';

/**
 * Serialize filter map + orderBy into a query string like:
 * ?filter[name]=pikachu&filter[types]=fire,water&orderBy=newest
 */
const buildQueryString = (filter: FilterMap, orderBy?: OrderBy) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
        if (v == null) return;
        if (Array.isArray(v) && v.length)
            params.append(`filter[${k}]`, v.join(','));
        else if (typeof v === 'string' && v.trim().length)
            params.append(`filter[${k}]`, v);
    });
    if (orderBy) params.append('orderBy', orderBy);
    const s = params.toString();
    return s ? `?${s}` : '';
}

/**
 * Store that manages filtering and sorting state for Pokédex queries.
 * Exposes both structured query object and serialized query string.
 */
export const usePokedexQuery = defineStore('pokedexQuery', () => {
    const filter = ref<FilterMap>({name: ''});
    const orderBy = ref<OrderBy | undefined>(undefined);

    /** Add/update/remove a single filter key safely*/
    const setFilter = (key: string, value: string | string[] | undefined | null) => {
        if (
            value == null ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '')
        )
            delete filter.value[key];
        else filter.value[key] = Array.isArray(value) ? [...value] : value;
    }

    /** Remove a specific filter key */
    const removeFilter = (k: string) => {
        delete filter.value[k];
    };

    /** Clear all filters. */
    const clearFilters = () => {
        filter.value = {};
    };

    /** Set or reset sorting */
    const setOrderBy = (v?: OrderBy | null) => {
        orderBy.value = v ?? undefined;
    };

    /** Reset filters + sorting to initial state. */
    const reset = () => {
        filter.value = {};
        orderBy.value = undefined;
    };

    /** Object representation of current query. */
    const query = computed(() => ({
        filter: Object.fromEntries(
            Object.entries(filter.value).map(([k, v]) => [
                k,
                Array.isArray(v) ? [...v] : v,
            ])
        ) as FilterMap,
        orderBy: orderBy.value,
    }));

    /** Query string representation*/
    const queryString = computed(() =>
        buildQueryString(query.value.filter, query.value.orderBy)
    );

    return {
        filter,
        orderBy,
        query,
        queryString,
        setFilter,
        removeFilter,
        clearFilters,
        setOrderBy,
        reset,
    };
});
