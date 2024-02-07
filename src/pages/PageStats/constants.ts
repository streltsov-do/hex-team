export interface IntTableData {
    short: string;
    target: string;
    counter: number;
}

export const TABLE_DATA_INIT: IntTableData[] = [
    {
        short: "",
        target: "",
        counter: 0,
    },
];

export type TypeField = "short" | "target" | "counter";
export const FIELD_SHORT: TypeField = "short";
export const FIELD_TARGET: TypeField = "target";
export const FIELD_COUNTER: TypeField = "counter";

export type TypeOrder = "src" | "asc" | "desc";
export const ORDER_SRC: TypeOrder = "src";
export const ORDER_ASC: TypeOrder = "asc";
export const ORDER_DESC: TypeOrder = "desc";

export type TypeOrder2 = Omit<TypeOrder, "src">;

export const ORDER_ARR = [ORDER_ASC, ORDER_DESC, ORDER_SRC];

export interface TypeSort {
    field: TypeField;
    order: TypeOrder;
}
export const SORT_EMPTY: TypeSort = {
    field: FIELD_SHORT,
    order: ORDER_SRC,
};