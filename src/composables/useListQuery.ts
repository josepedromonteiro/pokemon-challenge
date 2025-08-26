// TODO - Remove this file, since now we use the pokedex-query.store.ts
// import {computed, ref} from 'vue'
// import type {Filters, OrderByFields} from '@/services/pokedex-filter-service.ts'
//
// type FilterProperty = string
// export type FilterMap<T extends FilterProperty> = Partial<Record<T, string | string[]>>
//
// export interface Query<T extends FilterProperty = string, V extends FilterProperty = string> {
//     filter?: FilterMap<T>
//     orderBy?: V
// }
//
// export function buildQueryString<T extends FilterProperty, V extends FilterProperty>(q: Query<T, V>): string {
//     const params = new URLSearchParams()
//
//     Object.entries(q.filter || {}).forEach(([k, v]) => {
//         if (v == null) return
//         if (Array.isArray(v)) {
//             if (v.length) {
//                 params.append(`filter[${String(k)}]`, v.join(','))
//             }
//         } else if (String(v).length) {
//             params.append(`filter[${String(k)}]`, String(v))
//         }
//     })
//
//     if (q.orderBy) params.append('orderBy', q.orderBy)
//
//     const s = params.toString()
//     return s ? `?${s}` : ''
// }
//
// export function useListQuery<T extends FilterProperty = string, V extends FilterProperty = string>(
//     initial?: Partial<Query<T, V>>
// ) {
//     const filter = ref<FilterMap<T>>(initial?.filter ?? {})
//     const orderBy = ref<V | undefined>(initial?.orderBy)
//
//     function setFilter(key: T, value: string | string[] | undefined | null) {
//         if (value == null || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
//             delete filter.value[key]
//         } else {
//             filter.value[key] = Array.isArray(value) ? [...value] : value;
//         }
//     }
//
//     function removeFilter(key: T) {
//         delete filter.value[key]
//     }
//
//     function clearFilters() {
//         filter.value = {} as FilterMap<T>
//     }
//
//     function setOrderBy(token?: V | null) {
//         orderBy.value = (token ?? undefined) as V | undefined
//     }
//
//     function reset() {
//         filter.value = {} as FilterMap<T>
//         orderBy.value = undefined
//     }
//
//     const query = computed<Query<T, V>>(() => ({
//         // shallow clone; clone arrays to avoid external mutation
//         filter: Object.fromEntries(
//             Object.entries(filter.value).map(([k, v]) => [k, Array.isArray(v) ? [...v] : v])
//         ) as FilterMap<T>,
//         orderBy: orderBy.value,
//     }))
//
//     const queryString = computed(() => buildQueryString(query.value))
//
//     return {
//         // expose REFs (not their values) so callers can use .value
//         filter,
//         orderBy,
//
//         // computed
//         query,
//         queryString,
//
//         // actions
//         setFilter,
//         removeFilter,
//         clearFilters,
//         setOrderBy,
//         reset,
//     }
// }
//
// export const pokedexQuery = useListQuery<Filters, OrderByFields>({
//     filter: {name: ''},
// })
