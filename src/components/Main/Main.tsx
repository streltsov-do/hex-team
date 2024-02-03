import React from "react";
import { Route, Routes } from "react-router-dom";
import { PageAuth } from "../../pages/PageAuth/PageAuth";
import { PageReg } from "../../pages/PageReg/PageReg";
import { PageStats } from "../../pages/PageStats/PageStats";

const ROUTER_ARR = [
    {
        path: "/",
        element: <PageReg />,
    },
    {
        path: "/auth",
        element: <PageAuth />,
    },
    {
        path: "/stats",
        element: <PageStats />,
    },
];

export const Main = () => {
    return (
        <Routes>
            {ROUTER_ARR.map((item, idx) => (
                <Route key={idx} path={item.path} element={item.element} />
            ))}
        </Routes>
    );
};
