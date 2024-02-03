import React, { useState } from "react";
import { TextInput } from "../TextInput/TextInput";
import "./style/style.css";

interface propsType {
    name: string;
    title: string;
    submitText: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    login: string;
    loginError: boolean;
    changeLogin: React.ChangeEventHandler<HTMLInputElement>;
    password: string;
    passwordError: boolean;
    changePassword: React.ChangeEventHandler<HTMLInputElement>;
    errorForm: boolean;
    errorFormText: string;
    style?: React.CSSProperties;
}

export const LoginForm = (props: propsType) => {
    const {
        name,
        title,
        submitText,
        onClick,
        login,
        loginError,
        changeLogin,
        password,
        passwordError,
        changePassword,
        errorForm,
        errorFormText,
        style,
    } = props;

    return (
        <form className="login-form" name={name} style={style}>
            <h1 className="login-form__title">{title}</h1>
            <TextInput
                name="Логин"
                form="auth"
                onChange={changeLogin}
                error={loginError}
                value={login}
            />
            <TextInput
                name="Пароль"
                form="auth"
                onChange={changePassword}
                error={passwordError}
                value={password}
            />
            <button
                className="login-form__submit"
                type="submit"
                onClick={onClick}
            >
                {submitText}
            </button>
            {errorForm && (
                <span className="login-form__error">{errorFormText}</span>
            )}
        </form>
    );
};
