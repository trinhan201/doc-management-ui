import { useState, useEffect } from 'react';
import * as taskServices from '~/services/taskServices';

const useFetchTasks = () => {
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '', '', '', '', '', '', '');
            if (res.code === 200) {
                setAllTasks(res.allTasks);
            } else {
                console.log(res);
            }
        };
        fetchApi();
    }, []);
    return allTasks;
};

export default useFetchTasks;
