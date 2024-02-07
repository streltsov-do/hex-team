import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faSort,
    faSortDown,
    faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import {
    IntTableData,
    ORDER_ASC,
    ORDER_DESC,
    ORDER_SRC,
    TABLE_DATA_INIT,
    TypeField,
    TypeOrder,
    TypeOrder2,
    TypeSort,
    TypeSortArr,
} from "./constants";

export const getStatistics = (
    token_type: string,
    access_token: string,
    order: string,
    offset: number,
    limit: number,
) => {
    const tokenType = token_type[0].toUpperCase() + token_type.slice(1);
    return fetch(
        `https://front-test.hex.team/api/statistics?order=${order}&offset=${offset}&limit=${limit}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `${tokenType} ${access_token}`,
            },
            // mode: 'no-cors'
        },
    ).then((response) => {
        // console.log("rr", response);
        return response
            .json()
            .then((data) => {
                // const totalCount = parseInt((response.headers.get('X-Total-Count') || "0"),10);
                const finalData = {
                    data: TABLE_DATA_INIT,
                    total: 0,
                };
                if (!data.detail) {
                    const totalCount = parseInt(
                        response.headers.get("X-Total-Count") || "0",
                        10,
                    );

                    finalData.data = data;
                    finalData.total = totalCount;
                }
                return finalData;
            })
            .catch((error) => {
                const finalData = {
                    data: TABLE_DATA_INIT,
                    total: 0,
                };
                console.log("errP", error);
                return finalData;
            });
    });
    // .then((data) => {
    //     console.log("res", data);
    // })
    // .catch((error) => {
    //     console.log("errF", error);
    // });
};

export const changeOrder = (orderNow: TypeOrder) => {
    switch (orderNow) {
        case ORDER_ASC:
            return ORDER_DESC;
        case ORDER_DESC:
            return ORDER_SRC;
        case ORDER_SRC:
            return ORDER_ASC;
        default:
            return ORDER_SRC;
    }
};

export const getOrderIcon = (order: TypeOrder) => {
    const objIcon = {
        icon: faSort,
        classN: "order-sort",
    };
    switch (order) {
        case ORDER_ASC:
            objIcon.icon = faSortUp;
            objIcon.classN = "order-sort_up";
            break;
        case ORDER_DESC:
            objIcon.icon = faSortDown;
            objIcon.classN = "order-sort_down";
            break;
        case ORDER_SRC:
            objIcon.icon = faSort;
            objIcon.classN = "order-sort";
            break;
    }
    return objIcon;
};

export const compareFunc = (
    a: IntTableData,
    b: IntTableData,
    field: TypeField,
    order: TypeOrder2,
) => {
    let pick1 = order === ORDER_ASC ? a[field] : b[field];
    let pick2 = order === ORDER_ASC ? b[field] : a[field];

    if (typeof pick1 === "string" && typeof pick2 === "string") {
        pick1 = pick1.toUpperCase();
        pick2 = pick2.toUpperCase();
    }

    if (pick1 < pick2) {
        return -1;
    }
    if (pick1 > pick2) {
        return 1;
    }

    return 0;
};

export const getEquals = (arr: IntTableData[], field: TypeField) => {
    let equal = false;
    let out = "";
    for (let i = 0; i < arr.length - 1; i++) {
        if (equal === false) {
            if (arr[i][field] === arr[i + 1][field]) {
                equal = true;
                out += i + " ";
                if (i === arr.length - 2) {
                    out += i + 1;
                }
            }
        } else {
            if (arr[i][field] !== arr[i + 1][field]) {
                equal = false;
                out += i + ",";
            } else {
                if (i === arr.length - 2) {
                    out += i + 1;
                }
            }
        }
    }
    if (out[out.length - 1] === ",") {
        out = out.slice(0, out.length - 1);
    }
    return out;
};

export const setSort = (arr: TypeSort[], val: TypeSort) => {
    let idxSrc = -1;
    let idxField = -1;
    let newArr = [...arr];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].order === ORDER_SRC && idxSrc === -1) {
            idxSrc = i;
        }
        if (arr[i].field === val.field && idxField === -1) {
            idxField = i;
        }
    }
    // console.log("idxSrc", idxSrc);
    // console.log("idxField", idxField);
    // console.log("val", val);
    let newIdx = -1;
    if (val.order === ORDER_SRC) {
        if (idxField !== -1) {
            for (let i = idxField; i < newArr.length - 1; i++) {
                newArr[i] = newArr[i + 1];
            }
            // newArr[newArr.length-1]=val;
            newIdx = newArr.length - 1;
        }
    } else {
        if (idxField !== -1) {
            newIdx = idxField < idxSrc ? idxField : idxSrc;
            // newArr[newIdx]=val;
        } else {
            newIdx = idxSrc;
            // newArr[idxSrc]=val;
        }
    }
    newArr[newIdx] = val;

    const newSort = {
        arr: newArr,
        idx: newIdx,
    };
    // console.log("val", val);
    return newArr;
    // return newSort;
};
