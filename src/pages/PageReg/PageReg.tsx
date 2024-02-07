import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import "./style/style.css";

export const PageReg = () => {
    const [errorPost, setErrorPost] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPostText, setErrorPostText] = useState("");

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const auth = useAppSelector((state: RootState) => state.login);
    const logged = auth.access_token !== "";

    const changeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorPost(false);
        setErrorLogin(false);
        setLogin(e.target.value);
    };

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorPost(false);
        setErrorPassword(false);
        setPassword(e.target.value);
    };

    const navigate = useNavigate();

    useEffect(() => {
        logged && navigate("/squeeze");
    });

    const postReg = (login: string, password: string) => {
        fetch(
            `https://front-test.hex.team/api/register?username=${login}&password=${password}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
        ).then((response) => {
            return response
                .json()
                .then((data) => {
                    if (data.detail) {
                        const message =
                            data.detail ===
                            `user with username='${login}' already exists`
                                ? `Пользователь с логином '${login}' уже существует`
                                : data.detail;
                        setErrorPostText(`ERROR: ${message}`);
                        setErrorPost(true);
                    } else {
                        navigate("/auth");
                    }
                    return data;
                })
                .catch((error) => {
                    console.log("ERROR Response:", error);
                });
        });
        // .then((data) => {
        //     console.log("res", data);
        // })
        // .catch((error) => {
        //     console.log("errF", error);
        // });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setErrorLogin(!login);
        setErrorPassword(!password);
        if (login && password) {
            postReg(login, password);
        }
    };

    return (
        <div className="page-reg">
            <LoginForm
                name="reg"
                title="Регистрация"
                submitText="Зарегистрироваться"
                onClick={handleClick}
                login={login}
                loginError={errorLogin}
                changeLogin={changeLogin}
                password={password}
                passwordError={errorPassword}
                changePassword={changePassword}
                errorForm={errorPost}
                errorFormText={errorPostText}
            />
        </div>
    );
};
