import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import {
    FIELD_COUNTER,
    FIELD_SHORT,
    FIELD_TARGET,
    IntTableData,
    ORDER_SRC,
    SORT_EMPTY,
    TypeField,
    TypeOrder,
    TypeSort,
} from "./constants";
import {
    changeOrder,
    compareFunc,
    getEquals,
    getOrderIcon,
    getStatistics,
    setSort,
} from "./functions";
import "./style/style.css";

export const PageStats = () => {
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNow, setPageNow] = useState(0);
    const [pageJump, setPageJump] = useState(0);
    const [classJump, setClassJump] = useState("page-stats__jump");
    const [orderShort, setOrderShort] = useState<TypeOrder>(ORDER_SRC);
    const [orderTarget, setOrderTarget] = useState<TypeOrder>(ORDER_SRC);
    const [orderCounter, setOrderCounter] = useState<TypeOrder>(ORDER_SRC);
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
    const [sortState, setSortState] = useState<TypeSort[]>([
        SORT_EMPTY,
        SORT_EMPTY,
        SORT_EMPTY,
    ]);

    const auth = useAppSelector((state: RootState) => state.login);
    const logged = auth.access_token !== "";

    const navigate = useNavigate();

    useEffect(() => {
        !logged && navigate("/");
    });

    const setPages = (page: number) => {
        setPageNow(page);
        setPageJump(page);
        sessionStorage.setItem("page", page + "");
    };

    const update = (offset: number, limit: number) => {
        getStatistics(
            auth.token_type,
            auth.access_token,
            "asc_short",
            offset,
            limit,
        ).then((finalData) => {
            const dataArr = finalData.data as IntTableData[];
            setTotalPages(Math.floor((finalData.total + limit - 1) / limit));
            setSrcData(dataArr);
            setTableData(dataArr);
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

        const newSort = setSort(sortState, {
            field: field,
            order: newOrder,
        });
        setSortState(newSort);

        let equal = "";
        for (let i = 0; i < newSort.length; i++) {
            if (newSort[i].order === ORDER_SRC) {
                break;
            }
            if (i === 0) {
                newArr.sort((a, b) =>
                    compareFunc(a, b, newSort[i].field, newSort[i].order),
                );
                equal = getEquals(newArr, newSort[i].field);
            } else if (equal !== "") {
                let parts = equal.split(",");
                for (let j = 0; j < parts.length; j++) {
                    const limits = parts[j].split(" ");
                    const LIMIT_MIN = Number(limits[0]);
                    const LIMIT_MAX = Number(limits[1]) + 1;
                    const arrPart = newArr.slice(LIMIT_MIN, LIMIT_MAX);
                    arrPart.sort((a, b) =>
                        compareFunc(a, b, newSort[i].field, newSort[i].order),
                    );

                    newArr = [
                        ...newArr.slice(0, LIMIT_MIN),
                        ...arrPart,
                        ...newArr.slice(LIMIT_MAX),
                    ];
                }
            }
        }
        setTableData(newArr);
    };

    const resetOrders = () => {
        setOrderShort(ORDER_SRC);
        setOrderTarget(ORDER_SRC);
        setOrderCounter(ORDER_SRC);
    };

    const handlePage = (
        e: React.MouseEvent<HTMLButtonElement>,
        change: number,
    ) => {
        e.preventDefault();
        let newPage = pageNow + change;
        setPages(newPage);
        update(newPage * limit, limit);
        resetOrders();
    };

    const handlePageJump = (
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

        setClassJump("page-stats__jump");
        setPages(page);
        update(page * limit, limit);
        resetOrders();
    };

    const changePageJump = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setClassJump("page-stats__jump_wait");
        setPageJump(Number(e.target.value) - 1);
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
                                            handlePageJump(e, pageJump)
                                        }
                                    >
                                        Переход к странице:
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        value={pageJump + 1}
                                        onChange={changePageJump}
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
