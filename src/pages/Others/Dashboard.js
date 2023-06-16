import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookmark, faCircleArrowRight, faListCheck, faUsers } from '@fortawesome/free-solid-svg-icons';
import BarChart from '~/components/Chart/BarChart';
import PieChart from '~/components/Chart/PieChart';
import Select from 'react-select';
import * as userServices from '~/services/userServices';
import * as documentServices from '~/services/documentServices';
import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';

const Dashboard = ({ socket }) => {
    const [isSave, setIsSave] = useState(false);
    const [role, setRole] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [allDocumentIns, setAllDocumentIns] = useState([]);
    const [allDocumentOuts, setAllDocumentOuts] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [barOption, setBarOption] = useState({
        label: 'Theo loại',
        value: 'type',
    });
    const [pieOption, setPieOption] = useState({
        label: 'Theo loại',
        value: 'type',
    });

    const barOptions = [
        {
            label: 'Theo loại',
            value: 'type',
        },
        {
            label: 'Theo nơi ban hành',
            value: 'sender',
        },
        {
            label: 'Theo trạng thái',
            value: 'status',
        },
        {
            label: 'Theo mức độ',
            value: 'level',
        },
        {
            label: 'Theo vị trí hiện tại',
            value: 'currentLocation',
        },
    ];

    const pieOptions = [
        {
            label: 'Theo loại',
            value: 'type',
        },
        {
            label: 'Theo tiến trình',
            value: 'progress',
        },
        {
            label: 'Theo trạng thái',
            value: 'status',
        },
        {
            label: 'Theo mức độ',
            value: 'level',
        },
    ];

    console.log(role);

    useEffect(() => {
        const userRole = JSON.parse(localStorage.getItem('userRole'));
        setRole(userRole);
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getAllUser(1, 1, '');
            if (res.code === 200) {
                setAllUsers(res.allUsers);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, '', '', '', '', '', '', '');
            if (res.code === 200) {
                setAllDocuments(res.allDocuments);
                setAllDocumentIns(res.allDocumentIn);
                setAllDocumentOuts(res.allDocumentOut);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '');
            if (res.code === 200) {
                setAllTasks(res.allTasks);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, [isSave]);

    const getAssignToIds = (arr) => {
        const final = arr.map((item) => item.value);
        return final;
    };

    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            allTasks?.map(async (item) => {
                const currDate = new Date();
                const startDate = new Date(item?.createdAt);
                const endDate = new Date(item?.dueDate);
                const allDateToDo = endDate.getTime() - startDate.getTime();
                const datesWerePassed = currDate.getTime() - startDate.getTime();
                if (currDate.getTime() <= endDate.getTime()) {
                    if (datesWerePassed >= (allDateToDo / 3) * 2) {
                        if (item?.status === 'Sắp đến hạn') return;
                        await taskServices.updateStatus(item?._id, { status: 'Sắp đến hạn' });
                        setIsSave((isSave) => !isSave);

                        const newNotiId = await Promise.all(
                            getAssignToIds(item?.assignTo)?.map(async (userId) => {
                                const noti = await notificationServices.createNotification({
                                    notification: `Nhiệm vụ ${item.taskName} sắp đến hạn`,
                                    userId: userId,
                                    linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                                });
                                return { notiId: noti.data._id, userId: noti.data.userId };
                            }),
                        );
                        socket.current?.emit('sendNotification', {
                            senderId: '',
                            _id: newNotiId,
                            receiverId: getAssignToIds(item?.assignTo),
                            text: `Nhiệm vụ ${item?.taskName} sắp đến hạn`,
                            linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                            isRead: false,
                        });
                    } else {
                        await taskServices.updateStatus(item?._id, { status: 'Còn hạn' });
                        setIsSave((isSave) => !isSave);
                    }
                } else {
                    if (item?.status === 'Quá hạn') return;
                    await taskServices.updateStatus(item?._id, { status: 'Quá hạn' });
                    setIsSave((isSave) => !isSave);

                    const newNotiId = await Promise.all(
                        getAssignToIds(item?.assignTo)?.map(async (userId) => {
                            const noti = await notificationServices.createNotification({
                                notification: `Nhiệm vụ ${item.taskName} đã quá hạn`,
                                userId: userId,
                                linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                            });
                            return { notiId: noti.data._id, userId: noti.data.userId };
                        }),
                    );
                    socket.current?.emit('sendNotification', {
                        senderId: '',
                        _id: newNotiId,
                        receiverId: getAssignToIds(item?.assignTo),
                        text: `Nhiệm vụ ${item?.taskName} đã quá hạn`,
                        linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                        isRead: false,
                    });
                }
            });
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, [allTasks, socket]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="text-white bg-[#2417ab] rounded-lg">
                    <div className="flex items-center justify-between p-[18px]">
                        <div>
                            <p className="font-bold text-[3rem]">{allUsers?.length}</p>
                            <p className="text-[1.4rem]">Người dùng</p>
                        </div>
                        <div className="text-[5.6rem] text-[#000000]/[0.3]">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </div>
                    <NavLink
                        to="/users"
                        className="block text-[1.4rem] text-center bg-[#000000]/[0.3] py-1 cursor-pointer"
                    >
                        Xem chi tiết <FontAwesomeIcon icon={faCircleArrowRight} />
                    </NavLink>
                </div>
                <div className="text-white bg-[#2f8fe9] rounded-lg">
                    <div className="flex items-center justify-between p-[18px]">
                        <div>
                            <p className="font-bold text-[3rem]">{allDocumentIns?.length}</p>
                            <p className="text-[1.4rem]">Văn bản đến</p>
                        </div>
                        <div className="text-[5.6rem] text-[#000000]/[0.3]">
                            <FontAwesomeIcon icon={faBook} />
                        </div>
                    </div>
                    <NavLink
                        to="/documents/documents-in"
                        className="block text-[1.4rem] text-center bg-[#000000]/[0.3] py-1 cursor-pointer"
                    >
                        Xem chi tiết <FontAwesomeIcon icon={faCircleArrowRight} />
                    </NavLink>
                </div>
                <div className="text-white bg-[#f7a10f] rounded-lg">
                    <div className="flex items-center justify-between p-[18px]">
                        <div>
                            <p className="font-bold text-[3rem]">{allDocumentOuts?.length}</p>
                            <p className="text-[1.4rem]">Văn bản đi</p>
                        </div>
                        <div className="text-[5.6rem] text-[#000000]/[0.3]">
                            <FontAwesomeIcon icon={faBookmark} />
                        </div>
                    </div>
                    <NavLink
                        to="/documents/documents-out"
                        className="block text-[1.4rem] text-center bg-[#000000]/[0.3] py-1 cursor-pointer"
                    >
                        Xem chi tiết <FontAwesomeIcon icon={faCircleArrowRight} />
                    </NavLink>
                </div>
                <div className="text-white bg-[#df4545] rounded-lg">
                    <div className="flex items-center justify-between p-[18px]">
                        <div>
                            <p className="font-bold text-[3rem]">{allTasks?.length}</p>
                            <p className="text-[1.4rem]">Công việc</p>
                        </div>
                        <div className="text-[5.6rem] text-[#000000]/[0.3]">
                            <FontAwesomeIcon icon={faListCheck} />
                        </div>
                    </div>
                    <NavLink
                        to="/tasks"
                        className="block text-[1.4rem] text-center bg-[#000000]/[0.3] py-1 cursor-pointer"
                    >
                        Xem chi tiết <FontAwesomeIcon icon={faCircleArrowRight} />
                    </NavLink>
                </div>
            </div>
            <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600 mt-6">
                <div className="w-[50%]">
                    <Select options={barOptions} onChange={setBarOption} value={barOption} />
                </div>
                <BarChart
                    typeOption={barOption}
                    allDocuments={allDocuments}
                    allDocumentIns={allDocumentIns}
                    allDocumentOuts={allDocumentOuts}
                />
            </div>
            <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-red-600 mt-6">
                <div className="w-[50%]">
                    <Select options={pieOptions} onChange={setPieOption} value={pieOption} />
                </div>
                <PieChart typeOption={pieOption} allTasks={allTasks} />
            </div>
        </>
    );
};

export default Dashboard;
