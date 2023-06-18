import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as documentServices from '~/services/documentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';
import ExportExcel from '~/components/ExportFile/Document/ExportExcel';
import ExportWord from '~/components/ExportFile/Document/ExportWord';
import { errorNotify, successNotify } from '~/components/ToastMessage';

const DocumentStatistics = ({ socket }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [exportType, setExportType] = useState('Excel(.xlsx)');
    const [preview, setPreview] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [flag, setFlag] = useState();
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fLevel, setFLevel] = useState('');
    const [fFrom, setFFrom] = useState('');
    const [fTo, setFTo] = useState('');

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const exportOptions = ['Excel(.xlsx)', 'Word(.docx)'];
    const flagOptions = [
        { label: 'Tất cả', value: '' },
        { label: 'Văn bản đến', value: true },
        { label: 'Văn bản đi', value: false },
    ];

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType(1, 1, '');
            const documentTypeArray = res.allDocumentTypes
                ?.filter((item) => item.status !== false)
                .map((item) => item.documentTypeName);
            setDocumentTypes(documentTypeArray);
        };
        fetchApi();
    }, []);

    const handleStatistic = async () => {
        if (flag || fType || fStatus || fLevel || (fFrom && fTo)) {
            const res = await documentServices.getAllDocument(
                1,
                1,
                flag?.value || '',
                '',
                '',
                fType || '',
                fStatus || '',
                fLevel || '',
                '',
            );
            if (res.code === 200) {
                if (fFrom && fTo) {
                    const finalData = res?.allDocuments?.filter((d) => {
                        return (
                            new Date(d.sendDate).getTime() <= new Date(fTo).getTime() &&
                            new Date(d.sendDate).getTime() >= new Date(fFrom).getTime()
                        );
                    });
                    setAllDocuments(finalData);
                } else {
                    setAllDocuments(res.allDocuments);
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

    console.log(allDocuments);

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way border-t-[3px] border-blue-600">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Thống kê văn bản</h1>
                    <button
                        onClick={handleStatistic}
                        className="text-[1.3rem] w-fit md:text-[1.6rem] text-[white] bg-blue-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faChartColumn} /> Thống kê
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Sổ văn bản:</label>
                        <Select placeholder="--Vui lòng chọn--" options={flagOptions} onChange={setFlag} value={flag} />
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
                        <label className="text-[1.4rem]">Loại văn bản:</label>
                        <DropList
                            selectedValue={fType}
                            options={documentTypes}
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
                            allDocuments={allDocuments}
                            flag={flag?.label}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    ) : (
                        <ExportWord
                            allDocuments={allDocuments}
                            flag={flag?.label}
                            fType={fType}
                            fStatus={fStatus}
                            fLevel={fLevel}
                            fFrom={fFrom}
                            fTo={fTo}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default DocumentStatistics;
