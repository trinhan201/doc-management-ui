import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import * as taskServices from '~/services/taskServices';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import ExportExcel from '~/components/ExportFile/Task/ExportExcel';
import ExportWord from '~/components/ExportFile/Task/ExportWord';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';

const TaskStatistics = ({ socket }) => {
    const [exportType, setExportType] = useState('Excel(.xlsx)');
    const [preview, setPreview] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [statisticTasks, setStatisticTasks] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [fType, setFType] = useState('');
    const [fProgress, setFProgress] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fLevel, setFLevel] = useState('');
    const [fFrom, setFFrom] = useState('');
    const [fTo, setFTo] = useState('');

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const progressOptions = ['Đang xử lý', 'Chờ duyệt', 'Hoàn thành'];
    const statusOptions = ['Còn hạn', 'Sắp đến hạn', 'Quá hạn'];
    const typeOptions = ['Báo cáo', 'Tham luận', 'Kế hoạch'];
    const exportOptions = ['Excel(.xlsx)', 'Word(.docx)'];

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '', '', '', '', '', '');
            if (res.code === 200) {
                setAllTasks(res.allTasks);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, [isSave]);

    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            autoUpdateDeadline(allTasks, socket, setIsSave);
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, [allTasks, socket]);

    const handleStatistic = async () => {
        if (fProgress || fType || fStatus || fLevel || (fFrom && fTo)) {
            const res = await taskServices.getAllTask(1, 1, '', '', '', fType || '', fStatus || '', fLevel || '');
            if (res.code === 200) {
                let finalData;
                if (fFrom && fTo) {
                    finalData = res?.allTasks?.filter((item) => {
                        return (
                            new Date(new Date(item.createdAt).toLocaleDateString()).getTime() <=
                                new Date(fTo).getTime() &&
                            new Date(new Date(item.createdAt).toLocaleDateString()).getTime() >=
                                new Date(fFrom).getTime()
                        );
                    });
                    setStatisticTasks(finalData);
                } else {
                    setStatisticTasks(res.allTasks);
                }
                setPreview(true);
                successNotify('Thống kê thành công');
            } else {
                console.log(res.message);
            }
        } else {
            errorNotify('Hãy chọn ít nhất 1 trường');
        }
    };

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Thống kê công việc</h1>
                    <button
                        onClick={handleStatistic}
                        className="text-[1.3rem] w-fit md:text-[1.6rem] text-[white] bg-blue-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faChartColumn} /> Thống kê
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Tiến trình:</label>
                        <DropList
                            selectedValue={fProgress}
                            options={progressOptions}
                            setValue={setFProgress}
                            setId={() => undefined}
                        />
                    </div>

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
                <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Loại công việc:</label>
                        <DropList
                            selectedValue={fType}
                            options={typeOptions}
                            setValue={setFType}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trạng thái:</label>
                        <DropList
                            selectedValue={fStatus}
                            options={statusOptions}
                            setValue={setFStatus}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Mức độ:</label>
                        <DropList
                            selectedValue={fLevel}
                            options={levelOptions}
                            setValue={setFLevel}
                            setId={() => undefined}
                        />
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
                        <ExportExcel
                            allTasks={statisticTasks}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fProgress={fProgress}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    ) : (
                        <ExportWord
                            allTasks={statisticTasks}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fProgress={fProgress}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskStatistics;
