import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faSort,
    faSortDown,
    faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import "./style/style.css";

interface IntTableData {
    short: string;
    target: string;
    counter: number;
}

const TABLE_DATA_INIT: IntTableData[] = [
    {
        short: "",
        target: "",
        counter: 0,
    },
];

const getStatistics = (
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

type TypeField = "short" | "target" | "counter";
const FIELD_SHORT: TypeField = "short";
const FIELD_TARGET: TypeField = "target";
const FIELD_COUNTER: TypeField = "counter";

type TypeOrder = "src" | "asc" | "desc";
const ORDER_SRC: TypeOrder = "src";
const ORDER_ASC: TypeOrder = "asc";
const ORDER_DESC: TypeOrder = "desc";

type TypeOrder2 = Omit<TypeOrder, "src">;

const ORDER_ARR = [ORDER_ASC, ORDER_DESC, ORDER_SRC];

const changeOrder = (orderNow: TypeOrder) => {
    switch (orderNow) {
        case ORDER_ASC:
            return ORDER_DESC;
        case ORDER_DESC:
            return ORDER_SRC;
        case ORDER_SRC:
            return ORDER_ASC;
    }
};

const getOrderIcon = (order: TypeOrder) => {
    const objIcon = {
        icon: faSort,
        classN: "order-sort",
    };
    switch (order) {
        case ORDER_ASC:
            objIcon.icon = faSortDown;
            objIcon.classN = "order-sort_down";
            break;
        case ORDER_DESC:
            objIcon.icon = faSortUp;
            objIcon.classN = "order-sort_up";
            break;
        case ORDER_SRC:
            objIcon.icon = faSort;
            objIcon.classN = "order-sort";
            break;
    }
    return objIcon;
};

export const PageStats = () => {
    // const [order, setOrder] = useState("asc_short");
    // const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalNum, setTotalNum] = useState(0);
    const [pageNow, setPageNow] = useState(0);
    const [pageNew, setPageNew] = useState(0);
    const [classJump, setClassJump] = useState("page-stats__jump");
    const [tableData, setTableData] = useState([
        {
            short: "",
            target: "",
            counter: 0,
        },
    ]);
    const [srcData, setSrcData] = useState([
        {
            short: "",
            target: "",
            counter: 0,
        },
    ]);
    const [orderShort, setOrderShort] = useState<TypeOrder>(ORDER_ASC);
    const [orderTarget, setOrderTarget] = useState<TypeOrder>(ORDER_SRC);
    const [orderCounter, setOrderCounter] = useState<TypeOrder>(ORDER_SRC);

    const auth = useAppSelector((state: RootState) => state.login);
    const logged = auth.access_token !== "";

    const navigate = useNavigate();

    useEffect(() => {
        !logged && navigate("/");
    });

    const update = (offset: number, limit: number) => {
        getStatistics(
            auth.token_type,
            auth.access_token,
            "asc_short",
            offset,
            limit,
        ).then((finalData) => {
            const dataArr = finalData.data as IntTableData[];
            setTotalNum(finalData.total);
            setSrcData(dataArr);
            setTableData(dataArr);
            // console.log("data", data);
        });
    };

    useEffect(() => {
        update(pageNow * limit, limit);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        update(pageNow * limit, limit);
    };

    const handleClickSqueeze = (
        e: React.MouseEvent<HTMLTableCellElement>,
        idx: number,
    ) => {
        e.preventDefault();
        navigator.clipboard.writeText(
            "https://front-test.hex.team/s/" + tableData[idx].short,
        );
    };

    const compare = (
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

    const sortTable = (
        e: React.MouseEvent<HTMLButtonElement>,
        field: TypeField,
        order: TypeOrder,
    ) => {
        e.preventDefault();
        let newArr = [...srcData];

        const newOrder = changeOrder(order);
        switch (field) {
            case FIELD_SHORT:
                setOrderShort(newOrder);
                break;
            case FIELD_TARGET:
                setOrderTarget(newOrder);
                break;
            case FIELD_COUNTER:
                setOrderCounter(newOrder);
                break;
        }

        if (newOrder !== ORDER_SRC) {
            newArr.sort((a, b) => compare(a, b, field, order));
            // console.log("1", newArr);
        }
        setTableData(newArr);
    };

    const totalPages = Math.floor((totalNum + limit - 1) / limit);
    // console.log("totalPages", totalPages);

    const handlePage = (
        e: React.MouseEvent<HTMLButtonElement>,
        change: number,
    ) => {
        e.preventDefault();
        let newPage = pageNow + change;
        // console.log("newPage",newPage)
        setPageNow(newPage);
        setPageNew(newPage);
        update(newPage * limit, limit);
    };

    const handlePageNew = (
        e: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => {
        e.preventDefault();

        let page = newPage;

        if (page > totalPages - 1) {
            page = totalPages - 1;
        }
        if (page < 0) {
            page = 0;
        }
        // console.log("page",page);

        setClassJump("page-stats__jump");
        setPageNow(page);
        setPageNew(page);
        update(page * limit, limit);
    };

    const changePageNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setClassJump("page-stats__jump_wait");
        setPageNew(Number(e.target.value) - 1);
    };

    return (
        <>
            {logged && (
                <div className="page-stats">
                    <h3>Статистика переходов по коротким ссылкам</h3>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th className="table__header">#</th>
                                <th className="table__header">
                                    короткая ссылка
                                    <button
                                        className="table__sort"
                                        onClick={(e) =>
                                            sortTable(
                                                e,
                                                FIELD_SHORT,
                                                orderShort,
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={getOrderIcon(orderShort).icon}
                                            className={
                                                getOrderIcon(orderShort).classN
                                            }
                                        />
                                    </button>
                                </th>
                                <th className="table__header">
                                    исходная ссылка
                                    <button
                                        className="table__sort"
                                        onClick={(e) =>
                                            sortTable(
                                                e,
                                                FIELD_TARGET,
                                                orderTarget,
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                getOrderIcon(orderTarget).icon
                                            }
                                            className={
                                                getOrderIcon(orderTarget).classN
                                            }
                                        />
                                    </button>
                                </th>
                                <th className="table__header">
                                    количество переходов
                                    <br />
                                    по короткой ссылке
                                    <button
                                        className="table__sort"
                                        onClick={(e) =>
                                            sortTable(
                                                e,
                                                FIELD_COUNTER,
                                                orderCounter,
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                getOrderIcon(orderCounter).icon
                                            }
                                            className={
                                                getOrderIcon(orderCounter)
                                                    .classN
                                            }
                                        />
                                    </button>
                                </th>
                            </tr>
                            {tableData.map((val, idx) => (
                                <tr key={idx}>
                                    <td className="table__data">{idx + 1}</td>
                                    <td
                                        className="table__data table__data_long pointer"
                                        onClick={(e) =>
                                            handleClickSqueeze(e, idx)
                                        }
                                    >
                                        <Tooltip text="Нажмите для копирования ссылки">
                                            <div>
                                                {"https://front-test.hex.team/s/" +
                                                    val.short}
                                            </div>
                                        </Tooltip>
                                    </td>
                                    <td className="table__data table__data_long">
                                        {val.target}
                                    </td>
                                    <td className="table__data">
                                        {val.counter}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td className="table__pages">
                                    Страница: {pageNow + 1}/{totalPages}
                                    <button
                                        onClick={(e) => handlePage(e, -1)}
                                        disabled={pageNow === 0}
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        onClick={(e) => handlePage(e, +1)}
                                        disabled={pageNow + 1 === totalPages}
                                    >
                                        &gt;
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={classJump}
                                        onClick={(e) =>
                                            handlePageNew(e, pageNew)
                                        }
                                    >
                                        Переход к странице:
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        value={pageNew + 1}
                                        onChange={changePageNew}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        className="page-stats__update"
                        onClick={(e) => handleClick(e)}
                    >
                        Обновить
                    </button>
                </div>
            )}
        </>
    );
};
