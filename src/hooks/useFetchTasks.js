import { useState, useEffect } from 'react';
import * as taskServices from '~/services/taskServices';

const useFetchTasks = ({ isSave }) => {
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '', '', '', '', '', '', '');
            if (res.code === 200) {
                setAllTasks(res.allTasks);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, [isSave]);
    return allTasks;
};

export default useFetchTasks;
