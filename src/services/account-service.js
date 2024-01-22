import api from './api';
import axios from "axios";


const getAllAccounts = async (axiosConfig) => {
    try {
        const url = 'emp';
        const res = await api.get(url, axiosConfig);
        return res.data;
    }
    catch (error){
        return error.message;
    }
}

const accDetails = async (id, axiosConfig) => {
    try {
        const url = `emp/detail/${id}`;
        const details = await api.get(url, axiosConfig);
        return details.data;
    }catch (e) {
        return e.message;
    }
}

const getRoles = async (axiosConfig) => {
    try {
        const url = 'emp/roles';
        const roles = await api.get(url, axiosConfig);
        return roles.data;
    }catch (e){
        return e.message;
    }

}

const createAccount = async (formData, axiosConfig) => {
    try {
        const url = 'emp/create';
        const res = await api.post(url, formData, axiosConfig);
        return res.data;
    }
    catch (e){
        return e.message;
    }
}

const updateAcc = async (id, formData, axiosConfig) => {
    try {
        const url = `emp/update/${id}`;
        const res = await api.put(url, formData, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const deleteAccount = async (id, axiosConfig) => {
    try {
        const url = `emp/delete/${id}`;
        const res = await api.delete(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const changePassword = async (formData, axiosConfig) => {
    try {
        const url = 'emp/changepassword';
        const res = await api.post(url, formData, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const accountServices = {
    getAllAccounts,
    accDetails,
    getRoles,
    createAccount,
    updateAcc,
    deleteAccount,
    changePassword
}

export default accountServices;