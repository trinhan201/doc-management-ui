import { useState, useEffect } from 'react';
import {
    faAngleDown,
    faAngleRight,
    faArrowTurnDown,
    faArrowTurnUp,
    faChartColumn,
    faFile,
    faFontAwesome,
    faGauge,
    faLayerGroup,
    faListCheck,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jwt_decode from 'jwt-decode';
import SidebarItem from '~/components/SidebarItem';

const Sidebar = () => {
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    const [toggleSubMenu2, setToggleSubMenu2] = useState(false);
    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('userRole')));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role);
    }, []);

    return (
        <div className="w-full h-full bg-[#3c4b64] overflow-auto">
            <div className="flex h-[64px] bg-[#303c54] italic">
                <h1 className="text-white text-[3.6rem] m-auto">
                    QLVB <span className="text-[1.6rem]">v1.0</span>
                </h1>
            </div>
            <ul>
                <SidebarItem path="/dashboard" icon={faGauge} title="Bảng điều khiển" />
                <div className={userRole === 'Moderator' || userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem path="/document-types" icon={faFontAwesome} title="Loại văn bản" />
                </div>
                <SidebarItem
                    onClick={() => setToggleSubMenu(!toggleSubMenu)}
                    className="hello"
                    path="/documents"
                    icon={faFile}
                    title="Văn bản"
                    firstElement={
                        <FontAwesomeIcon
                            className="absolute top-[50%] translate-y-[-50%] right-[16px] text-[#ffffff]/[0.3]"
                            icon={toggleSubMenu ? faAngleDown : faAngleRight}
                        />
                    }
                    secondElement={
                        <ul
                            className={
                                !toggleSubMenu
                                    ? 'max-h-0 transition-height duration-[1s] overflow-hidden'
                                    : 'max-h-[300px] transition-height duration-[1.5s] overflow-hidden'
                            }
                        >
                            <SidebarItem path="/documents/documents-in" icon={faArrowTurnDown} title="Văn bản đến" />
                            <SidebarItem path="/documents/documents-out" icon={faArrowTurnUp} title="Văn bản đi" />
                        </ul>
                    }
                />

                <SidebarItem path="/tasks" icon={faListCheck} title="Việc cần làm" />
                <div className={userRole === 'Moderator' || userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem path="/departments" icon={faLayerGroup} title="Phòng ban" />
                </div>
                <div className={userRole === 'Admin' ? '' : 'hidden'}>
                    <SidebarItem path="/users" icon={faUser} title="Thành viên" />
                </div>
                <SidebarItem
                    onClick={() => setToggleSubMenu2(!toggleSubMenu2)}
                    className="hello"
                    path="/statistics"
                    icon={faChartColumn}
                    title="Báo cáo thống kê"
                    firstElement={
                        <FontAwesomeIcon
                            className="absolute top-[50%] translate-y-[-50%] right-[16px] text-[#ffffff]/[0.3]"
                            icon={toggleSubMenu2 ? faAngleDown : faAngleRight}
                        />
                    }
                    secondElement={
                        <ul
                            className={
                                !toggleSubMenu2
                                    ? 'max-h-0 transition-height duration-[1s] overflow-hidden'
                                    : 'max-h-[300px] transition-height duration-[1.5s] overflow-hidden'
                            }
                        >
                            <SidebarItem path="/statistics/documents" icon={faArrowTurnDown} title="Thống kê văn bản" />
                            <SidebarItem path="/statistics/tasks" icon={faArrowTurnUp} title="Thống kê công việc" />
                            <SidebarItem path="/statistics/systems" icon={faArrowTurnUp} title="Thống kê hệ thống" />
                        </ul>
                    }
                />
            </ul>
        </div>
    );
};

export default Sidebar;
