import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'javascript-time-ago';
import CommentItem from '~/components/CommentItem';
import InputField from '~/components/InputField';
import * as taskServices from '~/services/taskServices';
import * as documentServices from '~/services/documentServices';
import * as userServices from '~/services/userServices';
import * as notificationServices from '~/services/notificationServices';
import * as commentServices from '~/services/commentServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { setLevelColor, setFileIcon } from '~/utils/setMultiConditions';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks } from '~/hooks';
import Loading from '~/components/Loading';
import { handleDelete } from '~/utils/apiDelete';

const MemberTaskDetail = ({ socket }) => {
    const [comment, setComment] = useState('');
    const [commentId, setCommentId] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('detail');
    const [isSave, setIsSave] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [task, setTask] = useState({});
    const [attachFiles, setAttachFiles] = useState([]);
    const [displayFile, setDisplayFile] = useState([]);
    const [finalList, setFinalList] = useState([]);
    const [submitStatus, setSubmitStatus] = useState('');
    // List data state
    const [allUsers, setAllUsers] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);

    const navigate = useNavigate();
    const allTasks = useFetchTasks({ isSave });
    const ref = useRef();
    const timeAgo = new TimeAgo();
    const userId = JSON.parse(localStorage.getItem('userId'));
    const { id } = useParams();

    // Update tab
    const onUpdateTab = (value) => {
        setTab(value);
    };

    // Change status color
    const setStatusColor = (status) => {
        if (status === 'Sắp đến hạn') {
            return 'w-fit ml-2 status warning';
        } else if (status === 'Quá hạn') {
            return 'w-fit ml-2 status emergency';
        } else {
            return 'w-fit ml-2 status normal';
        }
    };

    // Change submit text color
    const setSubmitTextColor = (status) => {
        if (status === 'Trễ') {
            return 'text-[#dc2626] text-[1.4rem]';
        } else if (status === 'Chưa nộp') {
            return 'text-[#27a243] text-[1.4rem]';
        } else {
            return 'text-black text-[1.4rem]';
        }
    };

    // Get type file
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

    // Get link to reference document detail
    const getRefLink = () => {
        const refLink = allDocuments.find((item) => item.documentName === task?.refLink);
        return `http://localhost:3000/documents/detail/${refLink?._id}`;
    };

    // Create comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const data = {
            taskId: id,
            content: comment,
        };
        let res;
        if (commentId) {
            res = await commentServices.updateComment(commentId, data);
        } else {
            res = await commentServices.createComment(data);
        }
        if (res.code === 200) {
            setComment('');
            setCommentId('');
            setIsSave((isSave) => !isSave);
            successNotify(res.message);
        } else {
            errorNotify(res);
        }
    };

    // Submit assignment
    const handleSubmit = async () => {
        setLoading(true);
        if (!attachFiles) return;
        const data = new FormData();
        for (let i = 0; i < attachFiles.length; i++) {
            data.append('myFile', attachFiles[i]);
        }
        const res = await taskServices.submitResource(id, data);
        if (res.code === 200) {
            setAttachFiles([]);
            ref.current.value = '';
            setLoading(false);
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
            setIsSubmit(true);
        } else {
            setLoading(false);
            errorNotify(res.message);
        }
    };

    // Delete each assignment file
    const handleDeleteSubmitFile = async (fileName) => {
        const resources = task?.resources?.find((item) => item.userId === userId);
        if (resources?.resources?.includes(`http://localhost:8080/static/${fileName}`)) {
            const data = {
                filename: `http://localhost:8080/static/${fileName}`,
            };
            const res = await taskServices.deleteSubmitFileUrl(id, data);
            if (res.code === 200) {
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

    // Get member resources exclude leader
    const getMemberResources = () => {
        const allMemberResources = task?.resources?.filter((item) => item.userId !== task?.leader?.value);
        return allMemberResources;
    };

    // Get leader boolean
    const getLeader = () => {
        const leader = task?.leader?.value;
        if (leader === userId) {
            return true;
        } else {
            return false;
        }
    };

    // Unsubmit assignment
    const handleUnsubmit = async () => {
        setLoading(true);
        const res = await taskServices.unsubmitResource(id);
        if (res.code === 200) {
            setLoading(false);
            setIsSave((isSave) => !isSave);
            successNotify(res.message);
        } else {
            setLoading(false);
            errorNotify(res.message);
        }
    };

    // Change task progress
    const handleChangeProgress = async () => {
        setLoading(true);
        const res = await taskServices.updateProgress(id, { taskProgress: 'Chờ duyệt' });
        if (res.code === 200) {
            setLoading(false);
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
            setLoading(false);
            errorNotify(res);
        }
    };

    // Get all comments
    useEffect(() => {
        const fetchApi = async () => {
            const res = await commentServices.getAllComment();
            if (res.code === 200) {
                const filterComments = res?.data
                    ?.filter((item) => item.taskId === id)
                    .map((comment) => {
                        const user = allUsers?.find((user) => user._id === comment.userId);
                        return {
                            userName: user?.fullName,
                            avatar: user?.avatar,
                            commentId: comment?._id,
                            userId: comment?.userId,
                            content: comment?.content,
                            date: comment?.createdAt,
                        };
                    });
                setAllComments(filterComments);
            } else {
                console.log(res);
            }
        };
        fetchApi();
    }, [id, allUsers, isSave]);

    // Get comment by id
    useEffect(() => {
        if (!commentId) return;
        const fetchApi = async () => {
            const res = await commentServices.getCommentById(commentId);
            if (res.code === 200) {
                setComment(res.data.content);
            } else {
                console.log(res);
            }
        };
        fetchApi();
    }, [commentId]);

    // Get public info of user
    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            setAllUsers(res.data);
        };
        fetchApi();
    }, []);

    // Get all documents from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, true, '', '', '', '', '', '', '');
            const documentArray = res.allDocumentIn?.filter((item) => item.status === 'Đang xử lý');
            setAllDocuments(documentArray);
        };
        fetchApi();
    }, []);

    // Get task data from server
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

    // Get resource files from db and show in UI
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

    // Merge file in input with resource files from db and show in UI
    useEffect(() => {
        const getAttachFilesName = () => {
            const arr = Array.from(attachFiles)?.map((item) => item.name);
            setFinalList(displayFile?.concat(arr));
        };
        getAttachFilesName();
    }, [displayFile, attachFiles]);

    // Get submit status and isSubmit boolean
    useEffect(() => {
        const getCurrentResources = () => {
            const resource = task?.resources?.find((item) => item.userId === userId);
            setIsSubmit(resource?.isSubmit);
            setSubmitStatus(resource?.status);
        };
        getCurrentResources();
    }, [task?.resources, userId]);

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
            <div className="block lg:flex lg:items-start lg:gap-4">
                <div className="flex-[5]">
                    <ul
                        className={
                            getLeader()
                                ? 'flex flex-wrap text-[1.5rem] font-medium text-center text-gray-500'
                                : 'hidden'
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
                                <a
                                    className="text-[1.4rem]"
                                    href={getRefLink()}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
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
                                value={comment}
                                setValue={setComment}
                            />
                            <button
                                onClick={handleSubmitComment}
                                className="w-full md:w-fit text-[1.4rem] text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                            >
                                Gửi
                            </button>
                        </form>
                        <ul className="max-h-[500px] mt-5 p-2 overflow-y-auto">
                            {allComments?.map((cm, index) => {
                                return (
                                    <CommentItem
                                        key={index}
                                        currUserId={userId}
                                        userCommentId={cm?.userId}
                                        img={
                                            cm?.avatar ||
                                            'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                        }
                                        username={cm?.userName}
                                        content={cm?.content}
                                        cmtDate={timeAgo.format(new Date(cm?.date))}
                                        handleEdit={() => setCommentId(cm?.commentId)}
                                        handleDelete={() =>
                                            handleDelete(
                                                'bình luận',
                                                commentServices.deleteCommentById(cm?.commentId),
                                                setIsSave,
                                            )
                                        }
                                    />
                                );
                            })}
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
                                        className={
                                            isSubmit ? 'hidden' : 'text-[1.7rem] text-red-600 ml-3 cursor-pointer'
                                        }
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
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[.15] z-[999]">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default MemberTaskDetail;
