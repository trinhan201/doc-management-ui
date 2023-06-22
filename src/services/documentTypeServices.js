import httpRequest from '~/utils/httpRequest';

// Create document type function
export const createDocumentType = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document-type/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Update document type function
export const updateDocumentType = async (documentTypeId, data = {}) => {
    try {
        const res = await httpRequest.put(`/document-type/update/${documentTypeId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Activate document type function
export const activateDocumentType = async (documentTypeId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/document-type/activate/${documentTypeId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete document type function
export const deleteDocumentTypeById = async (documentTypeId) => {
    try {
        const res = await httpRequest.delete(`/document-type/delete/${documentTypeId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete many document type function
export const deleteManyDocumentType = async (data = {}) => {
    try {
        const res = await httpRequest.post('/document-type/delete-many', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get all document types function
export const getAllDocumentType = async (page, limit, search) => {
    try {
        const res = await httpRequest.get(`/document-type/get-all?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get document type by id function
export const getDocumentTypeById = async (documentTypeId) => {
    try {
        const res = await httpRequest.get(`/document-type/get/${documentTypeId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
