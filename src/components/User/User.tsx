import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import "./style/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../../redux/sliceLogin";

export const User = () => {
    const auth = useAppSelector((state: RootState) => state.login);

    const logged = auth.access_token !== "";

    const classUser = `fa-regular fa-user user__img ${logged && "user__img_active"}`;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (logged) {
            localStorage.removeItem("auth");
            dispatch(LOGOUT());
            navigate("/");
        } else {
            navigate("/auth");
        }
    };

    return (
        <div className="user">
            <FontAwesomeIcon icon={faUser} className={classUser} />
            <button onClick={handleClick} className="user__button">
                {" "}
                {logged ? "Выйти" : "Войти"}
            </button>
        </div>
    );
};
