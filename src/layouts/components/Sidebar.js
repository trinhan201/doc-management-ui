import { useState } from 'react';
import {
    faAngleDown,
    faAngleRight,
    faArrowTurnDown,
    faArrowTurnUp,
    faFile,
    faFontAwesome,
    faHouse,
    faLayerGroup,
    faListCheck,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarItem from '~/components/SidebarItem';

const Sidebar = () => {
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    return (
        <div className="w-full h-full bg-[#3c4b64]">
            <div className="flex h-[64px] bg-[#303c54] italic">
                <h1 className="text-white text-[3.6rem] m-auto">
                    QLVB <span className="text-[1.6rem]">v1.0</span>
                </h1>
            </div>
            <ul>
                <SidebarItem path="/home" icon={faHouse} title="Trang chủ" />
                <SidebarItem path="/document-types" icon={faFontAwesome} title="Loại văn bản" />
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
                <SidebarItem path="/departments" icon={faLayerGroup} title="Phòng ban" />
                <SidebarItem path="/users" icon={faUser} title="Thành viên" />
            </ul>
        </div>
    );
};

export default Sidebar;
