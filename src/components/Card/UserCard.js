import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import SwitchButton from '~/components/SwitchButton';
import DropList from '../DropList';

const UserCard = (props) => {
    const [showAction, setShowAction] = useState(false);
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    const toggle = (e) => {
        e.stopPropagation();
        setShowAction(!showAction);
    };

    return (
        <div onClick={() => setShowAction(false)} className="text-[1.4rem] bg-white p-[16px] mb-5 shadow-4Way">
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
                        <li onClick={() => setShowAction(false)} className="hover:bg-[#dddddd] cursor-pointer">
                            <NavLink className="block p-[8px] text-left" to={`/users/${props.userId}`}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span className="ml-3">Sửa</span>
                            </NavLink>
                        </li>
                        <li
                            onClick={() => setShowAction(false)}
                            className="w-full text-left p-[8px] hover:bg-[#dddddd] cursor-pointer"
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
                    <DropList
                        options={roleOptions}
                        listItem={props.role}
                        setValue={props.setRole}
                        setId={props.setUserId}
                    />
                </span>
            </div>
            <div className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <SwitchButton value={props.active} />
            </div>
        </div>
    );
};

export default UserCard;
