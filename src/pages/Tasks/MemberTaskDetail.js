import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { successNotify, errorNotify } from '~/components/ToastMessage';

const MemberTaskDetail = () => {
    const [allDocuments, setAllDocuments] = useState([]);
    const [task, setTask] = useState({});
    const [attachFiles, setAttachFiles] = useState([]);
    const [displayFile, setDisplayFile] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [isSubmit, setIsSubmit] = useState(JSON.parse(localStorage.getItem('isSubmit')) || false);

    const userId = JSON.parse(localStorage.getItem('userId'));
    const { id } = useParams();

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
            setTask(res.data);
        };
        fetchApi();
    }, [id, isSave]);

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
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
            setIsSubmit(true);
        } else {
            errorNotify(res.message);
        }
    };

    useEffect(() => {
        localStorage.setItem('isSubmit', JSON.stringify(isSubmit));
    }, [isSubmit]);

    useEffect(() => {
        const getAttachFilesName = () => {
            const arr = Array.from(attachFiles)?.map((item) => item.name);
            setDisplayFile((prev) => prev?.concat(arr));
        };
        getAttachFilesName();
    }, [attachFiles]);

    const handleDeleteSubmitFile = async (fileName) => {
        const data = {
            filename: `http://localhost:8080/static/${fileName}`,
        };
        const res = await taskServices.deleteSubmitFileUrl(id, data);
        if (res.code === 200) {
            setAttachFiles([]);
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res.message);
        }
    };

    return (
        <div className="block lg:flex lg:items-start lg:gap-4">
            <div className="flex-[5]">
                <div className="bg-white p-[16px] mb-5 shadow-4Way">
                    <div>
                        <h3 className="inline-block text-[2rem] font-bold">
                            {task?.taskName} <span className={setLevelColor(task?.level)}>{task?.level}</span>
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
                    <h3 className="text-[2rem]">Việc của bạn</h3>
                    <p className="text-[1.4rem]">Đã nộp</p>
                </div>
                <div className="mt-7">
                    {displayFile?.map((item, index) => {
                        return (
                            <div key={index} className="flex items-center">
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href={`http://localhost:8080/static/${item}`}
                                    className="flex flex-col text-[1.4rem] px-[16px] py-[6px] mb-3 rounded-md border"
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
                        />
                    </div>
                </div>
                {isSubmit ? (
                    <button
                        onClick={() => setIsSubmit(false)}
                        className={
                            isSubmit
                                ? 'w-full text-[1.4rem] text-blue-600 bg-white mt-7 px-[16px] py-[6px] rounded-md border border-[#cccccc] hover:bg-[#d2e3fc] transition-all duration-[1s]'
                                : 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-7 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]'
                        }
                    >
                        Hủy nộp
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className={
                            isSubmit
                                ? 'w-full text-[1.4rem] text-blue-600 bg-white mt-7 px-[16px] py-[6px] rounded-md border border-[#cccccc] hover:bg-[#d2e3fc] transition-all duration-[1s]'
                                : 'w-full text-[1.4rem] text-[white] bg-blue-600 mt-7 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]'
                        }
                    >
                        Nộp
                    </button>
                )}
            </div>
        </div>
    );
};

export default MemberTaskDetail;
