import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TextInput } from "../../components/TextInput/TextInput";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/reducers";
import "./style/style.css";

const WIDTH = 800 - 2 * (5 + 3);

const encodeUrl = (url: string) => {
    let encoded = "";
    for (let i = 0; i < url.length; i++) {
        switch (url[i]) {
            case "/":
                encoded += "%2F";
                break;
            case ":":
                encoded += "%3A";
                break;
            default:
                encoded += url[i];
                break;
        }
    }
    return encoded;
};

export const PageSqueeze = () => {
    const [urlSrc, setUrlSrc] = useState("");
    const [urlSqueezed, setUrlSqueezed] = useState("");

    const auth = useAppSelector((state: RootState) => state.login);
    const logged = auth.access_token !== "";

    const navigate = useNavigate();

    useEffect(() => {
        !logged && navigate("/");
    });

    const changeUrlSrc = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUrlSrc(e.target.value);
    };

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        urlSrc: string,
        token_type: string,
        access_token: string,
    ) => {
        const urlEnc = encodeUrl(urlSrc);
        const tokenType = token_type[0].toUpperCase() + token_type.slice(1);

        fetch(`https://front-test.hex.team/api/squeeze?link=${urlEnc}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `${tokenType} ${access_token}`,
            },
        }).then((response) => {
            return response
                .json()
                .then((data) => {
                    console.log("data", data);
                    if (data.detail) {
                        console.log("ERROR", data.detail);
                    } else {
                        setUrlSqueezed(
                            `https://front-test.hex.team/s/${data.short}`,
                        );
                    }
                    return;
                })
                .catch((error) => {
                    console.log("ERROR", error);
                    return;
                });
        });
    };

    const handleClickSqueeze = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(urlSqueezed);
    };

    return (
        <>
            {logged && (
                <div className="page-squeeze">
                    <h1 className="page-squeeze__title">
                        Сервис сокращения ссылок
                    </h1>
                    <form name="squeeze" className="form-squeeze">
                        <TextInput
                            name="Исходная ссылка"
                            form="squeeze"
                            onChange={changeUrlSrc}
                            error={false}
                            value={urlSrc}
                            style={{
                                width: WIDTH + "px",
                            }}
                        />
                        <TextInput
                            name="Сокращенная ссылка"
                            form="squeeze"
                            onChange={() => {}}
                            error={false}
                            value={urlSqueezed}
                            readonly={true}
                            style={{
                                width: WIDTH + "px",
                            }}
                            onClick={handleClickSqueeze}
                            tooltip_text="Нажмите для копирования ссылки"
                        />
                        <button
                            className="form-squeeze__submit"
                            type="submit"
                            form="squeeze"
                            onClick={(e) =>
                                handleClick(
                                    e,
                                    urlSrc,
                                    auth.token_type,
                                    auth.access_token,
                                )
                            }
                        >
                            Сократить
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
