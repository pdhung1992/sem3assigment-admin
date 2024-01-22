import api from './api';


//both

const getProvinces = async () => {
    try {
        const url = '/api/provinces';
        const provinces = await api.get(url);
        return provinces.data;
    }catch (e) {
        return e.message;
    }
}

const getDistByProvince = async (id) => {
    try {
        const url = `/api/districts/p=${id}`;
        const districts = await api.get(url);
        return districts.data;
    }catch (e) {
        return e.message;
    }
}

const getPOByDist = async (id) => {
    try {
        const url = `/api/postoffices/bydist/${id}`;
        const pos = await api.get(url);
        return pos.data;
    }catch (e) {
        return e.message;
    }
}

const getPODetails = async (id) => {
    try {
        const url = `/api/postoffices/bydist/${id}`;
        const pos = await api.get(url);
        return pos.data;
    }catch (e) {
        return e.message;
    }
}




const addressService = {
    getProvinces,
    getDistByProvince,
    getPOByDist,
    getPODetails,
}

export default addressService;