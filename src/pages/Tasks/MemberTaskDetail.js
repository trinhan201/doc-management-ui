import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faFileExcel,
    faFilePowerpoint,
    faFileWord,
    faFilePdf,
    faFile,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import CommentItem from '~/components/CommentItem';
import InputField from '~/components/InputField';
import * as taskServices from '~/services/taskServices';
import * as documentServices from '~/services/documentServices';
import * as userServices from '~/services/userServices';
import * as notificationServices from '~/services/notificationServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const MemberTaskDetail = ({ socket }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [tab, setTab] = useState('detail');
    const [allUsers, setAllUsers] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [task, setTask] = useState({});
    const [attachFiles, setAttachFiles] = useState([]);
    const [displayFile, setDisplayFile] = useState([]);
    const [finalList, setFinalList] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const navigate = useNavigate();
    const ref = useRef();
    const userId = JSON.parse(localStorage.getItem('userId'));
    const { id } = useParams();

    const onUpdateTab = (value) => {
        setTab(value);
    };

    const setLevelColor = (level) => {
        if (level === 'Ưu tiên') {
            return 'inline-block align-text-top w-fit level priority';
        } else if (level === 'Khẩn cấp') {
            return 'inline-block align-text-top w-fit level emergency';
        } else {
            return 'inline-block align-text-top w-fit level normal';
        }
    };

    const setStatusColor = (status) => {
        if (status === 'Sắp đến hạn') {
            return 'w-fit ml-2 status warning';
        } else if (status === 'Quá hạn') {
            return 'w-fit ml-2 status emergency';
        } else {
            return 'w-fit ml-2 status normal';
        }
    };

    const setSubmitTextColor = (status) => {
        if (status === 'Trễ') {
            return 'text-[#dc2626] text-[1.4rem]';
        } else if (status === 'Chưa nộp') {
            return 'text-[#27a243] text-[1.4rem]';
        } else {
            return 'text-black text-[1.4rem]';
        }
    };

    const setFileIcon = (fileName) => {
        if (fileName.includes('.xlsx') || fileName.includes('.csv')) {
            return <FontAwesomeIcon className="w-full h-full text-green-700" icon={faFileExcel} />;
        } else if (fileName.includes('.pptx') || fileName.includes('.ppt')) {
            return <FontAwesomeIcon className="w-full h-full text-[#ff5722]" icon={faFilePowerpoint} />;
        } else if (fileName.includes('.docx') || fileName.includes('.doc')) {
            return <FontAwesomeIcon className="w-full h-full text-blue-700" icon={faFileWord} />;
        } else if (fileName.includes('.pdf')) {
            return <FontAwesomeIcon className="w-full h-full text-red-600" icon={faFilePdf} />;
        } else {
            return <FontAwesomeIcon className="w-full h-full text-black" icon={faFile} />;
        }
    };

    const getTypeFile = (fileName) => {
        if (fileName.includes('.xlsx') || fileName.includes('.csv')) {
            return 'Excel';
        } else if (fileName.includes('.pptx') || fileName.includes('.ppt')) {
            return 'Powerpoint';
        } else if (fileName.includes('.docx') || fileName.includes('.doc')) {
            return 'Word';
        } else if (fileName.includes('.pdf')) {
            return 'PDF';
        } else {
            return 'Unknown';
        }
    };

    const getRefLink = () => {
        const refLink = allDocuments.find((item) => item.documentName === task?.refLink);
        return `http://localhost:3000/documents/detail/${refLink?._id}`;
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            setAllUsers(res.data);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, true, '', '', '', '', '', '');
            const documentArray = res.allDocumentIn?.filter((item) => item.status === 'Đang xử lý');
            setAllDocuments(documentArray);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await taskServices.getTaskById(id);
            if (res.code === 200) {
                setTask(res.data);
            } else {
                navigate('/error');
            }
        };
        fetchApi();
    }, [id, isSave, navigate]);

    useEffect(() => {
        const getResources = () => {
            const resources = task?.resources?.find((item) => {
                return item.userId === userId;
            });

            const finalResources = resources?.resources?.map((item) => {
                return item.replace('http://localhost:8080/static/', '');
            });

            setDisplayFile(finalResources);
        };
        getResources();
    }, [task?.resources, userId]);

    const handleSubmit = async () => {
        if (!attachFiles) return;
        const data = new FormData();
        for (let i = 0; i < attachFiles.length; i++) {
            data.append('myFile', attachFiles[i]);
        }
        const res = await taskServices.submitResource(id, data);
        if (res.code === 200) {
            setAttachFiles([]);
            ref.current.value = '';
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
            setIsSubmit(true);
        } else {
            errorNotify(res.message);
        }
    };

    useEffect(() => {
        const getAttachFilesName = () => {
            const arr = Array.from(attachFiles)?.map((item) => item.name);
            setFinalList(displayFile?.concat(arr));
        };
        getAttachFilesName();
    }, [displayFile, attachFiles]);

    const handleDeleteSubmitFile = async (fileName) => {
        const resources = task?.resources?.find((item) => item.userId === userId);
        if (resources?.resources?.includes(`http://localhost:8080/static/${fileName}`)) {
            const data = {
                filename: `http://localhost:8080/static/${fileName}`,
            };
            const res = await taskServices.deleteSubmitFileUrl(id, data);
            if (res.code === 200) {
                // setAttachFiles([]);
                // ref.current.value = '';
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res.message);
            }
        } else {
            const arr = Array.from(attachFiles)?.filter((item) => item.name !== fileName);
            setAttachFiles(arr);
            successNotify('Hủy nộp file thành công');
        }
    };

    const getMemberResources = () => {
        const allMemberResources = task?.resources?.filter((item) => item.userId !== task?.leader?.value);
        return allMemberResources;
    };

    useEffect(() => {
        const getCurrentResources = () => {
            const resource = task?.resources?.find((item) => item.userId === userId);
            setIsSubmit(resource?.isSubmit);
            setSubmitStatus(resource?.status);
        };
        getCurrentResources();
    }, [task?.resources, userId]);

    const getLeader = () => {
        // const leader = task?.assignTo?.find((item) => item?.flag === 'Leader');
        const leader = task?.leader?.value;
        if (leader === userId) {
            return true;
        } else {
            return false;
        }
    };

    const handleUnsubmit = async () => {
        const res = await taskServices.unsubmitResource(id);
        if (res.code === 200) {
            setIsSave((isSave) => !isSave);
            successNotify(res.message);
        } else {
            errorNotify(res.message);
        }
    };

    const handleChangeProgress = async () => {
        const res = await taskServices.updateProgress(id, { taskProgress: 'Chờ duyệt' });
        if (res.code === 200) {
            successNotify('Nhiệm vụ đang chờ duyệt');
            setIsSave((isSave) => !isSave);
            const newNotiId = await notificationServices.createNotification({
                notification: `Nhiệm vụ ${task?.taskName} đang chờ duyệt`,
                userId: allUsers?.find((item) => item.role === 'Admin')._id,
                linkTask: `http://localhost:3000/tasks/detail/${id}`,
            });
            socket.current?.emit('sendNotification', {
                senderId: userId,
                _id: [{ notiId: newNotiId.data._id, userId: newNotiId.data.userId }],
                receiverId: [allUsers?.find((item) => item.role === 'Admin')._id],
                text: `Nhiệm vụ ${task?.taskName} đang chờ duyệt`,
                linkTask: `http://localhost:3000/tasks/detail/${id}`,
                isRead: false,
            });
        } else {
            errorNotify(res.message);
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

    return (
        <div className="block lg:flex lg:items-start lg:gap-4">
            <div className="flex-[5]">
                <ul
                    className={
                        getLeader() ? 'flex flex-wrap text-[1.5rem] font-medium text-center text-gray-500' : 'hidden'
                    }
                >
                    <li onClick={() => onUpdateTab('detail')} className="mr-2 cursor-pointer">
                        <h3
                            className={
                                tab === 'detail'
                                    ? 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white activeTab'
                                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white'
                            }
                        >
                            Chi tiết
                        </h3>
                    </li>
                    <li onClick={() => onUpdateTab('resources')} className="mr-2 cursor-pointer">
                        <h3
                            className={
                                tab === 'resources'
                                    ? 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white activeTab'
                                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white'
                            }
                        >
                            Tài nguyên
                        </h3>
                    </li>
                </ul>
                <div className={tab === 'detail' ? 'bg-white p-[16px] mb-5 shadow-4Way' : 'hidden'}>
                    <div>
                        <h3 className="inline-block text-[2rem] font-bold">
                            {task?.taskName}{' '}
                            <span className="inline-block align-text-top w-fit text-white text-[1.3rem] font-semibold text-center p-1 rounded-lg bg-blue-500">
                                {task?.type}
                            </span>{' '}
                            <span className={setLevelColor(task?.level)}>{task?.level}</span>
                        </h3>
                        <p className="text-[1.3rem]">
                            Đến <span>{new Date(task?.dueDate).toLocaleString()}</span>
                            <span className={setStatusColor(task?.status)}>{task?.status}</span>
                        </p>
                        <hr className="my-7 border-[1.5px] border-black" />
                        <p className="text-[1.4rem]">{task?.desc}</p>
                        <div className="mt-12">
                            <h3 className="text-[1.8rem] font-bold">File đính kèm:</h3>
                            <ul>
                                {task?.attachFiles?.map((item, index) => (
                                    <li key={index} className="mb-2">
                                        <div className="flex items-center w-fit">
                                            <div className="w-[24px] h-[24px] mr-3">{setFileIcon(item)}</div>
                                            <a
                                                className="text-blue-600 text-[1.4rem] flex-1"
                                                href={item}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                {item.replace('http://localhost:8080/static/', '')}
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-12">
                            <h3 className="text-[1.8rem] font-bold">Liên kết liên quan:</h3>
                            <a className="text-[1.4rem]" href={getRefLink()} target="_blank" rel="noreferrer noopener">
                                {task?.refLink}
                            </a>
                        </div>
                    </div>
                </div>
                <div className={tab === 'resources' ? 'bg-white p-[16px] mb-5 shadow-4Way' : 'hidden'}>
                    {getMemberResources()?.map((mrs, index) => {
                        const user = allUsers?.find((user) => {
                            return user?._id === mrs?.userId;
                        });
                        return (
                            <div key={index} className="border border-dashed border-[#cccccc] p-5">
                                <p className="text-[1.4rem] font-bold">
                                    Người nộp: <span className="font-normal">{user?.fullName}</span>
                                </p>
                                <div>
                                    <p className="text-[1.4rem] font-bold">Tài nguyên:</p>
                                    <ul>
                                        {mrs?.resources?.map((fileName, index) => {
                                            return (
                                                <li key={index} className="mb-2">
                                                    <div className="flex items-center w-fit">
                                                        <div className="w-[24px] h-[24px] mr-3">
                                                            {setFileIcon(fileName)}
                                                        </div>
                                                        <a
                                                            className="text-blue-600 text-[1.4rem] flex-1"
                                                            href={fileName}
                                                            target="_blank"
                                                            rel="noreferrer noopener"
                                                        >
                                                            {fileName.replace('http://localhost:8080/static/', '')}
                                                        </a>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="bg-white p-[16px] mb-5 shadow-4Way">
                    <h3>Bình luận</h3>
                    <form>
                        <InputField
                            textarea
                            className="default textarea"
                            rows="3"
                            cols="50"
                            placeholder="Viết gì đó..."
                        />
                        <button className="w-full md:w-fit text-[1.4rem] text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                            Gửi
                        </button>
                    </form>
                    <ul className="mt-5">
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                    </ul>
                </div>
            </div>
            <div className="bg-white p-[16px] mb-5 shadow-4Way flex-[2]">
                <div className="flex items-center justify-between font-semibold">
                    <h3 className="text-[2rem]">
                        Việc của bạn{' '}
                        <span className={getLeader() ? '' : 'hidden'}>
                            (
                            <span className="inline-block align-middle w-fit text-white text-[1.3rem] font-semibold text-center px-1 rounded-lg bg-yellow-600">
                                Leader
                            </span>
                            )
                        </span>
                    </h3>
                    <p className={setSubmitTextColor(submitStatus)}>{submitStatus}</p>
                </div>
                <div className="mt-7 w-full">
                    {finalList?.map((item, index) => {
                        return (
                            <div key={index} className="flex items-center mb-5 w-full">
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href={`http://localhost:8080/static/${item}`}
                                    className="w-full flex flex-col text-[1.4rem] px-[16px] py-[6px] rounded-md border"
                                >
                                    <span className="w-full lg:w-[200px] xl:w-[250px] truncate font-semibold">
                                        {item}
                                    </span>
                                    <span>{getTypeFile(item)}</span>
                                </a>
                                <span
                                    onClick={() => handleDeleteSubmitFile(item)}
                                    className={isSubmit ? 'hidden' : 'text-[1.7rem] text-red-600 ml-3 cursor-pointer'}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </span>
                            </div>
                        );
                    })}
                    <div className={isSubmit ? 'hidden' : 'w-full'}>
                        <label
                            className="block w-full text-center text-[1.4rem] leading-[1] font-bold text-blue-700 bg-transparent py-[6px] rounded-3xl border border-dashed border-blue-700 cursor-pointer"
                            htmlFor="upload"
                        >
                            <FontAwesomeIcon icon={faPlus} />
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
                    </div>
                </div>
                {isSubmit ? (
                    <button
                        onClick={handleUnsubmit}
                        className={
                            task?.progress === 'Hoàn thành' || task?.progress === 'Chờ duyệt'
                                ? 'w-full text-[1.4rem] text-blue-600 bg-white mt-7 px-[16px] py-[6px] rounded-md border border-[#cccccc] hover:bg-[#d2e3fc] transition-all duration-[1s] pointer-events-none opacity-50'
                                : 'w-full text-[1.4rem] text-blue-600 bg-white mt-7 px-[16px] py-[6px] rounded-md border border-[#cccccc] hover:bg-[#d2e3fc] transition-all duration-[1s]'
                        }
                    >
                        Hủy nộp
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className={
                            task?.progress === 'Hoàn thành' || task?.progress === 'Chờ duyệt'
                                ? 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-7 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] pointer-events-none opacity-50'
                                : 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-7 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]'
                        }
                    >
                        Nộp
                    </button>
                )}
                <button
                    onClick={handleChangeProgress}
                    className={
                        getLeader()
                            ? task?.progress === 'Hoàn thành' || task?.progress === 'Chờ duyệt'
                                ? 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-5 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] pointer-events-none opacity-50'
                                : 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-5 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]'
                            : 'hidden'
                    }
                >
                    Đánh dấu hoàn tất
                </button>
            </div>
        </div>
    );
};

export default MemberTaskDetail;
