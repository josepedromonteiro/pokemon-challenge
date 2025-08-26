type FilterProperty = string;
export type FilterMap<T extends FilterProperty> = Partial<
  Record<T, string | string[]>
>;

export interface Query<
  T extends FilterProperty = string,
  V extends FilterProperty = string,
> {
  filter?: FilterMap<T>;
  orderBy?: V;
}
