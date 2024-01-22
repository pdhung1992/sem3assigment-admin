
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from "../actions/typeActions";

const initialState = {
    isLoggedIn : false,
    empData : null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case LOGIN_SUCCESS:
            return{
                ...state,
                isLoggedIn: true,
                empData: action.payload.empData
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                empData: null
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                empData: null
            }
        default:
            return state;
    }
}

export default authReducer;