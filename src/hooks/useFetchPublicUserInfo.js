import { useState, useEffect } from 'react';
import * as userServices from '~/services/userServices';

const useFetchPublicUserInfo = () => {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            if (res.code === 200) {
                setAllUsers(res.data);
            } else {
                console.log(res);
            }
        };
        fetchApi();
    }, []);

    return allUsers;
};

export default useFetchPublicUserInfo;
