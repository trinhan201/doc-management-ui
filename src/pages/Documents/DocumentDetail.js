import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as documentServices from '~/services/documentServices';

const DocumentDetail = () => {
    const [document, setDocument] = useState({});
    const [percent, setPercent] = useState('');
    const [statusStyle, setStatusStyle] = useState('');
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

    useEffect(() => {
        const setStatusPercentage = () => {
            if (document.status === 'Hoàn thành') {
                setPercent('100%');
                setStatusStyle('progress-bar full');
            } else if (document.status === 'Đang xử lý') {
                setPercent('60%');
                setStatusStyle('progress-bar percent60');
            } else {
                setPercent('30%');
                setStatusStyle('progress-bar percent30');
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
    }, [id]);

    return (
        <div className="bg-white p-[16px] mb-5 shadow-4Way">
            <h1 className="text-[2.2rem] font-bold">Chi tiết văn bản</h1>
            <div className="mt-12">
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Tên văn bản:</h3>
                    <p className="flex-1">{document?.documentName}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Loại văn bản:</h3>
                    <p className="flex-1">{document?.type}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Số ký hiệu</h3>
                    <p className="flex-1">{document?.code}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Ngày ban hành:</h3>
                    <p className="flex-1">{document?.sendDate}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Nơi ban hành:</h3>
                    <p className="flex-1">{document?.sender}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Mức độ:</h3>
                    <div className="flex-1">
                        <p className={setLevelColor(document?.level)}>{document?.level}</p>
                    </div>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Trạng thái:</h3>
                    <div className="flex-1 bg-gray-200 rounded-full mt-3">
                        <div className={statusStyle}>
                            <span>{percent}</span> <span>{document?.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Vị trí hiện tại:</h3>
                    <p className="flex-1">{document?.currentLocation}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">Trích yếu:</h3>
                    <p className="flex-1">{document?.note}</p>
                </div>
                <div className="flex my-5">
                    <h3 className="w-[180px] font-bold">File đính kèm:</h3>
                    <ul className="flex-1">
                        {document?.attachFiles?.map((item, index) => (
                            <li key={index}>
                                <div className="flex items-center w-fit">
                                    <a className="text-blue-600" href={item} target="_blank" rel="noreferrer noopener">
                                        {item.replace('http://localhost:8080/static/', '')}
                                    </a>
                                    <div className="flex items-center leading-6 text-[1.7rem] text-red-600 ml-3 cursor-pointer">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className="mt-3">
                            <label
                                className="inline-block w-[100px] text-center text-[2.4rem] leading-[1] text-black bg-transparent border border-dashed border-[#aaaaaa] py-[6px] rounded-3xl cursor-pointer"
                                htmlFor="upload"
                            >
                                +
                            </label>
                            <input
                                id="upload"
                                className="absolute opacity-0 z-[-1] rounded-3xl"
                                type="file"
                                name="myFile"
                                multiple
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
