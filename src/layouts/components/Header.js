import { useState, useEffect, useContext } from 'react';
import { faBell, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBars, faKey, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChangePasswordForm from '~/components/Form/ChangePasswordForm';
import { NavLink, useNavigate } from 'react-router-dom';
import * as authServices from '~/services/authServices';
import * as notificationServices from '~/services/notificationServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { AvatarContext } from '~/App';
import TimeAgo from 'javascript-time-ago';

const Header = ({ setToggle, socket }) => {
    const [notification, setNotification] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const { isChangeAvatar } = useContext(AvatarContext);
    const navigate = useNavigate();
    const timeAgo = new TimeAgo();

    const handleSignOut = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;
        const data = {
            token: refreshToken,
        };
        const res = await authServices.signOut(data);
        if (res.code === 200) {
            localStorage.clear();
            successNotify(res.message);
            navigate('/signin');
        } else {
            errorNotify(res);
        }
    };

    useEffect(() => {
        setToggle(toggleSidebar);
    }, [setToggle, toggleSidebar]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setUserAvatar(res?.avatar);
        };
        fetchApi();
    }, [isChangeAvatar]);

    //Start------------------------------------------------------------------//
    useEffect(() => {
        socket.current?.on('getNotification', (data) => {
            setNotification({
                _id: data._id.find((item) => item.userId === data.receiverId)?.notiId,
                notification: data.text,
                userId: data.receiverId,
                linkTask: data.linkTask,
                isRead: data.isRead,
                createdAt: Date.now(),
            });
        });
    }, [socket]);

    useEffect(() => {
        if (!notification) return;
        setNotifications((prev) => prev.concat(notification));
    }, [notification]);

    const handleChangeNotificationStatus = async (id) => {
        await notificationServices.changeNotificationStatus(id);
    };

    const notificationNotReadLength = (notifications) => {
        const length = notifications?.filter((item) => item.isRead === false).length;
        return length;
    };

    //End------------------------------------------------------------------//

    useEffect(() => {
        const fetchApi = async () => {
            const res = await notificationServices.getAllNotification();
            setNotifications(res.data);
        };
        fetchApi();
    }, []);

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
                        <li className="group relative p-[8px] hover:text-black cursor-pointer">
                            <FontAwesomeIcon icon={faBell} />
                            <p
                                className={
                                    notificationNotReadLength(notifications) > 0
                                        ? 'absolute block top-0 right-0 text-center min-w-[18px] text-[1rem] font-semibold text-[white] bg-red-600 p-1.5 rounded-full leading-none'
                                        : 'hidden'
                                }
                            >
                                {notificationNotReadLength(notifications)}
                            </p>
                            <div className="hidden absolute bottom-[-12px] right-0 bg-transparent w-[100px] h-[24px] group-hover:block"></div>
                            <div className="hidden absolute top-[50px] right-0 text-black bg-white shadow-4Way group-hover:block z-50">
                                <ul className="w-[240px] max-h-[280px] overflow-y-auto">
                                    {notifications?.length > 0 ? (
                                        notifications
                                            ?.sort(function (a, b) {
                                                return new Date(b.createdAt) - new Date(a.createdAt);
                                            })
                                            .map((notification, index) => {
                                                return (
                                                    <li
                                                        onClick={() =>
                                                            handleChangeNotificationStatus(notification?._id)
                                                        }
                                                        key={index}
                                                        className={
                                                            notification.isRead
                                                                ? 'w-full p-[12px] text-[1.3rem] cursor-pointer hover:bg-[#eeeeee] transition-all duration-[0.5s]'
                                                                : 'w-full p-[12px] text-[1.3rem] cursor-pointer bg-[#d8dbe0] hover:bg-[#eeeeee] transition-all duration-[0.5s]'
                                                        }
                                                    >
                                                        <a className="w-full" href={notification?.linkTask}>
                                                            <p className="w-full truncate">
                                                                {notification?.notification}
                                                            </p>
                                                            <p className="text-[1rem]">
                                                                {timeAgo.format(new Date(notification?.createdAt))}
                                                            </p>
                                                        </a>
                                                    </li>
                                                );
                                            })
                                    ) : (
                                        <li className="w-full truncate p-[12px] text-[1.3rem] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]">
                                            <span className="ml-3">Khong co thong bao</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </li>
                        <li className="p-[8px] hover:text-black cursor-pointer">
                            <FontAwesomeIcon icon={faEnvelopeOpen} />
                        </li>
                    </ul>
                    <div className="relative group">
                        <div className="w-[50px] h-[50px] rounded-full ml-8 cursor-pointer">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                src={
                                    userAvatar
                                        ? userAvatar
                                        : 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                }
                                alt="avatar"
                            />
                        </div>
                        <div className="hidden absolute top-[50px] right-0 text-black bg-white shadow-4Way group-hover:block">
                            <ul className="w-[180px]">
                                <li className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]">
                                    <NavLink className="py-[12px]" to="/profile">
                                        <FontAwesomeIcon icon={faUser} />
                                        <span className="ml-3">Thông tin cá nhân</span>
                                    </NavLink>
                                </li>
                                <li
                                    onClick={() => setShowChangePassword(true)}
                                    className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee]"
                                >
                                    <FontAwesomeIcon icon={faKey} />
                                    <span className="ml-3">Đổi mật khẩu</span>
                                </li>
                                <li
                                    onClick={handleSignOut}
                                    className="p-[12px] cursor-pointer hover:text-[#321fdb] hover:bg-[#eeeeee] border-t"
                                >
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
