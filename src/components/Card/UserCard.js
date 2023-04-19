import SwitchButton from '~/components/SwitchButton';
import DropList from '../DropList';

const UserCard = (props) => {
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    return (
        <div className="text-[1.4rem] bg-white p-[16px] mb-5 shadow-4Way">
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">STT:</span>
                <span className="flex-1 truncate">{props.id}</span>
            </p>
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Họ và tên:</span>
                <span className="flex-1 truncate">{props.fullName}</span>
            </p>
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Email:</span>
                <span className="flex-1 truncate">{props.email}</span>
            </p>
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Số điện thoại:</span>
                <span className="flex-1 truncate">{props.phone}</span>
            </p>
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Vai trò:</span>
                <span>
                    <DropList options={roleOptions} />
                </span>
            </p>
            <p className="flex items-center mb-3">
                <span className="font-bold w-[120px]">Trạng thái:</span>
                <SwitchButton />
            </p>
        </div>
    );
};

export default UserCard;
