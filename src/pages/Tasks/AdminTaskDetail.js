import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenToSquare,
    faTrashCan,
    faFileExcel,
    faFilePowerpoint,
    faFileWord,
    faFilePdf,
    faFile,
    faXmark,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import CommentItem from '~/components/CommentItem';
import * as taskServices from '~/services/taskServices';
import * as userServices from '~/services/userServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const AdminTaskDetail = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [percent, setPercent] = useState('');
    const [progressStyle, setProgressStyle] = useState('');
    const [tab, setTab] = useState('detail');
    const [task, setTask] = useState({});
    const [attachFiles, setAttachFiles] = useState([]);
    const [isSave, setIsSave] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const onUpdateTab = (value) => {
        setTab(value);
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

    const setLevelColor = (level) => {
        if (level === 'Ưu tiên') {
            return 'w-fit px-6 py-4 level priority';
        } else if (level === 'Khẩn cấp') {
            return 'w-fit px-6 py-4 level emergency';
        } else {
            return 'w-fit px-6 py-4 level normal';
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            setAllUsers(res.data);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const setStatusPercentage = () => {
            if (task.progress === 'Hoàn thành') {
                setPercent('100%');
                setProgressStyle('text-[1rem] md:text-[1.4rem] progress-bar full');
            } else if (task.progress === 'Chờ duyệt') {
                setPercent('75%');
                setProgressStyle('text-[1rem] md:text-[1.4rem] progress-bar percent75');
            } else if (task.progress === 'Đang xử lý') {
                setPercent('50%');
                setProgressStyle('text-[1rem] md:text-[1.4rem] progress-bar percent50');
            } else {
                setPercent('25%');
                setProgressStyle('text-[1rem] md:text-[1.4rem] progress-bar percent25');
            }
        };
        setStatusPercentage();
    }, [task.progress]);

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await taskServices.getTaskById(id);
            setTask(res.data);
        };
        fetchApi();
    }, [id, isSave]);

    const handleDeleteFile = async (fileName) => {
        const data = {
            filename: fileName,
        };
        const res = await taskServices.deleteFileUrl(id, data);
        if (res.code === 200) {
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
            for (let i = 0; i < attachFiles?.length; i++) {
                data.append('myFile', attachFiles[i]);
            }
            const res = await taskServices.uploadFile(id, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
                setAttachFiles([]);
            } else {
                errorNotify(res.message);
            }
        };
        uploadFile();
    }, [attachFiles, id]);

    const handleDelete = async (id) => {
        const confirmMsg = 'Bạn có chắc muốn xóa công việc này không?';
        if (!window.confirm(confirmMsg)) return;
        const res = await taskServices.deleteTaskById(id);
        if (res.code === 200) {
            successNotify(res.message);
            navigate('/tasks');
        } else {
            errorNotify(res);
        }
    };

    return (
        <>
            <ul className="flex flex-wrap text-[1.5rem] font-medium text-center text-gray-500">
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
            <div className="block lg:flex lg:items-start lg:gap-4">
                <div className="bg-white p-[16px] mb-5 shadow-lg flex-[5]">
                    <div className={tab === 'detail' ? '' : 'hidden'}>
                        <div>
                            <h3 className="text-[2rem] font-bold">
                                <span className="mr-2">{task?.taskName}</span>
                                <span className={setLevelColor(task?.level)}>{task?.level}</span>
                            </h3>
                            <p className="text-[1.4rem] mt-6">{task?.desc}</p>
                            <div className="flex items-center mt-12">
                                <div className="flex-1">
                                    <h3 className="text-[1.8rem] font-bold">Ngày bắt đầu:</h3>
                                    <p className="text-[1.4rem]">{new Date(task?.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[1.8rem] font-bold">Ngày kết thúc:</h3>
                                    <p className="text-[1.4rem]">{new Date(task?.dueDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Tiến trình:</h3>
                                <div className="bg-gray-200 rounded-full mt-3">
                                    <div className={progressStyle}>
                                        <span>{percent}</span> <span>{task?.progress}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Người thực hiện:</h3>
                                <div className="flex -space-x-2">
                                    {task?.assignTo?.slice(0, 3).map((at, index) => {
                                        const user = allUsers?.find((user) => {
                                            return user?._id === at?.value;
                                        });
                                        return (
                                            <img
                                                key={index}
                                                className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                                src={
                                                    user?.avatar ||
                                                    'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                                }
                                                alt="avatar"
                                            />
                                        );
                                    })}
                                    <div
                                        className={
                                            task?.assignTo?.length > 3
                                                ? 'hs-dropdown relative inline-flex [--placement:top-left]'
                                                : 'hidden'
                                        }
                                    >
                                        <div className="inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white font-medium text-gray-700 shadow-sm align-middle">
                                            <span className="font-medium leading-none text-[1.3rem]">
                                                +{task?.assignTo?.length - 3}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                                <div
                                                    onClick={() => handleDeleteFile(item)}
                                                    className="flex items-center leading-6 text-[1.7rem] text-red-600 ml-3 cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
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
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Liên kết liên quan:</h3>
                                <a className="text-[1.4rem]" href="!#">
                                    DEN 2
                                </a>
                            </div>
                        </div>
                        <div className="block md:flex items-center gap-5 mt-12">
                            <NavLink
                                to={`/tasks/edit/${task?._id}`}
                                className="block w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
                            </NavLink>
                            <button
                                onClick={() => handleDelete(task?._id)}
                                className="w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={faTrashCan} /> Xóa
                            </button>
                        </div>
                    </div>
                    <div className={tab === 'resources' ? '' : 'hidden'}>Tài nguyên tab</div>
                </div>
                <div className="bg-white p-[16px] mb-5 shadow-lg flex-[2]">
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
        </>
    );
};

export default AdminTaskDetail;
