import {be} from "constants/backendSetup";
import {getCORSHeaders} from "utils/fetchTools";



const logoutUser = async(token) => {
    let url = `${be.LOGOUT}`;
    let res = await fetch(url, {
        method: "GET",
        headers: getCORSHeaders(token)
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        throw await res.json();
    }
};


export const handleLogout = async (e, token) => {
        e.preventDefault();
        try {
            const {message} = await logoutUser(token);
            return message;
        } catch(e) {
            console.log(e);
        }
    }

