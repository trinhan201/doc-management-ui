import httpRequest from '~/utils/httpRequest';

export const createUser = async (data = {}) => {
    try {
        const res = await httpRequest.post('/user/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const updateUser = async (userId, data = {}) => {
    try {
        const res = await httpRequest.put(`/user/update/${userId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const updateRole = async (userId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/user/update-role/${userId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// export const deactivateUser = async (userId) => {
//     try {
//         const res = await httpRequest.patch(`/user/deactivate/${userId}`);
//         return res.data;
//     } catch (error) {
//         console.log(error);
//         return error.response.data.message;
//     }
// };

export const activateUser = async (userId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/user/activate/${userId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getAllUser = async () => {
    try {
        const res = await httpRequest.get('/user/get-all');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getUserById = async (userId) => {
    try {
        const res = await httpRequest.get(`/user/get/${userId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
