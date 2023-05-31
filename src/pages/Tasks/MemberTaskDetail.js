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
} from '@fortawesome/free-solid-svg-icons';
import CommentItem from '~/components/CommentItem';
import InputField from '~/components/InputField';
import * as taskServices from '~/services/taskServices';
import * as documentServices from '~/services/documentServices';

const MemberTaskDetail = () => {
    const [allDocuments, setAllDocuments] = useState([]);
    const [task, setTask] = useState({});

    const { id } = useParams();

    const setLevelColor = (level) => {
        if (level === 'Ưu tiên') {
            return 'w-fit px-6 py-4 level priority';
        } else if (level === 'Khẩn cấp') {
            return 'w-fit px-6 py-4 level emergency';
        } else {
            return 'w-fit px-6 py-4 level normal';
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
    }, [id]);

    return (
        <div className="block lg:flex lg:items-start lg:gap-4">
            <div>
                <div className="bg-white p-[16px] mb-5 shadow-4Way flex-[5]">
                    <div>
                        <h3 className="text-[2rem] font-bold">
                            <span className="mr-2">{task?.taskName}</span>
                            <span className={setLevelColor('Khẩn cấp')}>Khẩn cấp</span>
                        </h3>
                        <p className="text-[1.3rem]">
                            Đến <span>{new Date(task?.dueDate).toLocaleString()}</span>
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
                <div className="bg-white p-[16px] mb-5 shadow-4Way flex-[2]">
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
                    <a href="!#" className="flex flex-col text-[1.4rem] px-[16px] py-[6px] mb-3 rounded-md border">
                        <span className="w-full lg:w-[200px] xl:w-[250px] truncate font-semibold">
                            TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest.docx
                        </span>
                        <span>Docx</span>
                    </a>
                    <a href="!#" className="flex flex-col text-[1.4rem] px-[16px] py-[6px] mb-3 rounded-md border">
                        <span className="w-[200px] xl:w-[250px] truncate font-semibold">Test.docx</span>
                        <span>Docx</span>
                    </a>
                    <a href="!#" className="flex flex-col text-[1.4rem] px-[16px] py-[6px] mb-3 rounded-md border">
                        <span className="w-[200px] xl:w-[250px] truncate font-semibold">Test.docx</span>
                        <span>Docx</span>
                    </a>
                    <div className="w-full">
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
                            // onChange={(e) => setAttachFiles(e.target.files)}
                            // multiple
                        />
                    </div>
                </div>
                <button className="w-full text-[1.4rem] text-[white] bg-blue-600 mt-7 px-[16px] py-[6px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Nộp
                </button>
            </div>
        </div>
    );
};

export default MemberTaskDetail;
