import React, { Children, CSSProperties, useEffect, useState } from "react";
import { Tooltip } from "../Tooltip/Tooltip";
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
    type?: string;
    tooltip_text?: string;
}

export const TextInput = (props: propsType) => {
    const {
        name,
        form,
        onChange,
        value,
        error,
        readonly,
        style,
        onClick,
        type,
        tooltip_text,
    } = props;

    return (
        <div className="txt-input">
            <label className="txt-input__label" form={form} htmlFor="txt-input">
                {name}
            </label>
            {(!tooltip_text && (
                <input
                    className="txt-input__input"
                    type={type || "text"}
                    name="txt-input"
                    onChange={onChange}
                    onClick={onClick}
                    value={value}
                    readOnly={readonly}
                    style={style}
                />
            )) ||
                (tooltip_text && (
                    <Tooltip text={tooltip_text}>
                        <input
                            className="txt-input__input pointer"
                            type={type || "text"}
                            name="txt-input"
                            onChange={onChange}
                            onClick={onClick}
                            value={value}
                            readOnly={readonly}
                            style={style}
                        />
                    </Tooltip>
                ))}
            {error && (
                <span className="txt-input__error" style={style}>
                    Error: не указан {name}
                </span>
            )}
        </div>
    );
};
