import httpRequest from '~/utils/httpRequest';

export const createNotification = async (data) => {
    try {
        const res = await httpRequest.post('/notification/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const getAllNotification = async () => {
    try {
        const res = await httpRequest.get('/notification/get-all');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const changeNotificationStatus = async (notificationId) => {
    try {
        const res = await httpRequest.patch(`/notification/change-status/${notificationId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
