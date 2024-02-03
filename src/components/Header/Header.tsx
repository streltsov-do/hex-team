import { Link, useLocation } from "react-router-dom";
import { User } from "../User/User";
import "./style/style.css";

const locations = ["/", "/auth", "stats"];

export const Header = () => {
    // const [active, setActive] = useState(0);

    // console.log("href",window.location.href);

    const location = useLocation();

    const linkClass = [
        `nav__link ${location.pathname === "/" && "nav__link_active"}`,
        `nav__link ${location.pathname === "/auth" && "nav__link_active"}`,
        `nav__link ${location.pathname === "/stats" && "nav__link_active"}`,
    ];

    return (
        <div className="header">
            <nav>
                <ul className="nav">
                    <li>
                        <Link
                            // onClick={() => setActive(0)}
                            className={linkClass[0]}
                            to="/"
                        >
                            Главная
                        </Link>
                    </li>
                    <li>
                        <Link
                            // onClick={() => setActive(1)}
                            className={linkClass[1]}
                            to="/auth"
                        >
                            Вход
                        </Link>
                    </li>
                    <li>
                        <Link
                            // onClick={() => setActive(2)}
                            className={linkClass[2]}
                            to="/stats"
                        >
                            Статистика
                        </Link>
                    </li>
                </ul>
            </nav>
            <User />
        </div>
    );
};
