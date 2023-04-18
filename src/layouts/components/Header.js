import { useState, useEffect } from 'react';
import { faBell, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ setToggle }) => {
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        setToggle(toggleSidebar);
    }, [setToggle, toggleSidebar]);

    return (
        <div className="flex items-center justify-between w-full h-[64px] bg-white text-[#9fa9ae] pl-[16px] pr-[24px] border-b-[1px] border-solid border-[#cccccc]">
            <div onClick={() => setToggleSidebar(!toggleSidebar)} className="p-[8px] hover:text-black cursor-pointer">
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
                <div className="w-[50px] h-[50px] rounded-full ml-8 cursor-pointer">
                    <img
                        className="w-full h-full object-cover rounded-full"
                        src="https://img.freepik.com/premium-vector/cute-orange-robot-cat-avatar_79416-86.jpg?w=2000"
                        alt="avatar"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
