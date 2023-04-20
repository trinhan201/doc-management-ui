import { useState, useEffect } from 'react';
import { faBell, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBars, faKey, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChangePasswordForm from '~/components/Form/ChangePasswordForm';

const Header = ({ setToggle }) => {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        setToggle(toggleSidebar);
    }, [setToggle, toggleSidebar]);

    return (
        <>
            <div className="flex items-center justify-between w-full h-[64px] bg-white text-[#9fa9ae] pl-[16px] pr-[24px] border-b-[1px] border-solid border-[#cccccc]">
                <div
                    onClick={() => setToggleSidebar(!toggleSidebar)}
                    className="p-[8px] hover:text-black cursor-pointer"
                >
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <div className="flex items-center">
                    <ul className="flex items-center text-[2.2rem]">
                        <li className="p-[8px] hover:text-black cursor-pointer">
                            <FontAwesomeIcon icon={faBell} />
                        </li>
                        <li className="p-[8px] hover:text-black cursor-pointer">
                            <FontAwesomeIcon icon={faEnvelopeOpen} />
                        </li>
                    </ul>
                    <div className="relative group">
                        <div className="w-[50px] h-[50px] rounded-full ml-8 cursor-pointer">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                src="https://img.freepik.com/premium-vector/cute-orange-robot-cat-avatar_79416-86.jpg?w=2000"
                                alt="avatar"
                            />
                        </div>
                        <div className="hidden absolute top-[50px] right-0 text-black bg-white shadow-4Way group-hover:block">
                            <ul className="w-[180px]">
                                <li className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span className="ml-3">Thông tin cá nhân</span>
                                </li>
                                <li
                                    onClick={() => setShowChangePassword(true)}
                                    className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]"
                                >
                                    <FontAwesomeIcon icon={faKey} />
                                    <span className="ml-3">Đổi mật khẩu</span>
                                </li>
                                <li className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]">
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    <span className="ml-3">Đăng xuất</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {showChangePassword && <ChangePasswordForm setShowChangePassword={setShowChangePassword} />}
        </>
    );
};

export default Header;
