import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import { User } from "../User/User";
import "./style/style.css";

const LOCATIONS_ARR = [
    {
        path: "/",
        name: "Регистрация",
        logged: false,
    },
    {
        path: "/auth",
        name: "Вход",
        logged: false,
    },
    {
        path: "/squeeze",
        name: "Сокращение ссылок",
        logged: true,
    },
    {
        path: "/stats",
        name: "Статистика",
        logged: true,
    },
];

export const Header = () => {
    const location = useLocation();

    const auth = useAppSelector((state: RootState) => state.login);

    const logged = auth.access_token !== "";

    const linkClass = LOCATIONS_ARR.map(
        (val) =>
            `nav__link ${location.pathname === val.path && "nav__link_active"}`,
    );

    return (
        <div className="header">
            <nav>
                <ul className="nav">
                    {LOCATIONS_ARR.map((val, idx) => {
                        if (
                            (val.logged && logged) ||
                            (!val.logged && !logged)
                        ) {
                            return (
                                <li key={idx}>
                                    <Link
                                        className={linkClass[idx]}
                                        to={val.path}
                                    >
                                        {val.name}
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </nav>
            <User />
        </div>
    );
};
