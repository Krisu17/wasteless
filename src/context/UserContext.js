import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import {userTypes} from "../constants/userTypes";

const aesjs = require('aes-js');

const cookies = new Cookies();

export const UserContext = React.createContext({
    token: undefined,
    data: undefined,
    type: undefined,
    login: () => {},
    logout: () => {}
});

const encryptCookie = (data) => {
    try {
        const stringKey = process.env.REACT_APP_COOKIE_ENCRYPTION_KEY;
        let key = stringKey.split('').map((item) => item.charCodeAt(0));
        let dataBytes = aesjs.utils.utf8.toBytes( JSON.stringify(data) );
        let encryptedBytes = (new aesjs.ModeOfOperation.ctr(new Uint8Array(key), new aesjs.Counter(5))).encrypt(dataBytes);
        return aesjs.utils.hex.fromBytes(encryptedBytes);
    } catch(e) {
        alert("There was a problem configuring cookies. Your cookies will NOT be fully secure!");
        return data;
    }
};

const decryptCookie = (enc) => {
    if (enc) {
        try {
            const stringKey = process.env.REACT_APP_COOKIE_ENCRYPTION_KEY;
            let key = stringKey.split('');
            key = key.map((item) => item.charCodeAt(0));
            let encryptedBytes = aesjs.utils.hex.toBytes(enc);
            let decryptedBytes = (new aesjs.ModeOfOperation.ctr(new Uint8Array(key), new aesjs.Counter(5))).decrypt(encryptedBytes);
            return JSON.parse( aesjs.utils.utf8.fromBytes(decryptedBytes) );
        } catch(e) {
            alert("Could not properly read cookie, therefore you cannot log in. Please contact application administrator.");
            return undefined;
        }
    } else {
        return undefined;
    }
};

export const UserProvider = (props) => {
    const [token, setToken] = useState(
        decryptCookie(cookies.get("token"))
    );
    const [data, setData] = useState(decryptCookie(cookies.get("data")));
    const [type, setType] = useState(cookies.get("type"));

    const user = {
        token,
        data,
        type,
        login: (newToken, newData, newType = userTypes.COMMON) => {
            cookies.set('token', encryptCookie(newToken), {
                path: "/",
                //secure: process.env.REACT_APP_SECURE_COOKIES !== "v3rystr0ngblock@dea1mostimpossiBlet0bR3@ch0mg",
                //httpOnly: process.env.REACT_APP_SECURE_COOKIES !== "v3rystr0ngblock@dea1mostimpossiBlet0bR3@ch0mg",
            });
            setToken(newToken);
            cookies.set('data', encryptCookie(newData), {
                path: "/",
                //secure: process.env.REACT_APP_SECURE_COOKIES !== "v3rystr0ngblock@dea1mostimpossiBlet0bR3@ch0mg",
                //httpOnly: process.env.REACT_APP_SECURE_COOKIES !== "v3rystr0ngblock@dea1mostimpossiBlet0bR3@ch0mg",
            });
            setData(newData);
            cookies.set('type', newType, {
                path: "/",
                //secure: process.env.REACT_APP_SECURE_COOKIES !== "verystrongblockadealmostimpossibletobreachomg",
                //httpOnly: process.env.REACT_APP_SECURE_COOKIES !== "verystrongblockadealmostimpossibletobreachomg",
            });
            setType(newType);
        },
        logout: () => {
            cookies.remove("token", {path: "/"});
            cookies.remove("type", {path: "/"});
            cookies.remove("data", {path: "/"});
            setType(undefined);
            setToken(undefined);
            setData(undefined);
        }
    }

    return <UserContext.Provider value={user} {...props} />
};