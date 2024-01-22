import api from './api';
import axios from "axios";


const getBills = async (axiosConfig) => {
    try {
        const url = `/bill`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const getBillDetails = async (bn, axiosConfig) => {
    try {
        const url = `bill/detail/${bn}`;
        const bill = await api.get(url, axiosConfig);
        return bill.data;
    }catch (e) {
        return e.message;
    }
}

const rcvFromShipper =async (axiosConfig) => {
    try {
        const url = '/bill/receive/shipper';
        const rcvbills = await api.get(url, axiosConfig);
        return rcvbills.data;
    }catch (e) {
        return e.message;
    }
}

const rcvFromPostman = async (axiosConfig) => {
    try {
        const url = '/bill/receive/postman';
        const rcvbills = await api.get(url, axiosConfig);
        return rcvbills.data;
    }catch (e) {
        return e.message;
    }
}

const dispatchShipment = async (axiosConfig) => {
    try {
        const url = '/bill/dispatch';
        const dispatch = await api.get(url, axiosConfig);
        return dispatch.data;
    }catch (e) {
        return e.message;
    }
}

const receiveFromTransport = async (axiosConfig) => {
    try {
        const url = '/bill/receive/transport';
        const rcv = await api.get(url, axiosConfig);
        return rcv.data;
    }catch (e) {
        return e.message;
    }
}

const receiveFromPostOffice = async (axiosConfig) => {
    try {
        const url = '/bill/receive/postoffice';
        const rcv = await api.get(url, axiosConfig);
        return rcv.data;
    }catch (e) {
        return e.message;
    }
}

const deliveryToCnee = async (axiosConfig) => {
    try {
        const url = '/bill/delivery';
        const dlv = await api.get(url, axiosConfig);
        return dlv.data;
    }catch (e) {
        return e.message;
    }
}


const billService = {
    getBills,
    getBillDetails,
    rcvFromShipper,
    rcvFromPostman,
    dispatchShipment,
    receiveFromTransport,
    receiveFromPostOffice,
    deliveryToCnee
}

export default billService;