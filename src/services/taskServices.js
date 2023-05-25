import httpRequest from '~/utils/httpRequest';

export const getAllTask = async () => {
    try {
        const res = await httpRequest.get(`/task/get-all`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
