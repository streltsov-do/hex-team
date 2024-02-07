import React, { useState } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { useAppDispatch } from "../../redux/hooks";
import { AUTH } from "../../redux/sliceLogin";
import "./style/style.css";

export const PageAuth = () => {
    const [errorPost, setErrorPost] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPostText, setErrorPostText] = useState("");

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

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

    const dispatch = useAppDispatch();

    const postAuth = (login: string, password: string) => {
        fetch(`https://front-test.hex.team/api/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: login,
                password: password,
            }),
        }).then((response) => {
            return response
                .json()
                .then((data) => {
                    console.log("data", data);
                    if (data.detail) {
                        const message =
                            data.detail === "login and password do not match"
                                ? "логин и пароль не совпадают"
                                : data.detai;
                        setErrorPostText(`ERROR: ${message}`);
                        setErrorPost(true);
                    } else {
                        const auth = {
                            access_token: data.access_token,
                            token_type: data.token_type,
                        };
                        localStorage.setItem("auth", JSON.stringify(auth));

                        dispatch(
                            AUTH({
                                access_token: data.access_token,
                                token_type: data.token_type,
                            }),
                        );

                        navigate("/squeeze");
                    }
                    return data;
                })
                .catch((error) => {
                    console.log("errP", error);
                });
            // console.log("response", response.json());
            // console.log(response.json());
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
            postAuth(login, password);
        }
    };

    return (
        <div className="page-auth">
            <LoginForm
                name="auth"
                title="Авторизация"
                submitText="Войти"
                onClick={handleClick}
                login={login}
                loginError={errorLogin}
                changeLogin={changeLogin}
                password={password}
                passwordError={errorPassword}
                changePassword={changePassword}
                errorForm={errorPost}
                errorFormText={errorPostText}
                style={{
                    backgroundColor: "pink",
                }}
            />
        </div>
    );
};
