import api from './api';

const createStatus = async (formData, axiosConfig) => {
    const url = '/status/create';
    const res = await api.post(url, formData, axiosConfig);
    return res.data;
}

const statusServices = {
    createStatus
}

export default statusServices;