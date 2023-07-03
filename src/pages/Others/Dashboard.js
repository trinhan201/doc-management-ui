import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookmark, faListCheck, faUsers } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import BarChart from '~/components/Chart/BarChart';
import PieChart from '~/components/Chart/PieChart';
import * as userServices from '~/services/userServices';
import * as documentServices from '~/services/documentServices';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks } from '~/hooks';

const Dashboard = ({ socket }) => {
    const [isSave, setIsSave] = useState(false);
    // List data state
    const [allUsers, setAllUsers] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [allDocumentIns, setAllDocumentIns] = useState([]);
    const [allDocumentOuts, setAllDocumentOuts] = useState([]);
    // Chart option state
    const [barOption, setBarOption] = useState({
        label: 'Theo loại',
        value: 'type',
    });
    const [pieOption, setPieOption] = useState({
        label: 'Theo loại',
        value: 'type',
    });

    const allTasks = useFetchTasks({ isSave });
    // Filter options in bar chart
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
    // Filter options in pie chart
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

    // Get all users from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            if (res.code === 200) {
                setAllUsers(res.data);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, []);

    // Get all documents from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, '', '', '', '', '', '', '', '');
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

    // Check tasks deadline function
    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            autoUpdateDeadline(allTasks, socket, setIsSave);
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
