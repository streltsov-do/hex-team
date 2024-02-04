import React, { Children, CSSProperties, useEffect, useState } from "react";
import "./style/style.css";

interface propsType {
    name: string;
    form: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error: boolean;
    value: string;
    readonly?: boolean;
    style?: CSSProperties;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
}

export const TextInput = (props: propsType) => {
    const { name, form, onChange, value, error, readonly, style, onClick } = props;

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
                onClick={onClick}
                value={value}
                readOnly={readonly}
                style={style}
            />
            {error && (
                <span className="txt-input__error" style={style}>
                    Error: не указан {name}
                </span>
            )}
        </div>
    );
};
