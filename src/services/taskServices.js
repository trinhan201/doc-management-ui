import httpRequest from '~/utils/httpRequest';

export const createTask = async (data = {}) => {
    try {
        const res = await httpRequest.post('/task/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const uploadFile = async (taskId, data) => {
    try {
        const res = await httpRequest.post(`/task/upload/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteFileUrl = async (taskId, data) => {
    try {
        const res = await httpRequest.patch(`/task/delete-file-url/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const updateTask = async (taskId, data = {}) => {
    try {
        const res = await httpRequest.put(`/task/update/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteTaskById = async (taskId) => {
    try {
        const res = await httpRequest.delete(`/task/delete/${taskId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteManyTask = async (data = {}) => {
    try {
        const res = await httpRequest.post('/task/delete-many', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getAllTask = async (page, limit) => {
    try {
        const res = await httpRequest.get(`/task/get-all?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getTaskById = async (taskId) => {
    try {
        const res = await httpRequest.get(`/task/get/${taskId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};