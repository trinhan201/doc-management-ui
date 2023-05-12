import httpRequest from '~/utils/httpRequest';

export const createDocumentType = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document-type/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const updateDocumentType = async (documentTypeId, data = {}) => {
    try {
        const res = await httpRequest.put(`/document-type/update/${documentTypeId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const activateDocumentType = async (documentTypeId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/document-type/activate/${documentTypeId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteDocumentTypeById = async (documentTypeId) => {
    try {
        const res = await httpRequest.delete(`/document-type/delete/${documentTypeId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const deleteManyDocumentType = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document-type/delete-many', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getAllDocumentType = async (page, limit, search) => {
    try {
        const res = await httpRequest.get(`/document-type/get-all?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getDocumentTypeById = async (documentTypeId) => {
    try {
        const res = await httpRequest.get(`/document-type/get/${documentTypeId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
