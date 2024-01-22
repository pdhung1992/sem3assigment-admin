import {CLEAR_MESSAGE, SET_MESSAGE} from "./typeActions";


export const setMessage = (message) => ({
    type: SET_MESSAGE,
    payload: message,
});

export const clearMessage = () => ({
    type: CLEAR_MESSAGE,
});