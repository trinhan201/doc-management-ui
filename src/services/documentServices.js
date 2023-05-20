import httpRequest from '~/utils/httpRequest';

export const createDocument = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const uploadFile = async (documentId, data) => {
    try {
        const res = await httpRequest.post(`/document/upload/${documentId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteFileUrl = async (documentId, data) => {
    try {
        const res = await httpRequest.patch(`/document/delete-file-url/${documentId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const updateDocument = async (documentId, data = {}) => {
    try {
        const res = await httpRequest.put(`/document/update/${documentId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const changeDocumentStatus = async (documentId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/document/change-status/${documentId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const changeDocumentLocation = async (documentId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/document/change-location/${documentId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteDocumentById = async (documentId) => {
    try {
        const res = await httpRequest.delete(`/document/delete/${documentId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteManyDocument = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document/delete-many', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getAllDocument = async (page, limit, flag, fName, fCode, fType, fStatus, fLevel, fSendDate) => {
    try {
        const res = await httpRequest.get(
            `/document/get-all?page=${page}&limit=${limit}&documentIn=${flag}&documentName=${fName}&code=${fCode}&type=${fType}&status=${fStatus}&level=${fLevel}&sendDate=${fSendDate}`,
        );
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getDocumentById = async (documentId) => {
    try {
        const res = await httpRequest.get(`/document/get/${documentId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
