import {computed, ref} from "vue";
import type {Filters, OrderByFields} from "@/services/filter-service.local.ts";

type FilterProperty = string;

export type FilterMap<T extends FilterProperty> = Partial<Record<T, string | string[]>>;

export interface Query<T extends FilterProperty = string, V extends FilterProperty = string> {
    filter: FilterMap<T>;
    orderBy: V;
}

export function buildQueryString<T extends FilterProperty, V extends FilterProperty>(q: Query<T, V>): string {
    const params = new URLSearchParams();

    Object.entries(q.filter || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && `${v}`.length) {
            params.append(`filter[${String(k)}]`, `${v}`);
        }
    });

    Object.entries(q.orderBy || {}).forEach(([k, v]) => {
        if (v === "asc" || v === "desc") {
            params.append(`orderBy[${String(k)}]`, v);
        }
    });

    const s = params.toString();
    return s ? `?${s}` : "";
}

export function useListQuery<T extends FilterProperty = string, V extends FilterProperty = string>(
    initial?: Partial<Query<T, V>>
) {


    const filter = ref<FilterMap<T>>(initial?.filter ?? {});
    const orderBy = ref<V | undefined>(initial?.orderBy);


    function setFilter(key: T, value: string | undefined | null) {
        if (!value) delete filter.value[key];
        else filter.value[key] = `${value}`;
    }

    function removeFilter(key: T) {
        delete filter.value[key];
    }

    function clearFilters() {
        filter.value = {} as FilterMap<T>;
    }

    function setOrderBy(token?: V | null) {
        orderBy.value = (token ?? undefined) as V | undefined;
    }

    function reset() {
        filter.value = {} as FilterMap<T>;
        orderBy.value = undefined;
    }

    const query = computed<Query<T, V>>(() => ({
        filter: {...filter.value},
        orderBy: orderBy.value,
    }))

    const queryString = computed(() => buildQueryString(query.value));

    return {
        // state
        filter: filter.value,
        orderBy: orderBy.value,

        // computed
        query,
        queryString,

        // actions
        setFilter,
        removeFilter,
        clearFilters,
        setOrderBy,
        reset,
    };
}


export const pokedexQuery =
    useListQuery<Filters, OrderByFields>({
        filter: {name: ""},
    });
