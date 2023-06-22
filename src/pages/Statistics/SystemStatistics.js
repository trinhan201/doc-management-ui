import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import * as departmentServices from '~/services/departmentServices';
import * as documentServices from '~/services/documentServices';
import * as userServices from '~/services/userServices';
import ExportExcel from '~/components/ExportFile/System/ExportExcel';
import ExportWord from '~/components/ExportFile/System/ExportWord';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks } from '~/hooks';

const SystemStatistics = ({ socket }) => {
    const [isSave, setIsSave] = useState(false);
    const [exportType, setExportType] = useState('Excel(.xlsx)');
    const [preview, setPreview] = useState(false);
    // List data function
    const [allDocumentIns, setAllDocumentIns] = useState([]);
    const [allDocumentOuts, setAllDocumentOuts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [filterData, setFilterData] = useState([]);
    // Filter statistic state
    const [fFrom, setFFrom] = useState('');
    const [fTo, setFTo] = useState('');

    const allTasks = useFetchTasks({ isSave });
    const exportOptions = ['Excel(.xlsx)', 'Word(.docx)'];

    // Statistic function
    const handleStatistic = async () => {
        if (!(fFrom && fTo)) return errorNotify('Hãy chọn khoảng thời gian cần thốn kê');
        const finalData = allDepartments?.map((d) => {
            const user = allUsers
                ?.filter((item) => item.department === d)
                .filter(
                    (item) =>
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() <= new Date(fTo).getTime() &&
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() >= new Date(fFrom).getTime(),
                ).length;
            const documentIn = allDocumentIns
                ?.filter((item) => item.currentLocation === d)
                .filter(
                    (item) =>
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() <= new Date(fTo).getTime() &&
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() >= new Date(fFrom).getTime(),
                ).length;
            const documentOut = allDocumentOuts
                ?.filter((item) => item.currentLocation === d)
                .filter(
                    (item) =>
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() <= new Date(fTo).getTime() &&
                        new Date(new Date(item.createdAt).toLocaleDateString()).getTime() >= new Date(fFrom).getTime(),
                ).length;
            return {
                department: d,
                allUsers: user,
                allDocumentIns: documentIn,
                allDocumentOuts: documentOut,
            };
        });
        setFilterData(finalData);
        successNotify('Thống kê thành công');
        setPreview(true);
    };

    // Get all departments from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await departmentServices.getAllDepartment(1, 1, '');
            const departmentArray = res.allDepartments?.map((item) => item.departmentName);
            setAllDepartments(departmentArray);
        };
        fetchApi();
    }, []);

    // Get all users from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getAllUser(1, 1, '');
            setAllUsers(res.allUsers);
        };
        fetchApi();
    }, []);

    // Get all documents from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, '', '', '', '', '', '', '');
            if (res.code === 200) {
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
            <div className="bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Thống kê hệ thống</h1>
                    <button
                        onClick={handleStatistic}
                        className="text-[1.3rem] w-fit md:text-[1.6rem] text-[white] bg-blue-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faChartColumn} /> Thống kê
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="block md:flex items-center gap-1 flex-1">
                        <div className="flex items-center flex-1 gap-1">
                            <div className="flex-1">
                                <label className="text-[1.4rem]">Từ ngày:</label>
                                <InputField
                                    name="date"
                                    className="default leading-[1.3]"
                                    value={fFrom}
                                    setValue={setFFrom}
                                />
                            </div>
                            <span className="mt-10">-</span>
                        </div>
                        <div className="flex-1 mt-5 md:mt-0">
                            <label className="text-[1.4rem]">Đến ngày:</label>
                            <InputField name="date" className="default leading-[1.3]" value={fTo} setValue={setFTo} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={preview ? 'bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600' : 'hidden'}>
                <div className="flex items-center gap-5 w-full md:w-[50%]">
                    <DropList
                        selectedValue={exportType}
                        options={exportOptions}
                        setValue={setExportType}
                        setId={() => undefined}
                    />
                    {exportType === 'Excel(.xlsx)' ? (
                        <ExportExcel filterData={filterData} fFrom={fFrom} fTo={fTo} />
                    ) : (
                        <ExportWord filterData={filterData} fFrom={fFrom} fTo={fTo} />
                    )}
                </div>
            </div>
        </>
    );
};

export default SystemStatistics;
