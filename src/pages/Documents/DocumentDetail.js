import { faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as documentServices from '~/services/documentServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { faFileExcel, faFileWord, faFilePowerpoint, faFilePdf, faFile } from '@fortawesome/free-regular-svg-icons';

const DocumentDetail = () => {
    const [document, setDocument] = useState({});
    const [percent, setPercent] = useState('');
    const [statusStyle, setStatusStyle] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = JSON.parse(localStorage.getItem('userRole'));

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

    const handleDeleteFile = async (fileName) => {
        const data = {
            filename: fileName,
        };
        const res = await documentServices.deleteFileUrl(id, data);
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
            for (let i = 0; i < attachFiles.length; i++) {
                data.append('myFile', attachFiles[i]);
            }
            const res = await documentServices.uploadFile(id, data);
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
                        <li className={userRole === 'Member' ? 'pointer-events-none opacity-40' : ''}>
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
