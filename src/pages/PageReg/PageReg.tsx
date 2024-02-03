import React, { useState } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import "./style/style.css";

export const PageReg = () => {
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
                    console.log("data", data);
                    if (data.detail) {
                        setErrorPostText(`ERROR: ${data.detail}`);
                        setErrorPost(true);
                    } else {
                        navigate("/auth");
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
