import { useState } from 'react';
import SwitchButton from '../SwitchButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const DepartmentCard = (props) => {
    const [showAction, setShowAction] = useState(false);

    const toggle = () => {
        setShowAction(!showAction);
    };

    const handleShowForm = () => {
        setShowAction(false);
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
                            onClick={handleShowForm}
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
                <span className="font-bold w-[120px]">Tên phòng ban:</span>
                <span className="flex-1 truncate">{props.departmentName}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <SwitchButton />
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Ghi chú:</span>
                <span className="flex-1 truncate">{props.note}</span>
            </div>
        </div>
    );
};

export default DepartmentCard;
