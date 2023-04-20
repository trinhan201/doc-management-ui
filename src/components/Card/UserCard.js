import SwitchButton from '~/components/SwitchButton';
import DropList from '../DropList';

const UserCard = (props) => {
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    return (
        <div className="text-[1.4rem] bg-white p-[16px] mb-5 shadow-4Way">
            <div className="flex items-center mb-3">
                <input type="checkbox" />
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
