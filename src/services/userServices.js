import httpRequest from '~/utils/httpRequest';

export const updateUser = async (userId, data = {}) => {
    try {
        const res = await httpRequest.put(`/user/update/${userId}`, data);
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
