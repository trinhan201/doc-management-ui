import SwitchButton from '~/components/SwitchButton';
import DropList from '../DropList';

const UserCard = (props) => {
    const roleOptions = ['Admin', 'Moderator', 'Member'];

    return (
        <div className="text-[1.4rem] bg-white p-[16px] mb-5">
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">STT:</span>
                <span>{props.id}</span>
            </p>
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">Họ và tên:</span>
                <span>{props.fullName}</span>
            </p>
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">Email:</span>
                <span>{props.email}</span>
            </p>
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">Số điện thoại:</span>
                <span>{props.phone}</span>
            </p>
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">Vai trò:</span>
                <span>
                    <DropList options={roleOptions} />
                </span>
            </p>
            <p className="flex items-center justify-between mb-3">
                <span className="font-bold">Trạng thái:</span>
                <SwitchButton />
            </p>
        </div>
    );
};

export default UserCard;
