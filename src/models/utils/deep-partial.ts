// Deeply make every property optional, including inside arrays.
export type DeepPartial<T> =
    T extends (...args: any) => any ? T
        : T extends readonly (infer U)[] ? ReadonlyArray<DeepPartial<U>>
            : T extends (infer U)[] ? Array<DeepPartial<U>>
                : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> }
                    : T;
