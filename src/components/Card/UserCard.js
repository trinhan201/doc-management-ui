import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '~/components/SwitchButton';
import DropList from '../DropList';

const UserCard = (props) => {
    const [showAction, setShowAction] = useState(false);
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    const toggle = () => {
        setShowAction(!showAction);
    };

    const handleShowForm = () => {
        setShowAction(false);
        props.setShowForm(true);
        props.setFormTitle('Chỉnh sửa thành viên');
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
                        <li onClick={handleShowForm} className="flex items-center p-[8px] hover:bg-[#dddddd]">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span className="ml-3">Sửa</span>
                        </li>
                        <li
                            onClick={() => setShowAction(false)}
                            className="flex items-center p-[8px] hover:bg-[#dddddd]"
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
                <span className="font-bold w-[120px]">Họ và tên:</span>
                <span className="flex-1 truncate">{props.fullName}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Email:</span>
                <span className="flex-1 truncate">{props.email}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Số điện thoại:</span>
                <span className="flex-1 truncate">{props.phone}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Phòng ban:</span>
                <span className="flex-1 truncate">{props.department}</span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Vai trò:</span>
                <span>
                    <DropList options={roleOptions} />
                </span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <SwitchButton />
            </div>
        </div>
    );
};

export default UserCard;
