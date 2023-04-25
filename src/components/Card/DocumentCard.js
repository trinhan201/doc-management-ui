import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DropList from '../DropList';

const DocumentCard = (props) => {
    const [showAction, setShowAction] = useState(false);
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];

    const toggle = () => {
        setShowAction(!showAction);
    };

    return (
        <div className="text-[1.4rem] bg-white p-[16px] mb-5 shadow-4Way">
            <div className="flex items-center justify-between relative text-right mb-3">
                <div className="flex items-center">
                    <input type="checkbox" />
                </div>
                <FontAwesomeIcon onClick={toggle} className="w-[16px] h-[16px] cursor-pointer" icon={faEllipsisH} />
                <div
                    className={
                        !showAction ? 'hidden' : 'absolute top-[24px] right-0 w-[120px] h-fit bg-white shadow-4Way z-10'
                    }
                >
                    <ul>
                        <li
                            onClick={() => setShowAction(false)}
                            className="flex items-center p-[8px] hover:bg-[#dddddd] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="ml-3">Chi tiết</span>
                        </li>
                        <li
                            onClick={() => setShowAction(false)}
                            className="flex items-center p-[8px] hover:bg-[#dddddd] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span className="ml-3">Sửa</span>
                        </li>
                        <li
                            onClick={() => setShowAction(false)}
                            className="flex items-center p-[8px] hover:bg-[#dddddd] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <span className="ml-3">Xóa</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">STT:</span>
                <span className="flex-1 truncate">{props.id}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Mã văn bản:</span>
                <span className="flex-1 truncate">{props.code}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Tên văn bản:</span>
                <span className="flex-1 truncate">{props.docName}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Loại văn bản:</span>
                <span className="flex-1 truncate">{props.docType}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Mức độ:</span>
                <span className="text-white font-semibold text-center bg-[#cccccc] p-2 rounded-md">{props.level}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <span>
                    <DropList options={statusOptions} />
                </span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Ghi chú:</span>
                <span className="flex-1 truncate">{props.note}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Vị trí hiện tại:</span>
                <span>
                    <DropList options={departmentOptions} />
                </span>
            </div>
        </div>
    );
};

export default DocumentCard;
