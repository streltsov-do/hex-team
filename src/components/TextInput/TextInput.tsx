import React, { Children, useEffect, useState } from "react";
import "./style/style.css";

interface propsType {
    name: string;
    form: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    // ref: React.RefObject<HTMLInputElement>;
    error: boolean;
    value: string;
}

export const TextInput = (props: propsType) => {
    const { name, form, onChange, value, error } = props;

    return (
        <div className="txt-input">
            <label className="txt-input__label" form={form} htmlFor="txt-input">
                {name}
            </label>
            <input
                className="txt-input__input"
                type="text"
                name="txt-input"
                onChange={onChange}
                value={value}
            />
            {error && (
                <span className="txt-input__error">
                    Error: не указан {name}
                </span>
            )}
        </div>
    );
};
