import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import CommentItem from '~/components/CommentItem';

const AdminTaskDetail = () => {
    const [tab, setTab] = useState('detail');

    const onUpdateTab = (value) => {
        setTab(value);
    };

    const setLevelColor = (level) => {
        if (level === 'Ưu tiên') {
            return 'w-fit px-6 py-4 level priority';
        } else if (level === 'Khẩn cấp') {
            return 'w-fit px-6 py-4 level emergency';
        } else {
            return 'w-fit px-6 py-4 level normal';
        }
    };
    return (
        <>
            <ul class="flex flex-wrap text-[1.5rem] font-medium text-center text-gray-500">
                <li onClick={() => onUpdateTab('detail')} class="mr-2 cursor-pointer">
                    <h3
                        class={
                            tab === 'detail'
                                ? 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white activeTab'
                                : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white'
                        }
                    >
                        Chi tiết
                    </h3>
                </li>
                <li onClick={() => onUpdateTab('resources')} class="mr-2 cursor-pointer">
                    <h3
                        class={
                            tab === 'resources'
                                ? 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white activeTab'
                                : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-white'
                        }
                    >
                        Tài nguyên
                    </h3>
                </li>
            </ul>
            <div className="block lg:flex lg:items-start lg:gap-4">
                <div className="bg-white p-[16px] mb-5 shadow-lg flex-[5]">
                    <div className={tab === 'detail' ? '' : 'hidden'}>
                        <div>
                            <h3 className="text-[2rem] font-bold">
                                Lap ke hoach thanh lap khoa moi o benh vien Nha Be Lap ke hoach thanh lap khoa moi o
                                benh vien Nha Be Lap ke hoach thanh lap khoa moi o benh vien Nha Be{' '}
                                <span className={setLevelColor('Khẩn cấp')}>Khẩn cấp</span>
                            </h3>
                            <p className="text-[1.4rem] mt-6">
                                Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong
                                viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta
                                cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo
                                ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la
                                mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec Day
                                la mo ta cong viec Day la mo ta cong viec Day la mo ta cong viec
                            </p>
                            <div className="flex items-center mt-12">
                                <div className="flex-1">
                                    <h3 className="text-[1.8rem] font-bold">Ngày bắt đầu:</h3>
                                    <p className="text-[1.4rem]">20/01/2023 2:00 PM</p>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[1.8rem] font-bold">Ngày kết thúc:</h3>
                                    <p className="text-[1.4rem]">20/01/2023 2:00 PM</p>
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Tiến trình:</h3>
                                <div className="bg-gray-200 rounded-full mt-3">
                                    <div className="progress-bar full">
                                        <span>100%</span> <span>Hoàn thành</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Người thực hiện:</h3>
                                <div className="flex -space-x-2">
                                    <img
                                        className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                        src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*"
                                        alt=""
                                    />
                                    <img
                                        className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                        src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*"
                                        alt=""
                                    />
                                    <img
                                        className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                        src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*"
                                        alt=""
                                    />
                                    <img
                                        className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                        src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*"
                                        alt=""
                                    />
                                    <div className="hs-dropdown relative inline-flex [--placement:top-left]">
                                        <button
                                            id="hs-dropdown-avatar-more"
                                            className="hs-dropdown-toggle inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white font-medium text-gray-700 shadow-sm align-middle hover:bg-gray-300 focus:outline-none focus:bg-blue-100 focus:text-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                                        >
                                            <span className="font-medium leading-none">9+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">File đính kèm:</h3>
                                <ul>
                                    <li>Test.docx</li>
                                    <li>Test.docx</li>
                                    <li>Test.docx</li>
                                    {/* <li className={userRole === 'Member' ? 'pointer-events-none opacity-40' : ''}>
                                        <label
                                            className="text-center text-[1.4rem] leading-[1] font-bold text-blue-700 bg-transparent py-[6px] rounded-3xl cursor-pointer"
                                            htmlFor="upload"
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                                        </label>
                                        <input
                                            id="upload"
                                            className="absolute opacity-0 z-[-1] rounded-3xl"
                                            type="file"
                                            name="myFile"
                                            onChange={(e) => setAttachFiles(e.target.files)}
                                            multiple
                                        />
                                    </li> */}
                                </ul>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-[1.8rem] font-bold">Liên kết liên quan:</h3>
                                <a className="text-[1.4rem]" href="!#">
                                    DEN 2
                                </a>
                            </div>
                        </div>
                        <div className="block md:flex items-center gap-5 mt-12">
                            <NavLink
                                to="/tasks/edit/123"
                                className="block w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
                            </NavLink>
                            <button className="w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                                <FontAwesomeIcon icon={faTrashCan} /> Xóa
                            </button>
                        </div>
                    </div>
                    <div className={tab === 'resources' ? '' : 'hidden'}>Tài nguyên tab</div>
                </div>
                <div className="bg-white p-[16px] mb-5 shadow-lg flex-[2]">
                    <h3>Bình luận</h3>
                    <form>
                        <InputField textarea className="default" rows="3" cols="50" placeholder="Viết gì đó..." />
                        <button className="w-full md:w-fit text-[1.4rem] text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                            Gửi
                        </button>
                    </form>
                    <ul className="mt-5">
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                        <CommentItem
                            img="https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
                            username="Member 1"
                            content="Noi dung binh luan"
                            cmtDate="20/01/2023"
                        />
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminTaskDetail;
