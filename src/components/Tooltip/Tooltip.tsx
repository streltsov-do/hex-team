import { CSSProperties, ReactElement, useState } from "react";
import "./style/style.css";

type PropsType = {
    children: React.ReactNode;
    text: string;
    style?: CSSProperties;
    style_child?: CSSProperties;
};

export const Tooltip = (props: PropsType) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { children, text, style } = props;

    const handleEnter = () => {
        setShowTooltip(true);
    };

    const handleLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div
            className="tooltip"
            style={style}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {children}
            {showTooltip && <div className="tooltip__block">{text}</div>}
        </div>
    );
};
