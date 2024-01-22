import api from './api';

const login = async (username, password) => {
    try {
        const url = '/emp/login';
        const res = await api.post(url, {username, password});
        return res.data;
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const logout = () => {
    sessionStorage.removeItem('emp');
}

const empService = {
    login,
    logout
}

export default empService;
