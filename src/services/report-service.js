
import api from './api';

const inboundReport = async (startDate, endDate, axiosConfig) => {
    try {
        const url = `/report/inbound?startDate=${startDate}&endDate=${endDate}`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const outboundReport = async (startDate, endDate, axiosConfig) => {
    try {
        const url = `report/outbound?startDate=${startDate}&endDate=${endDate}`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const revenueReport = async (startDate, endDate, axiosConfig) => {
    try {
        const url = `report/revenue?startDate=${startDate}&endDate=${endDate}`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}


const reportServices = {
    inboundReport,
    outboundReport,
    revenueReport
}

export default reportServices;