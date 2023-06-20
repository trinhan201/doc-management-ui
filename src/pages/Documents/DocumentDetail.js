import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as documentServices from '~/services/documentServices';
import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { setLevelColor, setFileIcon } from '~/utils/setMultiConditions';

const DocumentDetail = ({ socket }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [document, setDocument] = useState({});
    const [percent, setPercent] = useState('');
    const [statusStyle, setStatusStyle] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = JSON.parse(localStorage.getItem('userRole'));

    const ref = useRef();

    const handleDeleteFile = async (fileName) => {
        const data = {
            filename: fileName,
        };
        const res = await documentServices.deleteFileUrl(id, data);
        if (res.code === 200) {
            ref.current.value = '';
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res.message);
        }
    };

    useEffect(() => {
        if (attachFiles.length === 0) return;
        const uploadFile = async () => {
            const data = new FormData();
            for (let i = 0; i < attachFiles.length; i++) {
                data.append('myFile', attachFiles[i]);
            }
            const res = await documentServices.uploadFile(id, data);
            if (res.code === 200) {
                setAttachFiles([]);
                ref.current.value = '';
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res.message);
            }
        };
        uploadFile();
    }, [attachFiles, id]);

    useEffect(() => {
        const setStatusPercentage = () => {
            if (document.status === 'Hoàn thành') {
                setPercent('100%');
                setStatusStyle('text-[1rem] md:text-[1.4rem] progress-bar full');
            } else if (document.status === 'Đang xử lý') {
                setPercent('60%');
                setStatusStyle('text-[1rem] md:text-[1.4rem] progress-bar percent60');
            } else {
                setPercent('30%');
                setStatusStyle('text-[1rem] md:text-[1.4rem] progress-bar percent30');
            }
        };
        setStatusPercentage();
    }, [document.status]);

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await documentServices.getDocumentById(id);
            setDocument(res.data);
        };
        fetchApi();
    }, [id, isSave]);

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

    return (
        <div className="bg-white p-[16px] mb-5 shadow-4Way">
            <h1 className="text-[2.2rem] font-bold">Chi tiết văn bản</h1>
            <div className="mt-12">
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Tên văn bản:</h3>
                    <p className="flex-1">{document?.documentName}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Loại văn bản:</h3>
                    <p className="flex-1">{document?.type}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Số ký hiệu:</h3>
                    <p className="flex-1">{document?.code}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Ngày ban hành:</h3>
                    <p className="flex-1">{new Date(document?.sendDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Nơi ban hành:</h3>
                    <p className="flex-1">{document?.sender}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Mức độ:</h3>
                    <div className="flex-1">
                        <p className={setLevelColor(document?.level)}>{document?.level}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Trạng thái:</h3>
                    <div className="flex-1 bg-gray-200 rounded-full mt-3">
                        <div className={statusStyle}>
                            <span>{percent}</span> <span>{document?.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Vị trí hiện tại:</h3>
                    <p className="flex-1">{document?.currentLocation}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">Trích yếu:</h3>
                    <p className="flex-1">{document?.note}</p>
                </div>
                <div className="flex flex-col md:flex-row my-5">
                    <h3 className="w-[180px] font-bold">File đính kèm:</h3>
                    <ul className="flex-1">
                        {document?.attachFiles?.map((item, index) => (
                            <li key={index} className="mb-2">
                                <div className="flex items-center w-fit">
                                    <div className="w-[24px] h-[24px] mr-3">{setFileIcon(item)}</div>
                                    <span className="flex-1">
                                        <a
                                            className="text-blue-600 text-[1.4rem]"
                                            href={item}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            {item.replace('http://localhost:8080/static/', '')}
                                        </a>
                                        <span
                                            onClick={() => handleDeleteFile(item)}
                                            className={
                                                userRole === 'Member'
                                                    ? 'hidden'
                                                    : 'inline-block align-middle text-[1.7rem] text-red-600 ml-3 cursor-pointer'
                                            }
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </span>
                                    </span>
                                </div>
                            </li>
                        ))}
                        <li className={userRole === 'Member' ? 'hidden' : ''}>
                            <label
                                className="text-center text-[1.4rem] leading-[1] font-bold text-blue-700 bg-transparent py-[6px] rounded-3xl cursor-pointer"
                                htmlFor="upload"
                            >
                                <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                            </label>
                            <input
                                id="upload"
                                className="absolute opacity-0 z-[-1] rounded-3xl"
                                type="file"
                                name="myFile"
                                onChange={(e) => setAttachFiles(e.target.files)}
                                multiple
                                ref={ref}
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <div
                onClick={() => navigate(-1)}
                className="block w-full md:w-fit text-center text-[white] bg-blue-600 mt-16 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] cursor-pointer"
            >
                {'<<'} Trở về
            </div>
        </div>
    );
};

export default DocumentDetail;
